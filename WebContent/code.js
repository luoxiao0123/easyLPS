function graphButtonToJson(button) {
	var graphJson = {
		jsonStr: button.getAttribute("jsonstring"),
		graphType: button.getAttribute("graphtype"),
		graphName: button.getAttribute("graphname"),
		graphId: button.getAttribute("graphid")
	}
	return graphJson;
}

function deleteGraph() {
	var subgraphList = document.getElementsByClassName("selectGraph");
	$.each(subgraphList, function(i, ele){
		if(ele.children[1].checked) {
			ele.parentNode.parentNode.removeChild(ele.parentNode);
		}
	});
}

function getFinalCode() {
	var subgraphList = document.getElementsByClassName("selectGraph");
	if(subgraphList.length == 0) {
		alert("There is no saved graph!");
		return;
	}
	var graphJson = {
		initGraph : [],
		reactGraph : [],
		macroGraph : []
	}
	$.each(subgraphList, function(i, ele){
		if(ele.children[1].checked) {
			if(ele.getAttribute("graphType") == "initialize") {
				graphJson.initGraph.push(graphButtonToJson(ele));
			}
			else if(ele.getAttribute("graphType") == "reactiverule") {
				graphJson.reactGraph.push(graphButtonToJson(ele));
			}
			else if(ele.getAttribute("graphType") == "macroaction") {
				graphJson.macroGraph.push(graphButtonToJson(ele));
			}
		}
	});
	if(graphJson.initGraph.length > 1) {
		alert("There can be at most 1 initialization graph!");
		return;
	}
	$.ajax({
		url : "CompileServlet",
		type : "post",
		data : {
			"graphJson": JSON.stringify(graphJson)
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){ 
			alert(XMLHttpRequest.responseText);
		},
		success : function(data) {
			var jsonData = JSON.parse(data);
			document.getElementById('output').value = jsonData.code;
			global.collection.actions = jsonData.actions;
			global.collection.fluents = jsonData.fluents;
			global.collection.macros = jsonData.macros;
			global.collection.actionsWild = jsonData.actionsWild;
			global.collection.fluentsWild = jsonData.fluentsWild;
			global.collection.macrosWild = jsonData.macrosWild;
			demonstrate(global.collection.actionsWild, 
					global.collection.fluentsWild, global.collection.macrosWild);
			getAllCells(global.collection.actions, "action");
			getAllCells(global.collection.fluents, "fluent");
			autoComplete();
		}
	});
}

function demonstrate(actions, fluents, macros) {
	demo(actions, "graphactions");
	demo(fluents, "graphfluents");
	demo(macros, "graphmacros");
}

function demo(list, str) {
	var node = document.getElementById(str);
	while (node.firstChild) {
	    node.removeChild(node.firstChild);
	}
	$.each(list, function(i, ele) {
		var li = document.createElement("LI");
		var ahref = document.createElement("A");
		ahref.href = "#";
		ahref.className = "cell";
		ahref.innerHTML = ele;
		li.appendChild(ahref);
		node.appendChild(li);
	});
}

function getAllCells(cells, cellType) {
	var className;
	if(cellType == "action") className = "actionSelect";
	else if(cellType == "fluent") className = "fluentSelect";
	else return;
	var nodes = document.getElementsByClassName(className);
	$.each(nodes, function(i, node) {
		var rows = node.getElementsByTagName("option");
		while (rows.length > 1) {
		    node.removeChild(rows[1]);
		}
		var option;
		$.each(cells, function(i, ele) {
			option = document.createElement("OPTION");
			option.value = ele;
			option.innerHTML = ele;
			node.appendChild(option);
		});
	});
}

function autoComplete() {
	$(function() {
	    $("#action").autocomplete({
	    	source: global.collection.actions
	    });
	    $("#fluent").autocomplete({
	    	source: global.collection.fluents
		});
	});
}

function autoText(id) {
	var input = document.getElementById(id);
	var select = input.parentNode.children[1];
	if(select.value == null || select.value == "") return;
	input.value = select.value;
}

