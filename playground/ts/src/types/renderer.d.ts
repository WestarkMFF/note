import { readonly } from "vue"

export interface VnodeType {
  tag?: string
  props?: Record<string, any>
  children?: string | Array<VnodeType> | VnodeType | Record<string, VnodeType>

  type?: any

  /**
   * 用来描述一个 vnode 的标签属性
   */
  props?: Record<string, any>

  el?: ContainerType

  onclick?: Function | Array<Function>

  /**
   * vnode 的组件实例
   */
  component?: {}
}

export interface ComponentType {
  /**
   * render 函数，必须是函数
   */
  render: (any, any) => any

  /**
   * data，就是辣个 data
   */
  data?: any

  /**
   * props，就是辣个 props
   */
  props?: Record<string, any>

  beforeCreate?: () => void

  created?: () => void

  beforeMounted?: () => void

  mounted?: () => void

  updated?: () => void

  /**
   * setup option
   *
   */
  setup?: (readonly, any) => Record<any, any>
}

export interface ContainerType extends Element {
  type?: string

  /**
   * 旧的 vnode
   *
   * learn: 如果带上 ‘?’ 可选操作符，那么会默认带上 undefined 类型
   */
  _vnode?: VnodeType | null | undefined

  class?: string

  _vei?: any
}

/**
 * 渲染器属性
 */
export interface RenderOpt {
  createElement: (string) => ContainerType

  setElementText: (Element, string) => void

  insert: (VnodeType, VnodeType, Element?) => void

  patchProps: (ContainerType, string, any, any) => void

  createText: (string) => Text

  setText: (VnodeType, string) => void
}

declare global {
  interface Element {
    _vnode: any
  }
}
