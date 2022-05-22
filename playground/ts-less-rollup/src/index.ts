import * as Types from "./types"
import "./styles/index.less"

const tipsMap = new Map()
/**
 * tips 容器, 给一个 className
 */
const tipsCtnEl = document.createElement("div")
tipsCtnEl.classList.add("eco_tips")

let tipId = 0

class Tips {
  /**
   * tips uniq id
   */
  id = 0

  /**
   * tips 内容
   */
  content = ""

  /**
   * tips 显示的时间, 默认五秒 (可选)
   */
  duration = 5000

  /**
   * tips 自定义 html (可选)
   */
  html = ""

  /**
   * tips 是否可关闭 (可选)
   */
  closable = false

  /**
   * 自身的 el 元素
   */
  el: HTMLElement | null = null

  constructor(params: string | Types.AlertParamsType) {
    if (typeof params == "string") {
      this.content = params
    } else if (typeof params == "object" && params != null) {
      const { content, duration = 5000, html = "", closable = false } = params

      this.content = content
      this.duration = duration
      this.html = html
      this.closable = closable
    }

    this.id = tipId++

    this.generateTipsEl()
  }

  generateTipsEl() {
    if (!this.content) return

    const tipsEl = document.createElement("div")
    const p = document.createElement("p")

    tipsEl.classList.add("eco_tips-item")
    tipsEl.appendChild(p)

    p.innerText = this.content

    if (this.closable) {
      this.generateCloseIcon(tipsEl)
    }

    /**
     * 是否有 tipsCtnEl, 有就往里 append, 否则把 tipsCtnEl append 到 body
     */
    const _tipsCtnEl = document.body.querySelector(".eco_tips")
    if (_tipsCtnEl) {
      _tipsCtnEl.appendChild(tipsEl)
    } else {
      tipsCtnEl.appendChild(tipsEl)
      document.body.append(tipsCtnEl)
    }

    this.el = tipsEl

    tipsMap.set(this.id, this.el)

    /**
     * 到时间删除这个 tips
     */
    if (typeof this.duration == "number" && this.duration > 0) {
      setTimeout(() => {
        this.removeTipsEl()
      }, this.duration)
    }
  }

  removeTipsEl() {
    // const el = tipsMap.get(this.id) // 当前元素的 el

    this.el?.animate(
      [
        { transform: "translateY(0px)", opacity: 1 },
        { transform: "translateY(-16px)", opacity: 0 },
      ],
      {
        duration: 120,
      }
    )

    // tipsMap.forEach((_el, _id) => {
    //   if (_id > this.id) {
    //     _el.animate([{ transform: "translateY(0px)" }, { transform: "translateY(-8px)" }], {
    //       duration: 100,
    //       // fill: "forwards",
    //     })
    //   }
    // })

    setTimeout(() => {
      tipsCtnEl.removeChild(this.el as HTMLElement)
    }, 100)
  }

  generateCloseIcon(tipsEl: HTMLElement) {
    const closeIcon = document.createElement("div")
    closeIcon.classList.add("eco_tips-closeIcon")
    closeIcon.innerText = "x"
    closeIcon.onclick = () => {
      this.removeTipsEl()
    }

    tipsEl.appendChild(closeIcon) // 添加 close Icon
  }
}

function generateTips(args: string | Types.AlertParamsType) {
  return new Tips(args)
}

export default generateTips
