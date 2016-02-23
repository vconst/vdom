(function() {
//"use strict";

QUnit.module("Basic");

/*QUnit.test("test", function(assert) {
	
	var names = [];

	for(var name in jQuery.fn) {
		names.push(name);
	}
	
	assert.equal(names.join(" "), "function");
});*/


QUnit.test("namespace", function(assert) {
  assert.equal(typeof v, "function", "v is function" );
  assert.ok(typeof v.fn, "v.fn is object");
});

QUnit.test("init", function(assert) {
  var el = v("<div>");

  assert.ok(el, "vdom element is created" );
  assert.equal(typeof el, "object", "vdom element type" );
  assert.ok(el instanceof v.fn.init, "vdom element is instance of v" );
  assert.equal(el.version, "0.1.0", "current version");
});

QUnit.test("apply attributes on dom element", function(assert) {
  var el = document.createElement("div");

  var v1 = v(el, { id: "test-id", class: "test1 test2", style: "width: 200px; height: 100px" });

  assert.ok(el.v, "vdom element is created" );
  assert.strictEqual(el.v, v1, "vdom element instance in dom" );
  assert.ok(el.v instanceof v.fn.init, "vdom element is instance of v" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.getAttribute("class"), "test1 test2", "class attribute");
  assert.equal(el.className, "test1 test2", "className property");
  assert.equal(el.style.width, "200px", "style.width property");
});

QUnit.test("apply attributes as object on dom element", function(assert) {
  var el = document.createElement("div");

  var v1 = v(el, { id: "test-id", class: { test1: true, test2: true, test3: false }, style: { width: "200px", height: "100px" }});

  assert.ok(el.v, "vdom element is created" );
  assert.strictEqual(el.v, v1, "vdom element instance in dom" );
  assert.ok(el.v instanceof v.fn.init, "vdom element is instance of v" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.getAttribute("class"), "test1 test2", "class attribute");
  assert.equal(el.className, "test1 test2", "className property");
  assert.equal(el.style.width, "200px", "style.width property");
});


QUnit.test("apply attributes on virtual dom element", function(assert) {
  var el = document.createElement("div");
  var v1 = v(el, { id: "test-id-old" });

  var v2 =  v(v1, { id: "test-id-new", class: "test1 test2", style: "width: 200px; height: 100px" });

  assert.ok(el.v, "vdom element is created" );
  assert.ok(el.v === v1, "vdom element instance in dom");
  assert.ok(v1 === v2, "vdom element is not recreated");
  assert.ok(el.v instanceof v.fn.init, "vdom element is instance of v" );
  assert.equal(el.getAttribute("id"), "test-id-new", "id attribute");
  assert.equal(el.getAttribute("class"), "test1 test2", "class attribute");
  assert.equal(el.className, "test1 test2", "className property");
  assert.equal(el.style.width, "200px", "style.width property");
});

QUnit.test("apply attributes on dom element several times", function(assert) {
  var el = document.createElement("div");
  var v1 = v(el, { id: "test-id-old" });

  var v2 =  v(el, { id: "test-id-new", class: "test1 test2", style: "width: 200px; height: 100px" });

  assert.ok(el.v, "vdom element is created" );
  assert.ok(el.v === v1, "vdom element instance in dom");
  assert.ok(v1 === v2, "vdom element is not recreated");
  assert.ok(el.v instanceof v.fn.init, "vdom element is instance of v" );
  assert.equal(el.getAttribute("id"), "test-id-new", "id attribute");
  assert.equal(el.getAttribute("class"), "test1 test2", "class attribute");
  assert.equal(el.className, "test1 test2", "className property");
  assert.equal(el.style.width, "200px", "style.width property");
});

QUnit.test("apply text content", function(assert) {
  var el = document.createElement("div");

  v(el, { id: "test-id" }, "Test Text");

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.textContent, "Test Text", "inner text");
});

QUnit.test("apply text content several times", function(assert) {
  var el = document.createElement("div");

  v(el, { id: "test-id" }, "Test Text 1");
  v(el, { id: "test-id" }, "Test Text 2");

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.textContent, "Test Text 2", "inner text");
});

