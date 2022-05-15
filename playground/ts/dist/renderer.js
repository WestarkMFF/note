"use strict";
var vnodeDemo = {
    tag: "div",
    props: {
        onclick: function () { return alert("hello world"); },
    },
    children: [
        {
            tag: "button",
            children: "clickMe",
        },
    ],
};
function renderer(vnode, container) {
    var el = document.createElement(vnode.tag);
    /**
     * 神奇, vnode.prop 为 undefined, for in 也不会报错
     */
    for (var key in vnode.props) {
        if (/^on/.test(key)) {
            el.addEventListener(key.substr(2), vnode.props[key]); // 给元素绑定一个事件监听
        }
    }
    if (isString(vnode.children)) {
        el.append(document.createTextNode(vnode.children));
    }
    else if (isArray(vnode.children)) {
        ;
        vnode.children.forEach(function (children) { return renderer(children, el); });
    }
    container.appendChild(el);
}
function isString(str) {
    return typeof str === "string";
}
function isArray(arr) {
    return Array.isArray(arr);
}
