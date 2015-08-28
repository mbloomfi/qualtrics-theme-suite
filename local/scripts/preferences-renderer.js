
// --------------------------------
//				GLOBAL VARS
// --------------------------------
var remote = require("remote");
var app = remote.require("app");
var Global = remote.getGlobal("sharedObject"); //see index.js
var appRoot = Global.appRoot;
var fs = require("fs-extra");
var path = require("path");


// --------------------------------
//				EVE (pubsub)
// --------------------------------
var Eve = {
	events: {},
	on: function (eventName, fn) {
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(fn);
	},
	off: function(eventName, fn) {
		if (this.events[eventName]) {
			for (var i = 0; i < this.events[eventName].length; i++) {
				if (this.events[eventName][i] === fn) {
					this.events[eventName].splice(i, 1);
					break;
				}
			};
		}
	},
	emit: function (eventName, data) {
		if (this.events[eventName]) {
			this.events[eventName].forEach(function(fn) {
				if(typeof data !== undefined) fn(data);
				else fn(undefined);
			});
		}
	}
};

//= include ../app-core-methods.js

// --------------------------------
//	Set core.LocalData
// --------------------------------
// core.localData.updateUserSettings();
// core.localData.snippets.readFromPersistentData();



var currentPanel = {};

// var logo = el("#logo");
// var panel = el("#panel");
// var navOptions = el(".nav_option");

// --------------------------------
//	Slide-in menus, btns etc.
// --------------------------------
// setTimeout(function(){
// 	panel.rmClass("hide");
// 	logo.rmClass("hide");
// 	el("#nav").rmClass("hide");
// 	el("html")[0].rmClass("white");
// 	el("body")[0].rmClass("white");
// 	el("#bottom-bar").rmClass("hide");
// }, 200);


setTimeout(function(){
	Eve.emit("init");
}, 200);


console.log("global:",Global);


/* 
Qualtrics Logo
*/
var QLogo = etc.template(function(){
	return etc.el("div", { id:"Q-logo", className:"hide",
		events: {
			attached: function(){
				this.classList.remove("hide");
			}
		},
		innerHTML: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg id="logo" class="logo" width="100%" height="100%" viewBox="0 0 126 113" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;">	<path id="QUALTRICS-LOGO" d="M37.9173,74.0432c6.68848,7.68458 14.6885,11.6327 22.3897,11.5751c4.95345,-0.0370611 9.73569,-1.1885 14.1609,-3.46098c-5.19244,-13.0908 -10.8007,-25.3777 -23.872,-25.0034c-14.299,0.409384 -14.9891,12.3154 -12.6785,16.8893ZM91.9689,82.6168c8.95474,13.2447 17.0121,23.8614 31.322,15.7607c0.770884,1.17637 1.56866,2.03767 2.3827,3.81007c-31.4887,21.409 -40.8065,5.72587 -48.3271,-12.7698c-5.38387,1.62777 -11.0441,2.46135 -16.8531,2.41178c-38.2982,-0.326807 -70.2451,-39.0309 -57.2274,-91.3621c0,0 12.7673,-0.0503319 20.2662,-7.81597e-14c-4.03189,27.9679 0.0501284,49.5572 7.82732,63.9869c1.20683,-5.03507 5.66846,-13.712 19.2363,-13.6796c16.4375,0.0392013 26.6013,10.8233 34.9112,22.4071c11.2196,-13.3616 17.395,-37.5431 13.0168,-72.7144c5.49535,-0.00530837 20.2633,-2.34479e-13 20.2633,-2.34479e-13c9.15318,37.0042 -4.33444,67.575 -26.8182,82.1494Z"/></svg>'
	});
});
Eve.on("init", function(){
	QLogo.render(null, document.body);
})


	

// --------------------------------
//				CANCEL BUTTON
// --------------------------------
// el("#cancel").on("click", function(){
// 	Global.preferencesWindow.close();
// })


// --------------------------------
//				SAVE BUTTON
// --------------------------------
// el("#save").on("click", function(e){
// 	savePreferences();
// });

// function savePreferences() {
// 	// saves from localData.userSettings to user-settings.json
// 	core.localData.snippets.writeToPersitentData(function(){
// 		core.userSettingsFile.update(function(){ // on success
// 			logo.addClass("saved");
// 			setTimeout(function(){
// 				Global.preferencesWindow.close();
// 			}, 450);
// 		});
// 	});
		
// }

// var Snippet = {
// 	current: null,
// 	init: function(){
// 		this.current = {
// 			name:null,
// 			id:null,
// 			code:null,
// 			type:null,
// 			element: null,
// 			index: null
// 		};
// 	},
// 	setName: function(_name){
// 		if(Snippet.current !== null){
// 			Snippet.current.name = _name;
// 			// if(Snippet.current.element !== null){
// 			// 	Snippet.current.element.textContent = _name;
// 			// }
// 		}
// 	},
// 	setId: function(_id){
// 		if(Snippet.current !== null){
// 			Snippet.current.id = _id;
// 		}
// 	},
// 	setType: function(type){
// 		if(Snippet.current !== null){
// 			Snippet.current.type = type;
// 		}
// 	},
// 	setCode: function(code){
// 		if(Snippet.current !== null){
// 			Snippet.current.code = code;
// 		}
// 	},
// 	setIndex: function(_index){
// 		if(Snippet.current !== null){
// 			Snippet.current.index = _index;
// 		}
// 	},
// 	getCurrentCore: function(){
// 		if(Snippet.current !== null)
// 		return {
// 			name: Snippet.current.name,
// 			id: Snippet.current.id,
// 			type: Snippet.current.type,
// 			code: Snippet.current.code,
// 		}
// 	},
// 	saveToLocal: function(){
// 		if(this.current !== null){
// 			var snippetRadios = document.getElementsByClassName("snippet-radio");
// 			for(var i = 0, ii = snippetRadios.length; i < ii; i++){
// 				if(snippetRadios[i].checked) Snippet.setType(snippetRadios[i].value);
// 			}
// 			if(Snippet.current.element !== null){
// 				console.log("name");

// 				Snippet.current.element.getElementsByClassName("snippet_name")[0].textContent = Snippet.current.name;
// 				Snippet.current.element.getElementsByClassName("snippet-type")[0].textContent = Snippet.current.type;
// 			}
// 			core.localData.snippets.list[this.current.index] = this.getCurrentCore();
// 		}
// 	}
// }


// function updateCurrentSnippet() {
// 	console.log()
// }


// // --------------------------------
// //			PREFERENCES NAV
// // --------------------------------
// el("#QTS-option").on("click", function(){
// 	panel.transitionTo.run("QTS");
// 	navOptions.rmClass("current");
// 	this.addClass("current");
// })
// el("#files-option").on("click", function(){
// 	panel.transitionTo.run("files");
// 	navOptions.rmClass("current");
// 	this.addClass("current");
// })
	

