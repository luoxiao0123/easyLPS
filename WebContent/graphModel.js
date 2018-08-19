function initialize() {
	graphBase("initialize");
}

function reactiveRule() {
	graphBase("reactiverule");
}

function macroAction() {
	graphBase("macroaction");
}



function graphBase(graphType) {
	var graph = new joint.dia.Graph;
	global.graph = graph;
	global.graphType = graphType;
	global.currentGraphButton = null;

    var paper = new joint.dia.Paper({
        el: document.getElementById('myholder'),
        model: graph,
        width: 600,
        height: 600,
        gridSize: 10,
        drawGrid: true,
        restrictTranslate: true, 
        interactive: { linkMove: false }
    });
    
    var timeLine = new Array();
    for(var timeInt = 1; timeInt <= 10; timeInt++){
    	timeLine[timeInt] = new joint.shapes.standard.Link({
    		customLinkInteractions: false,
    	});
    	timeLine[timeInt].source({ x: 10, y: timeInt * 40 });
    	timeLine[timeInt].target({ x: 580, y: timeInt * 40 });
    	if(graphType === "initialize") {
    		timeLine[timeInt].appendLabel({
                attrs: {
                    text: {
                        text: 'T = ' + timeInt
                    }
                }
            });
    	} else {
    		timeLine[timeInt].appendLabel({
                attrs: {
                    text: {
                        text: 'T' + timeInt
                    }
                }
            });
    	}
    	timeLine[timeInt].attr('line/targetMarker/type', 'circle');
    	timeLine[timeInt].addTo(graph);
    }
    
    paper.on('cell:contextmenu', function(cellView){
    	if(cellView.model instanceof joint.shapes.standard.Rectangle
    			|| cellView.model instanceof joint.shapes.standard.Polyline) {
    		if(global.mode === "text") {
    			var cellName = document.getElementById("myText").value;
    			if(!isValidName(cellName)) {
    				alert(cellName + " is not a valid cell name");
    				return;
    			}
    			cellView.model.attr('label/text', toStandardForm(cellName));
    			cellView.model.attr('label/fill', 'white');
    		} else if(global.mode === "remove") {
    			cellView.model.remove();
    		}
    	}
    	if(cellView.model instanceof joint.shapes.standard.Rectangle
    			&& global.graphType === "reactiverule"
    				&& global.mode === "setasconclusion") {
    		if(cellView.model.attr('label/fill') === 'white')
    			cellView.model.attr('label/fill', 'red');
    		else if(cellView.model.attr('label/fill') === 'red')
    			cellView.model.attr('label/fill', 'white');
    	}
    });
    
    paper.on('element:pointerup', function(elementView, evt, x, y) {
    	evt.data = elementView.model.position();
    	if(elementView.model instanceof joint.shapes.standard.Rectangle) {
    		elementView.model.position(evt.data.x, evt.data.y - evt.data.y % 40);
    	} else if (elementView.model instanceof joint.shapes.standard.Polyline) {
    		elementView.model.position(evt.data.x, evt.data.y - (evt.data.y + 20) % 40);
    	}
    });
    
};


function newAction() {
	var action = new joint.shapes.standard.Rectangle();
	action.position(250, 40);
	action.resize(100, 40);
	action.attr({
        body: {
            fill: 'green'
        },
        label: {
            text: 'action',
            fill: 'black'
        }
    });
	action.addTo(global.graph);
};

function newFluent() {
	var fluent = new joint.shapes.standard.Polyline();
	fluent.position(250, 20);
	fluent.resize(100, 40);
	fluent.attr({
		body: {
            fill: '#99ccff'
        },
        label: {
            text: 'fluent',
            fill: 'black'
        }
	});
	fluent.addTo(global.graph);
};

function isValidName(str) {
	var regex = /^(\s)*[a-z](\w)*(\s)*(\((\s)*(\w)+(\s)*(,(\s)*(\w)+(\s)*)*\))?$/;
	return str.match(regex);
}

function toStandardForm(str) {
	var strNoSpace = str.replace(/\s+/g, '');
	return strNoSpace.replace(/,/g, ', ');
}

