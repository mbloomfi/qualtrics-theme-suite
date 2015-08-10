// Init CodeMirror
function codemirrorInit() {
	window.codemirrorContainer = el("#codemirror-wrapper");

	// codemirrorContainer.el("textarea").attr("tabindex","-1");

	setTimeout(function(){
		codemirrorContainer.el("textarea").attr("tabindex", "-1");


		codemirrorContainer.addEventListener('contextmenu',function(e){
			e.stopPropagation();
			e.preventDefault();
			if(core.codeMirror.active){
				menu.popup(remote.getCurrentWindow());
			}
			// console.log("right clicked codemirror");
		}, true);

		var codeMirrorElement = document.querySelector(".CodeMirror").style.fontSize = "16px";


	}, 0);
	
	window.myCodeMirror = CodeMirror(codemirrorContainer, {
		mode: "css",
		theme: "monokai",
		tabSize: 2,
		indentWithTabs: true,
		keyMap: "sublime",
		lineWrapping: true,
		lineNumbers: true,
		autoCloseBrackets: true
	});
}