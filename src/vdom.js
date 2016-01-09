(function(window, undefined) {
"use strict";

var v = window.v = function(selector, attrs, children) {
	if(selector instanceof window.Array) {
		attrs = selector[1];
		children = selector[2];
		selector = selector[0];
	}

	if(attrs instanceof window.Array || typeof attrs === "string" || attrs instanceof v) {
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

function compileComplexAttrHook(delimiter, parameterSerializer, setter) {
	return function(node, value, prevValue) {
		var result = value;
		if(isObject(value)) {
			result = [];
			for(var name in value) {
				if(value[name]) {
					result.push(parameterSerializer(name, value[name]));
				}
			}
			result = result.join(delimiter);
		}
		if(result !== prevValue) {
			setter(node, result);
			return result;
		}
	};
}

v.attrHooks = {
	"class": compileComplexAttrHook(" ", 
		function(name) { return name; }, 
		function(node, value) { node.className = value || ""; }
	),
	"style": compileComplexAttrHook("; ", 
		function(name, value) { return name + ": " + value; }, 
		function(node, value) { node.style.cssText = value || ""; }
	)
};

function eventHook(node, name, value, prevValue) {
	var eventType = name.substr(2);

	if(prevValue !== value) {
		if(prevValue) {
			node.removeEventListener(eventType, prevValue);
		}
		if(value) {
			node.addEventListener(eventType, value);
		}
	}
}

function isObject(obj) {
	return Object.getPrototypeOf(obj) === Object.prototype;
}

function fetch(vNode) {
	var i,
		attributes,
		childNodes;
		debugger;
	if(!vNode.attrs) {
		attributes = vNode.node.attributes || [];
		vNode.attrs = {};
		for(i = 0; i < attributes.length; i++) {
			vNode.attrs[attributes[i].name] = attributes[i].value;
		}
	}
	if(!vNode.children) {
		vNode.children = [];
		if(!vNode.node.tagName) {
			vNode.textContent = vNode.node.textContent;
		}
		else {
			childNodes = vNode.node.childNodes;
			for(i = 0; i < childNodes.length; i++) {
				vNode.children.push(v(childNodes[i]));
			}
			if(vNode.children.length === 1 && !vNode.children[0].tagName) {
				vNode.textContent = vNode.children[0].textContent;
				vNode.children = [];
			}
		}
	}
}

v.fn = v.prototype = {
	version: "0.1.0",
	init: function(selector, attrs, children) {
		this.prevAttrs = this.attrs;
		this.prevChildren = this.children;
		
		this.attrs = attrs;

		if(children) {
			this.children = children.slice ? children.slice(0) : children;
		}

		if(selector instanceof Element || selector instanceof Text) {
			this.tagName = selector.tagName;
			this.node = selector;
			this.node.v = this;
			this.apply();
			fetch(this);
		}
		else if(typeof selector === "string"){
			if(selector[0] === '<' && selector[selector.length - 1] === '>') {
				this.tagName = selector.slice(1, -1);
			}
			else {
				this.textContent = selector;
			}
		}
		else {
			throw new Error("Wrong selector type");
		}
	},
	build: function() {
		var tagName = this.tagName;
			
		if(!this.node) {
			if(this.tagName) {
				this.node = document.createElement(this.tagName);
			}
			else {
				this.node = document.createTextNode(this.textContent);
			}
		}
		this.node.v = this;
		this.apply();
	},
	normalize: function() {
		var children = this.children;
		
		if(children) {
			if(!(children instanceof window.Array)) {
				children = [children];
			}
			if(children[0] && children[0][0] === "<") {
				children = [children];
			}
			if(children.length === 1 && (typeof children[0] === "string")) {
				this.textContent = children[0];
				children = [];
			}
			this.children = children;
			for(var i = 0; i < children.length; i++) {
				children[i] = v(children[i]);
			}
		}
	},
	apply: function() {
		this.normalize();

		var attrs = this.attrs,
			prevAttrs = this.prevAttrs,
			prevChildren = this.prevChildren || [],
			children = this.children || [],
			childrenCount = Math.max(prevChildren.length, children.length),
			textContent = this.textContent;

		if(attrs) {
			for(var name in attrs) {
				var value = attrs[name];
				var prevValue = prevAttrs && prevAttrs[name];
				if(name.length > 2 && name.indexOf("on") === 0) {
					eventHook(this.node, name, value, prevValue);
				}
				else if(v.attrHooks[name]){
					attrs[name] = v.attrHooks[name](this.node, value, prevValue);
				}
				else {
					this.node.setAttribute(name, value);
				}
			}
		}

		if(!childrenCount && this.prevTextContent !== textContent) {
			this.node.textContent = textContent;
		}

		this.prevChildren = undefined;
		
		for(var i = 0; i < childrenCount; i++) {
			var vNode = children[i];
			var prevVNode = prevChildren[i];
			
			if(!vNode) {
				prevVNode.node.parentNode.removeChild(prevVNode.node);
			}
			else if(!prevVNode) {
				vNode.build();
				this.node.appendChild(vNode.node);
			}
			else if(prevVNode.tagName !== vNode.tagName) {
				vNode.build();
				prevVNode.node.parentNode.replaceChild(vNode.node, prevVNode.node);
			}
			else {
				children[i] = prevVNode;
				
				prevVNode.prevAttrs = prevVNode.attrs;
				prevVNode.prevChildren = prevVNode.children;
				prevVNode.prevTextContent = prevVNode.textContent;
				
				prevVNode.attrs = vNode.attrs;
				prevVNode.children = vNode.children;
				prevVNode.textContent = vNode.textContent;
				prevVNode.apply();
			}
		}
	}
};

v.fn.init.prototype = v.fn;

})(window);