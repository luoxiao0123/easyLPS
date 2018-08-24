function toLPS() {
	$.ajax({
		url : "LpsServlet",
		type : "post",
		data : {
			"pageJson": JSON.stringify(pageToJson())
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
			global.collection.conditions = jsonData.conditions;
			global.collection.actionsWild = jsonData.actionsWild;
			global.collection.fluentsWild = jsonData.fluentsWild;
			global.collection.macrosWild = jsonData.macrosWild;
			demonstrate(global.collection.actionsWild, 
					global.collection.fluentsWild, global.collection.macrosWild);
			getAllCells(global.collection.actions, "action");
			getAllCells(global.collection.fluents, "fluent");
			autoComplete();
			selectText(jsonData);
		}
	});
}


function selectText(jsonData) {
	var div = document.getElementById("textcontent");
	while(div.firstChild) {
		div.removeChild(div.firstChild);
	}
	var header = document.createElement("P");
	header.innerHTML = jsonData.header.replace(/\n/g, "<br />");
	var causalTheory = document.createElement("P");
	causalTheory.innerHTML = jsonData.causalTheory.replace(/\n/g, "<br />");
	var precondition = document.createElement("P");
	precondition.innerHTML = jsonData.precondition.replace(/\n/g, "<br />");
	
	div.appendChild(header);	
	var subgraphs = document.getElementById("subgraphs");
	var subgraphList = subgraphs.getElementsByClassName("selectGraph");
	$.each(jsonData.graph, function(i, ele) {
		var graphText = document.createElement("P");
		graphText.innerHTML = ele.text.replace(/\n/g, "<br />");
		$.each(subgraphList, function(j, ahref) {
			if(ahref.getAttribute("graphid") == ele.id) {
				graphText.ondblclick = function() {
					global.graph.fromJSON(JSON.parse(ahref.getAttribute("jsonstring")));
			    	global.currentGraph = ahref;
			    	global.graphType = ahref.getAttribute("graphtype");
				}
				return false;
			}
		});
		div.appendChild(graphText);
	});	
	div.appendChild(causalTheory);
	div.appendChild(precondition);
	
	causalTheory.ondblclick = function() {
		show("tabs-2");
	}
	precondition.ondblclick = function() {
		show("tabs-3");
	}
}