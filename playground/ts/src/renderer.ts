// render 模型

import { effect, ref } from "@vue/reactivity"
import { VnodeType, RenderOpt, ContainerType } from "./types/renderer"
import { isArr } from "./utils"

/**
 * render => patch => mountElement => insert
 */

function createRenderer(opt: RenderOpt) {
  const { createElement, setElementText, insert, patchProps } = opt

  function patch(n1: VnodeType | null | undefined, n2: VnodeType, container: ContainerType) {
    console.log("patch", n1)

    /**
     * 卸载逻辑
     */
    if (n1 && n1.type != n2.type) {
      unmount(n1)
      /**
       * 把 n1 置为 null, 接下来就走渲染逻辑
       */
      n1 = null
    }

    const { type } = n2

    /**
     * type: n2 新的 vnode 里面的 type 属性
     *
     * 如果是字符串，那就是普通 html 标签元素
     * 如果是对象，那就是描述一个组件元素
     */

    if (typeof type === "string") {
      if (!n1) {
        /**
         * 渲染逻辑
         * 如果没有 新DOM 则意味着挂载
         */
        mountElement(n2, container)
      } else {
        /**
         * 如果 新DOM 存在意味着 patch
         */
        // patchElement(n1,n2)
      }
    } else if (typeof type === "object") {
    } else {
      // 其它类型的 vnode
    }
  }

  /**
   * 挂载逻辑
   */
  function mountElement(vnode: VnodeType, container: ContainerType) {
    /**
     * 创建一个 '虚拟DOM'
     *
     * 并赋值为 vnode.el 属性上面
     */
    const el = (vnode.el = createElement(vnode.type))
    if (typeof vnode.children === "string") {
      setElementText(el, vnode.children)
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        /**
         * 如果子树是 array 就调用 patch, n1 为 null, 最终调用还是会回到 mountElement, 相当于递归
         */
        patch(null, child, el)
      })
    }

    if (vnode.props) {
      for (const propsKey in vnode.props) {
        patchProps(el, propsKey, null, vnode.props[propsKey])
      }
    }

    insert(el, container)
  }

  function render(vnode: VnodeType, container: ContainerType) {
    console.log("render")
    if (vnode) {
      /**
       * 初始化，最开始 _vnode 是空的所以 patch 接收到的是 undefined
       */
      patch(container._vnode, vnode, container)
    } else {
      // 清空 vnode
      if (container._vnode) {
        unmount(container._vnode)
      }
    }

    /**
     * _vnode 旧的 vnode 要被卸载的 vnode
     */
    container._vnode = vnode
  }

  function unmount(vnode: VnodeType) {
    const parent = vnode.el?.parentNode
    if (parent && vnode.el) parent.removeChild(vnode.el)
  }

  return {
    render,
  }
}

/**
 * 是否应该设置 dom properties
 *
 * 如果 这个 key 不是 dom 上的，就不设置
 */
function shouldSetAsProps(el: ContainerType, key: string, value: any) {
  if (key == "form" && el.tagName === "INPUT") return false

  // 如果这个 key 不是 DOM properties 就拉到
  return key in el
}

/**
 * 用 createRenderer 创建一个 renderer 实例
 */
const renderer = createRenderer({
  createElement(tag: string) {
    return document.createElement(tag)
  },

  setElementText(el: HTMLElement, text: string) {
    el.textContent = text
  },

  /**
   * 这里把 container 抽象为 parent
   */
  insert(el: ContainerType, parent: ContainerType, anchor?: HTMLElement | null) {
    if (!anchor) anchor = null

    if (parent.insertBefore) {
      /**
       * 插入 dom
       */
      parent.insertBefore(el, anchor)
    }
  },

  /**
   * 给 el 添加 props
   *
   * 处理 dom properties
   */
  patchProps(el: ContainerType, key: keyof ContainerType, prevValue, nextValue) {
    const invokers = el._vei || (el._vei = {})
    let invoker = invokers[key]
    const name = key.slice(2).toLowerCase()

    /**
     * onxxxxxx
     *
     * 指的是 on 开头为事件
     */
    if (/^on/.test(key)) {
      if (nextValue) {
        if (!invoker) {
          invoker = el._vei[key] = (e: Event) => {
            console.log(e.timeStamp)

            if (e.timeStamp < invoker.attached) return

            if (Array.isArray(invoker.value)) {
              invoker.value.forEach((fn: Function) => fn(e))
            } else {
              invoker.value(e)
            }
          }

          // 把真正的事件处理函数赋值给 invoker.value
          invoker.value = nextValue
          invoker.attached = performance.now()

          el.addEventListener(name, invoker)
        } else {
          invoker.value = nextValue
        }
      } else if (invoker) {
        el.removeEventListener(name, invoker)
      }
    } else if (key == "class") {
      el.className = nextValue
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key]
      if (type == "boolean" && nextValue == "") {
        el[key] = true
      } else {
        el[key] = nextValue
      }
    } else {
      el.setAttribute(key, nextValue)
    }
  },
})

const vnode: { value: VnodeType } = ref({
  type: "button",
  props: {
    class: "shit",

    onclick: [
      () => {
        console.log("fuck")
      },
      () => {
        console.log("duck")
      },
    ],
  },

  children: "abc",
})

const bol = ref(false)

effect(() => {
  const vn = {
    type: "div",
    props: bol.value
      ? {
          onclick: () => console.log("parent clicked"),
        }
      : {},

    children: [
      {
        type: "p",
        props: {
          onclick: () => {
            console.log("p click")
            bol.value = true
          },
        },
        children: "test",
      },
    ],
  }

  renderer.render(vn, document.querySelector("#app"))
})
