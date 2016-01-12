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
	return function(vNode, value, prevValue) {
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
			setter(vNode.node, result);
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
	),
	"visible": function(vNode, value, prevValue) {
		if(value !== prevValue) {
			vNode.node.style.display = value ? "" : "none";
		}
		if(!vNode.prevChildren && vNode.children && !value) {
			vNode.children = [];
		}
	},
	"html": function(vNode, value, prevValue) {
		if(value !== prevValue) {
			vNode.node.innerHTML = value;
		}
	},
	"text": function(vNode, value, prevValue) {
		if(value !== prevValue) {
			vNode.textContent = value;
		}
	},
	"attr": function(vNode, value, prevValue) {
		value = value || {};
		prevValue = prevValue || {};

		for(var name in value) {
			if(value[name] !== prevValue[name]) {
				vNode.node.setAttribute(name, value[name]);
			}
		}
	},
	"event": function(vNode, value, prevValue) {
		value = value || {};
		prevValue = prevValue || {};

		for(var name in value) {
			eventHook(vNode.node, name, value[name], prevValue[name]);
		}
	}
};

function eventHook(node, eventType, value, prevValue) {
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
	return obj && Object.getPrototypeOf(obj) === Object.prototype;
}

function fetch(vNode) {
	var i,
		attributes,
		childNodes;
		
	vNode.tagName = vNode.node.tagName;

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

function applyAttrs(vDom) {
  	var attrs = vDom.attrs,
		prevAttrs = vDom.prevAttrs;

	if(attrs) {
		for(var name in attrs) {
			var value = attrs[name];
			var prevValue = prevAttrs && prevAttrs[name];
			if(name.length > 2 && name.indexOf("on") === 0) {
				eventHook(vDom.node, name.substr(2), value, prevValue);
			}
			else if(v.attrHooks[name]){
				attrs[name] = v.attrHooks[name](vDom, value, prevValue);
				if(attrs[name] === undefined) {
					attrs[name] = value;
				}
			}
			else {
				if(vDom.node.setAttribute && value !== prevValue) {
					vDom.node.setAttribute(name, value);
				}
			}
		}
	}

}

function applyChildren(vDom) {
	var prevChildren = vDom.prevChildren || [],
		children = vDom.children || [],
		childrenCount = Math.max(prevChildren.length, children.length),
		textContent = vDom.textContent;

	if(!childrenCount && vDom.prevTextContent !== textContent) {
		vDom.node.textContent = textContent;
	}

	vDom.prevChildren = undefined;
	
	for(var i = 0; i < childrenCount; i++) {
		var vNode = children[i];
		var prevVNode = prevChildren[i];
		
		if(!vNode) {
			prevVNode.node.parentNode.removeChild(prevVNode.node);
		}
		else if(!prevVNode) {
			vNode.build();
			vDom.node.appendChild(vNode.node);
		}
		else if(prevVNode.tagName !== vNode.tagName) {
			vNode.build();
			prevVNode.node.parentNode.replaceChild(vNode.node, prevVNode.node);
		}
		else {
			children[i] = prevVNode;
			
			prevVNode.init(vNode);
			prevVNode.apply();
		}
	}
}

v.fn = v.prototype = {
	version: "0.1.0",
	init: function(selector, attrs, children) {
		this.prevAttrs = this.attrs;
		this.prevChildren = this.children;
		this.prevTextContent = this.textContent;
		
		this.attrs = attrs;
		this.children = children && children.slice ? children.slice(0) : children;

		if(selector instanceof v) {
			this.tagName = selector.tagName;
			this.attrs = selector.attrs;
			this.textContent = selector.textContent;
			this.children = selector.children;
		}
		else if(selector instanceof Element || selector instanceof Text) {
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
	clone: function(recursive) {
		//this.normalize();
		
		var result = new v.fn.init(this);
		
		if(recursive && result.children) {
			result.children = result.children.slice(0);
			
			for(var i = 0; i < result.children.length; i++) {
				result.children[i] = result.children[i].clone(recursive);
			}
		}
		
		return result;
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
	normalize: function(recursive) {
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
				if(recursive) {
					children[i].normalize();
				}
			}
		}
	},
	apply: function() {
		this.normalize();
		
		applyAttrs(this);
		applyChildren(this);
	}
};

v.fn.init.prototype = v.fn;


v.bindingHandlers = {
	"if": function(vNode, value) {
		return !!value;
	},
	"ifnot": function(vNode, value) {
		return !value;
	},
	"foreach": function(vNode, items, allBindings) {
		var children = [],
			childNode;
			
		if(vNode.children && items) {
			for(var itemIndex = 0; itemIndex < items.length; itemIndex++) {
				for(var childIndex = 0; childIndex < vNode.children.length; childIndex++) {
					childNode = vNode.children[childIndex].clone();
					childNode.$bindingContext = createBindingContext(items[itemIndex], vNode.$bindingContext, itemIndex);
					children.push(childNode);
				}
			}
		}
		vNode.children = children;
	},
	"with": function(vNode, value, allBindings) {
		var childNode;
		
		if(vNode.children) {
			for(var index = 0; index < vNode.children.length; index++) {
				childNode = vNode.children[index];
				childNode.$bindingContext = createBindingContext(value, vNode.$bindingContext);
			}
		}
	}
};

function createBindingContext(data, parentContext, index) {
	return {
			$parents: parentContext ? parentContext.$parents.concat(parentContext.$data) : [],
			$root: parentContext ? parentContext.$root : data,
			$parent: parentContext ? parentContext.$data : null,
			$data: data,
			$parentContext: parentContext,
			$index: index
		};
}

function extend(baseObj, obj) {
	for(var name in obj) {
		baseObj[name] = obj[name];
	}
	return baseObj;
}

function getBindingHandler(bindingName) {
	var bindingHandler = v.bindingHandlers[bindingName];
	if(!bindingHandler && v.attrHooks[bindingName]) {
		bindingHandler = v.bindingHandlers[bindingName] = function(vNode, value) {
			var attrs = vNode.attrs;
			if(!vNode.templateAttrs) {
				vNode.templateAttrs = attrs;
				attrs = vNode.attrs = extend({}, attrs);
			}
			attrs[bindingName] = value;
		}
	}
	return bindingHandler;
}

var bindingsCache = {};

function getBindings(vNode, bindingContext) {
	var dataBindString = vNode.attrs && vNode.attrs["data-bind"],
	    bindingsGetter;
		
	if(dataBindString) {
		bindingsGetter = bindingsCache[dataBindString];
		if(!bindingsGetter) {
			bindingsGetter = bindingsCache[dataBindString] = new Function("$context", "with($context){with($data||{}){return{" + dataBindString + "}}}");
		}
		return bindingsGetter(bindingContext);
	}
}

function applyBindingsCore(template, data, bindingContext) {
	var vNode = template.clone();
	
	vNode.$template = template;
	vNode.$bindingContext = bindingContext = template.$bindingContext || bindingContext || createBindingContext(data);
	
	var allBindings = getBindings(vNode, bindingContext),
		bindingName,
		bindingHandler;
	
	for(bindingName in allBindings) {
		bindingHandler = getBindingHandler(bindingName);
		
		if(bindingHandler(vNode, allBindings[bindingName], allBindings) === false) {
			return;
		}
	}

	var children = vNode.children,
		childNode;
		
	if(children) {
		vNode.children = [];
		for(var i = 0; i < children.length; i++) {
			childNode = applyBindingsCore(children[i], bindingContext.$data, bindingContext);
			if(childNode) {
				vNode.children.push(childNode);
			}
		}
	}
			
	return vNode;
}

v.fn.applyBindings = function(viewModel) {
	var template = this.$template,
		vTree;

	if(viewModel === undefined && this.$bindingContext) {
		viewModel = this.$bindingContext.$data;
	}

	if(template) {
		vTree = applyBindingsCore(template, viewModel);
		if(vTree) {
			v(this.node, vTree.attrs, vTree.children || vTree.textContent);
		}
	}
};

v.applyBindings = function(viewModel, element) {
	var template;
	
	element = element || document.body;
	
	if(!element.v || !element.v.$template) {
		var template = v(element).clone(true);
		
		element.v.$template = template;
	}
	element.v.applyBindings(viewModel);
}

//http://plnkr.co/edit/itZBEmj18NCid8lNjxeO?p=preview

})(window);