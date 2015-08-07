// == Electron Natives ==
var remote = require("remote");
var app = remote.require("app");
var ipc = require("ipc");
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

// == Node Natives ==
var path = require("path");
var https = require('https');

// == Vendor ==
var fs = require("fs-extra");
var lwip = require("lwip");
var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCss = require('gulp-minify-css');
// var stylus = require("gulp-stylus");
var autoprefixer = require("gulp-autoprefixer");
var shelljs = require("shelljs");

// == Custom ==
var Global = remote.getGlobal("sharedObject"); //see index.js
var appRoot = Global.appRoot;

var template = etc.template;



var menu; // see core.codeMirror.activate()

	

// context menu (right click)







//= include ../app-core-methods.js
//= include ./modes/edit-preview/edit-preview.js


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
	editorWidth: "40%",
	previewWidth: "60%",
	set: function(_index){
		var self = this;

		if(_index === 0){ self.editorWidth = "10%"; self.previewWidth = "90%"; }
		else if(_index === 1){ self.editorWidth = "20%"; self.previewWidth = "80%"; }
		else if(_index === 2){ self.editorWidth = "30%"; self.previewWidth = "70%"; }
		else if(_index === 3){ self.editorWidth = "40%"; self.previewWidth = "60%"; }
		else if(_index === 4){ self.editorWidth = "50%"; self.previewWidth = "50%"; }
		else if(_index === 5){ self.editorWidth = "60%"; self.previewWidth = "40%"; }
		else if(_index === 6){ self.editorWidth = "70%"; self.previewWidth = "30%"; }
		else if(_index === 7){ self.editorWidth = "75%"; self.previewWidth = "25%"; }
		else if(_index === 8){ self.editorWidth = "80%"; self.previewWidth = "20%"; }
		else if(_index === 9){ self.editorWidth = "85%"; self.previewWidth = "15%"; }
		else if(_index === 10){ self.editorWidth = "90%"; self.previewWidth = "10%"; }

		el("#editor_preview_ratio").purge() // purge the style tag
			.text( // add text to the style tag
				"section#editor{ width:"+self.editorWidth+"; } "+
				"webview#preview{ width:"+self.previewWidth+"; }"+
				"webview#preview + #previewLoader{ width:"+self.previewWidth+"; }"
			);

		if(core.preview.mode.screenshot.active){
			core.preview.mode.screenshot.box.update();
		} else {
			console.log("not active")
		}
	}



};


