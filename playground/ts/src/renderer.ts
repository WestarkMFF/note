// render 模型

import { effect, ref, shallowReactive, reactive, shallowReadonly } from "@vue/reactivity"
import { VnodeType, RenderOpt, ContainerType, ComponentType } from "./types/renderer"
import { isArr } from "./utils"
import { cloneDeep } from "lodash"
import { Container } from "element-ui"
// import { mountComponent, patchComponent } from "./component"

/**
 * render => patch => mountElement => insert
 */

function createRenderer(opt: RenderOpt) {
  const { createElement, setElementText, insert, patchProps, createText, setText } = opt

  function patch(n1: VnodeType | null | undefined, n2: VnodeType, container: ContainerType, anchor?: any) {
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
        patchElement(n1, n2)
      }
    } else if (type == Text) {
      if (!n1) {
        const el = (n2.el = createText(n2.children))

        insert(el, container)
      } else {
        const el = (n2.el = n1.el)

        if (n2.children != n1.children) {
          setText(n2, n1.children)
        }
      }
    } else if (type == Comment) {
    } else if (type == Fragment) {
      /**
       * 处理 fragment 类型的节点
       */
      if (!n1) {
        Array.isArray(n2.children) && n2.children.forEach((c) => patch(null, c, container))
      } else {
        patchChildren(n1, n2, container)
      }
    } else if (typeof type === "object" || typeof type === "function") {
      /**
       * 处理 组件 节点
       */
      if (!n1) {
        mountComponent(n2, container, anchor)
      } else {
        patchComponent()
      }
    } else {
      // 其它类型的 vnode
    }
  }

  /**
   * patch 更新逻辑
   */
  function patchElement(n1: VnodeType, n2: VnodeType) {
    /**
     * 把 n1(旧 vn) 的 el 给到 n2
     */
    const el = (n2.el = n1.el)

    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key])
      }
    }

    for (const key in oldProps) {
      if (!(key in newProps)) {
        patchProps(el, key, oldProps[key], null)
      }
    }

    patchChildren(n1, n2, el as ContainerType)
  }

  /**
   * 更新子元素
   */
  function patchChildren(n1: VnodeType, n2: VnodeType, container: ContainerType) {
    if (typeof n2.children == "string") {
      /**
       * 判断新节点是否是文本节点
       *
       * 卸载旧 vn 的子元素
       */
      if (Array.isArray(n1.children)) {
        n1.children.forEach((c) => unmount(c))
      }

      setElementText(container, n2.children)
    } else if (Array.isArray(n2.children)) {
      /**
       * 如果新节点是 array
       *
       * 判断旧节点是不是 array
       *
       * 如果是的话，那就是说新旧节点都是 一组节点，涉及到 diff 算法
       */

      if (Array.isArray(n1.children)) {
        const oldChildren = n1.children
        const newChildren = n2.children

        const oldLen = oldChildren.length
        const newLen = newChildren.length

        /**
         * 两组子节点的公共长度
         */
        const commonLength = Math.min(oldLen, newLen)

        for (let i = 0; i < commonLength; i++) {
          patch(oldChildren[i], newChildren[i], container)
        }

        if (newLen > oldLen) {
          for (let i = commonLength; i < newLen; i++) {
            patch(null, newChildren[i], container)
          }
        } else if (oldLen > newLen) {
          for (let i = commonLength; i < oldLen; i++) {
            unmount(oldChildren[i])
          }
        }
      } else {
        setElementText(container, "")

        /**
         * 递归更新 n2
         */
        n2.children.forEach((c) => patch(null, c, container))
      }
    } else {
      /**
       * 新节点不存在
       */
      if (Array.isArray(n1.children)) {
        n1.children.forEach((c) => unmount(c))
      } else if (typeof n1.children == "string") {
        setElementText(container, "")
      }
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
    container._vnode = cloneDeep(vnode)
  }

  function unmount(vnode: VnodeType) {
    if (vnode.type == Fragment) {
      /**
       * 递归卸载 fragment
       */
      Array.isArray(vnode.children) && vnode.children.forEach((c) => unmount(c))
      return
    }

    const parent = vnode.el?.parentNode
    if (parent && vnode.el) parent.removeChild(vnode.el)
  }

  function mountComponent(vnode: VnodeType, container: ContainerType, anchor: ContainerType) {
    const componentOptions = vnode.type
    let { render, data, beforeCreate, created, props: propsOption, setup } = componentOptions as ComponentType

    /**
     * beforeCreate 生命周期钩子
     */
    beforeCreate && beforeCreate()

		/**
		 * 处理 props attrs 
		 */
    const [props, attrs] = resolveProps(propsOption || {}, vnode.props as Record<string, any>)

    /**
     * 把 data 包装成响应式对象
     */
    // const state = reactive(typeof data == "function" ? data() : data || {})
    const state = data ? reactive(data()) : {}

    /**
     * vnode 实例
     */
    const instance = {
      /**
       * 状态，就是 响应式的 data
       */
      state,

      /**
       * 组件是否被挂载
       */
      isMounted: false,

      /**
       * 组件的渲染内容
       */
      subTree: null,

      /**
       * 解析出来的 props
       */

      props: shallowReactive(props),
    }

    /**
     * 定义 emit 函数
     *
     * @param event string
     * @param payload
     */
    function emit(event: string, ...payload: any[]) {
      /**
       * 处理事件名
       *
       * change => onChange
       */

      const eventName = `on${event[0].toUpperCase() + event.slice(1)}`

      const handler = instance.props[eventName]
      if (handler) {
        handler(...payload)
      } else {
        console.error(`事件 ${eventName} 不存在`)
      }
    }

    const setupContext = { attrs, emit }

    let setupResult = null

    /**
     * 调用 setup 函数，拿到他的 return
     */
    if (setup) {
      setupResult = setup(shallowReadonly(instance.props), setupContext)
    }

    /**
     * setup 的返回结果
     */
    let setupState: any = null

    if (typeof setupResult === "function") {
      /**
       * 如果 setup 的返回结果是一个 function && option 里面已经有了 render 函数，那就是两个 render 冲突了
       */

      if (render) console.error(`setup 函数返回的是 render 函数，和 option > render 冲突了`)

      /**
       * 重写 render
       */
      render = setupResult
    } else {
      setupState = setupResult
    }

    vnode.component = instance

    /**
     * 渲染上下文对象
     *
     * 组件的实例代理
     */
    const renderContext = new Proxy(instance, {
      get(t, k, r) {
        const { state, props } = t

        /**
         * 先从 data 里面取得数据
         *
         * 说白了 data 会覆盖 props
         */
        if (state && k in state) {
          return state[k]
        } else if (props && k in props) {
          return props[k as string]
        } else if (setupState && k in setupState) {
          return setupState[k]
        } else {
          console.warn(`实例 ${instance} 读取 key: ${k as string} 不存在 `)
          return undefined
        }
      },

      set(t, k, v, r) {
        const { state, props } = t

        if (state && k in state) {
          return Reflect.set(t, k, v, r)
        } else if (props && k in props) {
          console.warn(`Attempting to mutate props ${k as string}, props are readOnly`)
          return false
        } else if (setupState && k in setupState) {
          setupState[k] = v
          return true
        } else {
          console.warn(`实例 ${instance} 写入 key: ${k as string} 失败 `)
          return false
        }
      },
    })

    /**
     * 对，就是辣个 created 钩子
     *
     * 这个 call 可以让 created 里面的 this 拿到 context
     */
    created && created.call(renderContext)

    /**
     * 更新视图
     */
    effect(() => {
      const subTree = render.call(renderContext, renderContext)

      patch(null, subTree, container, anchor)
    })
  }

  function patchComponent() {}

  /**
   * 解析 props
   * @param options vnode 里面定义的 props 对象
   * @param propsData template 转换的全部 props / attrs
   */
  function resolveProps(options: Record<string, any>, propsData: Record<string, any>) {
    type PropsKey = keyof typeof propsData

    const props: Record<PropsKey, any> = {}
    const attrs: Record<PropsKey, any> = {}

    for (const key in propsData) {
      if (key in options || key.startsWith("on")) {
        props[key] = propsData[key]
      } else {
        attrs[key] = propsData[key]
      }
    }

    return [props, attrs]
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
    console.log("!!setElementText")
    el.textContent = text
  },

  /**
   * 这里把 container 抽象为 parent
   */
  insert(el: ContainerType, parent: ContainerType, anchor?: HTMLElement | null) {
    console.log("!!insert")
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

  createText(text) {
    return document.createTextNode(text)
  },

  setText(el, text) {
    el.nodeValue = text
  },
})

