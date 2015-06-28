// == GLOBAL VARS ==
var remote = require("remote");
var app = remote.require("app");
var Global = remote.getGlobal("sharedObject"); //see index.js
var fs = require("fs");
var escape = require("escape-html");

var currentPanel = {};
var tempUserPrefData = {};
var writeInProgress = false;
var preferencesChanged = false;

var logo = el("#logo");
var panel = el("#panel");
var navOptions = el(".nav_option");

// INIT 
fs.readFile("local/user-settings.json", function(_err, _data){
	/* 
	Write user-config file to a temp file at start.
	This temp file will be re-written each time the user fiddles with the prefs. 
	This temp file will overwrite the actual user settings on save. 
	*/
	writeInProgress = true;
	fs.writeFile("local/temp-user-settings.json", _data, function(err){
		writeInProgress = false;
		setTimeout(function(){
			panel.rmClass("hide")
			logo.rmClass("hide");
			el("#nav").rmClass("hide");
			el("html")[0].rmClass("white");
			el("body")[0].rmClass("white");
			el("#bottom-bar").rmClass("hide");
		}, 200);

	})
})

	



el("#cancel").on("click", function(){
	Global.preferencesWindow.close();
})


// SAVE TEMP TO USER-PREFERENCES
el("#save").on("click", function(e){
	function saveUserPrefs(){
		if(preferencesChanged){
			console.log("saving prefs");
			fs.writeFile("local/user-settings.json", JSON.stringify(tempUserPrefData), function(err){
				if(err) alert("Error Saving Changes");
				else Global.preferencesWindow.close();
			})
		} else {
			console.log("no changes");
		}
	}

	if(writeInProgress){

		var checkWriteInterval = setInterval(function(){
			if(!writeInProgress) {
				saveUserPrefs();
				clearInterval(checkWriteInterval);
			} 
		},50);

	} else {
		saveUserPrefs();
	}
})


fs.watch('local/temp-user-settings.json', function (evt) {
  console.log('You are doing a ' + evt +' to TEMP-user-settings.json');
});

fs.watch('local/user-settings.json', function (evt) {
  console.log('You are doing a ' + evt +' to user-settings.json');
});



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

	fs.readFile("local/temp-user-settings.json", function(err, _data){
		console.log("reading temp");
		tempUserPrefData = JSON.parse(_data);
		panel.insertData(_panel);
	});
	
}

panel.insertData = function(_panel){
	if(_panel === "QTS"){

	} else if(_panel === "files"){

		// add path to Brands folder
		var pathToBrands = currentPanel.el("#path-to-brands").attr("value",tempUserPrefData.files.pathToBrands);

		// Populate the preview files and select the default		
		var defaultPreviewFile = currentPanel.el("#default-preview-file");
		// ADD OPTIONS
		var tempArray = [];		
		for(var i = 0, ii = tempUserPrefData.files.previewFiles.length; i < ii; i++ ){
			var pF = tempUserPrefData.files.previewFiles;			
			var currentOption = el("+option").attr("value", pF[i].fileName).text( pF[i].verboseName );
			if( pF[i].fileName === tempUserPrefData.files.defaultPreviewFile ) currentOption.selected = true;
			tempArray.push(currentOption);	
		}		

		defaultPreviewFile.append( el(tempArray) );		

		//= include update-temp-preferences/files-include.js


	} else if(_panel === "snippets"){

	} else if(_panel === "preview"){
		currentPanel.el("#"+tempUserPrefData.preview.refreshPreview).checked = true;
		currentPanel.el("#thumbnailName").attr("value", tempUserPrefData.preview.defaultThumbnailName);

		var defaultThumbnailExt = currentPanel.el("#default-thumbnail-ext");
		// ADD OPTIONS
		var tempArray = [];		
		for(var i = 0, ii = tempUserPrefData.preview.thumbnailExtensions.length; i < ii; i++ ){
			var tnE = tempUserPrefData.preview.thumbnailExtensions;		
			var currentOption = el("+option").attr("value", tnE[i]).text( tnE[i] );
			if( tnE[i] === tempUserPrefData.preview.defaultThumbnailExt ) currentOption.selected = true;
			tempArray.push(currentOption);
		}		
		defaultThumbnailExt.append( el(tempArray) );		

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
		currentPanel.append( 
			el("+label").text("Path To Brands").append( el("+input#path-to-brands") ) 
		);
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
						el("+input#thumbnailName").addClass("thumbnailName").attr("name", "thumbnailName"),
						el("+div").addClass(["select_cont", "inline-block"]).append( el("+select#default-thumbnail-ext") )
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

panel.updateTempFile = function(){
	preferencesChanged = true;
	writeInProgress = true;
	console.log("updating temp");
	fs.writeFile("local/temp-user-settings.json", JSON.stringify(tempUserPrefData), function(err){
		console.log("updated temps!");
		if(err) console.log(err);
		writeInProgress = false;
	});
}

// add "el" methods to all radio buttons
function checkAndRadio(){
	el(document.querySelectorAll("input[type=radio]"))
}

