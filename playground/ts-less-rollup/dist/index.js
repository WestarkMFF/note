function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var tipsMap = new Map();
/**
 * tips 容器, 给一个 className
 */

var tipsCtnEl = document.createElement("div");
tipsCtnEl.classList.add("eco_tips");
var tipId = 0;

var Tips = /*#__PURE__*/function () {
  /**
   * tips uniq id
   */

  /**
   * tips 内容
   */

  /**
   * tips 显示的时间, 默认五秒 (可选)
   */

  /**
   * tips 自定义 html (可选)
   */

  /**
   * tips 是否可关闭 (可选)
   */

  /**
   * 自身的 el 元素
   */
  function Tips(params) {
    _classCallCheck(this, Tips);

    _defineProperty(this, "id", 0);

    _defineProperty(this, "content", "");

    _defineProperty(this, "duration", 5000);

    _defineProperty(this, "html", "");

    _defineProperty(this, "closable", false);

    _defineProperty(this, "el", null);

    if (typeof params == "string") {
      this.content = params;
    } else if (_typeof(params) == "object" && params != null) {
      var content = params.content,
          _params$duration = params.duration,
          duration = _params$duration === void 0 ? 5000 : _params$duration,
          _params$html = params.html,
          html = _params$html === void 0 ? "" : _params$html,
          _params$closable = params.closable,
          closable = _params$closable === void 0 ? false : _params$closable;
      this.content = content;
      this.duration = duration;
      this.html = html;
      this.closable = closable;
    }

    this.id = tipId++;
    this.generateTipsEl();
  }

  _createClass(Tips, [{
    key: "generateTipsEl",
    value: function generateTipsEl() {
      var _this = this;

      if (!this.content) return;
      var tipsEl = document.createElement("div");
      var p = document.createElement("p");
      tipsEl.classList.add("eco_tips-item");
      tipsEl.appendChild(p);
      p.innerText = this.content;

      if (this.closable) {
        this.generateCloseIcon(tipsEl);
      }
      /**
       * 是否有 tipsCtnEl, 有就往里 append, 否则把 tipsCtnEl append 到 body
       */


      var _tipsCtnEl = document.body.querySelector(".eco_tips");

      if (_tipsCtnEl) {
        _tipsCtnEl.appendChild(tipsEl);
      } else {
        tipsCtnEl.appendChild(tipsEl);
        document.body.append(tipsCtnEl);
      }

      this.el = tipsEl;
      tipsMap.set(this.id, this.el);
      /**
       * 到时间删除这个 tips
       */

      if (typeof this.duration == "number" && this.duration > 0) {
        setTimeout(function () {
          _this.removeTipsEl();
        }, this.duration);
      }
    }
  }, {
    key: "removeTipsEl",
    value: function removeTipsEl() {
      var _this$el,
          _this2 = this;

      // const el = tipsMap.get(this.id) // 当前元素的 el
      (_this$el = this.el) === null || _this$el === void 0 ? void 0 : _this$el.animate([{
        transform: "translateY(0px)",
        opacity: 1
      }, {
        transform: "translateY(-16px)",
        opacity: 0
      }], {
        duration: 120
      }); // tipsMap.forEach((_el, _id) => {
      //   if (_id > this.id) {
      //     _el.animate([{ transform: "translateY(0px)" }, { transform: "translateY(-8px)" }], {
      //       duration: 100,
      //       // fill: "forwards",
      //     })
      //   }
      // })

      setTimeout(function () {
        tipsCtnEl.removeChild(_this2.el);
      }, 100);
    }
  }, {
    key: "generateCloseIcon",
    value: function generateCloseIcon(tipsEl) {
      var _this3 = this;

      var closeIcon = document.createElement("div");
      closeIcon.classList.add("eco_tips-closeIcon");
      closeIcon.innerText = "x";

      closeIcon.onclick = function () {
        _this3.removeTipsEl();
      };

      tipsEl.appendChild(closeIcon); // 添加 close Icon
    }
  }]);

  return Tips;
}();

function generateTips(args) {
  return new Tips(args);
}

export { generateTips as default };
