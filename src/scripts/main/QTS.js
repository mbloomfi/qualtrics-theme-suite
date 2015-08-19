var QTS = (function(){


	// ----------
	// Menu Bar
	// ----------

	Eve.on("Menu Bar ~ File Renamed", function(){
		el("#editorBar").addClass("renamed_file");
		setTimeout(function(){
			el("#editorBar").rmClass("renamed_file");
		},300);
	})





	// ----------
	// Brands
	// ----------
	_brands = {};

	_currentBrand = {
		name: null,
		path: null
	};


	Eve.on("Brand Selected", function(){

	});




	// ----------
	// Projects
	// ----------
	_projects = {};

	_currentProject = {
		name: null,
		path: null,
		files: null,
		currentFile: {
			name: null,
			path: null
		}
	};

	Eve.on("Rename File", function(data, callback){
		if(!data.path || !data.newName || !data.oldName) {
			return Eve.emit("error", "Rename File Error");
		}
		fs.rename(data.path + data.oldName, data.path + data.newName, function(err){
			if(err){ 
				return Eve.emit("error", "Rename File Error");
			}
			else {
				if(typeof callback === "function") {
					callback();
				}
			}
		});
	});



	// ----------
	// info.qthemne
	// ----------
	Eve.on("Brand Selected", function(){

	});

	Eve.on("Code Editor Saved", function(){

	});
	

})();

