"use strict";
function Render(obj, root) {
    var el = document.createElement(obj.tag);
    if (typeof obj.children === "string") {
        var text = document.createTextNode(obj.children);
        el.appendChild(text);
    }
    else if (Array.isArray(obj.children)) {
        obj.children.forEach(function (item) {
            Render(item, el);
        });
    }
    root.appendChild(el);
}