const Text = Symbol()
const Comment = Symbol()

const Fragment = Symbol()

const vnode: { value: VnodeType } = ref({
  type: "ul",
  props: {
    class: "shit",
  },

  children: [
    {
      type: Fragment,
      children: [
        { type: "li", children: "123" },
        { type: "li", children: "123" },
      ],
    },
  ],
})

// effect(() => {
//   console.log("effect")
//   renderer.render(vnode.value, document.body)
// })

// setTimeout(() => {
//   vnode.value.children[0].children[0].children = "999"
// }, 1000)

const ZComponent = {
  name: "ZComponent",

  props: {
    title: "Title",
  },

  data() {
    return {
      // title: "fuck",
    }
  },

  render() {
    return {
      type: "div",
      children: `title: ${(this as any).title}`,
    }
  },
}

const Comp: ComponentType = {
  props: {
    foo: String,
  },

  setup(props: Record<string, any>, setupContext: Record<string, any>) {
    // console.log(props.foo)

    return {}
  },

  render(props) {
    console.log(props)

    return {
      type: "div",
      children: `title11 ${this.foo}`,
    }
  },
}

const comp_vnode: { value: VnodeType } = ref({
  type: Comp,

  props: {
    foo: "yess",
  },
})

renderer.render(comp_vnode.value, document.querySelector("#app") as ContainerType)
