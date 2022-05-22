interface vnode {
  tag: string
  children: vnode[] | string
}

function Render(obj: vnode, root: HTMLElement) {
  const el = document.createElement(obj.tag)

  if (typeof obj.children === "string") {
    const text = document.createTextNode(obj.children as string)
    el.appendChild(text)
  } else if (Array.isArray(obj.children)) {
    obj.children.forEach((item) => {
      Render(item, el)
    })
  }

  root.appendChild(el)
}
