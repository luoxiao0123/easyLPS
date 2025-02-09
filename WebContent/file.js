/* 
 * the following code to upload file originated from 
 * "https://developer.mozilla.org/en-US/docs/Web/API/File/
 * Using_files_from_web_applications"
 * 
 * quote_1 starts
 */
window.URL = window.URL || window.webkitURL;

var fileSelect = document.getElementById("fileSelect");
var fileElem = document.getElementById("fileElem");

fileSelect.addEventListener("click", function(e) {
	if (fileElem) {
		fileElem.click();
	}
	e.preventDefault(); // prevent navigation to "#"
}, false);

function handleFiles(files) {
	if (!files.length) {
		alert("no file selected!");
	} else {
		var reader = new FileReader();
		reader.onload = function(event) {
		    parseJSON(event.target.result)
		  };
		reader.readAsText(files[0]);
	}
}

/*
 * quote_1 ends
 */


/* 
 * the following code to download file originated from 
 * "https://stackoverflow.com/questions/21012580/
 * is-it-possible-to-write-data-to-file-using-only-javascript"
 * 
 * quote_2 starts
 */

$('#download').on("click", function() {
	function download() {
		var name = prompt("Please input the name for the download file,\n" +
				"only letters and numbers are allowed", "");
		if(!name.match(/^(\w)+$/)) {
			alert("only letters and numbers are allowed in the file name,\n" +
					"please input again");
			return;
		}
		var fileContents = JSON.stringify(pageToJson(), null, 2);
		var fileName = name + ".txt";
	
		var ahref = document.createElement('a');
		ahref.setAttribute('href', 'data:text/plain;charset=utf-8,'
				+ encodeURIComponent(fileContents));
		ahref.setAttribute('download', fileName);
		ahref.click();
	}
	setTimeout(function() {
		download()
	}, 500);
});

/*
 * quote_2 ends
 */



function pageToJson() {
	var pageJson = {
			graphJson: getGraphJson(),
			causalJson: getCausalJson(),
			precondJson: getprecondJson()
	}
	return pageJson;
}

function getGraphJson() {
	var subgraphList = document.getElementsByClassName("selectGraph");
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
	return graphJson;
}

function graphButtonToJson(button) {
	var graphJson = {
		jsonStr: button.getAttribute("jsonstring"),
		graphType: button.getAttribute("graphtype"),
		graphName: button.getAttribute("graphname"),
		graphId: button.getAttribute("graphid")
	}
	return graphJson;
}

function getCausalJson() {
	var div = document.getElementById("causalStr");
	var causalList = div.getElementsByTagName("p");
	var arr = [];
	$.each(causalList, function(i, ele) {
		if(ele.firstChild.checked) {
			var span = ele.children[1];
			var causalJson = {
				text: span.innerHTML,
				action: span.getAttribute("action"),
				fluent: span.getAttribute("fluent"),
				condition: JSON.parse(span.getAttribute("condition"))
				}
			arr.push(causalJson);
		}
	});
	return arr;
}

function getprecondJson() {
	var div = document.getElementById("preCondStr");
	var precondList = div.getElementsByTagName("p");
	var arr = [];
	$.each(precondList, function(i, ele) {
		if(ele.firstChild.checked) {
			var span = ele.children[1];
			arr.push({
				text: span.innerHTML,
				action: JSON.parse(span.getAttribute("action")),
				fluent: JSON.parse(span.getAttribute("fluent")),
				condition: JSON.parse(span.getAttribute("condition"))
				});
		}
	});
	return arr;
}

function parseJSON(jsonData) {
	try {
		data = JSON.parse(jsonData);
	} catch(e) {
		alert("failed to parse the file! Please upload the correct file");
		return;
	}
	try {
		jsonDataToGraph(data.graphJson);
		jsonDataToCausal(data.causalJson);
		jsonDataToPrecond(data.precondJson);
	} catch(e) {
		alert("internal error in json file! Please upload the correct file");
		return;
	}
}

function jsonDataToGraph(data) {
	dataToGraph(data.initGraph);
	dataToGraph(data.reactGraph);
	dataToGraph(data.macroGraph);
}

function dataToGraph(data) {
	$.each(data, function(i, ele) {
		if(inGraphList(ele.graphId) == false) {
			var li = document.createElement("LI");
			var ahref = document.createElement("A");
			var span = document.createElement("SPAN");
			var checkbox = document.createElement("INPUT");
			ahref.href = "#";
			ahref.className = "selectGraph";
			span.innerHTML = ele.graphName + "(" + ele.graphType.substring(0, 1) + ")";
			ahref.setAttribute("jsonstring", ele.jsonStr);
			ahref.setAttribute("graphtype", ele.graphType);
			ahref.setAttribute("graphname", ele.graphName);
			ahref.setAttribute("graphid", ele.graphId);
			checkbox.className = "subgraph";
			checkbox.setAttribute("type", "checkbox");
			checkbox.setAttribute("checked", "checked");
			ahref.appendChild(span);
			ahref.appendChild(checkbox);
			li.appendChild(ahref);
			document.getElementById("subgraphs").appendChild(li);
			ahref.onclick = function() {
		    	global.graph.fromJSON(JSON.parse(this.getAttribute("jsonstring")));
		    	global.currentGraph = this;
		    	global.graphType = this.getAttribute("graphtype");
		    };
		    ahref.oncontextmenu = function() {
		    	this.parentNode.parentNode.removeChild(this.parentNode);
		    	global.currentGraph = null;
		    }
		}
	});
}

function inGraphList(id) {
	var subgraphList = document.getElementsByClassName("selectGraph");
	var boolean = false;
	$.each(subgraphList, function(i, ele) {
		if(ele.getAttribute("graphid") == id) {
			boolean = true;
			return false;
		}
	});
	return boolean;
}

function jsonDataToCausal(data) {
	var div = document.getElementById("causalStr");
	$.each(data, function(i, ele) {
		var p = document.createElement("P");
		var span = document.createElement("SPAN");
		var checkbox = document.createElement("INPUT");
		checkbox.setAttribute("type", "checkbox");
		checkbox.setAttribute("checked", "checked");
		span.setAttribute("action", ele.action);
		span.setAttribute("fluent", ele.fluent);
		span.setAttribute("condition", JSON.stringify(ele.condition));
		span.innerHTML = ele.text;
		p.appendChild(checkbox);
		p.appendChild(span);
		div.appendChild(p);
	});
}

function jsonDataToPrecond(data) {
	var div = document.getElementById("preCondStr");
	$.each(data, function(i, ele) {
		var p = document.createElement("P");
		var span = document.createElement("SPAN");
		var checkbox = document.createElement("INPUT");
		checkbox.setAttribute("type", "checkbox");
		checkbox.setAttribute("checked", "checked");
		span.setAttribute("action", JSON.stringify(ele.action));
		span.setAttribute("fluent", JSON.stringify(ele.fluent));
		span.setAttribute("condition", JSON.stringify(ele.condition));
		span.innerHTML = ele.text;
		p.appendChild(checkbox);
		p.appendChild(span);
		div.appendChild(p);
	});
}