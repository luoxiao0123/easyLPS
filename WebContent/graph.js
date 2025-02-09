function initialize() {
	graphBase("initialize");
}

function reactiveRule() {
	graphBase("reactiverule");
}

function macroAction() {
	graphBase("macroaction");
}

// create a graph in the left panel
function graphBase(graphType) {
	var graph = new joint.dia.Graph;
	global.graph = graph;
	global.graphType = graphType;
	global.currentGraph = null;

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
    
    //draw timeLine in graph
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
    
    /* 
     * right click: text mode: insert/update text in the cell
     *              remove mode: delete cell
     *              conclude mode: set cell to be part of conclusion
     */
    paper.on('cell:contextmenu', function(cellView){
    	var mode = document.getElementById("mode").value;
    	if(cellView.model instanceof joint.shapes.standard.Rectangle
    			|| cellView.model instanceof joint.shapes.standard.Polyline) {
    		if(mode === "text") {
    			var cellName = document.getElementById("myText").value;
    			if(!cellName.isValidName()) {
    				alert(cellName + " is not a valid cell name");
    				return;
    			}
    			cellView.model.attr('label/text', cellName.toStandardForm());
    			cellView.model.attr('label/fill', 'white');
    			if(cellView.model instanceof joint.shapes.standard.Rectangle) {
    				addCellButton("newAction", cellName.toStandardForm());
    			} else if(cellView.model instanceof joint.shapes.standard.Polyline) {
    				addCellButton("newFluent", cellName.toStandardForm());
    			}
    		} else if(mode === "remove") {
    			cellView.model.remove();
    		}
    	}
    	if(cellView.model instanceof joint.shapes.standard.Ellipse) {
    		if(mode === "text") {
    			var cellName = document.getElementById("myText").value.trim().resetBlank();
    			if(cellName == "" || cellName == null) {
    				alert("Please insert the name for condition/fact");
    				return;
    			}
    			cellView.model.attr('label/text', cellName);
    			cellView.model.attr('label/fill', 'white');
    			addCellButton("newCond", cellName);    			
    		} else if(mode === "remove") {
    			cellView.model.remove();
    		}
    	}
    	if((cellView.model instanceof joint.shapes.standard.Rectangle
    			|| cellView.model instanceof joint.shapes.standard.Ellipse)
    				&& global.graphType === "reactiverule"
    					&& mode === "conclude") {
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
    	} else if (elementView.model instanceof joint.shapes.standard.Ellipse) {
    		elementView.model.position(evt.data.x, evt.data.y - (evt.data.y + 10) % 20);
    	}
    });
    
};

String.prototype.trim = function () { 
	return this.replace(/(^\s*)|(\s*$)/g, ""); 
};

String.prototype.isValidName = function() {
	var regex = /^(\s)*[a-z](\w)*(\s)*(\((\s)*(\w)+(\s)*(,(\s)*(\w)+(\s)*)*\))?(\s)*$/;
	return this.match(regex);
}

String.prototype.toStandardForm = function() {
	var strNoSpace = this.replace(/\s+/g, '');
	return strNoSpace.replace(/,/g, ', ');
}

String.prototype.resetBlank = function() {
	 return this.replace(/\s+/g, ' '); 
};

// create a new action in the graph
function newAction(name) {
	var action = new joint.shapes.standard.Rectangle();
	var x = Math.floor(Math.random()*500);
	if(name == null) {
		action.position(x, 40);
		action.attr({
	        body: {
	            fill: 'green'
	        },
	        label: {
	            text: 'action',
	            fill: 'black'
	        }
	    });
	} else {
		action.position(x, 440);
		action.attr({
	        body: {
	            fill: 'green'
	        },
	        label: {
	            text: name,
	            fill: 'white'
	        }
	    });
	}
	action.resize(100, 40);
	action.addTo(global.graph);
};

