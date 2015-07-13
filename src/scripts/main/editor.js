
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

	}

	
};


//= include editor-dropdown-brands.js
//= include editor-dropdown-projects.js
//= include editor-dropdown-files.js


	