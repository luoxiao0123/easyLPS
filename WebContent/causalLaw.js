function newCausalLaw() {
	var causalLaw = {
		action: document.getElementById("action").value,
		cause: document.getElementById("cause").value,
		fluent: document.getElementById("fluent").value,
		condition: document.getElementById("condition").value,	
	}
	if(causalLaw.action == "") {
		alert("Please insert the action!");
		return;
	}
	if(causalLaw.cause == "") {
		alert("Please select the value of cause!");
		return;
	}
	if(causalLaw.fluent == "") {
		alert("Please insert the fluent!");
		return;
	}
	$.ajax({
		url : "CausalServlet",
		type : "post",
		data : {
			"causalLaw": JSON.stringify(causalLaw)
		},
		error : function(XMLHttpRequest, textStatus, errorThrown){ 
			alert("failure!");
		},
		success : function(output) {
			if(output != "") {
				var node = document.createElement("UL");
				var text = document.createElement("SPAN");
				var del = document.createElement("BUTTON");
				text.innerHTML = output;
				del.innerHTML = "delete";
				node.appendChild(text);
				node.appendChild(del);
				document.getElementById("causallaw").appendChild(node);
				del.onclick = function() {
					this.parentNode.parentNode.removeChild(this.parentNode);
				}
			}
		}
	});
}

function inputRestrict(obj) {
	var regex = obj.value.replace(/[^\a-\z\A-\Z0-9\(\)\,\_\ ]/g,'');
	if(obj.value != regex) {
		obj.value = regex;
	}
}

function conditionRestrict(obj) {
	var regex = obj.value.replace(/[^\a-\z\A-\Z0-9\(\)\,\_\ ]/g,'');
	if(obj.value != regex) {
		obj.value = regex;
	}
}

function newCondition() {
	var cond = document.createElement("TR");
	var head = document.createElement("TH");
	head.innerHTML = "condition";
	var data = document.createElement("TD");
	var bool = document.createElement("SELECT");
	var trueValue = document.createElement("OPTION");
	var falseValue = document.createElement("OPTION");
	trueValue.innerHTML = "";
	trueValue.value = "";
	falseValue.innerHTML = "not";
	falseValue.value = "not";
	var input = document.createElement("INPUT");
	var button = document.createElement("BUTTON");
	button.innerHTML = "delete";
	bool.appendChild(trueValue);
	bool.appendChild(falseValue);
	data.appendChild(bool);
	data.appendChild(input);
	data.appendChild(button);
	cond.appendChild(head);
	cond.appendChild(data);
	document.getElementById("causalTheory").appendChild(cond);
	button.onclick = function() {
		this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
	}
}