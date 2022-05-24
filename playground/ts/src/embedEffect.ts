let log = console.log

/**
 * effect
 */

interface EffectOptions {
  lazy?: boolean
  scheduler?: (fn: any) => any
}

/**
 * 封装 hasOwnProperty 函数
 * @param obj
 * @param key
 * @returns boolean
 */
function hasOwn(obj: Record<string, any>, key: any): boolean {
  if (typeof obj != "object" || obj == null) return false

  return Object.prototype.hasOwnProperty.call(obj, key)
}

function isArr(arr: any) {
  try {
    return Array.isArray(arr)
  } catch (e) {
    console.warn(`parse arr ${arr} wrong: ${e}`)
    return false
  }
}

let activeEffect: any // 当前激活的副作用函数 (effectFn)
const effectStack: Array<any> = []

enum TriggerType {
  SET = "SET",
  ADD = "ADD",
  DELETE = "DELETE",
}

function effect(fn: () => void, options?: EffectOptions) {
  if (!options) options = {}
  const effectFn: any = () => {
    cleanup(effectFn, fn)

    activeEffect = effectFn
    effectStack.push(effectFn)

    const res = fn()

    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]

    return res
  }

  effectFn.options = options
  effectFn.deps = []

  if (!options.lazy) {
    effectFn()
  }
  return effectFn
}

function cleanup(effectFn: any, fn: any) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]

    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

const bucket = new WeakMap()

const ITERATE_KEY = Symbol()
const reactiveMap = new Map()

function reactive(obj: any) {
  const existedProxy = reactiveMap.get(obj)

  if (existedProxy) {
    return existedProxy
  }

  const proxy = createReactive(obj)
  reactiveMap.set(obj, proxy)

  return proxy
}

function shallowReactive(obj: any) {
  return createReactive(obj, true)
}

function readOnly(obj: any) {
  return createReactive(obj, false, true)
}

/**
 * 创建响应式对象
 * @param obj
 * @param isShallow
 * @param isReadonly
 * @returns
 */
function createReactive(obj: any, isShallow?: boolean, isReadonly?: boolean): any {
  return new Proxy(obj, {
    get(target: any, key, receiver) {
      console.log("get trap", target, key)
      if (key == "raw") {
        return target
      }

      /**
       * 迭代器的 key 是 symbol
       */
      if (!isReadonly && typeof key !== "symbol") {
        // readOnly 不需要建立响应式联系
        track(target, key)
      }

      const res = Reflect.get(target, key, receiver)

      if (!isShallow && typeof res == "object" && res !== null) {
        return reactive(res)
      }

      return res
    },

    has(target, key) {
      track(target, key)
      return Reflect.has(target, key)
    },

    ownKeys(target) {
      // 把副作用函数和 ITERATE_KEY 关联起来
      track(target, isArr(target) ? "length" : ITERATE_KEY)

      const res = Reflect.ownKeys(target)

      return res
    },

    set(target, key, val, receiver) {
      if (isReadonly) {
        console.warn(`key ${key as any} is readOnly`)
        return true
      }

      // 获取旧值
      const oldValue = target[key]

      // 如果已经有 xx 属性就是 set, 否则是添加新属性
      const type = Array.isArray(target)
        ? Number(key) < target.length
          ? "SET"
          : "ADD"
        : hasOwn(target, key)
        ? "SET"
        : "ADD"

      // 设置属性值
      const res = Reflect.set(target, key, val, receiver)

      // receiver 是 target 的代理对象
      if (target === receiver.raw) {
        // 如果是 oldValue 和 newValue 都是 NaN 就不会触发副作用函数
        if (oldValue !== val && (oldValue === oldValue || val === val)) {
          trigger(target, key, type, val) // 触发副作用函数
        }
      }

      return res
    },

    /**
     * 拦截删除操作
     *
     * exg: delete obj.foo
     */
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(` key: ${key as any} is readOnly`)
        return true
      }

      const hadKey = hasOwn(target, key)
      const res = Reflect.deleteProperty(target, key)

      if (res && hadKey) {
        trigger(target, key, "DELETE")
      }

      return res
    },
  })
}

