// == GLOBAL VARS ==
var remote = require("remote");
var app = remote.require("app");
var Global = remote.getGlobal("sharedObject"); //see index.js


var logo = el("#logo");
var panel = el("#panel");
var navOptions = el(".nav_option");

setTimeout(function(){
	panel.rmClass("hide")
	logo.rmClass("hide");
	el("#nav").rmClass("hide");
	el("html")[0].rmClass("white");
	el("body")[0].rmClass("white");
	el("#bottom-bar").rmClass("hide");
}, 200);



el("#cancel").on("click", function(){
	Global.preferencesWindow.close();
})






el("#QTS-option").on("click", function(){
	panel.transitionTo("QTS");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#files-option").on("click", function(){
	panel.transitionTo("files");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#snippets-option").on("click", function(){
	panel.transitionTo("snippets");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#preview-option").on("click", function(){
	panel.transitionTo("preview");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#window-option").on("click", function(){
	panel.transitionTo("window");
	navOptions.rmClass("current");
	this.addClass("current");
})









panel.transitionTo = function(_newPanel) {
	panel.addClass("hide");
	var panelData = panel.getPanelData(_newPanel);
	_newPanel = panel.buildPanel(_newPanel);
	setTimeout(function(){
		panel.setPanel(_newPanel);
		panel.rmClass("hide");
	}, 300);
}

panel.getPanelData = function() {

}

panel.buildPanel = function(_newPanel) {
	if(_newPanel === "QTS"){
		return "QTS Prefs";
	} else if(_newPanel === "files"){
		var form = el("+form").addClass("files");
		form.append( el("+label").text("Path To Brands").append( el("+input") ) );

		// <select>
		// 	<option value="" disabled="disabled" selected="selected">Please select a name</option>
		// 	<option value="1">One</option>
		// 	<option value="2">Two</option>
		// </select>
		form.append( 
			el("+label").text("Default Preview File").append( 
				el("+select").append(
					el.join(
						[el("+option").text("V4-Vertical"), el("+option").text("V4-Horizontal"), el("+option").text("V4-Full"), el("+option").text("V3-Vertical")]
					)
				)
			)
		);
		form.append( el("+button").text("Manage Preview Files") );
		return form;

		return "files Prefs";
	} else if(_newPanel === "snippets"){
		return "snippets Prefs";
	} else if(_newPanel === "preview"){
		return "preview Prefs";
	} else if(_newPanel === "window"){
		return "window Prefs";
	}
}

panel.setPanel = function(_newPanel) {
	panel.purge().append(_newPanel);
}