// el("#snippets-option").on("click", function(){
// 	panel.transitionTo.run("snippets");
// 	navOptions.rmClass("current");
// 	this.addClass("current");
// })
// el("#preview-option").on("click", function(){
// 	panel.transitionTo.run("preview");
// 	navOptions.rmClass("current");
// 	this.addClass("current");
// })
// el("#window-option").on("click", function(){
// 	panel.transitionTo.run("window");
// 	navOptions.rmClass("current");
// 	this.addClass("current");
// })


// // --------------------------------
// //		CHANGE PREFERENCES PANEL
// // --------------------------------
// panel.transitionTo = baton(function(next, _newPanelName){

// 	panel.addClass("hide");
// 	var _newPanel = panel.buildPanel(_newPanelName);
// 	panel.insertData(_newPanelName);

// 	setTimeout(function(){
// 		next(_newPanel, _newPanelName);
// 	}, 300);

// })

// .then(function(next, _newPanel, _newPanelName){

// 	panel.setPanel(function(){
// 		next(_newPanelName);

// 	}, _newPanel);
// 	panel.rmClass("hide");

// 	console.log("new panel",_newPanelName)

// })

// .then(function(next, _newPanelName){
// 	console.log("new panel name",_newPanelName)
// 	if(_newPanelName === "manage-snippets"){


// 		console.log("set code CodeMirror")
// 		var snippetCodemirrorCont = document.getElementById("snippetCodemirror");

		

		// codemirrorContainer.el("textarea").attr("tabindex","-1");
		// setTimeout(function(){
		// 	snippetCodemirrorCont.el("textarea").attr("tabindex", "-1");
		// 	snippetCodemirror.on("change", function(){
		// 		Snippet.setCode(snippetCodemirror.getValue());
		// 	})
		// }, 0);
		
		// window.snippetCodemirror = CodeMirror(snippetCodemirrorCont, {
		// 	mode: "css",
		// 	theme: "monokai",
		// 	tabSize: 2,
		// 	indentWithTabs: true,
		// 	keyMap: "sublime",
		// 	lineWrapping: true,
		// 	lineNumbers: true,
		// 	autoCloseBrackets: true
		// });




// 	}

// 	// console.log("currentPanel:",currentPanel);
// 	currentPanel.on("submit", function(evt){
// 		evt.preventDefault();
// 	});

// });





// // --------------------------------
// //			BUILD PANEL (FORM)
// // --------------------------------
// panel.buildPanel = function(_newPanel) {
// 	if(_newPanel === "QTS"){

// 		currentPanel = el("+form#qtsForm").addClass("QTS").append(
// 			el("+label").text("QTS Thing").append( el("+input") )
// 		);
// 		return currentPanel;
// 	} 


// 	else if(_newPanel === "files"){
// 		console.log("a1")

// 		currentPanel = el("+form#filesForm").addClass("files");
// 		//Path To Brands
// 		currentPanel.append( 
// 			el("+label#path-to-brands-label").append( 
// 				el.join([
// 					el("+div").text("Path To Brands"),
// 					el("+span#homeDirectory").text(process.env.HOME+"/ "),
// 					el("+input#path-to-brands")
// 				])
				 
// 			) 
// 		);
// 		//Default Preview File
// 		currentPanel.append( 
// 			el("+label").addClass("extraMarginBottom").text("Default Preview File").append( 
// 				el("+div").addClass("select_cont").append(
// 					el("+select#default-preview-file").attr("name", "default-preview-file")
// 				)
// 			)
// 		);
		
// 		// currentPanel.append( el("+br") );

// 		//Manage Preview Files
// 		currentPanel.append( 
// 			el("+button#managePreviewFiles").addClass("btn").text("Manage Preview Files") 
// 		);

// 		//Manage Base Files
// 		currentPanel.append( 
// 			el("+button#manageBaseFiles").addClass("btn").text("Manage Base Files") 
// 		);

// 		// --------------------------------
// 		//	Manage Preview Files Litener
// 		// --------------------------------
// 		currentPanel.el("#managePreviewFiles").on("click", function(){
// 			panel.transitionTo.run("previewFiles");
// 		});

// 		console.log("a2")

// 		return currentPanel;
// 	} 


// 	else if(_newPanel === "previewFiles"){
// 		currentPanel = el("+form#previewFilesForm").addClass("files");
// 		//Path To Brands
// 		currentPanel.append( 
// 			el("+div").addClass("previewFilesLabel").append( 
// 				el.join([
// 					el("+div").text("Preview Question Files"),
// 					el("+div#previewFilesCont").addClass("fileListContainer")
// 				])
				 
// 			) 
// 		);

// 		return currentPanel;
// 	}



// 	else if(_newPanel === "snippets"){

// 		currentPanel = el("+form#snippetsForm").addClass("snippets").append(
// 			el.join([
// 				el("+button").text("Manage Snippets").on("click", function(){
// 					panel.transitionTo.run("manage-snippets");
// 				}),
// 				el("+button").text("Manage Key Bindings"),
// 			])
// 		);

// 		return currentPanel;

// 	} 

// 	else if(_newPanel === "manage-snippets"){

// 		currentPanel = el("+form#snippetsForm").addClass("snippets").append(
// 			el.join([
// 				el("+div#snippetsListCont"),

// 				el("+div#snippetInfo").append(el.join([

// 					el("+input#snippetName").attr("placeholder", "Snippet Name")
// 					.on("keyup", function(){
// 						if(typeof Snippet.current !== "undefined" && Snippet.current.element) {

// 							Snippet.setName(this.value);

// 							// Snippet.current.element.textContent = this.value;
// 							// Snippet.current.element.dataset.name = this.value;
// 							// core.localData.snippets.list[Snippet.current.element.dataset.index].name = this.value;


// 						}
// 					}).on("paste", function(){
// 						if(typeof Snippet.current !== "undefined" && Snippet.current.element) {
// 							Snippet.setName(this.value);
// 							// Snippet.current.element.textContent = this.value;
// 							// Snippet.current.element.dataset.name = this.value;
// 							// core.localData.snippets.list[Snippet.current.element.dataset.index].name = this.value;
// 						}
// 					})
// 					,
// 					el("+div#snippetTypeCont").append(el.join([
// 						el("+label#snippetType-css").text("CSS").append(
// 							el("+input#snippetRadio-css").addClass("snippet-radio").attr("type","radio").attr("value", "css").attr("name","snippet-radio")
// 						),
// 						el("+label#snippetType-js").text("JS").append(
// 							el("+input#snippetRadio-js").addClass("snippet-radio").attr("type","radio").attr("value", "js").attr("name","snippet-radio")
// 						)
// 					])),
// 				])),
// 				el("+div#snippetCodemirror")
// 				,
// 				el("+button#saveSnippet").text("Save Snippet").on("click", function(){
// 					Snippet.saveToLocal();
// 				})
// 			])
// 		);