function track(target: any, key: any) {
  if (!activeEffect) return

  let depsMap = bucket.get(target)
  if (!depsMap) bucket.set(target, (depsMap = new Map()))

  let deps = depsMap.get(key)
  if (!deps) depsMap.set(key, (deps = new Set()))

  deps.add(activeEffect)

  activeEffect.deps.push(deps)
}

function trigger(target: any, key: any, type?: "SET" | "ADD" | "DELETE", val?: any) {
  const depsMap = bucket.get(target)

  // 这个 target 没有绑定副作用函数
  if (!depsMap) {
    return
  }

  // 储存可以被执行的副作用函数
  const effectsToRun = new Set()

  if (type === "ADD" && isArr(target)) {
    // 取出 length 相关的副作用函数
    const lengthEffect = depsMap.get("length")

    // 待执行 length 相关的副作用函数
    lengthEffect &&
      lengthEffect.forEach((effectFn: any) => {
        if (effectFn != activeEffect) {
          // effectsToRun.add(effectFn)
        }
      })
  }

  const effects = depsMap.get(key)

  effects &&
    effects.forEach((effectFn: any) => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn)
      }
    })

  // 和 ITERATE_KEY 相关的副作用函数
  if (type == "ADD" || type == "DELETE") {
    const iterateEffects = depsMap.get(ITERATE_KEY)
    iterateEffects &&
      iterateEffects.forEach((effectFn: any) => {
        if (effectFn != activeEffect) {
          effectsToRun.add(effectFn)
        }
      })
  }

  if (isArr(target) && key == "length") {
    // 对于索引 >= 新的 length 元素，取出副作用函数等待执行
    depsMap.forEach((effects: any, key: number) => {
      if (key >= val) {
        effects.forEach((effectFn: Function) => {
          if (effectFn != activeEffect) {
            effectsToRun.add(effectFn)
          }
        })
      }
    })
  }

  effectsToRun.forEach((effectFn: any) => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn() // 执行副作用函数
    }
  })
}

const jobQueue = new Set() // 任务队列
const p = Promise.resolve() // 一个 promise 实例
let isFlushing = false // 是否正在刷新队列
function flushJob() {
  if (isFlushing) return

  isFlushing = true
  p.then(() => {
    jobQueue.forEach((job: any) => job())
  }).finally(() => {
    isFlushing = false
  })
}

// computed 模型
function computed(getter: any) {
  // value 表示上一次缓存到的值
  let value: any

  let dirty = true // 是否是脏数据，脏数据要重新计算

  const effectFn = effect(getter, {
    lazy: true,
    scheduler: () => {
      if (!dirty) {
        dirty = true
        trigger(result, "value")
      }
    },
  })

  const result = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }

      track(result, "value")
      return value
    },
  }

  return result
}

interface WatchConfig {
  immediate?: boolean
  flush?: "pre" | "post" | "sync"
}

// watch 模型
function watch(source: any, cb: any, config: WatchConfig) {
  if (!config) config = {}
  let getter: any
  if (typeof source === "function") {
    getter = source
  } else if (typeof source == "string") {
    getter = () => eval(source)
  } else {
    getter = () => traverse(source)
  }

  // cleanup 用来储存用户注册的过期回调
  let oldValue: any, newValue, cleanup: any

  function onInvalidate(fn: any) {
    cleanup = fn
  }

  const job = () => {
    newValue = effectFn()

    // 先调用过期的回调
    if (cleanup) cleanup()

    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }

  const effectFn = effect(() => getter(), {
    scheduler: () => {
      if (config.flush === "post") {
        Promise.resolve().then(() => job())
      } else {
        job()
      }
    },
    lazy: true,
  })

  if (config.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}

function traverse(value: any, seen?: any) {
  if (seen == undefined) seen = new Set()

  if (typeof value !== "object" || value === null || seen.has(value)) return value
  seen.add(value)

  for (const k in value) {
    traverse(value[k], seen)
  }

  return value
}

/**
 * ----------------------------------
 *
 * 业务代码 👇
 */

// const obj = reactive({ foo: { bar: 1 } })

// effect(() => {
//   console.log("触发副作用函数")

//   console.log(obj)
// })

const obj = reactive({})
const arr = reactive([obj])

log(arr.includes(obj))
log(arr)
