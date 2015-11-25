"use strict";
(function(window, undefined) {

var v = window.v = function(selector, attrs, children) {
    return new v.fn.init(selector, attrs, children);
};

v.fn = v.prototype = {
    version: "0.1.0",
    init: function(selector) {
        this.selector = selector;
    }
};

v.fn.init.prototype = v.fn;

})(window);