// 		return currentPanel;

// 	} 

// 	else if(_newPanel === "preview"){
		
// 		currentPanel = el("+form#previewForm").addClass("preview").append(
// 			el.join([
// 				el("+div").addClass("fieldSet").append(
// 					el.join([
// 						el("+h2").text("Refresh Preview Window"),
// 						el("+label").addClass(["radioLabel"]).text("On Save").append(
// 							el("+span").text(" (⌘S) ")
// 						).text(" and Command ").append(
// 							el.join([
// 								el("+span").text(" (⌘R) "),
// 								el("+input#onSave").attr("type", "radio").attr("value", 1).attr("name", "refreshPreview")
// 							])
// 						),
// 						el("+label").addClass("radioLabel").text("On Command Only").append(
// 							el.join([
// 								el("+span").text(" (⌘R) "),
// 								el("+input#onCommand").attr("type", "radio").attr("value", 2).attr("name", "refreshPreview")
// 							])
// 						)
// 					])
// 				),
// 				el("+div").addClass("fieldSet").append(
// 					el.join([
// 						el("+h2").text("Default Thumbnail Name"),
// 						el("+input#thumbnailName").addClass("thumbnailName").attr("name", "thumbnailName"),
// 						el("+div").addClass(["select_cont", "inline-block"]).append( el("+select#default-thumbnail-ext") )
// 					])
// 				),
// 			])
// 		);
// 		return currentPanel;
// 	} 

// 	else if(_newPanel === "window"){

// 		currentPanel = el("+form#windowForm").addClass("window").append(
// 			el("+label").text("Window Thing").append( el("+input") )
// 		);
// 		return currentPanel;

// 	}
// }


// // --------------------------------
// //		APPLY THE BUILT PANNEL
// // --------------------------------
// panel.setPanel = function(next, _newPanel) {
// 	panel.purge().append(_newPanel);
// 	next();
// }




// // --------------------------------
// //		INSERT DATA INTO PANEL
// // --------------------------------
// panel.insertData = function(_panel){
// 	if(_panel === "QTS"){

// 	} else if(_panel === "files"){

// 		// add path to Brands folder
// 		var pathToBrands = currentPanel.el("#path-to-brands").attr("value",core.localData.brands.path);

// 		// Populate the preview files and select the default		
// 		var defaultPreviewFile = currentPanel.el("#default-preview-file");
// 		// ADD OPTIONS
// 		var tempArray = [];		
// 		for(var i = 0, ii = core.localData.userSettings.files.previewFiles.length; i < ii; i++ ){
// 			var pF = core.localData.userSettings.files.previewFiles;			
// 			var currentOption = el("+option").attr("value", pF[i].fileName).text( pF[i].verboseName );
// 			if( pF[i].fileName === core.localData.userSettings.files.defaultPreviewFile ) currentOption.selected = true;
// 			tempArray.push(currentOption);	
// 		}		

// 		defaultPreviewFile.append( el(tempArray) );		


// 		currentPanel.el("#path-to-brands").on("blur", function(){
// 			if(this.value !== core.localData.brands.path){
// 				core.localData.brands.path = core.localData.userSettings.files.brands.path = this.value;
// 			}
// 		});

// 		currentPanel.el("#default-preview-file").on("blur", function(){
// 			if(this.options[this.selectedIndex].value !== core.localData.userSettings.files.defaultPreviewFile){
// 				core.localData.userSettings.files.defaultPreviewFile = this.options[this.selectedIndex].value;
// 			}
// 		});

// 	}


// 	else if(_panel === "previewFiles") {

// 		console.log("preview files?")
// 		var previewFilesCont = currentPanel.el("#previewFilesCont");
// 		var path = appRoot+"/local/preview-files"; 
// 		var fileList = [];
// 		fs.readdir(path, function(_err, _files){
// 			if(_err) console.log("error listing preview files");
// 			for(var i = 0, ii = _files.length; i < ii; i++){
// 				var stats = fs.statSync(path+"/"+_files[i]);
// 				if(stats.isFile() && _files[i].charAt(0) !== ".") fileList.push(_files[i]);
// 			}

// 			for(var i = 0, ii = fileList.length; i < ii; i++){
// 				previewFilesCont.append(
// 					el("+div").addClass("file-item").append(
// 						el.join([
// 							el("+div#previewfile-"+i).addClass("delete-file"),
// 							el("+label").addClass("file-name").text(fileList[i]).attr("for","previewfile-"+i)
// 						])
// 					)
// 				);
// 			}

// 			// loop through files list and populate preview files list container 
// 			console.log("preview files list:",fileList);
// 		});

// 	}



// 	else if(_panel === "snippets"){

// 	} 



// 	else if(_panel === "manage-snippets"){

// 		var snippetsListCont = currentPanel.el("#snippetsListCont");
// 		var snippetsList = core.localData.snippets.list;

// 		var frag = document.createDocumentFragment();



		// for(var i = 0, ii = snippetsList.length; i < ii; i++){

		// 	var snippetItem = el("+div").addClass("snippet-item").attr("data-id",snippetsList[i].id).attr("data-type",snippetsList[i].type).attr("data-name",snippetsList[i].name).attr("data-index",i)
		// 		.append(
		// 			el("+div").addClass("snippet_name").text(snippetsList[i].name)
		// 		).append(
		// 			el("+div").addClass("snippet-type").text(snippetsList[i].type)
		// 		)

		// 		// CLICK snippet button
		// 		.on("click", function(){
		// 			var self = this;

		// 			el(".snippet-item").each(function(item){
		// 				item.rmClass("selected")
		// 			})
		// 			self.addClass("selected");

		// 			var _index;
		// 			var thisSnippet;
		// 			var matchingSnippet = core.localData.snippets.list.some(function(snip, index){
		// 				if(self.dataset.id === snip.id) {
		// 					thisSnippet = snip;
		// 					_index=index;
		// 					return true;
		// 				}
		// 			});
		// 			console.log("thisSnippet",thisSnippet);

		// 			console.log("index",_index)
		// 			Snippet.init();
		// 			Snippet.setName(thisSnippet.name);
		// 			Snippet.setId(thisSnippet.id);
		// 			Snippet.setType(thisSnippet.type);
		// 			Snippet.setCode(thisSnippet.code);
		// 			Snippet.setIndex(_index);
		// 			Snippet.current.element = self;


		// 			snippetCodemirror.setValue(Snippet.current.code);
		// 			document.getElementById("snippetRadio-"+Snippet.current.type).checked = true;
		// 			document.getElementById("snippetName").value = Snippet.current.name;

		// 		});
		// 	frag.appendChild(snippetItem);
		// 	frag.appendChild(el("+hr"));

		// }