// Init CodeMirror
function codemirrorInit() {
	window.codemirrorContainer = el("#codemirror-wrapper");

	// codemirrorContainer.el("textarea").attr("tabindex","-1");

	setTimeout(function(){
		codemirrorContainer.el("textarea").attr("tabindex", "-1");


		codemirrorContainer.addEventListener('contextmenu',function(e){
			e.stopPropagation();
			e.preventDefault();
			if(core.codeMirror.active){
				menu.popup(remote.getCurrentWindow());
			}
			console.log("right clicked codemirror");
		}, true);

		var codeMirrorElement = document.querySelector(".CodeMirror").style.fontSize = "16px";


	}, 0);
	
	window.myCodeMirror = CodeMirror(codemirrorContainer, {
		mode: "css",
		theme: "monokai",
		tabSize: 2,
		indentWithTabs: true,
		keyMap: "sublime",
		lineWrapping: true,
		lineNumbers: true,
		autoCloseBrackets: true
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
		console.log("reloading?");
		core.localData.updateBrandsList(next);

	})
	.then(function(next){

		core.localData.updateRecentBrands(next);

	})
	.then(function(next){

		core.localData.snippets.readFromPersistentData(next);

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



		window.addEventListener("resize", function(){
			core.preview.mode.screenshot.box.update();
		})



		window.addEventListener("keypress", function(e){

		console.log("e",e);
			// enter key
			if(e.keyCode === 13) {
				if(core.preview.mode.currentMode === "thumbnail"){
					var clickEvent = new MouseEvent("click");
					document.getElementById("thumbCamera").dispatchEvent(clickEvent);
				}
				else if(core.preview.mode.currentMode === "screenshot"){
					var clickEvent = new MouseEvent("click");
					document.getElementById("screenshotCamera").dispatchEvent(clickEvent);
					console.log("take screenshot");
				}
			}

		});

		window.keystate = [];



		document.addEventListener('keydown',function(evt){
			keystate[evt.keyCode] = true;
			if (evt.keyCode === 38 || evt.keyCode === 40 || evt.keyCode === 39 || evt.keyCode === 37 || evt.keyCode === 32) {
				// evt.preventDefault();
				
			}

			// if 'minus' key
			if(evt.keyCode === 189){
				keystate[evt.keyCode] = false;

				//if 'COMMAND'
				if(keystate[91]){
					if(core.preview.mode.currentMode === "thumbnail"){
						var clickEvent = new MouseEvent("click");
						document.getElementById("decrease-thumb-size").dispatchEvent(clickEvent);
					}
				}
			}

			// if 'equals' key
			else if(evt.keyCode === 187){
				keystate[evt.keyCode] = false;

				//if 'COMMAND'
				if(keystate[91]){
					if(core.preview.mode.currentMode === "thumbnail"){
						var clickEvent = new MouseEvent("click");
						document.getElementById("increase-thumb-size").dispatchEvent(clickEvent);
					}
				}
			}

			// if 'right arrow' key
			else if(evt.keyCode === 39){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if(keystate[91] && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						if(keystate[91]){
							thumbBox.style.left = (parseInt(thumbBox.style.left) + (50))+"px";
						} else {
							thumbBox.style.left = (parseInt(thumbBox.style.left) + (10))+"px";
						}

						if( (parseInt(thumbBox.style.left) + thumbBox.clientWidth) > window.innerWidth ) thumbBox.style.left = (
							window.innerWidth - thumbBox.clientWidth
							)+"px";
						
						// thumbBox.style.top = (parseInt(thumbBox.style.top) + (evt.clientY - self.prevClientY))+"px";
						// var clickEvent = new MouseEvent("click");
						// document.getElementById("increase-thumb-size").dispatchEvent(clickEvent);
					}
				
			}

			// if 'left arrow' key
			else if(evt.keyCode === 37){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if(keystate[91] && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						if(keystate[91]){

							if(parseInt(thumbBox.style.left) - (50) < 0){
								thumbBox.style.left = "0px";
							} else {
								thumbBox.style.left = (parseInt(thumbBox.style.left) - (50))+"px";
							}
							
						} else {

							if(parseInt(thumbBox.style.left) - (10) < 0){
								thumbBox.style.left = "0px";
							} else {
								thumbBox.style.left = (parseInt(thumbBox.style.left) - (10))+"px";
							}

						}

					}
				
			}

			// if 'down arrow' key
			else if(evt.keyCode === 40){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if(keystate[91] && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						
						if(keystate[91]){
							thumbBox.style.top = (parseInt(thumbBox.style.top) + (50))+"px";
						} else {
							thumbBox.style.top = (parseInt(thumbBox.style.top) + (10))+"px";
						}
						console.log("top",parseInt(thumbBox.style.top));
						console.log("box height",thumbBox.clientHeight);
						console.log("window height",window.innerHeight);


						if( (parseInt(thumbBox.style.top) + thumbBox.clientHeight) >= window.innerHeight) {
							console.log("reset top")
							thumbBox.style.top = (
							window.innerHeight - thumbBox.clientHeight
							)+"px";
						}
							
						
						// thumbBox.style.top = (parseInt(thumbBox.style.top) + (evt.clientY - self.prevClientY))+"px";
						// var clickEvent = new MouseEvent("click");
						// document.getElementById("increase-thumb-size").dispatchEvent(clickEvent);
					}
				
			}

			// if 'up arrow' key
			else if(evt.keyCode === 38){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if(keystate[91] && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						if(keystate[91]){

							if(parseInt(thumbBox.style.top) - (50) < 0){
								thumbBox.style.top = "0px";
							} else {
								thumbBox.style.top = (parseInt(thumbBox.style.top) - (50))+"px";
							}


						} else {

							if(parseInt(thumbBox.style.top) - (10) < 0){
								thumbBox.style.top = "0px";
							} else {
								thumbBox.style.top = (parseInt(thumbBox.style.top) - (10))+"px";
							}
							
						}

						
						// thumbBox.style.top = (parseInt(thumbBox.style.top) + (evt.clientY - self.prevClientY))+"px";
						// var clickEvent = new MouseEvent("click");
						// document.getElementById("increase-thumb-size").dispatchEvent(clickEvent);
					}
				
			}





		});


		document.addEventListener('keyup',function(evt){

			keystate[evt.keyCode] = false;
			console.log("keystate:",keystate);
		});

		preview.addEventListener("did-start-loading", function(){
			// preview.reload();
			preview.addClass("loading-fadeout");
			if(preview.src === "http://10.240.30.11/releasemanager") {
				// console.log("release manager redirecting!!");
			}
			// else if(preview.src === "local/no-preview.html"){
			// 	console.log("preview src:#")
			// 	core.preview.init();
			// }
			


			// core.preview.init();
		  // preview.src = "local/currentPreview.html";
		});

		preview.addEventListener("dom-ready", function(){
			// preview.reload();

			// console.log("dom ready!!");
			if(preview.src === "http://10.240.30.11/releasemanager") {

				preview.insertCSS("body {background:white !important;} #Page, #Footer {border-radius:0 !important; box-shadow:none !important; background:white !important;} #Page #Toolbar { display:none; border:none !important; border-width:0 !important; border-radius:8px; border-top:none !important; border-bottom:none !important; background: rgb(210,210,210) !important; overflow:hidden;} #Page #Content { border-top:none !important;}");
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




