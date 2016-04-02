(function() {
//"use strict";

QUnit.module("jQuery");

QUnit.test("init", function(assert) {
  var v1 = v("<div>");

  assert.ok(v1, "vdom element is created" );
  assert.ok(v1 instanceof v, "vdom element is instance of v" );
  assert.ok(v1 instanceof jQuery, "vdom element is instance of jQuery" );
  assert.strictEqual(v1.length, 1, "vdom element length" );
  assert.strictEqual(v1[0], v1.node, "vdom element node by 0 key" );
});

QUnit.test("text", function(assert) {
  var el = document.createElement("div");

  var v1 = v(el).text("Test");

  assert.equal(v1[0].textContent, "Test", "vdom element textContent" );
});

QUnit.test("several append and text", function(assert) {
  var el = document.createElement("div");

  var v1 = v(el);
  v1.append(v("<span>").text("Test1"));
  v1.append(v("<span>").text("Test2"));

  assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test2</span>", "vdom element innerHTML" );
});

QUnit.test("several appendTo and text", function(assert) {
  var el = document.createElement("div");

  var v1 = v(el);
  v("<span>").appendTo(v1).text("Test1");
  v("<span>").appendTo(v1).text("Test2");

  assert.equal(v1[0].innerHTML, "<span>Test1</span><span>Test2</span>", "vdom element innerHTML" );
});


QUnit.test("empty", function(assert) {
  var el = document.createElement("div");

  var v1 = v(el);
  v1.append(v("<span>").text("Test1"));
  v1.empty();
  v1.append(v("<span>").text("Test2"));

  assert.equal(v1[0].innerHTML, "<span>Test2</span>", "vdom element innerHTML" );
});


})();