// 		// Create New Snippet Button
// 		frag.appendChild(
// 			el("+div").addClass(["snippet-item", "addNew"]).text("ADD NEW SNIPPET").on("click", function(){
// 					var self = this;
// 					el(".snippet-item").each(function(item){
// 						item.rmClass("selected")
// 					})
					
					

// 					function addNewSnippet(){
// 						var i = core.localData.snippets.list.length;

// 						// generate random string

// 						var snippetItem = el("+div").addClass(["snippet-item", "selected"]).attr("data-id","renadomness").attr("data-type","css").attr("data-name","snippet").attr("data-index",i)
// 						.append(
// 							el("+div").addClass("snippet_name").text("New Snippet (not saved)")
// 						).append(
// 							el("+div").addClass("snippet-type").text("css")
// 						);


// 						var thisSnippet = {
// 							name: "",
// 							id: "",
// 							type: "css",
// 							code: "/*code here*/"
// 						};

// 						Snippet.init();
// 						Snippet.setName(thisSnippet.name);
// 						Snippet.setId(thisSnippet.id);
// 						Snippet.setType(thisSnippet.type);
// 						Snippet.setCode(thisSnippet.code);
// 						Snippet.setIndex(i);
// 						Snippet.current.element = snippetItem;



// 						// CLICK snippet button
// 						snippetItem.on("click", function(){
// 							var self = this;

// 							el(".snippet-item").each(function(item){
// 								item.rmClass("selected")
// 							})
// 							self.addClass("selected");

// 							var _index;
// 							var thisSnippet;
// 							var matchingSnippet = core.localData.snippets.list.some(function(snip, index){
// 								if(self.dataset.id === snip.id) {
// 									thisSnippet = snip;
// 									_index=index;
// 									return true;
// 								}
// 							});
// 							console.log("thisSnippet",thisSnippet);

// 							console.log("index",_index)
// 							Snippet.init();
// 							Snippet.setName(thisSnippet.name);
// 							Snippet.setId(thisSnippet.id);
// 							Snippet.setType(thisSnippet.type);
// 							Snippet.setCode(thisSnippet.code);
// 							Snippet.setIndex(_index);
// 							Snippet.current.element = self;

// 							console.log("Snippet.current",Snippet.current);


// 							snippetCodemirror.setValue(Snippet.current.code);
// 							document.getElementById("snippetRadio-"+Snippet.current.type).checked = true;
// 							document.getElementById("snippetName").value = Snippet.current.name;

// 						});

// 						var container = currentPanel.el("#snippetsListCont");
// 						container.insertBefore(el("+hr"), container.firstChild)
// 						container.insertBefore(snippetItem, container.firstChild)
						
// 					// frag.appendChild(snippetItem);
// 					// frag.appendChild(el("+hr"));
// 					}
// 					addNewSnippet();


// 					document.getElementById("snippetRadio-"+Snippet.current.type).checked = true;
// 					document.getElementById("snippetName").value = "";
// 					snippetCodemirror.setValue(Snippet.current.code);
// 					console.log("Snippet.current",Snippet.current)
// 				})
// 		)


// 		snippetsListCont.append(frag);

// 	}


// 	else if(_panel === "preview"){
// 		currentPanel.el("#"+core.localData.userSettings.preview.refreshPreview).checked = true;
// 		currentPanel.el("#thumbnailName").attr("value", core.localData.userSettings.preview.defaultThumbnailName);

// 		var defaultThumbnailExt = currentPanel.el("#default-thumbnail-ext");
// 		// ADD OPTIONS
// 		var tempArray = [];		
// 		for(var i = 0, ii = core.localData.userSettings.preview.thumbnailExtensions.length; i < ii; i++ ){
// 			var tnE = core.localData.userSettings.preview.thumbnailExtensions;		
// 			var currentOption = el("+option").attr("value", tnE[i]).text( tnE[i] );
// 			if( tnE[i] === core.localData.userSettings.preview.defaultThumbnailExt ) currentOption.selected = true;
// 			tempArray.push(currentOption);
// 		}		
// 		defaultThumbnailExt.append( el(tempArray) );		



// 		currentPanel.el("#onSave").on("focus", function(){
// 		if(core.localData.userSettings.preview.refreshPreview !== this.id){
// 			core.localData.userSettings.preview.refreshPreview = this.id;
// 		}
// 	});
// 	currentPanel.el("#onCommand").on("focus", function(){
// 		if(core.localData.userSettings.preview.refreshPreview !== this.id){
// 			core.localData.userSettings.preview.refreshPreview = this.id;
// 		}
// 	});


// 	} else if(_panel === "window"){

// 	}

// }


// // --------------------------------
// // ELIFY APPENDED CHECK/RADIO BTNS
// // --------------------------------
// function checkAndRadio(){
// 	el(document.querySelectorAll("input[type=radio]"))
// }







var bottomBar = (function(){

	// Cancel Button
	var cancelBtn = etc.template(function(){
		return etc.el("div", {
			id:"cancel",className:"btn",
			events: {
				click: function(){
					Eve.emit("cancelAll");
				}
			}
		}, "cancel changes");
	})


	// Save Button
	var saveBtn = etc.template(function(){
		return etc.el("div", {
			id:"save",className:"btn",
			events: {
				click: function(){
					Eve.emit("saveAll");
				}
			}
		}, "save changes");
	})


	// Buttons Container
	var bottomBarCont = etc.template(function(){
		var elm = etc.el("section", {
			id:"bottom-bar", className:"hide",
			events: {
				attached: function(){
					this.classList.remove("hide");
				}
			}
		});

		return elm.append([
			cancelBtn.render(), saveBtn.render()
		]);
	});




	Eve.on("init", function(){
		bottomBarCont.render(null, document.body);
	});

})();




// // --------------------
// // main panel
// // --------------------
// var manageSnippetsCont = etc.template(function(){
// 	return etc.el("form",{id:"snippetsForm",className:"snippets"}).append([
// 		snippetListCont.render(),
// 		snippetInfoCont.render(),
// 		snippetCodemirror.render(),
// 		saveSnippetBtn.render()
// 	]);
// });


// var snippetListCont = etc.template(function(){
// 	return etc.el("div",{id:"snippetsListCont"});
// });



// var snippetInfoCont = etc.template(function(){
// 	return etc.el("div",{id:"snippetInfo"});
// });


// var snippetNameField = etc.template(function(){
// 	return etc.el("input",{
// 		id:"snippetName", placeholder:"Snippet Name",
// 		events: {
// 			keyup: function(){
// 				console.log("keyup");
// 			},
// 			paste: function(){
// 				console.log("paste");
// 			}
// 		}
// 	});
// });




// var snippetTypeRadios = etc.template(function(){

// 	var container = etc.el("div",
// 	{
// 		id:"snippetTypeCont",
// 		events: {
// 			keyup: function(){
// 				console.log("keyup");
// 			},
// 			paste: function(){
// 				console.log("paste");
// 			}
// 		}
// 	});

