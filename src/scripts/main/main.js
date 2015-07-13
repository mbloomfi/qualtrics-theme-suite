// == Electron Natives ==
var remote = require("remote");
var app = remote.require("app");
var ipc = require("ipc");

// == Node Natives ==
var path = require("path");

// == Vendor ==
var fs = require("fs-extra");
var gulp = require("gulp");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var replace = require("gulp-replace");
var sass = require("gulp-sass");
var minifyCss = require('gulp-minify-css');
// var stylus = require("gulp-stylus");
var autoprefixer = require("gulp-autoprefixer");

// == Custom ==
var Global = remote.getGlobal("sharedObject"); //see index.js
var appRoot = Global.appRoot;


//= include ../app-core-methods.js


var dimmer = {
	on: function() {
		var _dimmer = el("+div").addClass("dimmer");
		el("body").append(_dimmer);
		setTimeout(function(){
			el(".dimmer")[0].addClass("show");
		},10);
	},
	off: function(){
		core.localData.updateUserSettings(function(){
			var _dimmer = el(".dimmer").rmClass("show");

			// if dropdowns are open, close them
			if(editorCore.dropdowns.projects.status === "opened") editorCore.dropdowns.projects.close();
			if(editorCore.dropdowns.brands.status === "opened") editorCore.dropdowns.brands.close();

			setTimeout(function(){
				_dimmer.rm();
				_dimmer = null;
			},500);
		});
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
		else if(_index === 7){ editorWidth = "75%"; previewWidth = "25%"; }
		else if(_index === 8){ editorWidth = "80%"; previewWidth = "20%"; }
		else if(_index === 9){ editorWidth = "85%"; previewWidth = "15%"; }
		else if(_index === 10){ editorWidth = "90%"; previewWidth = "10%"; }

		el("#editor_preview_ratio").purge() // purge the style tag
			.text( // add text to the style tag
				"section#editor{ width:"+editorWidth+"; } "+
				"webview#preview{ width:"+previewWidth+"; }"+
				"webview#preview + #previewLoader{ width:"+previewWidth+"; }"
			);
	}
};


// Init CodeMirror
function codemirrorInit() {
	window.codemirrorContainer = el("#codemirror-wrapper");

	// codemirrorContainer.el("textarea").attr("tabindex","-1");

	setTimeout(function(){
		codemirrorContainer.el("textarea").attr("tabindex", "-1");
	}, 0);
	
	window.myCodeMirror = CodeMirror(codemirrorContainer, {
		mode: "css",
		theme: "monokai",
		tabSize: 2,
		indentWithTabs: true,
		keyMap: "sublime",
		lineWrapping: true,
		lineNumbers: true
	});
}

//= include ./editor.js
//= include ./brand-search.js
//= include ./Quitter.js
//= include ./Saver.js
//= include ./Prompter.js



// INIT app
el.on("load", function(){
	//add global reference to editor and preview
	window.editor = el("#editor");
	window.preview = el("#preview");

	baton(function(next){
		
		
		core.localData.updateUserSettings(next);

	})
	.then(function(next){

		core.localData.updateBrandsList(next);

	})
	.then(function(next){

		core.localData.updateRecentBrands(next);

	})
	.then(function(next){

		editorCore.dropdowns.setDropdownGlobals();

		editorCore.dropdowns.bodyClick();

		editorCore.dropdowns.brands.populate();
		editorCore.dropdowns.brands.init();
		
		editorCore.dropdowns.projects.populate();
		editorCore.dropdowns.projects.init();

		editorCore.dropdowns.files.prepare();
		editorCore.dropdowns.files.addFileDragListener();

		codemirrorInit();

		core.codeMirror.dirtyWatch();

		core.preview.init();
		//un-hide page // show editor and webview
		el.join( [editor, preview] ).rmClass("hide");
		

		preview.addEventListener("did-start-loading", function(){
			// preview.reload();
			preview.addClass("loading-fadeout");
			if(preview.src === "http://sun.qprod.net/releasemanager/") {
				console.log("release manager redirecting!!");
			}
			


			// core.preview.init();
		  // preview.src = "local/currentPreview.html";
		});

		preview.addEventListener("dom-ready", function(){
			// preview.reload();

			console.log("dom ready!!");
			if(preview.src === "http://sun.qprod.net/releasemanager/") {

				preview.insertCSS("body {background:white !important;} #Page, #Footer {border-radius:0 !important; box-shadow:none !important; background:white !important;} #Page #Toolbar {border:none !important; border-width:0 !important; border-radius:8px; border-top:none !important; border-bottom:none !important; background: rgb(210,210,210) !important; overflow:hidden;} #Page #Content { border-top:none !important;}");
			}

			setTimeout(function(){
				preview.rmClass("loading-fadeout");
			},50);



			// core.preview.init();
		  // preview.src = "local/currentPreview.html";
		});
	})
	.run();
});


