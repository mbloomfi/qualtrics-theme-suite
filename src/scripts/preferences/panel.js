/* 
Panel Main
*/
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

	var QTS_Panel = etc.template(function(){
		return etc.el("div", {id:"preferences_splash"}, "QTS");
	});

	var filesPanel = etc.template(function(){
		return etc.el("div", {id:"preferences_splash"}, "FILES");
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
		var navMap = {
			splash: splashPanel,
			qts: QTS_Panel,
			files: filesPanel,
			snippets: SnippetsPanel.main,
			manageSnippets: SnippetsPanel.manageSnippets,
			preview: previewPanel,
			window: windowPanel
		};

		if(navMap.hasOwnProperty(selected_nav)){
			panelTemplate.render({panel:navMap[selected_nav]}, document.body);
		} 
	}


	//SUB PUB EVENTS
	Eve.on("init", function(){
		panelTemplate.render({panel:splashPanel, className:"hide"}, document.body);
	});
	Eve.on("navSelect", setPanel);
	Eve.on("selectPanel", setPanel);


})();




/* 
Snippets Panel
*/
var SnippetsPanel = (function(){


	var mainTemplate = etc.template(function(){
		var container = etc.el("form", {id:"snippetsForm", className:"snippets"}, "Snippets");

		var manageSnippetsBtn = etc.el("button",{events:{
			click:function(e){
				e.preventDefault();
				Eve.emit("selectPanel", "manageSnippets")
			}
		}},"Manage Snippets");

		return container.append([
			manageSnippetsBtn
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

			// CLICK snippet button
			// .on("click", function(){
			// 	var self = this;

			// 	el(".snippet-item").each(function(item){
			// 		item.rmClass("selected")
			// 	})
			// 	self.addClass("selected");

			// 	var _index;
			// 	var thisSnippet;
			// 	var matchingSnippet = core.localData.snippets.list.some(function(snip, index){
			// 		if(self.dataset.id === snip.id) {
			// 			thisSnippet = snip;
			// 			_index=index;
			// 			return true;
			// 		}
			// 	});
			// 	console.log("thisSnippet",thisSnippet);

			// 	console.log("index",_index)
			// 	Snippet.init();
			// 	Snippet.setName(thisSnippet.name);
			// 	Snippet.setId(thisSnippet.id);
			// 	Snippet.setType(thisSnippet.type);
			// 	Snippet.setCode(thisSnippet.code);
			// 	Snippet.setIndex(_index);
			// 	Snippet.current.element = self;


			// 	snippetCodemirror.setValue(Snippet.current.code);
			// 	document.getElementById("snippetRadio-"+Snippet.current.type).checked = true;
			// 	document.getElementById("snippetName").value = Snippet.current.name;

			// });
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