//create a new fluent in the graph
function newFluent(name) {
	var fluent = new joint.shapes.standard.Polyline();
	var x = Math.floor(Math.random()*500);
	if(name == null) {
		fluent.position(x, 20);
		fluent.attr({
	        body: {
	            fill: '#99ccff'
	        },
	        label: {
	            text: 'fluent',
	            fill: 'black'
	        }
	    });
	} else {
		fluent.position(x, 440);
		fluent.attr({
	        body: {
	            fill: '#99ccff'
	        },
	        label: {
	            text: name,
	            fill: 'white'
	        }
	    });
	}
	fluent.resize(100, 40);
	fluent.addTo(global.graph);
};

//create a new condition in the graph
function newCond(name) {
	var cond = new joint.shapes.standard.Ellipse();
	var x = Math.floor(Math.random()*500);
	if(name == null) {
		cond.position(x, 30);
		cond.attr({
	        body: {
	            fill: '#F7DC6F'
	        },
	        label: {
	            text: 'condition',
	            fill: 'black'
	        }
	    });
	} else {
		cond.position(x, 450);
		cond.attr({
	        body: {
	            fill: '#F7DC6F'
	        },
	        label: {
	            text: name,
	            fill: 'white'
	        }
	    });
	}
	cond.resize(100, 40);
	cond.addTo(global.graph);
};


// add button to the dropdown menu above the graph
function addCellButton(id, cellName) {
	var className;
	if(id == "newAction") {
		className = "oldAction";
	} else if(id == "newFluent") {
		className = "oldFluent";
	} else if(id == "newCond") {
		className = "oldCond";
	} else {
		return;
	}
	var cellList = document.getElementsByClassName(className);
	for (var i = 0; i < cellList.length; i++) {
	    if(cellList[i].innerHTML == cellName) return;
	}
	var li = document.createElement("LI");
	var ahref = document.createElement("A");
	ahref.href = "#";
	ahref.innerHTML = cellName;
	li.appendChild(ahref);
	document.getElementById(id).appendChild(li);
	if(id == "newAction") {
		ahref.className = "oldAction";
		ahref.onclick = function() {
			newAction(cellName);
		}
	} else if(id == "newFluent") {
		ahref.className = "oldFluent";
		ahref.onclick = function() {
			newFluent(cellName);
		}
	} else if(id == "newCond") {
		ahref.className = "oldCond";
		ahref.onclick = function() {
			newCond(cellName);
		}
	}
}

function save() {
	if(global.currentGraph === null){
		saveAs();
	} else {
		global.currentGraph.setAttribute("jsonstring", JSON.stringify(global.graph.toJSON()));
		global.currentGraph.setAttribute("graphid", new Date().getTime() + "" + Math.floor(Math.random() * 1000));
	}
};

function saveAs() {
	if(global.graphType === null) {
		alert("Please draw a graph first!");
		return;
	}
	var name = prompt("Please input the name for the " + global.graphType, "");
	if(name){
		if(global.graphType == "macroaction" && !name.isValidName()){
			alert(name + " is not a valid name for a macroaction");
			return;
		}
		var li = document.createElement("LI");
		var ahref = document.createElement("A");
		var span = document.createElement("SPAN");
		var checkbox = document.createElement("INPUT");
		ahref.href = "#";
		ahref.className = "selectGraph";
		span.innerHTML = name.toStandardForm() + "(" + global.graphType.substring(0, 1) + ")";
		ahref.setAttribute("jsonstring", JSON.stringify(global.graph.toJSON()));
		ahref.setAttribute("graphtype", global.graphType);
		ahref.setAttribute("graphname", name.toStandardForm());
		ahref.setAttribute("graphid", new Date().getTime() + "" + Math.floor(Math.random() * 1000));
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
	    global.currentGraph = ahref;
	}
};

// convert a single graph to LPS code
function getClause() {
	if(global.currentGraph == null) {
		alert("Please save the graph first!");
		return;
	}
	$.ajax({
			url : "ClauseServlet",
			type : "post",
			data : {
				"jsonStr": JSON.stringify(global.graph.toJSON()), 
				"graphType": global.graphType,
				"graphName": global.currentGraph.getAttribute("graphname"),
				"graphId": global.currentGraph.getAttribute("graphid")
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){ 
				alert(XMLHttpRequest.responseText);
			},
			success : function(data) {
				document.getElementById('output').innerHTML = data;
			}
	});
}
