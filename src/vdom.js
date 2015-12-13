(function(window, undefined) {
"use strict";

var v = window.v = function(selector, attrs, children) {
	if(selector instanceof v) {
		selector.init(selector.node, attrs, children);
		return selector;
	}

	if(selector instanceof Element && selector.v) {
		selector.v.init(selector, attrs, children);
		return selector.v;
	}

	return new v.fn.init(selector, attrs, children);
};

v.fn = v.prototype = {
	version: "0.1.0",
	init: function(selector, attrs, children) {
		this.attrs = attrs;
		this.children = children;

		if(selector instanceof Element) {
			this.node = selector;
			selector.v = this;
			this.apply();
		}
		else {
			this.nodeType = selector;
		}
	},
	apply: function() {
		var attrs = this.attrs,
			name;

		if(attrs) {
			for(name in attrs) {
				this.node.setAttribute(name, attrs[name]);
			}
		}
	}
};

v.fn.init.prototype = v.fn;

})(window);