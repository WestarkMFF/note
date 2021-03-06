import { hasOwn, isArr } from "./utils/index"
let log = console.log

function clg(...msg: any[]) {
  console.log("%c" + msg, "color: blue")
}

const _toString = Object.prototype.toString

function rawType(v: any) {
  return _toString.call(v).slice(8, -1)
}

/**
 * effect
 */

interface EffectOptions {
  lazy?: boolean
  scheduler?: (fn: any) => any
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

type BasicType = string | number | boolean | bigint

// 封装 wrapper 函数
function ref(val: BasicType) {
  const wrapper = {
    value: val,
  }

  Object.defineProperty(wrapper, "__v_isRef", {
    value: true,
  })

  return reactive(wrapper)
}

/**
 * obj 接收一个响应式对象
 */
function toRef(obj: any, key: any) {
  const wrapper = {
    get value() {
      return obj[key]
    },

    set value(val) {
      obj[key] = val
    },
  }

  Object.defineProperty(wrapper, "__v_isRef", {
    value: true,
  })

  return wrapper
}

/**
 * 接收一个响应式对象，返回一个被 ref 包裹的 响应式对象
 */
function toRefs(obj: any) {
  const ret: any = {}

  for (const key in obj) {
    ret[key] = toRef(obj, key)
  }

  return ret
}

/**
 * target 是一个响应式对象
 */
function proxyRefs(target: any) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver)

      return value.__v_isRef ? value.value : value
    },

    set(target, key, newValue, receiver) {
      if (target[key].__v_isRef) {
        target[key].value = newValue
        return true
      }

      return Reflect.set(target, key, newValue, reactive)
    },
  })
}

function shallowReactive(obj: any) {
  return createReactive(obj, true)
}

function readOnly(obj: any) {
  return createReactive(obj, false, true)
}

const arrayInstrumentations: any = {}

;["includes", "indexOf", "lastIndexOf"].forEach((method: string) => {
  const originMethod = Array.prototype[method as any]

  arrayInstrumentations[method] = function (...args: [searchElement: any, fromIndex?: number | undefined]) {
    // this 指向代理对象

    let res = originMethod.apply(this, args)

    if (res == false) {
      res = originMethod.apply(this.raw, args)
    }

    return res
  }
})

let shouldTrack = true

;["push", "pop", "shift", "unshift", "splice"].forEach((method: string) => {
  const originMethod = Array.prototype[method as any]
  arrayInstrumentations[method] = function (...args: any[]) {
    shouldTrack = false

    let res = originMethod.apply(this, args)

    shouldTrack = true

    return res
  }
})

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
       * 拦截 includes 等数组操作
       */
      if (isArr(target) && hasOwn(arrayInstrumentations, key)) {
        console.log("key", key)
        return Reflect.get(arrayInstrumentations, key, receiver)
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

const mutableInstrumentations: any = {
  add(key: any) {
    // this.raw => 原始对象
    const target = this.raw

    const hadKey = target.has(key)
    const res = target.add(key)

    if (!hadKey) {
      trigger(target, key, "ADD")
    }

    return res
  },

  set(key: any, value: any) {
    const target = this.raw

    const had = target.has(key)

    const oldValue = target.get(key)

    // value.raw 设置原始数据
    const rawValue = value.raw || value

    target.set(key, rawValue)

    if (!had) {
      trigger(target, key, "ADD")
    } else if (oldValue !== value || (oldValue === oldValue && value === value)) {
      trigger(target, key, "SET")
    }
  },

  delete(key: any) {
    const target = this.raw

    const hadKey = target.has(key)

    const res = target.delete(key)

    if (hadKey) {
      trigger(target, key, "DELETE")
    }

    return res
  },

  forEach(cb: Function) {
    const target = this.raw
    const wrapperFunction = (val: any) => {
      if (typeof val != "object") return val
      const _rawType = rawType(val)
      if (["Map", "Set"].includes(_rawType)) {
        return createSetReactive(val)
      } else {
        return reactive(val)
      }
    }

    track(target, ITERATE_KEY)

    target.forEach((v, k) => {
      cb(wrapperFunction(v), wrapperFunction(k), this)
    })
  },

  get(key) {
    const target = this.raw

    const res = target.get(key)
    return createSetReactive(res)
  },

  [Symbol.iterator]: iterationMethod,
  entries: iterationMethod,
  values: iterationMethod,
}

function iterationMethod() {
  const target = this.raw
  const itr = target[Symbol.iterator]()

  const wrap = (val: any) => (typeof val === "object" ? createSetReactive(val) : val)

  track(target, ITERATE_KEY)

  console.log("this", this)

  return {
    next() {
      const { value, done } = itr.next()
      return {
        value: value ? [wrap(value[0]), wrap(value[1])] : value,
        done,
      }
    },

    [Symbol.iterator]() {
      return this
    },
  }
}

/**
 * 创建 set, map 响应式
 * @param obj
 */
function createSetReactive(obj: any, isShallow?: boolean, isReadOnly?: boolean) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      console.log("read set key: ", key)
      if (key == "raw") return target
      if (key == "size") {
        track(target, ITERATE_KEY)
        return Reflect.get(target, key, target)
      }

      return mutableInstrumentations[key]
      // return target[key].bind(target)
    },
  })
}

function track(target: any, key: any) {
  if (!activeEffect || !shouldTrack) return

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
          effectsToRun.add(effectFn)
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
  if (type == "ADD" || type == "DELETE" || (type == "SET" && rawType(target) == "Map")) {
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

const obj = reactive({ foo: 1, bar: 1 })
const newObj = proxyRefs({ ...toRefs(obj) })

console.log(newObj.foo)

export { ref, toRef, toRefs, reactive }
