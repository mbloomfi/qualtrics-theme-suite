// == GLOBAL VARS ==
var remote = require("remote");
var app = remote.require("app");
var Global = remote.getGlobal("sharedObject"); //see index.js
var appRoot = Global.appRoot;
var fs = require("fs");
var json = require("jsonfile");
var escape = require("escape-html");

var localSettingsData = null;
var localPersistentData = null;

// == INIT ==
el.on("load", function(){

	//add global reference to editor and preview
	window.editor = el("#editor");
	window.preview = el("#preview");


	//= include fileSystem.js

	baton(function(next){

		readUserPreferences(next);

	})
	.then(function(next){

		readPersistantData(next);

	})
	.then(function(){

		readBrands();
		brandDropDown.populate();
		//un-hide page // show editor and webview
		el.join( [editor, preview] ).rmClass("hide");
		enableDropdowns();
	})
	.yield();


	// // add resize listener
	// window.addEventListener('resize',onWindowResize);

	codemirrorInit();

});

var dimmer = {
	on: function() {
		var _dimmer = el("+div").addClass("dimmer");
		el("body").append(_dimmer);
		setTimeout(function(){
			el(".dimmer")[0].addClass("show");
		},10);
	},
	off: function(){
		var _dimmer = el(".dimmer").rmClass("show");
		setTimeout(function(){
			_dimmer.rm();
		},500);
	}
};

editorPreviewBar = {
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

function logError(_message, _err) {
	console.log(_message, _err);
}

function pause(time, _callback) {
	setTimeout(function(){
		_callback();
	}, time);
}




//
