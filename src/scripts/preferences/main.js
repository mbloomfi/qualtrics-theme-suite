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



// --------------------------------
//				GLOBAL VARS
// --------------------------------
var remote = require("remote");
var app = remote.require("app");
var Global = remote.getGlobal("sharedObject"); //see index.js
var appRoot = Global.appRoot;
var fs = require("fs-extra");
var path = require("path");

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

		

// 		// codemirrorContainer.el("textarea").attr("tabindex","-1");
// 		setTimeout(function(){
// 			snippetCodemirrorCont.el("textarea").attr("tabindex", "-1");
// 			snippetCodemirror.on("change", function(){
// 				Snippet.setCode(snippetCodemirror.getValue());
// 			})
// 		}, 0);
		
// 		window.snippetCodemirror = CodeMirror(snippetCodemirrorCont, {
// 			mode: "css",
// 			theme: "monokai",
// 			tabSize: 2,
// 			indentWithTabs: true,
// 			keyMap: "sublime",
// 			lineWrapping: true,
// 			lineNumbers: true,
// 			autoCloseBrackets: true
// 		});




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



// 		for(var i = 0, ii = snippetsList.length; i < ii; i++){

// 			var snippetItem = el("+div").addClass("snippet-item").attr("data-id",snippetsList[i].id).attr("data-type",snippetsList[i].type).attr("data-name",snippetsList[i].name).attr("data-index",i)
// 				.append(
// 					el("+div").addClass("snippet_name").text(snippetsList[i].name)
// 				).append(
// 					el("+div").addClass("snippet-type").text(snippetsList[i].type)
// 				)

// 				// CLICK snippet button
// 				.on("click", function(){
// 					var self = this;

// 					el(".snippet-item").each(function(item){
// 						item.rmClass("selected")
// 					})
// 					self.addClass("selected");

// 					var _index;
// 					var thisSnippet;
// 					var matchingSnippet = core.localData.snippets.list.some(function(snip, index){
// 						if(self.dataset.id === snip.id) {
// 							thisSnippet = snip;
// 							_index=index;
// 							return true;
// 						}
// 					});
// 					console.log("thisSnippet",thisSnippet);

// 					console.log("index",_index)
// 					Snippet.init();
// 					Snippet.setName(thisSnippet.name);
// 					Snippet.setId(thisSnippet.id);
// 					Snippet.setType(thisSnippet.type);
// 					Snippet.setCode(thisSnippet.code);
// 					Snippet.setIndex(_index);
// 					Snippet.current.element = self;


// 					snippetCodemirror.setValue(Snippet.current.code);
// 					document.getElementById("snippetRadio-"+Snippet.current.type).checked = true;
// 					document.getElementById("snippetName").value = Snippet.current.name;

// 				});
// 			frag.appendChild(snippetItem);
// 			frag.appendChild(el("+hr"));

// 		}

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






