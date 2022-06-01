// interface VnodeType {
//   tag: string
//   props?: Record<string, any>
//   children: string | Array<VnodeType>
// }

// const vnodeDemo = {
//   tag: "div",
//   props: {
//     onclick: () => alert("hello world"),
//   },
//   children: [
//     {
//       tag: "button",
//       children: "clickMe",
//     },
//   ],
// }

// function renderer(vnode: VnodeType, container: HTMLElement) {
//   const el = document.createElement(vnode.tag)

//   /**
//    * 神奇, vnode.prop 为 undefined, for in 也不会报错
//    */
//   for (let key in vnode.props) {
//     if (/^on/.test(key)) {
//       el.addEventListener(key.substr(2), vnode.props[key]) // 给元素绑定一个事件监听
//     }
//   }

//   if (isString(vnode.children)) {
//     el.append(document.createTextNode(vnode.children as string))
//   } else if (isArray(vnode.children)) {
//     ;(vnode.children as Array<VnodeType>).forEach((children) => renderer(children, el))
//   }

//   container.appendChild(el)
// }

// function isString(str: any) {
//   return typeof str === "string"
// }

// function isArray(arr: any) {
//   return Array.isArray(arr)
// }

function renderer(innerHtml: string, container: HTMLElement) {
  container.innerHTML = innerHtml
}

const app = document.querySelector("#app")

export { renderer }
  