(function() {
//"use strict";

QUnit.module("knockout");

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
