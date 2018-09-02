// delete the graph button in "graph to LPS" tab
function deleteGraph() {
	var subgraphs = document.getElementById("subgraphs");
	var subgraphList = subgraphs.getElementsByClassName("selectGraph");
	var removeList = new Array();
	$.each(subgraphList, function(i, ele){
		if(ele.children[1].checked) {
			removeList.push(ele.parentNode);
		}
	});
	$.each(removeList, function(i, ele) {
		subgraphs.removeChild(ele);
	});
}

// show actions, fluents, and macro actions in table of "graph to LPS"
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

// fill the content of dropdown menu of actions and fluents
function getAllCells(cells, cellType) {
	var className;
	if(cellType == "action") className = "actionSelect";
	else if(cellType == "fluent") className = "fluentSelect";
	else if(cellType == "condition") className = "condSelect";
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

// if select menu has a value, copy it to the input
function autoText(id) {
	var input = document.getElementById(id);
	var select = input.parentNode.children[1];
	if(select.value == null || select.value == "") return;
	input.value = select.value;
}

// if the cause is "update", add a line of 
// "updates _ to _ in fluent" 
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

function addCondition() {
	var table = document.getElementById("causalTheory");
	var tr = document.createElement("TR");
	var th = document.createElement("TH");
	th.innerHTML = "condition";
	var td = document.createElement("TD");
	td.className = "condition";
	var select = document.createElement("SELECT");
	select.className = "boolean";
	var trueOption = document.createElement("OPTION");
	trueOption.innerHTML = "";
	trueOption.value = "";
	var falseOption = document.createElement("OPTION");
	falseOption.innerHTML = "not";
	falseOption.value = "not ";
	var input = document.createElement("INPUT");
	input.setAttribute("type", "text");
	var condSelect = document.createElement("SELECT");
	condSelect.className = "condSelect";
	var option = document.createElement("OPTION");
	option.innerHTML = "please select a condition";
	option.value = "";
	var del = document.createElement("BUTTON");
	del.innerHTML = "delete";
	condSelect.appendChild(option);
	select.appendChild(trueOption);
	select.appendChild(falseOption);
	td.appendChild(select);
	td.appendChild(input);
	td.appendChild(condSelect);
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
	condSelect.onchange = function() {
		var inp = this.parentNode.children[1];
		if(this.value == null || this.value == "") return;
		inp.value = this.value;
	}
	$(function() {
	    $("#causalTheory .condition>input").autocomplete({
	    	source: global.collection.conditions
	    });
	});
	getAllCells(global.collection.conditions, "condition");
}

function newCausalLaw() {
	var table = document.getElementById("causalTheory");
	var action = document.getElementById("action").value;
	var str = "";
	if(action == null || action == "") {
		alert("Please input the action");
		return;
	}
	if(!action.isValidName()) {
		alert(action + " is not a valid action name");
		return;
	}
	str = str + action.toStandardForm() + " ";
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
	if(!fluent.isValidName()) {
		alert(fluent + " is not a valid fluent name");
		return;
	}
	str = str + fluent.toStandardForm();
	var conds = table.getElementsByClassName("condition");
	var condArray = [];
	if(conds.length > 0) {
		var condsStr = new Array();
		$.each(conds, function(i, ele) {
			condsStr.push(" " + ele.children[0].value + 
					ele.children[1].value.trim().resetBlank());
			condArray.push(ele.children[1].value.trim().resetBlank());
		});
		str = str + " if" + condsStr.join(",");
	}
	str = str + ".";
	var div = document.getElementById("causalStr");
	var p = document.createElement("P");
	var span = document.createElement("SPAN");
	var checkbox = document.createElement("INPUT");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("checked", "checked");
	span.setAttribute("action", action.toStandardForm());
	span.setAttribute("fluent", fluent.toStandardForm());
	span.setAttribute("condition", JSON.stringify(condArray));
	span.innerHTML = str;
	p.appendChild(checkbox);
	p.appendChild(span);
	div.appendChild(p);
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
	select.className = "boolean";
	var trueOption = document.createElement("OPTION");
	trueOption.innerHTML = "";
	trueOption.value = "";
	var falseOption = document.createElement("OPTION");
	falseOption.innerHTML = "not";
	falseOption.value = "not ";
	var input = document.createElement("INPUT");
	input.setAttribute("type", "text");
	var cellSelect = document.createElement("SELECT");
	var option = document.createElement("OPTION");
	option.value = "";
	var del = document.createElement("BUTTON");
	del.innerHTML = "delete";
	cellSelect.appendChild(option);
	select.appendChild(trueOption);
	select.appendChild(falseOption);
	td.appendChild(select);
	td.appendChild(input);
	td.appendChild(cellSelect);
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
	} else if(cellType == "condition") {
		cellSelect.className = "condSelect";
		option.innerHTML = "please select a condition";
		$(function() {
		    $("#precondition .condition>input").autocomplete({
		    	source: global.collection.conditions
		    });
		});
		getAllCells(global.collection.conditions, "condition");
	}
}

