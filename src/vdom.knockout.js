(function(window, undefined) {
"use strict";

var v = window.v;

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

})(window);