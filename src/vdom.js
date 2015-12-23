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

function compileComplexAttrHook(delimiter, parameterSerializer) {
	return function(val) {
		var result = val;
		if(isObject(val)) {
			result = [];
			for(var name in val) {
				if(val[name]) {
					result.push(parameterSerializer(name, val[name]));
				}
			}
			result = result.join(delimiter);
		}
		return result;
	};
}

v.attrHooks = {
	"class": compileComplexAttrHook(" ", function(name) { return name; }),
	"style": compileComplexAttrHook("; ", function(name, value) { return name + ": " + value; })
};

function isObject(obj) {
	return Object.getPrototypeOf(obj) === Object.prototype;
}

function getStrHashCode(str){
    // 1315423911=b'1001110011001111100011010100111'
    var hash = 1315423911,
		i,
		ch;
		
    for (i = str.length - 1; i >= 0; i--) {
        ch = str.charCodeAt(i);
        hash ^= ((hash << 5) + ch + (hash >> 2));
    }

    return (hash & 0x7FFFFFFF);
}

function getNodeHashCode(vNode) {
	var attrs = vNode.attrs,
		children = vNode.children,
		textContent = vNode.textContent || "",
		hash = getStrHashCode(vNode.tagName || "");
	
	if(attrs) {
		for(var name in attrs) {
			hash ^= getStrHashCode(name + ":" + attrs[name]);
		}
	}

	if(textContent) {
		hash ^= getStrHashCode(textContent);
		hash ^= getStrHashCode(":" + textContent);
	}
	
	if(children) {
		for(var index  = 0; index < children.length; index++) {
			hash ^= getStrHashCode(index + ":" + children[index].hashCode);
		}
	}
	return hash;
}

v.fn = v.prototype = {
	version: "0.1.0",
	init: function(selector, attrs, children) {
		this.attrs = attrs;
		this.children = children;

		if(selector instanceof Element) {
			//this.tagName = selector.tagName;
			this.node = selector;
			this.node.v = this;
			this.normalize();
			this.apply();
		}
		else if(typeof selector === "string"){
			this.tagName = selector;
			this.normalize();
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
	normalize: function() {
		var attrs = this.attrs,
			children = this.children;

		if(attrs) {
			for(var name in attrs) {
				var attrHook = v.attrHooks[name];
				
				if(attrHook) {
					attrs[name] = attrHook(attrs[name]);
				}
			}
		}
		
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
				children[i].normalize();
			}
		}
		this.hashCode = getNodeHashCode(this);
	},
	apply: function() {
		var attrs = this.attrs,
			children = this.children,
			textContent = this.textContent;

		if(attrs) {
			for(var name in attrs) {
				this.node.setAttribute(name, attrs[name]);
			}
		}
		
		if(this.node.nodeName !== "#text") {
			this.node.textContent = "";
		}

		if(textContent) {
			this.node.textContent = textContent;
		}
		
		if(children) {
			for(var i = 0; i < children.length; i++) {
				var vNode = children[i];

				vNode.build();
				this.node.appendChild(vNode.node);
			}
		}
	}
};

v.fn.init.prototype = v.fn;

})(window);