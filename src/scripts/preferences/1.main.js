// == GLOBAL VARS ==
var remote = require("remote");
var app = remote.require("app");
var Global = remote.getGlobal("sharedObject"); //see index.js

setTimeout(function(){
	el("#nav").rmClass("hide");
	el("#bottom-bar").rmClass("hide");
}, 10);

el("#cancel").on("click", function(){
	Global.preferencesWindow.close();
})

// CLicks
var navOptions = el(".nav_option");

el("#QTS-option").on("click", function(){
	showPanel("QTS");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#files-option").on("click", function(){
	showPanel("files");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#snippets-option").on("click", function(){
	showPanel("snippets");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#preview-option").on("click", function(){
	showPanel("preview");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#window-option").on("click", function(){
	showPanel("window");
	navOptions.rmClass("current");
	this.addClass("current");
})


function showPanel(_panel) {
	var panel = el("#panel");
	if(_panel === "QTS"){
		panel.purge().text("QTS Prefs");
	} else if(_panel === "files"){
		panel.purge().text("files Prefs");
	} else if(_panel === "snippets"){
		panel.purge().text("snippets Prefs");
	} else if(_panel === "preview"){
		panel.purge().text("preview Prefs");
	} else if(_panel === "window"){
		panel.purge().text("window Prefs");
	}
}