function newPrecondition() {
	var table = document.getElementById("precondition");
	var cellArray = new Array();
	var actionArray = [];
	var fluentArray = [];
	var condArray = [];
	var trs = table.children;
	if(trs.length < 1) {
		alert("Please add a clause to the precondition");
		return;
	}
	var flag = false;
	$.each(trs, function(i, tr) {
		if(tr.firstChild.innerHTML == "action") {
			var action = tr.children[1].children[1].value;
			if(action == null || action == "") {
				alert("Please input the action");
				flag = true;
				return false;
			}
			if(!action.isValidName()) {
				alert(action + " is not a valid action name");
				flag = true;
				return false;
			}
			cellArray.push(tr.children[1].children[0].value + action.toStandardForm());
			actionArray.push(action.toStandardForm());
		} else if(tr.firstChild.innerHTML == "fluent") {
			var fluent = tr.children[1].children[1].value;
			if(fluent == null || fluent == "") {
				alert("Please input the fluent");
				flag = true;
				return false;
			}
			if(!fluent.isValidName()) {
				alert(fluent + " is not a valid fluent name");
				flag = true;
				return false;
			}
			cellArray.push(tr.children[1].children[0].value + fluent.toStandardForm());
			fluentArray.push(fluent.toStandardForm());
		} else if(tr.firstChild.innerHTML == "condition") {
			var condition = tr.children[1].children[1].value;
			if(condition == null || condition == "") {
				alert("Please input the value of condition");
				flag = true;
				return false;
			}
			cellArray.push(tr.children[1].children[0].value + condition.trim().resetBlank());
			condArray.push(condition.trim().resetBlank());
		}
	});
	if(flag) return;
	var str = "false " + cellArray.join(", ") + ".";
	var div = document.getElementById("preCondStr");
	var p = document.createElement("P");
	var span = document.createElement("SPAN");
	var checkbox = document.createElement("INPUT");
	checkbox.setAttribute("type", "checkbox");
	checkbox.setAttribute("checked", "checked");
	span.innerHTML = str;
	span.setAttribute("action", JSON.stringify(actionArray));
	span.setAttribute("fluent", JSON.stringify(fluentArray));
	span.setAttribute("condition", JSON.stringify(condArray));
	p.appendChild(checkbox);
	p.appendChild(span);
	div.appendChild(p);
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

function resetPrecondition() {
	var table = document.getElementById("precondition");
	while (table.firstChild) {
	    table.removeChild(table.firstChild);
	}
}

// id: 'causalStr', 'preCondStr'
function delInputClause(id) {
	var causal = document.getElementById(id);
	var removeList = new Array();
	$.each(causal.children, function(i, ele) {
		if(ele.firstChild.checked) {
			removeList.push(ele);
		}
	});
	$.each(removeList, function(i, ele) {
		causal.removeChild(ele);
	});
}