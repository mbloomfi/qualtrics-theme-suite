/* eslint-disable */
var editorPreviewBar = {
	editorWidth: "40%",
	previewWidth: "60%",
	set: function(_index){
		var self = this;

		if(_index === 0){ self.editorWidth = "10%"; self.previewWidth = "90%"; }
		else if(_index === 1){ self.editorWidth = "20%"; self.previewWidth = "80%"; }
		else if(_index === 2){ self.editorWidth = "30%"; self.previewWidth = "70%"; }
		else if(_index === 3){ self.editorWidth = "40%"; self.previewWidth = "60%"; }
		else if(_index === 4){ self.editorWidth = "50%"; self.previewWidth = "50%"; }
		else if(_index === 5){ self.editorWidth = "60%"; self.previewWidth = "40%"; }
		else if(_index === 6){ self.editorWidth = "70%"; self.previewWidth = "30%"; }
		else if(_index === 7){ self.editorWidth = "75%"; self.previewWidth = "25%"; }
		else if(_index === 8){ self.editorWidth = "80%"; self.previewWidth = "20%"; }
		else if(_index === 9){ self.editorWidth = "85%"; self.previewWidth = "15%"; }
		else if(_index === 10){ self.editorWidth = "90%"; self.previewWidth = "10%"; }

		el("#editor_preview_ratio").purge() // purge the style tag
			.text( // add text to the style tag
				"section#editor{ width:"+self.editorWidth+"; } "+
				"webview#preview{ width:"+self.previewWidth+"; }"+
				"webview#preview + #previewLoader{ width:"+self.previewWidth+"; }"
			);

		if(core.preview.mode.screenshot.active){
			core.preview.mode.screenshot.box.update();
		} else {
			// console.log("not active")
		}
	}
};


// ----------------------------
//  Editor Core Methods
// ----------------------------
var editorCore = {

	// ----------------------------
	//  Editor State
	// ----------------------------
	active: true,
	deactivate: function(){
		editor.addClass("inactive");
		preview.focus();
		preview.blur();
	},
	activate: function(){
		editor.rmClass("inactive");
	},

	init: function(){
		this.refreshBtn.config();
	},

	// ----------------------------
	//  Dropdowns
	// ----------------------------
	dropdowns: {

		setDropdownGlobals: function(){
			window.brandName = el("#brandName");
			window.projectName = el("#projectName");
			window.fileName = el("#fileName");
		},

		bodyClick: function(){
			// document.body.addEventListener('click', function(){
			// 	if(editorCore.dropdowns.brands.status === "opened"){
			// 		editorCore.dropdowns.brands.close();
			// 	}
			// 	if(editorCore.dropdowns.projects.status === "opened"){
			// 		editorCore.dropdowns.projects.close();
			// 	}
			// 	if(editorCore.dropdowns.files.status === "opened"){
			// 		editorCore.dropdowns.files.close();
			// 	}
			// 	if(document.getElementById("image_preview_container")){
			// 		document.getElementById("image_preview_container").rm();
			// 	}
			// });
		}

	},

	refreshBtn: {
		config: function(){
			var refreshBtn = el("#refreshPreviewBtn");
			refreshBtn.on("click", function(){
				core.preview.mode.regular.reload();
			});

		},

		activate: function(){
			// console.log("activating refreesh btn");
			el("#refreshPreviewBtn").addClass("active");
		},

		deactivate: function(){
			// console.log("deactivating refreesh btn");
			el("#refreshPreviewBtn").rmClass("active");
		}


	},

	increaseFontSize: function(){
		if(core.preview.mode.currentMode === "thumbnail") return;
		var codeMirrorElement = document.querySelector(".CodeMirror");
		var currentSize = parseInt(codeMirrorElement.style.fontSize);
		if( currentSize < 24 ){
			// console.log("increasing");
			codeMirrorElement.style.fontSize = (++currentSize)+"px";
		}
	},
	decreaseFontSize: function(){
		if(core.preview.mode.currentMode === "thumbnail") return;
		var codeMirrorElement = document.querySelector(".CodeMirror");
		var currentSize = parseInt(codeMirrorElement.style.fontSize);
		if( currentSize > 10 ){
			// console.log("decreasing");
			codeMirrorElement.style.fontSize = `${--currentSize}px`;
		}
	}

	
};

editorCore.init();
/* eslint-enable */