// 	var cssCont = etc.el("label",{id:"snippetType-css"},"css").append(
// 		etc.el("input",{id:"snippetRadio-css", type:"radio", value: "css", name: "snippet-radio"})
// 	);

// 	var jsCont = etc.el("label",{id:"snippetType-js"},"JS").append(
// 		etc.el("input",{id:"snippetRadio-js", type:"radio", value: "js", name: "snippet-radio"})
// 	);

// 	return container.render().append([
// 		cssCont.render(), jsCont.render()
// 	]);
// });



// var snippetCodemirror = etc.template(function(){
// 	return etc.el("div", {id:"snippetCodemirror"});
// });


// var saveSnippetBtn = etc.template(function(){
// 	return etc.el("button", {id:"saveSnippet", onclick:function(){ Snippet.saveToLocal(); }}, "Save Snippet");

// });  


var Data = (function(){
	var snippetsList;
	var currentSnippet = null;
	var preferencesData;
	var pathToBrands;
	var previewFilesList = [];



	var local = {
		// read preferences and persistent data
		init: function(){
			console.log("init local data");
			fs.readFile(__dirname+"/local/persistent-data.json", function(_err, _data){
				if(!_err) {
					snippetsList = JSON.parse(_data).snippets;
				}
				else {
					console.log("local init ERROR:",_err);
				}
			});

			fs.readdir(__dirname+"/local/preview-files", function(_err, _files){
				if(_err) return console.error("local init ERROR:",_err);
				for(var i = 0, ii = _files.length; i < ii ; i++){
					var stats = fs.statSync(__dirname+"/local/preview-files"+"/"+_files[i]);
					if(stats.isFile() && _files[i].charAt(0) !== ".") previewFilesList.push(_files[i]);
				}
			});

			fs.readFile(__dirname+"/local/user-settings.json", function(_err, _data){
				if(_err) return console.error("local init ERROR:",_err);
				preferencesData = JSON.parse(_data);
				pathToBrands = preferencesData.files.brands.path;
				console.log("preferencesData:",preferencesData);
			});
		}
	};

	function saveLocalToFiles(){
		sanitizeSnippets();

		fs.readFile(__dirname+"/local/persistent-data.json", function(_err, _data){
			if(!_err) {
				var persData = JSON.parse(_data);
				persData.snippets = snippetsList;
				persData = JSON.stringify(persData);

				fs.writeFile(__dirname+"/local/persistent-data.json",persData,function(_err){
					if(!_err){

						fs.writeFile(__dirname+"/local/user-settings.json",JSON.stringify(preferencesData),function(_err){
							if(!_err){

								document.getElementById('Q-logo').classList.add("saved");
								setTimeout(function(){
									Global.mainWindow.webContents.executeJavaScript("Eve.emit('Preferences Saved');");
									Global.preferencesWindow.close();
								}, 450);

							}
							else {
								alert("Save Error!")
							}
						});
								
					} else {
						console.log("ERROR", _err);
					}
				})

			}
			else {
				console.log("local init ERROR:",_err);
			}
		});
		console.log("saving local data to disk");
	}

	function cancelAll(){
		Eve.off("saveAll", saveLocalToFiles);
		console.log("cancel all changes");
		document.getElementById('Q-logo').classList.add("deleted");
		setTimeout(function(){
			Global.preferencesWindow.close();
		}, 200);
	}

	function sanitizeSnippets(){
		currentSnippet = null;
		snippetsList.forEach(function(snip, i, arr){
			if(snip.name === ""){
				snip.name = snip.id;
			}
			if(snip.type === ""){
				snip.type = "css";
			}
		});
	}



	Eve.on("init", local.init);
	Eve.on("saveAll", saveLocalToFiles);
	Eve.on("cancelAll", cancelAll);



	// CREATE NEW SNIPPET
	Eve.on("createNewSnippet", function(){
		console.log("creating new snippet");
		var snippetItems = document.getElementsByClassName("snippet-item");
		for(var i = 0, ii = snippetItems.length; i < ii; i++){
			snippetItems[i].classList.remove("selected");
		}
		document.getElementById('snippetName').classList.remove("error");
		var snippetID = ((Date.now() * (Math.random()+1)).toString(36).substring(0,8)) + "-" + ((Date.now() * (Math.random()+1)).toString(36).substring(0,4));
		var snippetItem = etc.el("div", {
			className:"snippet-item selected",
			dataset: {
				id: snippetID
			},
			events: {
				click: function(){
					var currentSnippet = Data.getCurrentSnippet()
					if( currentSnippet === null || currentSnippet.name.trim().search(/[\w\s]+/i) !== -1 ){
					
						var snippetItems = document.getElementsByClassName("snippet-item");
						for(var i = 0, ii = snippetItems.length; i < ii; i++){
							snippetItems[i].classList.remove("selected");
						}
						this.classList.add("selected");
							
						Eve.emit("selectedSnippet", this.dataset.id);
					} else {
						console.log("current snippet name invalid");
						Eve.emit("snippetNameInvalid");
					}
					
				}
			}
		}).append([
			etc.el("div", {className:"snippet_name"}, "No Name"),
			etc.el("div", {className:"snippet-type"}, "css")
		]);
		snippetsList.push({name:"", type:"css", id:snippetID, code: ""});
		var snippetsListCont = document.getElementById("snippetsListCont").append(snippetItem);
		console.log("snippetItem",snippetItem);
		var click = new MouseEvent("click", {
	    bubbles: true,
	    cancelable: true,
	    view: window,
	  });
		snippetItem.dispatchEvent(click);
	});





	Eve.on("selectedSnippet", function(_id){
		var inactiveElements = document.getElementsByClassName("inactive-no_snippet");
		while(inactiveElements.length > 0){
			inactiveElements[0].classList.remove("inactive-no_snippet");
		}

		//remove highlighting from all snippet items
		document.getElementById('snippetName').classList.remove("error");

		//find the snippet in the local snippet list and set it to currentSnippet
		currentSnippet = snippetsList.filter(function(snip, ind, arr){
			if(snip.id === _id) return true;
		})[0];

		//update the editor area
		document.getElementById('snippetName').value = currentSnippet.name;
		document.getElementById('snippetRadio-'+currentSnippet.type).checked = true;
		if(currentSnippet.type === "css"){
			snippetCodemirror.setOption("mode","text/x-scss");
		} else if(currentSnippet.type === "js"){
			snippetCodemirror.setOption("mode","javascript");
		}
		snippetCodemirror.setValue(currentSnippet.code);
	});




	Eve.on("deleteCurrentSnippet", function(){
		if(currentSnippet === null) {
			return;
		}

		//update the snippet in localData array
		snippetsList.some(function(snip, index, arr){
			if(currentSnippet.id === snip.id ){

				var qLogo = document.getElementById('Q-logo');
				qLogo.classList.add("deleted");
				setTimeout(function(){
					qLogo.classList.remove("deleted");
				}, 200);

				
				// update the snippet info in the list of snippets
				var snippetItems = document.getElementsByClassName("snippet-item");
				for(var i = 0, ii = snippetItems.length; i < ii; i++){
					if(snippetItems[i].dataset.id === currentSnippet.id) {
						snippetItems[i].parentNode.removeChild(snippetItems[i]);
					}
				}


				snippetsList.splice(index, 1);
				currentSnippet = null;

				document.getElementById('deleteSnippetBtn').classList.add("inactive-no_snippet");
				document.getElementById('saveSnippetBtn').classList.add("inactive-no_snippet");
				document.getElementById('snippetEditSection').classList.add("inactive-no_snippet");

				

				return true;
			}
		});
	});




	Eve.on("saveCurrentSnippet", function(){
		if(currentSnippet === null) {
			return;
		}
		//get name from input field
		currentSnippet.name = document.getElementById('snippetName').value.trim();

		//get type from radio buttons
		var snippetRadios = document.getElementsByClassName("snippet-radio");
		console.log("snippetsRadios:",snippetRadios);
		for(var i = 0, ii = snippetRadios.length; i < ii; i++){
			console.log("snippetRadios[i];",snippetRadios[i]);
			if(snippetRadios[i].checked) currentSnippet.type = snippetRadios[i].value;
		}
		console.log("currentSnippet.type:",currentSnippet.type);

		//get code from codemirror
		currentSnippet.code = snippetCodemirror.getValue();

		//update the snippet in localData array
		snippetsList.some(function(snip, index, arr){
			if(currentSnippet.id === snip.id ){
				snippetsList[index] = currentSnippet;
				return true;
			}
		});

		// update the snippet info in the list of snippets
		var snippetItems = document.getElementsByClassName("snippet-item");
		for(var i = 0, ii = snippetItems.length; i < ii; i++){
			if(snippetItems[i].dataset.id === currentSnippet.id) {
				snippetItems[i].getElementsByClassName("snippet_name")[0].textContent = currentSnippet.name;
				snippetItems[i].getElementsByClassName("snippet-type")[0].textContent = currentSnippet.type;
			}
		}

		var qLogo = document.getElementById('Q-logo');
		qLogo.classList.add("saved");
		setTimeout(function(){
			qLogo.classList.remove("saved");
		}, 400);
	});



	Eve.on("snippetArrowUp", function(){
		console.log("currentSnippet",currentSnippet);
		if(currentSnippet === null || snippetsList[0].id === currentSnippet.id) return;
		else {
			var snippetItem = {};
			var snippetItems = document.getElementsByClassName("snippet-item");

			for(var i = 0, ii = snippetItems.length; i < ii; i++){
				if(snippetItems[i].dataset.id === currentSnippet.id) {
					snippetItem.element = snippetItems[i];
					snippetItem.index = i;
				}
			}

			var previousSibling = snippetItem.element.previousSibling;
			var parentNode = snippetItem.element.parentNode;
			parentNode.removeChild(snippetItem.element);
			parentNode.insertBefore(snippetItem.element,previousSibling);

			snippetItem.element.scrollIntoView();

			currentSnippet = snippetsList.splice(snippetItem.index, 1)[0];
			snippetsList.splice((snippetItem.index-1), 0, currentSnippet);

			for(var i = 0, ii = snippetItems.length; i < ii; i++){
				if (i < 10) {
					// if(i === 0) snippetItems[i].classList.add("first");
					// else if(i === 9) snippetItems[i].classList.add("top10");
					snippetItems[i].classList.add("top10");
				}
				else {
					snippetItems[i].classList.remove("top10");
				}
			}
		}
	});



	Eve.on("snippetArrowDown", function(){
		console.log("currentSnippet",currentSnippet);
		if(currentSnippet === null || snippetsList[snippetsList.length-1].id === currentSnippet.id) return;
		else {
			var snippetItem = {};
			var snippetItems = document.getElementsByClassName("snippet-item");

			for(var i = 0, ii = snippetItems.length; i < ii; i++){
				if(snippetItems[i].dataset.id === currentSnippet.id) {
					snippetItem.element = snippetItems[i];
					snippetItem.index = i;
				}
			}

			

			var nextSibling = snippetItem.element.nextSibling;
			var parentNode = snippetItem.element.parentNode;
			parentNode.removeChild(snippetItem.element);
			parentNode.insertBefore(snippetItem.element,nextSibling.nextSibling);

			currentSnippet = snippetsList.splice(snippetItem.index, 1)[0];
			snippetsList.splice((snippetItem.index+1), 0, currentSnippet);

			snippetItem.element.scrollIntoView(false);

			
			for(var i = 0, ii = snippetItems.length; i < ii; i++){
				if (i < 10) {
					snippetItems[i].classList.add("top10");
				}
				else {
					snippetItems[i].classList.remove("top10");
				}
			}

		}
	});



	Eve.on("manageSnippetsInit", sanitizeSnippets);

	Eve.on("pathToBrands-inputChange", function(){
		pathToBrands = preferencesData.files.brands.path = document.getElementById("path-to-brands").value;
	});



	return {
		getSnippets: function(){
			return snippetsList;
		},

		getCurrentSnippet: function(){
			return currentSnippet;
		},

		getPreviewFiles: function(){
			return previewFilesList;
		},

		getPathToBrands: function(){
			return pathToBrands;
		}

	}

})();
var nav = (function(){

	var navQTS = etc.template(function(){
		return etc.el("div", {
			id:"QTS-option", className:"nav_option", 
			dataset:{panel:"qts"}, 
			events:{
				click: function(){
					Eve.emit("navSelect", this.dataset.panel);
					this.classList.add("current");
				}
			}
		}, "QTS");
	});

	var navFiles = etc.template(function(){
		return etc.el("div", {id:"files-option", className:"nav_option", 
			dataset:{panel:"files"}, 
			events:{
				click: function(){
					Eve.emit("navSelect", this.dataset.panel);
					this.classList.add("current");
				}
			}
		}, "Files");
	});

	var navSnippets = etc.template(function(){
		return etc.el("div", {id:"snippets-option", className:"nav_option", 
			dataset:{panel:"snippets"}, 
			events:{
				click: function(){
					Eve.emit("navSelect", this.dataset.panel);
					this.classList.add("current");
				}
			}
		}, "Snippets");
	});

	var navPreview = etc.template(function(){
		return etc.el("div", {id:"preview-option", className:"nav_option", 
			dataset:{panel:"preview"}, 
			events:{
				click: function(){
					Eve.emit("navSelect", this.dataset.panel);
					this.classList.add("current");
				}
			}
		}, "Preview");
	});

	var navWindow = etc.template(function(){
		return etc.el("div", {id:"window-option", className:"nav_option", 
			dataset:{panel:"window"}, 
			events:{
				click: function(){
					Eve.emit("navSelect", this.dataset.panel);
					this.classList.add("current");
				}
			}
		}, "Window");
	});


	var navTemplate = etc.template(function(){
		var navCont = etc.el("nav", {
			id:"nav", className:"hide",
			events: {
				attached: function(){
					this.classList.remove("hide");
				}
			}
		});
		return navCont.append([
			navQTS.render(),
			navFiles.render(),
			navSnippets.render(),
			navPreview.render(),
			navWindow.render()
		]);
	});


	Eve.on("navSelect", function(_selectedNav){
		var navOptions = document.getElementsByClassName("nav_option");
		for(var i = 0, ii = navOptions.length; i < ii; i++) {
			navOptions[i].classList.remove("current");
		}
	})

	Eve.on("init", function(){
		navTemplate.render(null, document.body);
	});


})();


