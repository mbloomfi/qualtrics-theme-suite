editorCore.dropdowns.files = {
	status: "closed",
	prepare: function(){
		window.fileName = el("#fileName");
	},
	activate: function(_projectName){
		fileName.rmClass("incactive");
		console.log("getting files for:", _projectName)
		core.brands.projects.files.list(_projectName, function(files){
			console.log("files",files);

		});
	},
	populate: function(){

	},
	select: function(_projectName){

	}

};