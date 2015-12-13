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


})();