function save() {
	if(global.currentGraphButton === null){
		saveAs();
	} else {
		global.currentGraphButton.setAttribute("jsonstring", JSON.stringify(global.graph.toJSON()));
	}
};

function saveAs() {
	var name = prompt("Please input the name for the " + global.graphType, "");
	if(name){
		if(global.graphType == "macroaction" && !isValidName(name)){
			alert(name + " is not a valid name for a macroaction");
			return;
		}
		var node = document.createElement("LI");
		var checkbox = document.createElement("INPUT");
		var button = document.createElement("BUTTON");
		var del = document.createElement("BUTTON");
		checkbox.setAttribute("name", "subgraph");
		checkbox.setAttribute("type", "checkbox");
		checkbox.setAttribute("checked", "checked");
		checkbox.setAttribute("style", "display:none");
		button.innerHTML = toStandardForm(name) + "." + global.graphType;
		del.innerHTML = "delete";
		button.setAttribute("jsonstring", JSON.stringify(global.graph.toJSON()));
		button.setAttribute("graphtype", global.graphType);
		button.setAttribute("graphname", toStandardForm(name));
		node.appendChild(checkbox);
		node.appendChild(button);
		node.appendChild(del);
	    document.getElementById('storedGraph').appendChild(node);
	    button.onclick = function() {
	    	global.graph.fromJSON(JSON.parse(this.getAttribute("jsonstring")));
	    	global.currentGraphButton = this;
	    	global.graphType = this.getAttribute("graphtype");
	    };
	    del.onclick = function() {
	    	this.parentNode.parentNode.removeChild(this.parentNode);
	    	global.currentGraphButton = null;
	    }
	    global.currentGraphButton = button;
	}
};


function removeElement() {
	if(global.mode !== "remove") {
		global.mode = "remove";
		document.getElementById("mode").innerHTML = "Remove Mode";
	} else {
		global.mode = "normal";
		document.getElementById("mode").innerHTML = "Normal Mode";
	}
};

function insertText() {
	if(global.mode !== "text") {
		global.mode = "text";
		document.getElementById("mode").innerHTML = "Text Mode";
	} else {
		global.mode = "normal";
		document.getElementById("mode").innerHTML = "Normal Mode";
	}
};

function setAsConclusion() {
	if(global.mode !== "setasconclusion") {
		global.mode = "setasconclusion";
		document.getElementById("mode").innerHTML = "setAsConclusion Mode";
	} else {
		global.mode = "normal";
		document.getElementById("mode").innerHTML = "Normal Mode";
	}
};

function toJson() {
	return JSON.stringify(global.graph.toJSON());
}

function jsonStr() {
	alert(JSON.stringify(global.graph.toJSON()));
}

function selectGraph() {
	document.getElementById("getCode").style.display = "block";
	document.getElementById("hideSelect").style.display = "block";
	var subgraphList = document.getElementsByName("subgraph");
	$.each(subgraphList, function(i, ele){
		ele.style.display = "block";
	});
}

function hideSelect() {
	document.getElementById("getCode").style.display = "none";
	document.getElementById("hideSelect").style.display = "none";
	var subgraphList = document.getElementsByName("subgraph");
	$.each(subgraphList, function(i, ele){
		ele.style.display = "none";
	});
}

function graphButtonToJson(button) {
	var graphJson = {
		"jsonStr": button.getAttribute("jsonstring"),
		"graphType": button.getAttribute("graphtype"),
		"graphName": button.getAttribute("graphname")
	}
	return graphJson;
}

function getFinalCode() {
	var subgraphList = document.getElementsByName("subgraph");
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
		if(ele.checked) {
			if(ele.parentNode.children[1].getAttribute("graphType") == "initialize") {
				graphJson.initGraph.push(graphButtonToJson(ele.parentNode.children[1]));
			}
			else if(ele.parentNode.children[1].getAttribute("graphType") == "reactiverule") {
				graphJson.reactGraph.push(graphButtonToJson(ele.parentNode.children[1]));
			}
			else if(ele.parentNode.children[1].getAttribute("graphType") == "macroaction") {
				graphJson.macroGraph.push(graphButtonToJson(ele.parentNode.children[1]));
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
			parent.frames["code"].document.getElementById('output').value = jsonData.code;
			alert(data);
		}
	});
}