/***************** 
Panel Main
*****************/
var panel = (function(){

	/*
	MAIN PANEL TEMPLATE
	*/
	var panelTemplate = etc.template(function(){

		var panelCont = etc.el("section", {
			id:"panel", className:(this.props.className)?this.props.className:"",
			events: {
				attached: function(){
					this.classList.remove("hide");
				}
			}
		});

		return panelCont.append(this.props.panel.render());
		
	});


	/*
	Panel Inner-Templates
	*/
	var splashPanel = etc.template(function(){
		return etc.el("div", {id:"preferences_splash"}, "PREFERENCES");
	});

		



	var previewPanel = etc.template(function(){
		return etc.el("div", {id:"preferences_splash"}, "PREVIEW");
	});

	var windowPanel = etc.template(function(){
		return etc.el("div", {id:"preferences_splash"}, "WINDOW");
	});





	
	/* 
	Set Panel State
	*/
	function setPanel(selected_nav){
		var panelMap = {
			splash: splashPanel,
			qts: QTS_Panel.QTS_Panel_Template,
			files: FilesPanel.mainTemplate,
			managePreviewFiles: FilesPanel.previewFilesTemplate,
			snippets: SnippetsPanel.main,
			manageSnippets: SnippetsPanel.manageSnippets,
			preview: previewPanel,
			window: windowPanel
		};

		if(panelMap.hasOwnProperty(selected_nav)){
			panelTemplate.render({panel:panelMap[selected_nav]}, document.body);
		} 
	}


	//SUB PUB EVENTS
	Eve.on("init", function(){
		panelTemplate.render({panel:splashPanel, className:"hide"}, document.body);
	});
	Eve.on("navSelect", setPanel);
	Eve.on("selectPanel", setPanel);


})();


