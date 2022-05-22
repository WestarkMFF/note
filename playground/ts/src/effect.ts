// // const bucket = new WeakMap()
// const bucket = new WeakMap()
// const effectStack: Array<any> = []
// let activeEffect: any

// function reactive(obj: Record<string, any>) {
//   const data = new Proxy(obj, {
//     get(target: any, key: any) {
//       track(target, key)
//       return target[key]
//     },

//     set(target, key, v) {
//       target[key] = v
//       trigger(target, key, v)

//       return true
//     },
//   })

//   return data
// }

// /**
//  * 追踪响应式把 fn 存起来，因为 _key 是 Set, 所以不怕重复
//  * @param target
//  * @param key
//  */
// function track(target: any, key: any) {
//   if (!activeEffect) return
//   const _keys = getBucketFn(target, key)
//   _keys.add(activeEffect)

//   activeEffect.deps.push(_keys)
// }

// function trigger(target: any, key: any, v: any) {
//   const _keys = getBucketFn(target, key)
//   const effectToRun = new Set(_keys)

//   effectToRun.forEach((fn: any) => fn())
// }

// function getBucketFn(target: any, key: any) {
//   // bucket (weakmap)
//   // |
//   // -- target (map)
//   //   |
//   //   -- key (set)
//   //     |
//   //     -- fn
//   let _target = bucket.get(target)
//   if (!_target) {
//     bucket.set(target, (_target = new Map()))
//   }

//   let _key = _target.get(key)
//   if (!_key) {
//     _target.set(key, (_key = new Set()))
//   }

//   return _key
// }

// function effect(fn: () => any) {
//   const effectFn: any = () => {
//     cleanup(effectFn)
//     activeEffect = effectFn
//     effectStack.push(effectFn)

//     const res = fn()

//     effectStack.pop()
//     activeEffect = effectStack[effectStack.length - 1]

//     return res
//   }

//   effectFn.deps = []

//   effectFn()
// }

// function cleanup(effectFn: any) {
//   for (let i = 0; i < effectFn.deps.length; i++) {
		
//     let deps = effectFn.deps[i]
//     deps.delete(effectFn)
//   }



//   effectFn.deps.length = 0
//   console.log(effectFn.deps)

// 	console.log(bucket)
// 	debugger
// }

// const obj = reactive({
//   text: "hello MFF",
//   title: "learn",
//   number: 2333,
//   ok: true,
// })

// effect(() => {
//   console.log("执行了副作用函数")
//   document.body.innerText = obj.ok ? obj.text : "no"
// })


// effect(() => {
// 	obj.ok
// })

// // setTimeout(() => {
// //   obj.ok = false
// // }, 3000)
