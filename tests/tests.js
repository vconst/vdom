(function() {
"use strict";

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
  assert.equal(el.innerText, "Test Text", "inner text");
});

QUnit.test("apply text content several times", function(assert) {
  var el = document.createElement("div");

  v(el, { id: "test-id" }, "Test Text 1");
  v(el, { id: "test-id" }, "Test Text 2");

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.innerText, "Test Text 2", "inner text");
});

QUnit.test("apply one children as virtual node", function(assert) {
  var el = document.createElement("div");

  v(el, v("<span>", "Test Text 1"));

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.childNodes.length, 1, "children count");
  assert.equal(el.childNodes[0].tagName, "SPAN", "child 1 node type");
  assert.equal(el.childNodes[0].innerText, "Test Text 1", "children node 1 text");
});

QUnit.test("apply children as virtual nodes", function(assert) {
  var el = document.createElement("div");

  v(el, { id: "test-id" }, [v("<span>", "Test Text 1"), v("<span>", "Test Text 2")]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.childNodes.length, 2, "children count");
  assert.equal(el.childNodes[0].tagName, "SPAN", "child 1 node type");
  assert.equal(el.childNodes[0].innerText, "Test Text 1", "children node 1 text");
  assert.equal(el.childNodes[1].tagName, "SPAN", "child 2 node type");
  assert.equal(el.childNodes[1].innerText, "Test Text 2", "children node 2 text");
});

QUnit.test("apply children as virtual node arrays", function(assert) {
  var el = document.createElement("div");

  v(el, { id: "test-id" }, [["<span>", "Test Text 1"], ["<span>", "Test Text 2"]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.childNodes.length, 2, "children count");
  assert.equal(el.childNodes[0].tagName, "SPAN", "child 1 node type");
  assert.equal(el.childNodes[0].innerText, "Test Text 1", "children node 1 text");
  assert.equal(el.childNodes[1].tagName, "SPAN", "child 2 node type");
  assert.equal(el.childNodes[1].innerText, "Test Text 2", "children node 2 text");
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
  assert.equal(el.childNodes[0].innerText, "Test Text 1", "children node 1 text");
  assert.equal(el.childNodes[1].tagName, "SPAN", "child 2 node type");
  assert.equal(el.childNodes[1].innerText, "Test Text 2", "children node 2 text");
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
  assert.equal(el.childNodes[0].childNodes[0].innerText, "Test Text 1", "children node 1 text");
  assert.equal(el.childNodes[0].childNodes[1].tagName, "SPAN", "child 2 node type");
  assert.equal(el.childNodes[0].childNodes[1].innerText, "Test Text 2", "children node 2 text");
});

QUnit.test("hashCode for simple node", function(assert) {
  assert.ok(v("<div>").hashCode > 0, "hashCode is positive number");
  
  assert.equal(v("<div>").hashCode, v("<div>").hashCode, "hashCodes for equal tagName");
  assert.notEqual(v("<div>").hashCode, v("<span>").hashCode, "hashCodes for not equal tagName");
  
  assert.equal(v("<div>", { id: "test1", style: { display: "none", width: "100px" }, class: { test1: true, test2: true } }).hashCode, 
               v("<div>", { id: "test1", style: { display: "none", width: "100px" }, class: { test1: true, test2: true } }).hashCode, "hashCodes for equal attributes id, class, style");

  assert.notEqual(v("<div>", { id: "test1", style: { display: "none", width: "100px" }, class: { test1: true, test2: true } }).hashCode, 
                  v("<div>", { id: "test2", style: { display: "none", width: "100px" }, class: { test1: true, test2: true } }).hashCode, "hashCodes for not equal id attribute");
  
  assert.notEqual(v("<div>", { id: "test1", style: { display: "none", width: "100px" }, class: { test1: true, test2: true } }).hashCode, 
                  v("<div>", { id: "test1", style: { display: "none", width: "200px" }, class: { test1: true, test2: true } }).hashCode, "hashCodes for not equal style attribute");

  assert.notEqual(v("<div>", { id: "test1", style: { display: "none", width: "100px" }, class: { test1: true, test2: true } }).hashCode, 
                  v("<div>", { id: "test1", style: { display: "none", width: "100px" }, class: { test1: true, test2: false } }).hashCode, "hashCodes for not equal class attribute");
});

QUnit.test("hashCode for node with children", function(assert) {
  assert.equal(v("<div>", "Test1").hashCode, v("<div>", "Test1").hashCode, "hashCodes for equal text content");
  assert.notEqual(v("<div>", "Test1").hashCode, v("<span>", "Test2").hashCode, "hashCodes for not equal text content");

  assert.equal(v("<div>", [["<span>", "Test1"], ["<span>", "Test2"]]).hashCode, v("<div>", [["<span>", "Test1"], ["<span>", "Test2"]]).hashCode, "hashCodes for equal children");
  assert.notEqual(v("<div>", [["<span>", "Test1"], ["<span>", "Test2"]]).hashCode, v("<div>", [["<span>", "Test1"]]).hashCode, "hashCodes for not equal children count");
  assert.notEqual(v("<div>", [["<span>", "Test1"], ["<span>", "Test2"]]).hashCode, v("<div>", [["<span>", "Test2"], ["<span>", "Test1"]]).hashCode, "hashCodes for not equal children order");
  assert.notEqual(v("<div>", [["<span>", "Test1"], ["<span>", "Test2"]]).hashCode, v("<div>", [["<span>", "Test1"], ["<span>", "Test3"]]).hashCode, "hashCodes for not equal children text content");
  assert.notEqual(v("<div>", ["<div>", ["<span>", "Test1"]]).hashCode, v("<div>", ["<div>", ["<span>", "Test2"]]).hashCode, "hashCodes for not equal children recursive");
});

QUnit.test("render table performance", function(assert) {
	var rows = [];
	var rowCount = 100;
	var columnCount = 100;
  
	for(var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
		rows.push(["<tr>", []]);
		for(var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
			rows[rowIndex][1].push(["<td>", /*{ style: { "text-align": "center" } },*/ "Test " + rowIndex + " " + columnIndex]);
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
			//cell.style.textAlign = "center";
			row.appendChild(cell);
		}
	}
	assert.ok(true, "native js render time - " + (new Date() - date));

	date = new Date();
	container.clientWidth;
	assert.ok(true, "native js reflow time - " + (new Date() - date));
	assert.ok(true, "native js full time - " + (new Date() - startDate));
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

})();