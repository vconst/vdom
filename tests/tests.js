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

})(v)

