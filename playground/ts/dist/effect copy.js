"use strict";
/**
 * effect
 */
var activeEffect; // 当前激活的副作用函数 (effectFn)
function effect(fn) {
    console.log(0);
    var effectFn = function () {
        cleanup(effectFn);
        activeEffect = effectFn;
        console.log(1);
        fn();
    };
    effectFn.deps = [];
    effectFn();
}
function cleanup(effectFn) {
    console.log("cleanup", effectFn);
    for (var i = 0; i < effectFn.deps.length; i++) {
        var deps = effectFn.deps[i];
        console.log("!!", effectFn);
        deps.delete(effectFn);
    }
    effectFn.deps.length = 0;
}
var bucket = new WeakMap();
var data = { text: "hello world", title: "fuck", ok: true };
var obj = new Proxy(data, {
    get: function (target, key) {
        track(target, key);
        return target[key];
    },
    set: function (target, key, val) {
        target[key] = val;
        trigger(target, key);
        return true;
    },
});
function track(target, key) {
    console.log(3, key);
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
    console.log(activeEffect.deps);
}
function trigger(target, key) {
    var depsMap = bucket.get(target);
    if (!depsMap)
        return; // 没有这个 key 就不会触发了
    var effects = depsMap.get(key);
    var effectsToRun = new Set(effects);
    console.log("effectsToRun", effectsToRun);
    effectsToRun.forEach(function (fn) { return fn(); });
    //   effects && effects.forEach((fn: any) => fn()) // 实际上执行的是: 当时的 activeEffect
}
effect(function () {
    console.log("effect run");
    console.log(2);
    document.body.innerText = obj.ok ? obj.text : "falseeee";
});
setTimeout(function () {
    console.log("-------------");
    obj.ok = false;
}, 1000);
setTimeout(function () {
    console.log("-------------");
    obj.ok = true;
}, 2000);
setTimeout(function () {
    console.log("-------------");
    obj.ok = false;
}, 3000);
