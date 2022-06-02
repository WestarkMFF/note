interface VnodeType {
  tag: string
  props?: Record<string, any>
  children: string | Array<VnodeType>


	type: string
}

declare global {
  interface HTMLElement {
    _vnode: any
  }
}

import { effect, ref } from "@vue/reactivity"

function createRenderer() {
  function path(n1: VnodeType | null, n2: VnodeType, container: HTMLElement) {
		/**
		 * 渲染逻辑
		 * 如果没有 新DOM 则意味着挂载 
		 */
		if(!n1){

		} else{
			/**
			 * 如果 新DOM 存在意味着 patch
			 */
		}
	}

	/**
	 * 挂载逻辑
	 */
	function mountElement(vnode:VnodeType,container:HTMLElement){
		// 创建一个 DOM
		const el = document.createElement(vnode.type)

		if(typeof vnode.children === 'string') {
			el.textContent = vnode.children
		}

		container.appendChild(el)


	}

  function render(vnode: VnodeType, container: HTMLElement) {
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

const count = ref(1)
