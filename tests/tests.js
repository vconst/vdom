(function() {
"use strict";

QUnit.test("namespace", function(assert) {
  assert.equal(typeof v, "function", "v is function" );
  assert.ok(typeof v.fn, "v.fn is object");
});

QUnit.test("init", function(assert) {
  var el = v("div");

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
  assert.equal(el.innerText, "Test Text", "id attribute");
});

QUnit.test("apply text content several times", function(assert) {
  var el = document.createElement("div");

  v(el, { id: "test-id" }, "Test Text 1");
  v(el, { id: "test-id" }, "Test Text 2");

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.innerText, "Test Text 2", "inner text");
});

QUnit.test("apply children as virtual nodes", function(assert) {
  var el = document.createElement("div");

  v(el, { id: "test-id" }, [v("span", "Test Text 1"), v("span", "Test Text 2")]);

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

  v(el, { id: "test-id" }, [["span", "Test Text 1"], ["span", "Test Text 2"]]);

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

  v([el, { id: "test-id" }, [["span", "Test Text 1"], "Test Text 2", ["span", "Test Text 3"]]]);

  assert.ok(el.v, "vdom element is created" );
  assert.equal(el.getAttribute("id"), "test-id", "id attribute");
  assert.equal(el.childNodes.length, 3, "children count");
  assert.equal(el.innerHTML, "<span>Test Text 1</span>Test Text 2<span>Test Text 3</span>", "inner html");
});

QUnit.test("apply attrs and children by array", function(assert) {
  var el = document.createElement("div");

  v([el, { id: "test-id" }, [["span", "Test Text 1"], ["span", "Test Text 2"]]]);

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

  v(el, { id: "test-id" }, [["div", [["span", "Test Text 1"], ["span", "Test Text 2"]]]]);

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


})();