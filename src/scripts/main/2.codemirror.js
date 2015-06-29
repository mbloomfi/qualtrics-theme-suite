function codemirrorInit() {
	window.codemirrorContainer = el("#codemirror-wrapper");

	var myCodeMirror = CodeMirror(codemirrorContainer, {
		value: "body { \n\tbackground: red;\n}",
		mode: "css",
		theme: "monokai",
		tabSize: 2,
		indentWithTabs: true,
		keyMap: "sublime",
		lineWrapping: true,
		lineNumbers: true
	});
}

// function codemirrorAdjustHeight(){
// 	codemirrorContainer
// }
