(function(window, undefined) {
"use strict";

var v = window.v = function(selector, attrs, children) {
	if(selector instanceof window.Array) {
		attrs = selector[1];
		children = selector[2];
		selector = selector[0];
	}

	if(selector instanceof v) {
		selector.init(selector.node, attrs, children);
		return selector;
	}

	if(selector instanceof Element && selector.v) {
		selector.v.init(selector, attrs, children);
		return selector.v;
	}

	if(attrs instanceof window.Array || typeof attrs === "string") {
		children = attrs;
		attrs = undefined;
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
			this.node.v = this;
			this.apply();
		}
		else {
			this.tagName = selector;
		}
	},
	build: function() {
		this.node = document.createElement(this.tagName);
		this.node.v = this;
		this.apply();
	},
	apply: function() {
		var attrs = this.attrs,
			children = this.children;

		if(attrs) {
			for(var name in attrs) {
				this.node.setAttribute(name, attrs[name]);
			}
		}
		this.node.textContent = "";
		if(children) {
			if(!(children instanceof window.Array)) {
				children = [children];
			}
			for(var i = 0; i < children.length; i++) {
				var vNode = children[i];
				if(vNode) {
					if(vNode instanceof window.Array && typeof vNode[0] === "string") {
						vNode = v(vNode);
					}
					if(vNode instanceof v) {
						vNode.build();
						this.node.appendChild(vNode.node);
					}
					else if(typeof vNode === "string") {
						var node = document.createTextNode(vNode);
						this.node.appendChild(node);
					}
				}
			}
		}
	}
};

v.fn.init.prototype = v.fn;

})(window);