// 	else if(_newPanel === "previewFiles"){
// 		currentPanel = el("+form#previewFilesForm").addClass("files");
// 		//Path To Brands
// 		currentPanel.append( 
// 			el("+div").addClass("previewFilesLabel").append( 
// 				el.join([
// 					el("+div").text("Preview Question Files"),
// 					el("+div#previewFilesCont").addClass("fileListContainer")
// 				])
				 
// 			) 
// 		);

// 		return currentPanel;
// 	}
/*****************
QTS Panel
*****************/
var QTS_Panel = (function(){

	var QTS_Panel_Template = etc.template(function(){
		return etc.el("label", {
			id:"user_name"
		}, "Your Name").append(
			etc.el("input", {
				id:"user_name_input",
				placeholder:"Name"
			})
		);
	});	



	return {
		QTS_Panel_Template: QTS_Panel_Template
	}
})();


/*****************
Files Panel
*****************/
var FilesPanel = (function(){

	// main template
	var filesTemplate = etc.template(function(){
		var container = etc.el("form", {id:"filesForm", className:"files"});
		container.append([
			etc.el("label", {id:"path-to-brands-label"}).append([
				etc.el("div", {},"path to Brands"),
				etc.el("span", {id:"homeDirectory"}, process.env.HOME+"/ "),
				etc.el("input", {
					id:"path-to-brands", value:Data.getPathToBrands(),
					events: {
						blur: function(){
							Eve.emit("pathToBrands-inputChange");
						},
						keyup: function(){
							Eve.emit("pathToBrands-inputChange");
						},
						paste: function(){
							Eve.emit("pathToBrands-inputChange");
						}
					}
				})
			]),
			etc.el("br")
		]);


		container.append( 
			etc.el("button",{id:"managePreviewFiles", className:"btn", events:{
				click: function(e){
					e.preventDefault();
					Eve.emit("selectPanel", "managePreviewFiles")
				}
			}}, "Manage Preview Files")
		);

		container.append( 
			etc.el("button",{id:"manageBaseFiles", className:"btn"}, "Manage Base Files")
		);
		

		return container;
	});




	//manage preview files template
	var previewFilesTemplate = etc.template(function(){
		var filesList = Data.getPreviewFiles();

		var previewFilesCont = etc.el("div", {id:"previewFilesCont", className:"fileListContainer"})
		//
		.append("THIS IS NOT YET FUNCTIONAL!")
		//
		;

		for(var i = 0, ii = filesList.length; i < ii; i++){
			previewFilesCont.append(
				etc.el("div", {className:"file-item", dataset:{name:filesList[i]}},filesList[i])
			);
		}

		var container = etc.el("form", {id:"previewFilesForm", className:"files"});
		container.append( 
			etc.el("div", {className:"previewFilesLabel"}).append([
				etc.el("div", {},"Preview Question Files"),
				previewFilesCont
			])
		);

		var editBtnsCont = etc.el("div", {id:"editBtnsCont"}).append([
			etc.el("div", {id:"deletePreviewFile-btn", className:"btn"}, "Delete File")
		]);
		container.append(
			etc.el("section", {id:"edit-preview-files"}).append([
				editBtnsCont
			])
		)

		return container;
	});

	return {
		mainTemplate: filesTemplate,
		previewFilesTemplate: previewFilesTemplate,
	};
})();





