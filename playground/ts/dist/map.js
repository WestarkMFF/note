"use strict";
// map, set 数据结构
// const m = new Map()
// const w = new WeakMap()
// ;(function () {
//   const foo = { foo: 1 }
//   const bar = { bar: 1 }
//   m.set(foo, 1)
//   w.set(bar, 1)
// })()
// console.log(m.keys())
// console.log(m.entries())
// console.log(m.size)
// console.log(w)
var s = new Set();
[1, 3, 5, 7, 9].forEach(function (x) { return s.add(x); });
s.delete(9);
console.log(s);
