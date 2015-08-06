
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
			document.body.addEventListener('click', function(){
				if(editorCore.dropdowns.brands.status === "opened"){
					editorCore.dropdowns.brands.close();
				}
				if(editorCore.dropdowns.projects.status === "opened"){
					editorCore.dropdowns.projects.close();
				}
				if(editorCore.dropdowns.files.status === "opened"){
					editorCore.dropdowns.files.close();
				}
			});
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
			console.log("activating refreesh btn");
			el("#refreshPreviewBtn").addClass("active");
		},

		deactivate: function(){
			console.log("deactivating refreesh btn");
			el("#refreshPreviewBtn").rmClass("active");
		}


	},

	increaseFontSize: function(){
		if(core.preview.mode.currentMode === "thumbnail") return;
		var codeMirrorElement = document.querySelector(".CodeMirror");
		var currentSize = parseInt(codeMirrorElement.style.fontSize);
		if( currentSize < 24 ){
			console.log("increasing");
			codeMirrorElement.style.fontSize = (++currentSize)+"px";
		}
	},
	decreaseFontSize: function(){
		if(core.preview.mode.currentMode === "thumbnail") return;
		var codeMirrorElement = document.querySelector(".CodeMirror");
		var currentSize = parseInt(codeMirrorElement.style.fontSize);
		if( currentSize > 10 ){
			console.log("decreasing");
			codeMirrorElement.style.fontSize = (--currentSize)+"px";
		}
	}

	
};




//= include editor-dropdown-brands.js
//= include editor-dropdown-projects.js
//= include editor-dropdown-files.js

editorCore.init();
	