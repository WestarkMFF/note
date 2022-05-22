"use strict";
/**
 * effect
 */
/**
 * 封装 hasOwnProperty 函数
 * @param obj
 * @param key
 * @returns boolean
 */
function hasOwn(obj, key) {
    if (typeof obj != "object" || obj == null)
        return false;
    return Object.prototype.hasOwnProperty.call(obj, key);
}
var activeEffect; // 当前激活的副作用函数 (effectFn)
var effectStack = [];
var TriggerType;
(function (TriggerType) {
    TriggerType["SET"] = "SET";
    TriggerType["ADD"] = "ADD";
    TriggerType["DELETE"] = "DELETE";
})(TriggerType || (TriggerType = {}));
function effect(fn, options) {
    if (!options)
        options = {};
    var effectFn = function () {
        cleanup(effectFn, fn);
        activeEffect = effectFn;
        effectStack.push(effectFn);
        var res = fn();
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
        return res;
    };
    effectFn.options = options;
    effectFn.deps = [];
    if (!options.lazy) {
        effectFn();
    }
    return effectFn;
}
function cleanup(effectFn, fn) {
    for (var i = 0; i < effectFn.deps.length; i++) {
        var deps = effectFn.deps[i];
        deps.delete(effectFn);
    }
    effectFn.deps.length = 0;
}
var bucket = new WeakMap();
var ITERATE_KEY = Symbol();
function reactive(obj) {
    return createReactive(obj);
}
function shallowReactive(obj) {
    return createReactive(obj, true);
}
function readOnly(obj) {
    return createReactive(obj, false, true);
}
function createReactive(obj, isShallow, isReadonly) {
    return new Proxy(obj, {
        get: function (target, key, receiver) {
            if (key == "raw") {
                return target;
            }
            // readOnly 不需要建立响应式联系
            if (!isReadonly) {
                track(target, key);
            }
            var res = Reflect.get(target, key, receiver);
            if (isShallow && typeof res == "object" && res !== null) {
                return reactive(res);
            }
            return res;
        },
        has: function (target, key) {
            track(target, key);
            return Reflect.has(target, key);
        },
        ownKeys: function (target) {
            // 把副作用函数和 ITERATE_KEY 关联起来
            track(target, ITERATE_KEY);
            var res = Reflect.ownKeys(target);
            return res;
        },
        set: function (target, key, val, receiver) {
            // 获取旧值
            var oldValue = target[key];
            // 如果已经有 xx 属性就是 set, 否则是添加新属性
            var type = hasOwn(target, key) ? "SET" : "ADD";
            // 设置属性值
            var res = Reflect.set(target, key, val, receiver);
            // receiver 是 target 的代理对象
            if (target === receiver.raw) {
                // 如果是 oldValue 和 newValue 都是 NaN 就不会触发副作用函数
                if (oldValue !== val && (oldValue === oldValue || val === val)) {
                    trigger(target, key, type); // 触发副作用函数
                }
            }
            return res;
        },
        /**
         * 拦截删除操作
         *
         * exg: delete obj.foo
         */
        deleteProperty: function (target, key) {
            if (isReadonly) {
                console.warn(" key: " + key + " is readOnly");
                return true;
            }
            var hadKey = hasOwn(target, key);
            var res = Reflect.deleteProperty(target, key);
            if (res && hadKey) {
                trigger(target, key, "DELETE");
            }
            return res;
        },
    });
}
function track(target, key) {
    if (!activeEffect)
        return;
    var depsMap = bucket.get(target);
    if (!depsMap)
        bucket.set(target, (depsMap = new Map()));
    var deps = depsMap.get(key);
    if (!deps)
        depsMap.set(key, (deps = new Set()));
    deps.add(activeEffect);
    activeEffect.deps.push(deps);
}
function trigger(target, key, type) {
    var depsMap = bucket.get(target);
    // 这个 target 没有绑定副作用函数
    if (!depsMap) {
        return;
    }
    var effects = depsMap.get(key);
    // 储存可以被执行的副作用函数
    var effectsToRun = new Set();
    effects &&
        effects.forEach(function (effectFn) {
            if (effectFn !== activeEffect) {
                effectsToRun.add(effectFn);
            }
        });
    // 和 ITERATE_KEY 相关的副作用函数
    if (type == "ADD" || type == "DELETE") {
        var iterateEffects = depsMap.get(ITERATE_KEY);
        iterateEffects &&
            iterateEffects.forEach(function (effectFn) {
                if (effectFn != activeEffect) {
                    effectsToRun.add(effectFn);
                }
            });
    }
    effectsToRun.forEach(function (effectFn) {
        if (effectFn.options.scheduler) {
            effectFn.options.scheduler(effectFn);
        }
        else {
            effectFn(); // 执行副作用函数
        }
    });
}
var jobQueue = new Set(); // 任务队列
var p = Promise.resolve(); // 一个 promise 实例
var isFlushing = false; // 是否正在刷新队列
function flushJob() {
    if (isFlushing)
        return;
    isFlushing = true;
    p.then(function () {
        jobQueue.forEach(function (job) { return job(); });
    }).finally(function () {
        isFlushing = false;
    });
}
// computed 模型
function computed(getter) {
    // value 表示上一次缓存到的值
    var value;
    var dirty = true; // 是否是脏数据，脏数据要重新计算
    var effectFn = effect(getter, {
        lazy: true,
        scheduler: function () {
            if (!dirty) {
                dirty = true;
                trigger(result, "value");
            }
        },
    });
    var result = {
        get value() {
            if (dirty) {
                value = effectFn();
                dirty = false;
            }
            track(result, "value");
            return value;
        },
    };
    return result;
}
// watch 模型
function watch(source, cb, config) {
    if (!config)
        config = {};
    var getter;
    if (typeof source === "function") {
        getter = source;
    }
    else if (typeof source == "string") {
        getter = function () { return eval(source); };
    }
    else {
        getter = function () { return traverse(source); };
    }
    // cleanup 用来储存用户注册的过期回调
    var oldValue, newValue, cleanup;
    function onInvalidate(fn) {
        cleanup = fn;
    }
    var job = function () {
        newValue = effectFn();
        // 先调用过期的回调
        if (cleanup)
            cleanup();
        cb(newValue, oldValue, onInvalidate);
        oldValue = newValue;
    };
    var effectFn = effect(function () { return getter(); }, {
        scheduler: function () {
            if (config.flush === "post") {
                Promise.resolve().then(function () { return job(); });
            }
            else {
                job();
            }
        },
        lazy: true,
    });
    if (config.immediate) {
        job();
    }
    else {
        oldValue = effectFn();
    }
}
function traverse(value, seen) {
    if (seen == undefined)
        seen = new Set();
    if (typeof value !== "object" || value === null || seen.has(value))
        return value;
    seen.add(value);
    for (var k in value) {
        traverse(value[k], seen);
    }
    return value;
}
/**
 * ----------------------------------
 *
 * 业务代码 👇
 */
var obj = reactive({ foo: { bar: 1 } });
effect(function () {
    console.log("触发副作用函数");
    console.log(obj);
});
