(function(window, undefined) {
"use strict";

var v = window.v = function(selector, attrs, children) {
	if(selector instanceof window.Array) {
		attrs = selector[1];
		children = selector[2];
		selector = selector[0];
	}

	if(attrs instanceof window.Array || typeof attrs === "string") {
		children = attrs;
		attrs = undefined;
	}

	if(selector instanceof v) {
		if(attrs || children) {
			selector.init(selector.node, attrs, children);
		}
		return selector;
	}

	if(selector instanceof Element && selector.v) {
		selector.v.init(selector, attrs, children);
		return selector.v;
	}

	return new v.fn.init(selector, attrs, children);
};

v.attrHooks = {
	"class": function(val) {
		var result = val;
		if(isObject(val)) {
			result = [];
			for(var name in val) {
				if(val[name]) {
					result.push(name);
				}
			}
			result = result.join(" ");
		}
		return result;
	},
	"style": function(val) {
		var result = val;
		if(isObject(val)) {
			result = [];
			for(var name in val) {
				if(val[name]) {
					result.push(name + ": " + val[name]);
				}
			}
			result = result.join("; ");
		}
		return result;
	}
}

function isObject(obj) {
	return Object.getPrototypeOf(obj) === Object.prototype;
}

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
		else if(typeof selector === "string"){
			this.tagName = selector;
		}
		else {
			throw new Error("Wrong selector type");
		}
	},
	build: function() {
		var tagName = this.tagName;
		if(tagName[0] === '<' && tagName[tagName.length - 1] === '>') {
			this.node = document.createElement(tagName.slice(1, -1));
		}
		else {
			this.node = document.createTextNode(tagName);
		}
		this.node.v = this;
		this.apply();
	},
	apply: function() {
		var attrs = this.attrs,
			children = this.children;

		if(attrs) {
			for(var name in attrs) {
				var attrValue = attrs[name];
				var attrHook = v.attrHooks[name];
				
				if(attrHook) {
					attrValue = attrHook(attrValue);
				}
				this.node.setAttribute(name, attrValue);
			}
		}
		if(this.node.nodeName !== "#text") {
			this.node.textContent = "";
		}
		if(children) {
			if(!(children instanceof window.Array)) {
				children = [children];
			}
			if(children[0] && children[0][0] === "<") {
				children = [children];
			}
			for(var i = 0; i < children.length; i++) {
				var vNode = v(children[i]);

				vNode.build();
				this.node.appendChild(vNode.node);
			}
		}
	}
};

v.fn.init.prototype = v.fn;

})(window);