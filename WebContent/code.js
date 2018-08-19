function graphButtonToJson(button) {
	var graphJson = {
		"jsonStr": button.getAttribute("jsonstring"),
		"graphType": button.getAttribute("graphtype"),
		"graphName": button.getAttribute("graphname")
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
	var id;
	if(cellType == "action") id = "actionSelect";
	else if(cellType == "fluent") id = "fluentSelect";
	else return;
	var node = document.getElementById(id);
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