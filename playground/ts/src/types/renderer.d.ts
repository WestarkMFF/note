export interface VnodeType {
  tag?: string
  props?: Record<string, any>
  children?: string | Array<VnodeType> | VnodeType

  type?: string

  /**
   * 用来描述一个 vnode 的标签属性
   */
  props?: any

  el?: ContainerType
}

export interface ContainerType extends HTMLElement {
  type?: string

  /**
   * 旧的 vnode
   *
   * learn: 如果带上 ‘?’ 可选操作符，那么会默认带上 undefined 类型
   */
  _vnode?: VnodeType | null
}

/**
 * 渲染器属性
 */
export interface RenderOpt {
  createElement: (string) => ContainerType

  setElementText: (HTMLElement, string) => void

  insert: (VnodeType, VnodeType, HTMLElement?) => void

  patchProps: (ContainerType, string, any, any) => void
}

declare global {
  interface HTMLElement {
    _vnode: any
  }
}
