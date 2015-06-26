// == GLOBAL VARS ==
var remote = require("remote");
var app = remote.require("app");
var Global = remote.getGlobal("sharedObject"); //see index.js

// == INIT ==
el.on("load", function(){

	//add global reference to editor and preview
	window.editor = el("#editor");
	window.preview = el("#preview");

	// show editor and webview
	el.join( [editor, preview] ).rmClass("hide");

	// // add resize listener
	// window.addEventListener('resize',onWindowResize);

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
	