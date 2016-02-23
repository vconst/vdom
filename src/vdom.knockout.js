(function(window, undefined) {
"use strict";

var v = window.v;

function createBindingsString(vNode) {
	var dataBindString = vNode.attrs && vNode.attrs["data-bind"];
		
	if(dataBindString) {
		return "var bindings = (function($context) { with($context){with($data||{}){ return {" + dataBindString + "};}}})(context);\n";
	}
	return "";
}

function createTemplateChildren(children) {
	var resultChildren = [];
	
	for(var i = 0; i < children.length; i++) {
		resultChildren.push(createTemplateCore(children[i], true));
	}
	
	return "[" + resultChildren.join(", ") + "]";
}

function createTemplateCore(vNode, inline) {
	var templateBody = "";
	
	var bindingsString = createBindingsString(vNode);
	
	templateBody += bindingsString;

	if(bindingsString) {
		templateBody += "if(bindings.if !== undefined && !bindings.if) return;\n";
		templateBody += "if(bindings.ifnot !== undefined && bindings.ifnot) return;\n";
	}	
	
	var attrsString = JSON.stringify(vNode.attrs || {});

	var needReturn = !inline || bindingsString;
	
	if(needReturn) {
		templateBody += "var attrs = " + attrsString + ";\n";
	}

	if(bindingsString) {
		templateBody += "for(var name in bindings) { if(name !== 'if' && name !== 'foreach' && name !== 'data-bind') attrs[name] = bindings[name]; }\n";
	}
	
	
	var childrenString = createTemplateChildren(vNode.children || []);
	
	var parentContext = "{ $parents: context.$parents.concat(context.$data), $root: context.$root, $parent: context.$data, $parentContext: context }";

	if(bindingsString && bindingsString.indexOf("foreach:") >= 0) {
		childrenString = "(function(context, items) {\n var result = [];\n for(var i = 0; i < items.length; i++) {\n context.$data = items[i];\n context.$index = i;\n result = result.concat(" + childrenString + ");\n }\n return result;\n })(" + parentContext + ", bindings.foreach || [])";
	}

	if(childrenString !== "[]") {
		childrenString += ".filter(function(item) { return item; })";
	}

	if(needReturn) {
		templateBody += "return ";
	}
	if(vNode.tagName) {
		templateBody += "[\"<" + vNode.tagName + ">\", " + (needReturn ? "attrs" : attrsString)  + ", " + childrenString + " ]";
	}
	else {
		templateBody += "\"" + vNode.textContent + "\"";
	}
	if(inline && bindingsString) {
		templateBody = "(function(context) {\n " + templateBody + " })(context)"
	}
	return templateBody;
}


function createTemplate(vNode) {
	var templateBody = "var context = { $parents: [], $root: data, $data: data };\ndebugger;";
	
	templateBody += createTemplateCore(vNode);

	return new Function("data", templateBody);
}

v.applyBindings = function(viewModel, element) {
	var vNode;
	
	element = element || document.body;
	
	if(!element.v || !element.v.$template) {
		var vNode = v(element);
		
		element.v.$template = createTemplate(vNode);
	}
	vNode = element.v.$template(viewModel);

	v(element, vNode[1], vNode[2]);
}

})(window);