/***************** 
Snippets Panel
*****************/
var SnippetsPanel = (function(){


	var mainTemplate = etc.template(function(){
		var container = etc.el("form", {id:"snippetsForm", className:"snippets"});

		var manageSnippetsBtn = etc.el("button",{events:{
			click:function(e){
				e.preventDefault();
				Eve.emit("selectPanel", "manageSnippets")
			}
		}},"Manage Snippets");

		var manageKeybindingsBtn = etc.el("button",{events:{
			click:function(e){
				e.preventDefault();
				alert("Not yet functional. Sorry.")
				// Eve.emit("selectPanel", "manageSnippets")
			}
		}},"Manage Key Bindings");

		return container.append([
			manageSnippetsBtn,
			manageKeybindingsBtn
		]);
	});

	

	var manageSnippetsTemplate = etc.template(function(){

		Eve.emit("manageSnippetsInit");

		var manageSnippetsCont = etc.el("form", {id:"snippetsForm", className:"snippets"});

		var snippetListCont = etc.el("div", {id:"snippetsListCont"});
		var snippetsList = Data.getSnippets();



		for(var i = 0, ii = snippetsList.length; i < ii; i++){

			var snippetItem = etc.el("div", {
				className:"snippet-item",
				dataset: {
					id:snippetsList[i].id
				},
				events: {
					click: function(){
						var currentSnippet = Data.getCurrentSnippet()
						if( currentSnippet === null || currentSnippet.name.trim().search(/[\w\s]+/i) !== -1 ){
						
							if(currentSnippet !== null){
								console.log("current snippet NAME:", currentSnippet.name.trim());
								console.log("selected snippet MATCH:",currentSnippet.name.trim().match(/[\w\s]+/i));
							}
							var snippetItems = document.getElementsByClassName("snippet-item");
							for(var i = 0, ii = snippetItems.length; i < ii; i++){
								snippetItems[i].classList.remove("selected");
							}
							this.classList.add("selected");
							Eve.emit("selectedSnippet", this.dataset.id);
						} else {
							console.log("current snippet name invalid");
							Eve.emit("snippetNameInvalid");
						}
						
					}
				}
			}).append([
				etc.el("div", {className:"snippet_name"}, snippetsList[i].name),
				etc.el("div", {className:"snippet-type"}, snippetsList[i].type)
			]);
			snippetListCont.append(snippetItem);
		}

		var snippetEditSection = etc.el("section", {id:"snippetEditSection", className:"inactive-no_snippet"});
		var snippetInfo = etc.el("div", {id:"snippetInfo"});
		var snippetNameField = etc.el("input", {
			id:"snippetName", placeholder:"Snippet Name"
		});
		var snippetTypeCont = etc.el("div",{id:"snippetTypeCont"}).append([
			// css radio
			etc.el("label",{id:"snippetType-css"},"CSS").append(
				etc.el("input",{
					id:"snippetRadio-css", className:"snippet-radio", type:"radio", value: "css", name: "snippet-radio",
					events: {
						click: function(){
							snippetCodemirror.setOption("mode","text/x-scss");
						}
					}
				})
			),
			// js radio
			etc.el("label",{id:"snippetType-js"},"JS").append(
				etc.el("input",{
					id:"snippetRadio-js", className:"snippet-radio", type:"radio", value: "js", name: "snippet-radio",
					events: {
						click: function(){
							snippetCodemirror.setOption("mode","javascript");
						}
					}
				})
			)
		])

		var snippetArrows = etc.el("div", {id:"snippetArrowsCont"}).append([
			etc.el("div",{id:"snippetArrowUp", events:{click: function(){Eve.emit("snippetArrowUp");}}, innerHTML:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 35 43" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path d="M23.079,42.366l-11.604,0l0,-17.924l-10.775,0l16.577,-24.231l16.577,24.231l-10.775,0l0,17.924Z" /></svg>'}),
			etc.el("div",{id:"snippetArrowDown", events:{click: function(){Eve.emit("snippetArrowDown");}}, innerHTML:'<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 35 43" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path d="M23.079,42.366l-11.604,0l0,-17.924l-10.775,0l16.577,-24.231l16.577,24.231l-10.775,0l0,17.924Z" /></svg>'})
		])

		var snippetCodemirrorCont = etc.el("div", {
			id:"snippetCodemirror", 
			events: {
				attached: function(){
					var self = this;
					
					
					window.snippetCodemirror = CodeMirror(self, {
						mode: "css",
						theme: "monokai",
						tabSize: 2,
						indentWithTabs: true,
						keyMap: "sublime",
						lineWrapping: true,
						lineNumbers: true,
						autoCloseBrackets: true
					});

					setTimeout(function(){
						snippetCodemirror.on("change", function(){
							console.log("changed codemirror");
							// Snippet.setCode(snippetCodemirror.getValue());
						})
					}, 0);

				}
			}
		});

		var snippetBtnsCont = etc.el("section", {id:"snippetBtnsCont"}).append([
			etc.el("div", {
				id:"newSnippetBtn", className:"btn",
				events: {
					click: function(){
						var currentSnippet = Data.getCurrentSnippet()
						if( currentSnippet === null || currentSnippet.name.trim().search(/[\w\s]+/i) !== -1 ){
							Eve.emit("createNewSnippet");

						} else {
							Eve.emit("snippetNameInvalid");
						}
					}
				}
			}, "New"),
			etc.el("div", {id:"deleteSnippetBtn", className:"btn inactive-no_snippet",
				events: {
					click: function(){
						if(this.classList.contains("inactive-no_snippet")) return;
						Eve.emit("deleteCurrentSnippet");
					}
				}
			}, "Delete"),
			etc.el("div", {id:"saveSnippetBtn", className:"btn inactive-no_snippet",
				events: {
					click: function(){
						if(this.classList.contains("inactive-no_snippet")) return;
						var currentSnippet = Data.getCurrentSnippet();
						var errors = 0;
						//get type from radio buttons
						var snippetRadios = document.getElementsByClassName("snippet-radio");
						if(currentSnippet !== null && !snippetRadios[0].checked && !snippetRadios[1].checked){
							errors++;
							alert("Select Snippet Type (CSS or JavaScript)")
						}

						var snippetNameField = document.getElementById('snippetName');
						if( currentSnippet !== null ){	
							console.log("currentSnippet",currentSnippet);
							if(snippetNameField.value.trim().search(/[\w\s]+/i) === -1){
								errors++;
								Eve.emit("snippetNameInvalid");
							}
						} 

						if(errors === 0){
							Eve.emit("saveCurrentSnippet");
						}
						
							

					}
				}
			}, "Save"),
		])

		return manageSnippetsCont.append([
			snippetListCont,
			snippetEditSection.append([
				snippetInfo.append([
					snippetNameField,
					snippetTypeCont,
					snippetArrows
				]),
				snippetCodemirrorCont
			]),
			snippetBtnsCont
		]);
	});

	var manageKeybindingsTemplate = etc.template(function(){

	});

	Eve.on("snippetNameInvalid", function(){
		console.log("invalid snippet name");
		document.getElementById('snippetName').classList.add("error");
	});

	// Eve.on("selectedSnippet", function(_id){
	// 	document.getElementById('snippetName').classList.remove("error");
	// 	var localSnippetsList = Data.getSnippets();
	// 	var selectedSnippet = localSnippetsList.filter(function(snip, ind, arr){
	// 		if(snip.id === _id) return true;
	// 	})[0];
	// 	currentSnippet = selectedSnippet;
	// 	console.log("selected snippet:",selectedSnippet);
	// })



	return {
		main: mainTemplate,
		manageSnippets: manageSnippetsTemplate,
		manageKeybindings: manageKeybindingsTemplate
	}
})();



