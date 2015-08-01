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
		return etc.el("div", {id:"preferences_splash"}, "MANAGE SNIPS");
	});

	var manageKeybindingsTemplate = etc.template(function(){

	});


	return {
		main: mainTemplate,
		manageSnippets: manageSnippetsTemplate,
		manageKeybindings: manageKeybindingsTemplate
	}
})();


console.log(SnippetsPanel);