QUnit.test("apply one children as virtual node", function(assert) {
  var el = document.createElement("div");

  v(el, v("<span>", "Test Text 1"));

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.childNodes.length, 1, "children count");
  assert.equal(el.childNodes[0].tagName, "SPAN", "child 1 node type");
  assert.equal(el.childNodes[0].textContent, "Test Text 1", "children node 1 text");
});

QUnit.test("apply children as virtual nodes", function(assert) {
  var el = document.createElement("div");

  v(el, { id: "test-id" }, [v("<span>", "Test Text 1"), v("<span>", "Test Text 2")]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.childNodes.length, 2, "children count");
  assert.equal(el.childNodes[0].tagName, "SPAN", "child 1 node type");
  assert.equal(el.childNodes[0].textContent, "Test Text 1", "children node 1 text");
  assert.equal(el.childNodes[1].tagName, "SPAN", "child 2 node type");
  assert.equal(el.childNodes[1].textContent, "Test Text 2", "children node 2 text");
});

QUnit.test("apply children as virtual node arrays", function(assert) {
  var el = document.createElement("div");

  v(el, { id: "test-id" }, [["<span>", "Test Text 1"], ["<span>", "Test Text 2"]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.childNodes.length, 2, "children count");
  assert.equal(el.childNodes[0].tagName, "SPAN", "child 1 node type");
  assert.equal(el.childNodes[0].textContent, "Test Text 1", "children node 1 text");
  assert.equal(el.childNodes[1].tagName, "SPAN", "child 2 node type");
  assert.equal(el.childNodes[1].textContent, "Test Text 2", "children node 2 text");
});

QUnit.test("apply children as virtual nodes arrays and texts", function(assert) {
  var el = document.createElement("div");

  v([el, { id: "test-id" }, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.childNodes.length, 3, "children count");
  assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2<span>Test Text 3</span>", "inner html");
});

QUnit.test("apply attrs and children by array", function(assert) {
  var el = document.createElement("div");

  v([el, { id: "test-id" }, [["<span>", "Test Text 1"], ["<span>", "Test Text 2"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.childNodes.length, 2, "children count");
  assert.equal(el.childNodes[0].tagName, "SPAN", "child 1 node type");
  assert.equal(el.childNodes[0].textContent, "Test Text 1", "children node 1 text");
  assert.equal(el.childNodes[1].tagName, "SPAN", "child 2 node type");
  assert.equal(el.childNodes[1].textContent, "Test Text 2", "children node 2 text");
});

QUnit.test("apply children recursive", function(assert) {
  var el = document.createElement("div");

  v(el, { id: "test-id" }, ["<div>", [["<span>", "Test Text 1"], ["<span>", "Test Text 2"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.childNodes.length, 1, "children count");
  assert.equal(el.childNodes[0].tagName, "DIV", "child 1 node type");
  assert.equal(el.childNodes[0].childNodes.length, 2, "children count");
  assert.equal(el.childNodes[0].childNodes[0].tagName, "SPAN", "child 1 node type");
  assert.equal(el.childNodes[0].childNodes[0].textContent, "Test Text 1", "children node 1 text");
  assert.equal(el.childNodes[0].childNodes[1].tagName, "SPAN", "child 2 node type");
  assert.equal(el.childNodes[0].childNodes[1].textContent, "Test Text 2", "children node 2 text");
});

QUnit.test("update textContent in children", function(assert) {
  var el = document.createElement("div");

  v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);
  
  var v1 = el.childNodes[0].v;
  var v2 = el.childNodes[1].v;
  var v3 = el.childNodes[2].v;

  v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 4"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.childNodes.length, 3, "children count");
  assert.equal(el.childNodes[0].v, v1, "vNode instance is not changed for child node 1");
  assert.equal(el.childNodes[1].v, v2, "vNode instance is not changed for child node 2");
  assert.equal(el.childNodes[2].v, v3, "vNode instance is not changed for child node 3");
  assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2<span>Test Text 4</span>", "inner html");
});

QUnit.test("add node in children to end", function(assert) {
  var el = document.createElement("div");

  v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);
  
  var v3 = el.childNodes[2].v;

  v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"], ["<span>", "Test Text 4"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.childNodes.length, 4, "children count");
  assert.equal(el.childNodes[2].v, v3, "vNode instance is not changed for child node 3");
  assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2<span>Test Text 3</span><span>Test Text 4</span>", "inner html");
});

QUnit.test("add node in children to middle", function(assert) {
  var el = document.createElement("div");

  v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);
  
  //var v3 = el.childNodes[2].v;

  v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<div>", "Test Text 4"], ["<span>", "Test Text 3"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.childNodes.length, 4, "children count");
  //assert.equal(el.childNodes[3].v, v3, "vNode instance is not changed for child node 3");
  assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2<div>Test Text 4</div><span>Test Text 3</span>", "inner html");
});

QUnit.test("add node in children to start when key is not used", function(assert) {
  var el = document.createElement("div");

  v([el, [["<span>", "Test Text 1"], ["<span>", "Test Text 2"]]]);
  var v0 = el.childNodes[0].v;
  var v1 = el.childNodes[1].v;
  
  v([el, [["<span>", "Test Text 0"], ["<span>", "Test Text 1"], ["<span>", "Test Text 2"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.childNodes.length, 3, "children count");
  assert.equal(el.childNodes[0].v, v0, "vNode instance is not changed for first node");
  assert.equal(el.childNodes[1].v, v1, "vNode instance is not changed for second node");
  assert.equal(el.innerHTML, "<span>Test Text 0</span><span>Test Text 1</span><span>Test Text 2</span>", "inner html");
});

QUnit.test("add node in children to start when key is used", function(assert) {
  var el = document.createElement("div");

  v([el, [["<span>", { key: 1 }, "Test Text 1"], ["<span>", { key: 2 }, "Test Text 2"]]]);
  var v0 = el.childNodes[0].v;
  var v1 = el.childNodes[1].v;
  
  v([el, [["<span>", { key: 0 }, "Test Text 0"], ["<span>", { key: 1 }, "Test Text 1"], ["<span>", { key: 2 }, "Test Text 2"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.childNodes.length, 3, "children count");
  assert.equal(el.childNodes[1].v, v0, "vNode instance is moved for first node to second");
  assert.equal(el.childNodes[2].v, v1, "vNode instance is moved for second node to third");
  assert.equal(el.innerHTML, "<span>Test Text 0</span><span>Test Text 1</span><span>Test Text 2</span>", "inner html");
});

QUnit.test("reorder nodes in children when key is used", function(assert) {
  var el = document.createElement("div");

  v([el, [["<span>", { key: 0 }, "Test Text 0"], ["<span>", { key: 1 }, "Test Text 1"], ["<span>", { key: 2 }, "Test Text 2"]]]);
  var v0 = el.childNodes[0].v;
  var v1 = el.childNodes[1].v;
  var v2 = el.childNodes[2].v;
  
  v([el, [["<span>", { key: 2 }, "Test Text 2"], ["<span>", { key: 1 }, "Test Text 1"], ["<span>", { key: 0 }, "Test Text 0"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.childNodes.length, 3, "children count");
  assert.equal(el.childNodes[0].v, v2, "vNode 0 equal prev vNode 2");
  assert.equal(el.childNodes[1].v, v1, "vNode 1 equal prev vNode 1");
  assert.equal(el.childNodes[2].v, v0, "vNode 2 equal prev vNode 0");
  assert.equal(el.innerHTML, "<span>Test Text 2</span><span>Test Text 1</span><span>Test Text 0</span>", "inner html");
});

QUnit.test("reorder nodes random in children when key is used", function(assert) {
  var el = document.createElement("div");

  v([el, [["<span>", { key: 0 }, "Test Text 0"], ["<span>", { key: 1 }, "Test Text 1"], ["<span>", { key: 2 }, "Test Text 2"], ["<span>", { key: 3 }, "Test Text 3"]]]);
  var v0 = el.childNodes[0].v;
  var v1 = el.childNodes[1].v;
  var v2 = el.childNodes[2].v;
  var v3 = el.childNodes[3].v;
  
  v([el, [["<span>", { key: 0 }, "Test Text 0"], ["<span>", { key: 3 }, "Test Text 3"], ["<span>", { key: 2 }, "Test Text 2"], ["<span>", { key: 1 }, "Test Text 1"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.childNodes.length, 4, "children count");
  assert.equal(el.childNodes[0].v, v0, "vNode 0 equal prev vNode 0");
  assert.equal(el.childNodes[1].v, v3, "vNode 1 equal prev vNode 3");
  assert.equal(el.childNodes[2].v, v2, "vNode 2 equal prev vNode 2");
  assert.equal(el.childNodes[3].v, v1, "vNode 2 equal prev vNode 1");
  assert.equal(el.innerHTML, "<span>Test Text 0</span><span>Test Text 3</span><span>Test Text 2</span><span>Test Text 1</span>", "inner html");
});



QUnit.test("remove node in children from end", function(assert) {
  var el = document.createElement("div");

  v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);
  
  v([el, [["<span>", "Test Text 1"], "Test Text 2"]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.childNodes.length, 2, "children count");
  assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2", "inner html");
});

QUnit.test("remove text node in children from middle", function(assert) {
  var el = document.createElement("div");

  v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);
  
  v([el, [["<span>", "Test Text 1"], ["<span>", "Test Text 3"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.childNodes.length, 2, "children count");
  assert.equal(el.innerHTML, "<span>Test Text 1</span><span>Test Text 3</span>", "inner html");
});

QUnit.test("remove text from node", function(assert) {
  var el = document.createElement("div");

  v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>", "Test Text 3"]]]);
  
  v([el, [["<span>", "Test Text 1"], "Test Text 2", ["<span>"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.childNodes.length, 3, "children count");
  assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2<span></span>", "inner html");
});

QUnit.test("apply event on virtual dom element", function(assert) {
  var el = document.createElement("div");
  
  var clickCount = 0;

  v(el, { onclick: function() { clickCount++; } });
  
  el.dispatchEvent(  new MouseEvent("click"));

  assert.equal(clickCount, 1, "click count" );
});

QUnit.test("apply event on dom element several times", function(assert) {
  var el = document.createElement("div");
  
  var clickCount = 0;

  v(el, { onclick: function() { clickCount++; } });

  v(el, { onclick: function() { clickCount++; } });
  
  el.dispatchEvent(  new MouseEvent("click"));

  assert.equal(clickCount, 1, "click count" );
});

QUnit.test("vNode from node", function(assert) {
  var el = document.createElement("div");
  var child1 = document.createElement("span");
  child1.textContent = "Test Text 1";
  el.appendChild(child1);
  var child2 = document.createElement("span");
  child2.textContent = "Test Text 2";
  el.appendChild(child2);
  el.id = "test-id";
  el.style.width = "100px";

  var vNode = v(el);

  assert.equal(vNode.tagName, "DIV", "root tagName");
  assert.deepEqual(vNode.attrs, { style: "width: 100px;", id: "test-id" }, "root attrs");
  assert.equal(vNode.children.length, 2, "root children count");
  assert.equal(vNode.children[0].tagName, "SPAN", "children 1 tagName");
  assert.equal(vNode.children[0].textContent, "Test Text 1", "children 1 textContent");
  assert.equal(vNode.children[1].tagName, "SPAN", "children 2 tagName");
  assert.equal(vNode.children[1].textContent, "Test Text 2", "children 2 textContent");
});

QUnit.test("apply visible hook on dom element", function(assert) {
  var el = document.createElement("div");

  v(el, { visible: false }, [["<div>"], ["<div>"]]);

  assert.equal(el.style.display, "none", "element is hidden");
  assert.equal(el.childNodes.length, 0, "children count");

  v(el, { visible: true }, [["<div>"], ["<div>"]]);
  
  assert.equal(el.style.display, "", "element is visible");
  assert.equal(el.childNodes.length, 2, "children count");

  v(el, { visible: false }, [["<div>"], ["<div>"]]);

  assert.equal(el.style.display, "none", "element is hidden");
  assert.equal(el.childNodes.length, 2, "children count");
});

QUnit.test("apply html hook on dom element", function(assert) {
  var el = document.createElement("div");

  v(el, { html: "<span>Test Text</span>" });

  assert.equal(el.innerHTML, "<span>Test Text</span>", "element innerHTML");
});

QUnit.test("apply text hook on dom element", function(assert) {
  var el = document.createElement("div");

  v(el, { text: "<span>Test Text</span>" });

  assert.equal(el.textContent, "<span>Test Text</span>", "element textContent");
});

QUnit.test("apply attr hook on dom element", function(assert) {
  var el = document.createElement("div");

  v(el, { attr: { id: "test-id", "data-test": "test" } });

  assert.equal(el.getAttribute("id"), "test-id", "element id attribute");
  assert.equal(el.getAttribute("data-test"), "test", "element data-test attribute");
});

QUnit.test("apply event hook on virtual dom element", function(assert) {
  var el = document.createElement("div");
  
  var clickCount = 0;
  var mousedownCount = 0;

  v(el, { event: { click: function() { clickCount++; }, mousedown: function() { mousedownCount++; } }});
  
  el.dispatchEvent(new MouseEvent("click"));
  el.dispatchEvent(new MouseEvent("mousedown"));

  assert.equal(clickCount, 1, "click count" );
  assert.equal(mousedownCount, 1, "mousedown count" );
});

QUnit.module("Performance");

QUnit.test("render table performance", function(assert) {
	var rows = [];
	var rowCount = 100;
	var columnCount = 100;

	for(var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
		rows.push(["<tr>", []]);
		for(var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
			rows[rowIndex][1].push(["<td>", 
			{ onclick: function() {}, class: "cell", style: { "text-align": "center" } }, 
			//{ class: "cell" },
			"Test " + rowIndex + " " + columnIndex]);
		}
	}
	
	var container = document.createElement("div");
	container.style.visibility = "hidden";
	document.body.appendChild(container);

	var startDate = new Date();
	var date = startDate;
	
	var vTable = v("<table>", rows);
	assert.ok(true, "initialization time - " + (new Date() - date));
	
	
	date = new Date();
	v(container, vTable);
	assert.ok(true, "render time - " + (new Date() - date));
	
	date = new Date();
	container.clientWidth;
	assert.ok(true, "reflow time - " + (new Date() - date));
	assert.ok(true, "full time - " + (new Date() - startDate));
	assert.equal(vTable.node.rows[50].cells[50].textContent, "Test 50 50", "cell 50 50 text");
	

	startDate = new Date();
	date = startDate;

	rows[50][1][50][1] = "Test Updated";
	vTable = v("<table>", rows);
	assert.ok(true, "update initialization time - " + (new Date() - date));
	
	
	date = new Date();
	//console.profile("update render");
	var vContainer = v(container, vTable);
	//console.profileEnd();
	assert.ok(true, "update render time - " + (new Date() - date));
	
	date = new Date();
	container.clientWidth;
	assert.ok(true, "update reflow time - " + (new Date() - date));
	assert.ok(true, "update full time - " + (new Date() - startDate));
	assert.equal(vContainer.node.firstChild.rows[50].cells[50].textContent, "Test Updated", "cell 50 50 text");



	container.textContent = "";
	container.clientWidth;

	startDate = new Date();
	date = startDate;
	var table = document.createElement("table");
	container.appendChild(table);
	
	for(var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
		var row = document.createElement("tr");
		table.appendChild(row);
		
		for(var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
			var cell = document.createElement("td");
			cell.textContent = "Test " + rowIndex + " " + columnIndex;
			cell.addEventListener("click", function() {});
			cell.className = "cell";
			cell.style.textAlign = "center";
			row.appendChild(cell);
		}
	}
	assert.ok(true, "native js render time - " + (new Date() - date));

	date = new Date();
	container.clientWidth;
	assert.ok(true, "native js reflow time - " + (new Date() - date));
	assert.ok(true, "native js full time - " + (new Date() - startDate));
	
	startDate = new Date();
	date = startDate;
	table.rows[50].cells[50].textContent = "Test Updated";
	assert.ok(true, "update native js render time - " + (new Date() - date));

	date = new Date();
	container.clientWidth;
	assert.ok(true, "update native js reflow time - " + (new Date() - date));
	assert.ok(true, "update native js full time - " + (new Date() - startDate));
	
});

QUnit.test("render list performance", function(assert) {
	var items = [];
	var itemCount = 10000;
  
	for(var rowIndex = 0; rowIndex < itemCount; rowIndex++) {
		items.push(["<li>", "test " + rowIndex]);
	}
	
	var container = document.createElement("div");
	container.style.visibility = "hidden";
	document.body.appendChild(container);

	var startDate = new Date();
	var date = startDate;
	
	var vList= v("<ul>", items);
	assert.ok(true, "initialization time - " + (new Date() - date));
	
	
	date = new Date();
	v(container, vList);
	assert.ok(true, "render time - " + (new Date() - date));
	
	date = new Date();
	container.clientWidth;
	assert.ok(true, "reflow time - " + (new Date() - date));
	assert.ok(true, "full time - " + (new Date() - startDate));



	container.textContent = "";
	container.clientWidth;

	startDate = new Date();
	date = startDate;
	var list = document.createElement("ul");
	container.appendChild(list);
	for(var rowIndex = 0; rowIndex < itemCount; rowIndex++) {
		var item = document.createElement("li");
		item.textContent = "test " + rowIndex;
		list.appendChild(item);
	}
	assert.ok(true, "native js render time - " + (new Date() - date));

	date = new Date();
	container.clientWidth;
	assert.ok(true, "native js reflow time - " + (new Date() - date));
	assert.ok(true, "native js full time - " + (new Date() - startDate));
});

QUnit.module("knockout syntax");

QUnit.test("applyBindings foreach/if/text/attr", function(assert) {
  var el = document.getElementById("qunit-fixture");
  
  el.innerHTML = '<ul class="list" data-bind="foreach: items"><li class="list-item" data-bind="if: visible, attr: { id: \'list-item-\' + caption }"><span class="list-item-caption" data-bind="text: caption"></span>: <span class="list-item-content" data-bind="text: text"></li></ul>'
  
  v.applyBindings({ items: [{ caption: "1", text: "text 1", visible: true }, { caption: "2", text: "text 2", visible: false }, { caption: "3", text: "text 3", visible: true }] }, el);
  
  assert.equal(el.innerHTML, 
	"<ul class=\"list\" data-bind=\"foreach: items\">" + 
		"<li class=\"list-item\" data-bind=\"if: visible, attr: { id: 'list-item-' + caption }\" id=\"list-item-1\">" + 
			"<span class=\"list-item-caption\" data-bind=\"text: caption\">1</span>: <span class=\"list-item-content\" data-bind=\"text: text\">text 1</span>" + 
		"</li>" + 
		"<li class=\"list-item\" data-bind=\"if: visible, attr: { id: 'list-item-' + caption }\" id=\"list-item-3\">" + 
			"<span class=\"list-item-caption\" data-bind=\"text: caption\">3</span>: <span class=\"list-item-content\" data-bind=\"text: text\">text 3</span>" + 
		"</li>" + 
	"</ul>");
	
	v.applyBindings({ items: [] }, el);
	
  assert.equal(el.innerHTML, 
	"<ul class=\"list\" data-bind=\"foreach: items\">" + 
	"</ul>");
	
});

QUnit.test("applyBindings perfomance", function(assert) {
	var viewModel = { items: [] };
	
    var el = document.createElement("div");
	
	document.body.appendChild(el);
  
    el.innerHTML = '<ul id="v-list" data-bind="foreach: items"><li>v: <span data-bind="text: val"></span></li></ul>';
	
	var date = new Date();
	v.applyBindings(viewModel, el);
	assert.ok(true, new Date() - date);

	date = new Date();
	fill(10000);
	el.clientWidth;
	assert.ok(true, new Date() - date);

	date = new Date();
	update(10000);
	el.clientWidth;
	assert.ok(true, new Date() - date);

	function fill(n) {
		var i,
			items = [];
		for (i = 0; i < n; i += 1) {
			items.push({
				val: i
			});
		}
		viewModel.items = items;
		
		v.applyBindings(viewModel, el);
	}

	function update(n) {
		var i, 
			item;
		
		for(var i = 0 ; i < n; i++) {
			item = viewModel.items[i];
			item.val = item.val + ' ' + item.val;
		};

		v.applyBindings(viewModel, el);
	}
	
	//el.remove();
	

});


})();