function causeChg() {
	var cause = document.getElementById("cause");
	var line = document.getElementById("fromto");
	if(cause.value == "updates" && line.getAttribute("style") == "display:none") {
		line.setAttribute("style", "display:table-row");
	}
	if(cause.value != "updates" && line.getAttribute("style") == "display:table-row") {
		line.setAttribute("style", "display:none");
	}
}

function newCondition() {
	var table = document.getElementById("causalTheory");
	var tr = document.createElement("TR");
	var th = document.createElement("TH");
	th.innerHTML = "condition";
	var td = document.createElement("TD");
	td.className = "cond";
	var select = document.createElement("SELECT");
	var trueOption = document.createElement("OPTION");
	trueOption.innerHTML = "";
	trueOption.value = "";
	var falseOption = document.createElement("OPTION");
	falseOption.innerHTML = "not";
	falseOption.value = "not ";
	var input = document.createElement("INPUT");
	var del = document.createElement("BUTTON");
	del.innerHTML = "delete";
	select.appendChild(trueOption);
	select.appendChild(falseOption);
	td.appendChild(select);
	td.appendChild(input);
	td.appendChild(del);
	tr.appendChild(th);
	tr.appendChild(td);
	table.appendChild(tr);
	input.onkeyup = function() {
		condRestrict(this);
	}
	del.onclick = function() {
		this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
	}
}

function newCausalLaw() {
	var table = document.getElementById("causalTheory");
	var action = document.getElementById("action").value;
	var str = "";
	if(action == null || action == "") {
		alert("Please input the action");
		return;
	}
	if(!isValidName(action)) {
		alert(action + " is not a valid action name");
		return;
	}
	str = str + toStandardForm(action) + " ";
	var cause = document.getElementById("cause").value;
	if(cause == null || cause == "") {
		alert("Please select the value of cause");
		return;
	}
	str = str + cause + " ";
	if(cause == "updates") {
		var from = document.getElementById("from").value;
		var to = document.getElementById("to").value;
		if(from == null || from == "" || to == null || to == "") {
			alert("Please input the value of updates");
			return;
		}
		str = str + from.trim().resetBlank() + 
		" to " + to.trim().resetBlank() + " in ";
	}
	var fluent = document.getElementById("fluent").value;
	if(fluent == null || fluent == "") {
		alert("Please input the fluent");
		return;
	}
	if(!isValidName(fluent)) {
		alert(fluent + " is not a valid fluent name");
		return;
	}
	str = str + toStandardForm(fluent);
	var conds = table.getElementsByClassName("cond");
	if(conds.length > 0) {
		var condsArray = new Array();
		$.each(conds, function(i, ele) {
			condsArray.push(" " + ele.children[0].value + 
					ele.children[1].value.trim().resetBlank());
		});
		str = str + " if" + condsArray.join(",");
	}
	str = str + ".";
	var div = document.getElementById("causalStr");
	var p = document.createElement("P");
	var span = document.createElement("SPAN");
	var checkbox = document.createElement("INPUT");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("checked", "checked");
	span.setAttribute("action", toStandardForm(action));
	span.setAttribute("fluent", toStandardForm(fluent));
	span.innerHTML = str;
	p.appendChild(checkbox);
	p.appendChild(span);
	div.appendChild(p);
}

function delInputClause(id) {
	var causal = document.getElementById(id);
	$.each(causal.children, function(i, ele) {
		if(ele.firstChild.checked) {
			causal.removeChild(ele);
		}
	});
}

