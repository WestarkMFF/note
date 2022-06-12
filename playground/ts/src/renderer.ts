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
    console.log("patch")
    /**
     * 渲染逻辑
     * 如果没有 新DOM 则意味着挂载
     */
    if (!n1) {
      mountElement(n2, container)
    } else {
      /**
       * 如果 新DOM 存在意味着 patch
       */
    }
  }

  /**
   * 挂载逻辑
   */
  function mountElement(vnode: VnodeType, container: ContainerType) {
    // 创建一个 DOM
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
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key])
      }
    }

    insert(el, container)
  }

  function render(vnode: VnodeType, container: ContainerType) {
    if (vnode) {
      patch(container._vnode, vnode, container)
    } else {
      // 清空 vnode
      if (container._vnode) {
        const el = container._vnode.el
        const parent = el?.parentNode

        if (parent) parent.removeChild(el)
      }
    }
    container._vnode = vnode
  }

  return {
    render,
  }
}

function shouldSetAsProps(el: ContainerType, key: string, value: any) {
  if (key == "form" && el.tagName === "INPUT") return false

  // 如果这个 key 不是 DOM properties 就拉到
  return key in el
}

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
      parent.insertBefore(el, anchor)
    }
  },

  patchProps(el, key, prevValue, nextValue) {
    if (key == "class") {
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

const vnode = {
  type: "input",
  props: {
    disabled: "",
    class: "shit",
  },
}

const container = { type: "root" }

renderer.render(vnode, document.body)
