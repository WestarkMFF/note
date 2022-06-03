// render 模型

import { effect, ref } from "@vue/reactivity"
import { VnodeType, RenderOpt } from "./types/renderer"

function createRenderer(opt: RenderOpt) {
  const { createElement, setElementText, insert } = opt

  function path(n1: VnodeType | null, n2: VnodeType, container: HTMLElement) {
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
  function mountElement(vnode: VnodeType, container: HTMLElement) {
    // 创建一个 DOM
    const el = createElement(vnode.type)
    if (typeof vnode.children === "string") {
      setElementText(el, vnode.children)
    }

    insert(el, container)
  }

  function render(vnode: VnodeType, container: any) {
    if (vnode) {
      path(container._vnode, vnode, container)
    } else {
      // 清空 vnode
      if (container._vnode) {
        container.innerHTML = ""
      }
    }
    container._vnode = vnode
  }

  return {
    render,
  }
}

const renderer = createRenderer({
  createElement(tag: string) {
    console.log(`创建元素${tag}`)
    return { tag }
  },

  setElementText(el: HTMLElement, text: string) {
    console.log(`设置 ${JSON.stringify(el)} 的内容为: ${text}`)
    el.textContent = text
  },

  insert(el: VnodeType, parent: VnodeType, anchor?: HTMLElement | null) {
    console.log(`将 ${JSON.stringify(el)} 添加到 ${JSON.stringify(parent)} 下`)
    if (!anchor) anchor = null

    parent.children = el
  },
})

const vnode = {
  type: "h1",
  children: "hello",
}

const container = { type: "root" }

renderer.render(vnode, container)
