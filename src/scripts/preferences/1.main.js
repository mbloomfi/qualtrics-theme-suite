// --------------------------------
//				GLOBAL VARS
// --------------------------------
var remote = require("remote");
var app = remote.require("app");
var Global = remote.getGlobal("sharedObject"); //see index.js
var appRoot = Global.appRoot;
var fs = require("fs");
var json = require("jsonfile");
var escape = require("escape-html");

var currentPanel = {};
var localUserPrefData = {};

var logo = el("#logo");
var panel = el("#panel");
var navOptions = el(".nav_option");

fs.stat("/Users/samueleaton/", function(err, stats){
	console.log("stats.isDirectory:",stats.isDirectory());
})



// --------------------------------
//		INIT (USER PREFS TO LOCAL)
// --------------------------------
json.readFile(Global.appRoot+"/local/user-settings.json", function(_err, _data){

	if(_err) console.log("ERROR reading user-settings.json::",_err );
	console.log("read file:", _data);
	/* 
	Store user-config file to a local json at start.
	This json object will be re-written each time the user fiddles with the prefs. 
	This json object will overwrite the actual user settings on save. 
	*/

	// set local object
	localUserPrefData = _data;

	// init preferences
	setTimeout(function(){
		panel.rmClass("hide")
		logo.rmClass("hide");
		el("#nav").rmClass("hide");
		el("html")[0].rmClass("white");
		el("body")[0].rmClass("white");
		el("#bottom-bar").rmClass("hide");
	}, 200);




});
	

// --------------------------------
//				CANCEL BUTTON
// --------------------------------
el("#cancel").on("click", function(){
	Global.preferencesWindow.close();
})


// --------------------------------
//				SAVE BUTTON
// --------------------------------
el("#save").on("click", function(e){
	savePreferences();
});

function savePreferences() {
	// saves from local to user-prefs file if any changes
	json.writeFile(Global.appRoot+"/local/user-settings.json", localUserPrefData, function(err){
		if(err) alert("Error Saving Changes");
		else Global.preferencesWindow.close();;
	});
}




// --------------------------------
//			PREFERENCES NAV
// --------------------------------
el("#QTS-option").on("click", function(){
	panel.transitionTo.run("QTS");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#files-option").on("click", function(){
	panel.transitionTo.run("files");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#snippets-option").on("click", function(){
	panel.transitionTo.run("snippets");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#preview-option").on("click", function(){
	panel.transitionTo.run("preview");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#window-option").on("click", function(){
	panel.transitionTo.run("window");
	navOptions.rmClass("current");
	this.addClass("current");
})


// --------------------------------
//		CHANGE PREFERENCES PANEL
// --------------------------------
panel.transitionTo = baton(function(next, _newPanelName){

	panel.addClass("hide");
	var _newPanel = panel.buildPanel(_newPanelName);
	panel.insertData(_newPanelName);
	
	pause(300, next, _newPanel);

})
.then(function(next, _newPanel){

	panel.setPanel(next, _newPanel);
	panel.rmClass("hide");

})
.then(function(next){
	// console.log("currentPanel:",currentPanel);
	currentPanel.on("submit", function(evt){
		evt.preventDefault();
	});

});


// --------------------------------
//			BUILD PANEL (FORM)
// --------------------------------
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
			el("+label#path-to-brands-label").append( 
				el.join([
					el("+div").text("Path To Brands"),
					el("+span#homeDirectory").text(process.env.HOME+"/ "),
					el("+input#path-to-brands")
				])
				 
			) 
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


// --------------------------------
//		APPLY THE BUILT PANNEL
// --------------------------------
panel.setPanel = function(next, _newPanel) {
	panel.purge().append(_newPanel);
	checkAndRadio();
	next();
}


// --------------------------------
//		INSERT DATA INTO PANEL
// --------------------------------
panel.insertData = function(_panel){
	if(_panel === "QTS"){

	} else if(_panel === "files"){

		// add path to Brands folder
		var pathToBrands = currentPanel.el("#path-to-brands").attr("value",localUserPrefData.files.pathToBrands);

		// Populate the preview files and select the default		
		var defaultPreviewFile = currentPanel.el("#default-preview-file");
		// ADD OPTIONS
		var tempArray = [];		
		for(var i = 0, ii = localUserPrefData.files.previewFiles.length; i < ii; i++ ){
			var pF = localUserPrefData.files.previewFiles;			
			var currentOption = el("+option").attr("value", pF[i].fileName).text( pF[i].verboseName );
			if( pF[i].fileName === localUserPrefData.files.defaultPreviewFile ) currentOption.selected = true;
			tempArray.push(currentOption);	
		}		

		defaultPreviewFile.append( el(tempArray) );		

		//= include update-temp-preferences/files-include.js


	} else if(_panel === "snippets"){

	} else if(_panel === "preview"){
		currentPanel.el("#"+localUserPrefData.preview.refreshPreview).checked = true;
		currentPanel.el("#thumbnailName").attr("value", localUserPrefData.preview.defaultThumbnailName);

		var defaultThumbnailExt = currentPanel.el("#default-thumbnail-ext");
		// ADD OPTIONS
		var tempArray = [];		
		for(var i = 0, ii = localUserPrefData.preview.thumbnailExtensions.length; i < ii; i++ ){
			var tnE = localUserPrefData.preview.thumbnailExtensions;		
			var currentOption = el("+option").attr("value", tnE[i]).text( tnE[i] );
			if( tnE[i] === localUserPrefData.preview.defaultThumbnailExt ) currentOption.selected = true;
			tempArray.push(currentOption);
		}		
		defaultThumbnailExt.append( el(tempArray) );		

		//= include update-temp-preferences/preview-include.js

	} else if(_panel === "window"){

	}

}


// --------------------------------
// ELIFY APPENDED CHECK/RADIO BTNS
// --------------------------------
function checkAndRadio(){
	el(document.querySelectorAll("input[type=radio]"))
}

