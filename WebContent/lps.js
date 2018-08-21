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