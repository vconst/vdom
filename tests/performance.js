(function() {
//"use strict";

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

})();
