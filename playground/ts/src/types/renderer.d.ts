export interface VnodeType {
  tag?: string
  props?: Record<string, any>
  children?: string | Array<VnodeType> | VnodeType

  type?: string
}

export interface RenderOpt {
  createElement: (string) => VnodeType

  setElementText: (HTMLElement, string) => void

  insert: (VnodeType, VnodeType, HTMLElement?) => void
}

declare global {
  interface HTMLElement {
    _vnode: any
  }
}
