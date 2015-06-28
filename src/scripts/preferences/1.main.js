// == GLOBAL VARS ==
var remote = require("remote");
var app = remote.require("app");
var Global = remote.getGlobal("sharedObject"); //see index.js
var fs = require("fs");
var currentPanel = {};


fs.watch('local/', function (evt) {
  console.log('You are doing a ' + evt);
});

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



panel.transitionTo = function(_newPanelName) {

	panel.addClass("hide");
	var _newPanel = panel.buildPanel(_newPanelName);
	panel.getPanelData(_newPanelName);
	setTimeout(function(){
		panel.setPanel(_newPanel);
		panel.rmClass("hide");
	}, 300);

}

panel.getPanelData = function(_panel) {

	fs.readFile("local/user-settings.json", function(err, _data){
		var data = JSON.parse(_data);
		panel.insertData(_panel, data);
	});
	
}

panel.insertData = function(_panel, data){

	if(_panel === "QTS"){

	} else if(_panel === "files"){
		// add path to Brands folder
		currentPanel.el("#path-to-brands").attr("value",data.files.pathToBrands);

		// Populate the preview files and select the default		
		var defaultPreviewFile = currentPanel.el("#default-preview-file");
		var tempArray = [];		
		for(var i = 0, ii = data.files.previewFiles.length; i < ii; i++ ){
			var pF = data.files.previewFiles;			
			if( pF[i].fileName === data.files.defaultPreviewFile ) {
				var selectedOption = el("+option").attr("value", pF[i].fileName).text( pF[i].verboseName );
				selectedOption.selected = true;
				tempArray.push(selectedOption);				
			} else {				
				tempArray.push(el("+option").attr("value", pF[i].fileName).text( pF[i].verboseName ))				
			}

		}		
		defaultPreviewFile.append( el(tempArray) );		

		// currentPanel.el("#path-to-brands").attr("value",data.files.pathToBrands);
		// .append(
		// 				el.join([
		// 					el("+option").attr("value","preview-file-001").text("V4-Vertical"), 
		// 					el("+option").attr("value","preview-file-002").text("V4-Horizontal"), 
		// 					el("+option").attr("value","preview-file-003").text("V4-Full")
		// 				])
		// 			)
	} else if(_panel === "snippets"){

	} else if(_panel === "preview"){
		// currentPanel.el("#path-to-brands").attr("value",data.files.pathToBrands);
		

	} else if(_panel === "window"){

	}

}


// BUILD PANEL
panel.buildPanel = function(_newPanel) {
	if(_newPanel === "QTS"){

		currentPanel = el("+form#qtsForm").addClass("QTS").append(
			el("+label").text("QTS Thing").append( el("+input") )
		);
		return currentPanel;
	} 

	else if(_newPanel === "files"){

		currentPanel = el("+form#filesForm").addClass("files");
		//Path To Brands
		currentPanel.append( el("+label").text("Path To Brands").append( el("+input#path-to-brands") ) );
		//Default Preview File
		currentPanel.append( 
			el("+label").text("Default Preview File").append( 
				el("+div").addClass("select_cont").append(
					el("+select#default-preview-file").attr("name", "default-preview-file")
				)
			)
		);
		//Manage Preview Files
		currentPanel.append( el("+button").text("Manage Preview Files") );
		return currentPanel;
	} 

	else if(_newPanel === "snippets"){

		currentPanel = el("+form#snippetsForm").addClass("snippets").append(
			el("+label").text("Snippets Stuff").append( el("+input") )
		);

		return currentPanel;

	} 

	else if(_newPanel === "preview"){
		
		currentPanel = el("+form#previewForm").addClass("preview").append(
			el.join([
				el("+div").addClass("fieldSet").append(
					el.join([
						el("+h2").text("Refresh Preview Window"),
						el("+label").addClass(["radioLabel"]).text("On Save").append(
							el("+span").text(" (⌘S) ")
						).text(" and Command ").append(
							el.join([
								el("+span").text(" (⌘R) "),
								el("+input#onSave").attr("type", "radio").attr("value", 1).attr("name", "refreshPreview")
							])
						),
						el("+label").addClass("radioLabel").text("On Command Only").append(
							el.join([
								el("+span").text(" (⌘R) "),
								el("+input#onCommand").attr("type", "radio").attr("value", 2).attr("name", "refreshPreview")
							])
						)
					])
				),
				el("+div").addClass("fieldSet").append(
					el.join([
						el("+h2").text("Default Thumbnail Name"),
						el("+input").addClass("thumbnailName").attr("name", "thumbnailName"),
						el("+div").addClass(["select_cont", "inline-block"]).append(
							el("+select").append(
								el.join([
									el("+option").text(".gif"), 
									el("+option").text(".png"), 
									el("+option").text(".jpg")
								])
							)
						)
					])
				),
			])
		);
		return currentPanel;
	} 

	else if(_newPanel === "window"){

		currentPanel = el("+form#windowForm").addClass("window").append(
			el("+label").text("Window Thing").append( el("+input") )
		);
		return currentPanel;

	}
}

panel.setPanel = function(_newPanel) {
	panel.purge().append(_newPanel);
	checkAndRadio();
}

function checkAndRadio(){
	el(document.querySelectorAll("input[type=radio]"))
}

