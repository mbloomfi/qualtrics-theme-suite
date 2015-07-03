// == GLOBAL VARS ==
var remote = require("remote");
var app = remote.require("app");
var Global = remote.getGlobal("sharedObject"); //see index.js
var appRoot = Global.appRoot;
var fs = require("fs");
var json = require("jsonfile");
var escape = require("escape-html");


//= include app-core-methods.js

var dimmer = {
	on: function() {
		var _dimmer = el("+div").addClass("dimmer");
		el("body").append(_dimmer);
		setTimeout(function(){
			el(".dimmer")[0].addClass("show");
		},10);
	},
	off: function(){
		readUserPreferences();
		var _dimmer = el(".dimmer").rmClass("show");
		setTimeout(function(){
			_dimmer.rm();
		},500);
	}
};


var editorPreviewBar = {
	set: function(_index){
		var editorWidth = null;
		var previewWidth = null;

		if(_index === 0){ editorWidth = "10%"; previewWidth = "90%"; }
		else if(_index === 1){ editorWidth = "20%"; previewWidth = "80%"; }
		else if(_index === 2){ editorWidth = "30%"; previewWidth = "70%"; }
		else if(_index === 3){ editorWidth = "40%"; previewWidth = "60%"; }
		else if(_index === 4){ editorWidth = "50%"; previewWidth = "50%"; }
		else if(_index === 5){ editorWidth = "60%"; previewWidth = "40%"; }
		else if(_index === 6){ editorWidth = "70%"; previewWidth = "30%"; }
		else if(_index === 7){ editorWidth = "80%"; previewWidth = "20%"; }
		else if(_index === 8){ editorWidth = "90%"; previewWidth = "10%"; }

		el("#editor_preview_ratio").purge() // purge the style tag
			.text( // add text to the style tag
				"section#editor{ width:"+editorWidth+"; } "+
				"webview#preview{ width:"+previewWidth+"; }"
			);
	}
};


// Init CodeMirror
function codemirrorInit() {
	window.codemirrorContainer = el("#codemirror-wrapper");

	var myCodeMirror = CodeMirror(codemirrorContainer, {
		value: "body { \n\tbackground: red;\n}",
		mode: "css",
		theme: "monokai",
		tabSize: 2,
		indentWithTabs: true,
		keyMap: "sublime",
		lineWrapping: true,
		lineNumbers: true
	});
}

//= include editor.js
//= include brand-search.js
//= include quitter.js


// INIT app
el.on("load", function(){
	//add global reference to editor and preview
	window.editor = el("#editor");
	window.preview = el("#preview");

	baton(function(next){
		
		codemirrorInit();
		readUserPreferences(next);

	})
	.then(function(next){

		readPersistantData(next);

	})
	.then(function(){

		brandDropDown.populate();
		projectDropDown.populate();

		//un-hide page // show editor and webview
		el.join( [editor, preview] ).rmClass("hide");
		enableDropdowns();
	})
	.run();
});


