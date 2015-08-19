Eve.on("Preferences Saved", function(){
	console.log("prefs saved!");
	core.localData.snippets.readFromPersistentData(core.codeMirror.resetContextMenu, true);
});


Eve.on("Code Editor Saved", function(){
	editorCore.dropdowns.files.setClean();
	myCodeMirror.markClean();
	if(core.localData.currentFile.name === "StyleSheet.scss"){
		core.preview.mode.regular.compileSass();
	}

});

Eve.on("error", function(message){

	console.error("ERROR:", message);
	fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});

})