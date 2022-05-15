/**
 * effect
 */

interface EffectOptions {
  lazy?: boolean
  scheduler?: (fn: any) => any
}

let activeEffect: any // 当前激活的副作用函数 (effectFn)
const effectStack: Array<any> = []

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

const data = { text: "hello world", title: "fuck", ok: true, count: 222, num: 333 }
const ITERATE_KEY = Symbol()

const obj = new Proxy(data, {
  get(target: any, key) {
    track(target, key)
    return target[key]
  },

  has(target, key) {
    track(target, key)
    return Reflect.has(target, key)
  },

  ownKeys(target) {
    // 把副作用函数和 ITERATE_KEY 关联起来
    track(target, ITERATE_KEY)

    const res = Reflect.ownKeys(target)

    console.log("res", res)
    return res
  },

  set(target, key, val, receiver) {
    const res = Reflect.set(target, key, val, receiver)

    trigger(target, key)
    return res
  },
})

function track(target: any, key: any) {
  if (!activeEffect) return

  let depsMap = bucket.get(target)
  if (!depsMap) bucket.set(target, (depsMap = new Map()))

  let deps = depsMap.get(key)
  if (!deps) depsMap.set(key, (deps = new Set()))

  deps.add(activeEffect)

  activeEffect.deps.push(deps)
}

function trigger(target: any, key: any) {
  const depsMap = bucket.get(target)

  if (!depsMap) {
    return // 没有这个 key 就不会触发了
  }

  const effects = depsMap.get(key)
  const effectsToRun = new Set()

  effects &&
    effects.forEach((effectFn: any) => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn)
      }
    })

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

effect(() => {
  for (let i in obj) {
    console.log(i)
  }
})

obj.foo = false