//cellType: "action" "fluent" "condition"
function addCell(cellType) {
	if(!(cellType == "action" || cellType == "fluent" || cellType == "condition")) return;
	var table = document.getElementById("precondition");
	var tr = document.createElement("TR");
	var th = document.createElement("TH");
	th.innerHTML = cellType;
	var td = document.createElement("TD");
	td.className = cellType;
	var select = document.createElement("SELECT");
	var trueOption = document.createElement("OPTION");
	trueOption.innerHTML = "";
	trueOption.value = "";
	var falseOption = document.createElement("OPTION");
	falseOption.innerHTML = "not";
	falseOption.value = "not ";
	var input = document.createElement("INPUT");
	var del = document.createElement("BUTTON");
	del.innerHTML = "delete";
	select.appendChild(trueOption);
	select.appendChild(falseOption);
	td.appendChild(select);
	td.appendChild(input);
	tr.appendChild(th);
	tr.appendChild(td);
	table.appendChild(tr);
	input.onkeyup = function() {
		condRestrict(this);
	}
	del.onclick = function() {
		this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
	}
	if(cellType == "condition") {
		td.appendChild(del);
	} else {
		var cellSelect = document.createElement("SELECT");
		var option = document.createElement("OPTION");
		option.value = "";
		cellSelect.appendChild(option);
		td.appendChild(cellSelect);
		td.appendChild(del);
		cellSelect.onchange = function() {
			var inp = this.parentNode.children[1];
			if(this.value == null || this.value == "") return;
			inp.value = this.value;
		}
		if(cellType == "action") {
			cellSelect.className = "actionSelect";
			option.innerHTML = "please select an action";
			$(function() {
			    $("#precondition .action>input").autocomplete({
			    	source: global.collection.actions
			    });
			});
			getAllCells(global.collection.actions, "action");
		} else if(cellType == "fluent") {
			cellSelect.className = "fluentSelect";
			option.innerHTML = "please select a fluent";
			$(function() {
			    $("#precondition .fluent>input").autocomplete({
			    	source: global.collection.fluents
			    });
			});
			getAllCells(global.collection.fluents, "fluent");
		}
	}
}

function newPrecondition() {
	var table = document.getElementById("precondition");
	var cellArray = new Array();
	var trs = table.children;
	if(trs.length < 1) {
		alert("Please add a clause to the precondition");
		return;
	}
	$.each(trs, function(i, tr) {
		if(tr.firstChild.innerHTML == "action") {
			var action = tr.children[1].children[1].value;
			if(action == null || action == "") {
				alert("Please input the action");
				return;
			}
			if(!isValidName(action)) {
				alert(action + " is not a valid action name");
				return;
			}
			cellArray.push(tr.children[1].children[0].value + toStandardForm(action));
		} else if(tr.firstChild.innerHTML == "fluent") {
			var fluent = tr.children[1].children[1].value;
			if(fluent == null || fluent == "") {
				alert("Please input the fluent");
				return;
			}
			if(!isValidName(fluent)) {
				alert(fluent + " is not a valid fluent name");
				return;
			}
			cellArray.push(tr.children[1].children[0].value + toStandardForm(fluent));
		} else if(tr.firstChild.innerHTML == "condition") {
			var condition = tr.children[1].children[1].value;
			if(condition == null || condition == "") {
				alert("Please input the value of condition");
				return;
			}
			cellArray.push(tr.children[1].children[0].value + condition.trim().resetBlank());
		}
	});
	var str = "false " + cellArray.join(", ") + ".";
	var div = document.getElementById("preCondStr");
	var p = document.createElement("P");
	var span = document.createElement("SPAN");
	var checkbox = document.createElement("INPUT");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("checked", "checked");
	span.innerHTML = str;
	p.appendChild(checkbox);
	p.appendChild(span);
	div.appendChild(p);
}

function resetPrecondition() {
	var table = document.getElementById("precondition");
	while (table.firstChild) {
	    table.removeChild(table.firstChild);
	}
}

function resetCausalLaw() {
	var table = document.getElementById("causalTheory");
	var trs = table.getElementsByTagName("tr");
	while(trs.length > 4) {
		trs[4].parentNode.removeChild(trs[4]);
	}
	document.getElementById("action").value = "";
	document.getElementById("action").parentNode.children[1].value = "";
	document.getElementById("fluent").value = "";
	document.getElementById("fluent").parentNode.children[1].value = "";
	document.getElementById("cause").value = "";
	document.getElementById("from").value = "";
	document.getElementById("to").value = "";
	document.getElementById("fromto").setAttribute("style", "display:none");
}