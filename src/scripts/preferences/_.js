/*!
<el> by samueleaton
*/
!function(){el=function(e,t){function n(e){var n=e.charAt(0);switch(n){case"#":return i.getById(e.slice(1));case"+":if(e.slice(1).match(/#/)){var r=e.slice(1).split("#"),l=i.create(r[0],t);return el.isElementArray(l)?l.each(function(e){e.setAttribute("id",r[1])}):l.setAttribute("id",r[1]),l}return i.create(e.slice(1),t);case".":return i.getByClassName(e.slice(1));default:return i.getByTagName(e)}}var i=this===window?window.el:this;return"string"==typeof e?n(e):el.isElement(e)?el.elify(e):el.isCollection(e)||el.isNodeList(e)||el.isElementArray(e)?el.elify(e):void 0},el.create=function(e,t){if(t&&"number"==typeof t){for(var n=[],i=0,r=t;r>i;i++)n.push(el.elify(document.createElement(e)));return n}return el.elify(document.createElement(e))},el.getById=function(e){if(this===window.el)return el.elify(document.getElementById(e));if(el.isElement(this)){if(document.contains(this))return el.elify(document.getElementById(e));var t=this,n=!1,i=null;return t.el("*").each(function(t){return t.getAttribute("id")===e?(n=!0,i=t,0):void 0}),i}},el.getByClassName=function(e,t){var n=this===window.el?document:this,i=n.getElementsByClassName(e);return i=Array.prototype.slice.call(i),el.elify(i)},el.getByTagName=function(e,t){var n=this===window.el?document:this,i=n.getElementsByTagName(e);return i=Array.prototype.slice.call(i),el.elify(i)},el.on=function(e,t){var n=el.isElement(this)||el.isElementArray(this)?this:window;return n.addEventListener(e,t),this},el.join=function(e){var t=[];if(el.isArray(e))for(var n=0,i=e.length;i>n;n++)el.isElement(e[n])?t.push(e[n]):el.isElementArray(e[n])&&e[n].each(function(e){t.push(e)});return el.elify(t)},el.elify=function(e){function t(e){return e.el=el,e.getById=el.getById,e.getByClassName=el.getByClassName,e.getByTagName=el.getByTagName,e.getByAttribute=el.getByAttribute,e.elify=el.elify,e.on=el.on,e.addClass=function(e){var t=this;if(el.isArray(e))for(var n=0,i=e.length;i>n;n++)t.classList.add(e[n]);else"string"==typeof e&&t.classList.add(e);return t},e.rmClass=function(e){var t=this;if(el.isArray(e))for(var n=0,i=e.length;i>n;n++)t.classList.remove(e[n]);else"string"==typeof e&&t.classList.remove(e);return t},e.hasClass=function(e){return this.classList.contains(e)},e.rm=function(){var e=this;return e.parentNode&&e.parentNode.removeChild(e),e},e.append=function(e){if(el.isElementArray(e)){var n=document.createDocumentFragment();e.each(function(e){e.el||(e=t(e)),n.appendChild(e)}),e=n}return this.appendChild(e),this},e.appendTo=function(e){var t=this;return el.isElementArray(e)?e.each(function(e){var n=t.cloneNode(!0);e.appendChild(n)}):e.appendChild(t),t},e.purge=function(){for(var e=this;e.firstChild;)e.removeChild(e.firstChild);return e},Object.defineProperty(e,"text",{configurable:!0,enumerable:!0,writable:!0,value:function(t){return"string"==typeof t&&e.appendChild(document.createTextNode(t)),e}}),e.attr=function(e,t){return"string"==typeof e&&this.setAttribute(e,void 0!==t?t:""),this},e}return el.isElement(e)?t(e):((el.isCollection(e)||el.isNodeList(e))&&(e=Array.prototype.slice.call(e)),e.each=function(e){for(var t=this,n=0,i=t.length;i>n;n++)if(0===e(t[n],n,t))return this===window.el?void 0:this;return this===window.el?void 0:this},e.each(function(e){t(e)}),e.addClass=function(n){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.addClass(n))}),e},e.rmClass=function(n){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.rmClass(n))}),e},e.hasClass=function(n,i){if("all"===i||"undefined"==typeof i){var r=!0;return e.each(function(e){"undefined"!=typeof e&&(void 0===e.el&&(e=t(e)),e.hasClass(n)||(r=!1))}),r}return"any"===i?(e.each(function(e){return"undefined"!=typeof e&&(e.el||(e=t(e)),e.hasClass(n))?!0:void 0}),!1):e},e.rm=function(n){return this.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.rm())}),e},e.append=function(n){if(el.isElementArray(n)){var i=document.createDocumentFragment();n.each(function(e){void 0===e.el&&(e=t(e)),i.appendChild(e)}),n=i}return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.append(n.cloneNode(!0)))}),e},e.appendTo=function(n,i){return e.each(function(e){"undefined"!=typeof e&&(void 0===e.el&&(e=t(e)),e.appendTo(n))}),i!==!1&&e.rm(),e},e.purge=function(){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.purge())}),e},e.text=function(n){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.text(n))}),e},e.attr=function(n,i){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.attr(n,i))}),e},e.on=function(e,t){return this.each(function(n){n.addEventListener(e,t)}),this},e)},el.isArray=function(e){return Array.isArray(e)||e instanceof Array?!0:!1},el.isElementArray=function(e){return(Array.isArray(e)||e instanceof Array)&&el.isElement(e[0])?!0:!1},el.isElement=function(e){var t;try{t=e instanceof HTMLElement}catch(n){t=e&&e.nodeType?!0:!1}return t},el.isCollection=function(e){return e instanceof HTMLCollection},el.isNodeList=function(e){return e instanceof NodeList}}();
function baton(u){var _={run:function(){var u=Array.prototype.splice.call(arguments,0);return _.__utils__.i=-1,_["yield"].apply(null,u)},then:function(u){return"function"==typeof u&&_.__utils__.queue.push(u),_},"yield":function(u){var t=Array.prototype.splice.call(arguments,0);return t.unshift(_["yield"]),"undefined"!=typeof _.__utils__.queue[_.__utils__.i+1]?(_.__utils__.i++,_.__utils__.queue[_.__utils__.i].apply(null,t)):u},__utils__:{queue:[],i:-1}};return Object.create(_).then(u)}

function pause(time, _callback) {
	var args = Array.prototype.splice.call(arguments, 2);
	console.log("args:",args);
	setTimeout(function(){
		_callback.apply(null, args);
	}, time);
}
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
		currentPanel.el("#path-to-brands").on("blur", function(){
			if(this.value !== localUserPrefData.files.pathToBrands){
				localUserPrefData.files.pathToBrands = this.value;
			}
		});
		
		currentPanel.el("#default-preview-file").on("blur", function(){
			if(this.options[this.selectedIndex].value !== localUserPrefData.files.defaultPreviewFile){
				localUserPrefData.files.defaultPreviewFile = this.options[this.selectedIndex].value;
			}
		});
		



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
		currentPanel.el("#onSave").on("focus", function(){
			if(localUserPrefData.preview.refreshPreview !== this.id){
				localUserPrefData.preview.refreshPreview = this.id;
			}
		});
		
		currentPanel.el("#onCommand").on("focus", function(){
			if(localUserPrefData.preview.refreshPreview !== this.id){
				localUserPrefData.preview.refreshPreview = this.id;
			}
		});
		
		


	} else if(_panel === "window"){

	}

}


// --------------------------------
// ELIFY APPENDED CHECK/RADIO BTNS
// --------------------------------
function checkAndRadio(){
	el(document.querySelectorAll("input[type=radio]"))
}

