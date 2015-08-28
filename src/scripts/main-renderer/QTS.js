var QTS = (function(){


	// --------------
	// Global Eve Listeners
	// --------------

	Eve.on("Preferences Saved", function(){
		console.log("prefs saved!");
		core.localData.snippets.readFromPersistentData(core.codeMirror.resetContextMenu, true);
	});


	Eve.on("Code Editor Saved", function(){
		editorCore.dropdowns.files.setClean();
		myCodeMirror.markClean();
		if(core.localData.currentFile.name === "StyleSheet.scss"){
			core.preview.mode.regular.compileSass();
		}

	});

	Eve.on("error", function(message){
		console.error("ERROR:", message);
		fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~\n"+(new Date)+"\n\t"+message+"\n\n", function(){});
	});

	window.addEventListener("focus", function(){
		Eve.emit("window-focused");
	});


	
	// ---------------------------------------
	// User Preferences
	// 
	
	// ---------------------------------------
	// Menu Bar
	// 


	// WHY the hell is this here?
	Eve.on("Menu Bar ~ File Renamed", function(){
		el("#editorBar").addClass("renamed_file");
		setTimeout(function(){
			el("#editorBar").rmClass("renamed_file");
		},300);
	});




	// ---------------------------------------
	// info.qthemne
	// 
	function getInfoQTheme(pathToProject, callback){
		fs.readFile(pathToProject, "utf-8", function(err, data){
			if(err) {
				Eve.emit("error", err);
				return callback(true, null);
			}

			var jsonData;

			try {
				jsonData = JSON.parse(data);
			} catch(e) {
				Eve.emit("error", err);
				jsonData = {};
			}

			callback(false, jsonData);
		});
	}


	function resetLocalInfoQtheme() {
		_currentProject.infoQTheme = {
			"author": null,
			"lastModifiedFile": null,
			"LastModified": {
				"author": "",
				"date": ""
			},
			"version": "V4",
			"variables":"numberOfQuestions=-1 legacySQ=0 AnyDeviceSupport=1 CSS=BaseStylesV4.css Transitions=Slide,Fade,Flip,Barrel DefaultTransition=Fade"
		}
	}

	function writeInfoQTheme(pathToFile, jsonData){
		fs.writeFile(pathToFile, JSON.stringify(jsonData));
	}




	Eve.on("Brand Selected", function(brandName, pathToBrand){
		// if(!brandName || !pathToBrand) return;
	});


	Eve.on("Project Selected", function(projectName){
		if(!projectName) {
			Eve.emit("error", "Prameters Missing");
			return;
		}


		// return console.log("project selected check!");
		

		getInfoQTheme(pathToProject, function(missingFile, json){
			if(missingFile){
				resetLocalInfoQtheme();

				writeInfoQTheme(
					_currentProject.path+"/info.qtheme",
					_currentProject.infoQTheme
				);

			}
			if(json.author === null) json.author = "Sam Eaton";
		});
	});



	Eve.on("Code Editor Saved", function(){

	});



	

})();




// ------------------
// User Preferences
// ------------------
var UserPreferences = (function(){

	var _userPreferences = {
		path: path.normalize(__dirname + "/local/user-settings.json")
	};

	function _pathToBrands() {
		return _userPreferences.pathToBrands || null;
	}

	var UserPreferencesInterface = loca(_userPreferences.path);

	UserPreferencesInterface.on("read", function(data){

	});

	UserPreferencesInterface.once("read", function(){
		console.log("");
		console.log("This is only happening once!!!!");
		console.log("");
	})



	function checkUsername(callback) {
		if(!_userPreferences.username) {
			setTimeout(function(){
				Prompter.prompt({
					message:"What is your name?",
					type: "question",
					input: {
						placeholder: "John Doe"
					},
					mainBtn:{
						text:"Ok",
						onClick: function(){
							var prompterInput = document.getElementById("prompterInput");

							if(prompterInput.value.length > 0){

								Prompter.hide();
								_userPreferences.username = prompterInput.value;
								if(typeof callback === "function") callback();

							}
						}
					}
				});
			}, 350);
				
		} 
		else {
			if(typeof callback === "function") callback();
		}
	}


	function checkBrandLocation(callback) {
		// console.log("username", _userPreferences.username);
		if(!_userPreferences.files.brands.path) {

			setTimeout(function(){
				Prompter.prompt({
					message:"Brands File Path: "+process.env.HOME+"/",
					type: "question",
					input: {
						placeholder: "Desktop"
					},
					mainBtn:{
						text:"Ok",
						onClick: function(){
							var prompterInput = document.getElementById("prompterInput");

							if(prompterInput.value.length > 0){

								Prompter.hide();
								_userPreferences.files.brands.path = prompterInput.value;
								if(typeof callback === "function") callback();

							}
						}
					}
				});
			}, 350);

		} else {
			_pathToBrands = process.env.HOME + "/" + _userPreferences.files.brands.path;
			if(typeof callback === "function") callback();
		}
	}


	function updateLocalUserPrefrences(callback){
		fs.readFile(__dirname+"/local/user-settings.json", "utf-8", function(err, data){
			if(err) return Eve.emit("error", err);

			_userPreferences = JSON.parse(data);

			checkUsername(function(){
				checkBrandLocation(function(){
					Eve.emit("Local Preferences Updated");
					if(typeof callback === "function") callback();
				});
			});

		});
	}

	function writeUserPrefrences(){
		fs.writeFile(__dirname+"/local/user-settings.json", JSON.stringify(_userPreferences), function(err){
			if(err) {
				Eve.emit("error", err);
			}
			else {
				Eve.emit("Preferences File Updated");
			}
		});
	}



	Eve.on("app-started",function(){
		updateLocalUserPrefrences(function(){
			writeUserPrefrences();
			Eve.emit("app-loaded");
		});
	});

	Eve.on("window-focused", updateLocalUserPrefrences);
	// Eve.ignore("window-focused").until("app-loaded");

	Eve.on("Local Preferences Updated", writeUserPrefrences);
	// Eve.ignore("Local Preferences Updated").until("app-loaded");

	/* 
	return
	*/
	return {

		getPathToBrands: function(){
			return _pathToBrands;
		},
		API: UserPreferencesInterface
	}
})();





// ------------------
// Persistent Data
// ------------------
var PersistentData = (function(){
	var _pdLocal = {};
	var _pdPath = __dirname+"/local/persistent-data.json";

	function resetLocalPersistentData() {
		
		fs.readFile(_pdPath, "utf-8", function(err, data){
			if(err) return Eve.emit("error",err);

			var pd = JSON.parse(data);
			_pdLocal = pd;

			Eve.emit("Local Persistent Data Updated");

		})
	}

	function updatePersistentDataFile() {
		console.log("updating persistent data file");
		fs.writeFile(_pdPath, JSON.stringify(_pdLocal), function(err){
			if(err) Eve.emit("err", err);
		});
	}

	Eve.on("app-started", resetLocalPersistentData);
	
	Eve.on("window-focused", resetLocalPersistentData);

	Eve.on("Recent Brands Changed", function(recentBrands){
		console.log("recent brands changed!");
		_pdLocal.recentBrands = recentBrands;
		updatePersistentDataFile();
	});

	return {
		getLocal: function(){
			return _pdLocal;
		}
	}

})();







// ------------------
// Brands
// ------------------
var Brands = (function(){
	_brands = {
		recent: null,
		list: null
	};

	_currentBrand = {
		name: null,
		path: null,
		projectsList: null
	};

	function pruneRecentBrands() {
		console.log("pruning brands");
		var pathToBrands = UserPreferences.getPathToBrands();
		var recentBrandsAltered = false;
		var i = _brands.recent.length;
		while(i--) {
			fs.stat(pathToBrands + "/" + _brands.recent[i], function(err, stats){
				if(err) {
					console.log("removing brand!");
					_brands.recent.splice(i, 1);
					recentBrandsAltered = true;
				}
			})
		}
		setTimeout(function(){
			if(recentBrandsAltered) {
				console.log("emitting?");
				Eve.emit("Recent Brands Changed", _brands.recent);
			}
			else {
				console.log("not emitting?");
			}
		}, 400);
			
	}

	function setCurrentBrand(brandName) {
		_currentBrand.name = brandName;
		_currentBrand.path = UserPreferences.getPathToBrands() + "/" + brandName;
		fs.readdir(_currentBrand.path, function(err, files){
			if(err) return Eve.emit("error",err);

			_currentBrand.projectsList = [];
			for(var i = 0, ii = files.length; i < ii; i++) {
				var fsStats = fs.statSync(_currentBrand.path+"/"+files[i]);
				if(fsStats.isDirectory()){
					_currentBrand.projectsList.push(files[i]);
				}
			}
			Eve.emit("Current Brand Updated", _currentBrand);

		});
	}

	function resetLocalBrandsList() {
		var brandsPath = UserPreferences.getPathToBrands();
		fs.readdir(brandsPath, function(err, files){
			if(err) return Eve.emit("error",err);
			var brandsList = [];
			for(var i = 0, ii = files.length; i < ii; i++) {
				var fsStats = fs.statSync(brandsPath+"/"+files[i]);
				if(fsStats.isDirectory()){
					brandsList.push(files[i]);
				}
			}
			_brands.list = brandsList;
			Eve.emit("Local Brands List Updated", _currentBrand);
		});
	}

	// Eve.on("app-loaded", function(){
	// 	console.log("app loaded");
	// 	pruneRecentBrands();
	// })

	Eve.on("Brand Selected", function(brandName){
		// console.log("selecting brand =>",brandName);
		setCurrentBrand(brandName);
	});

	Eve.on("Brands Menu Btn Clicked", function(){
		resetLocalBrandsList();
	})

	Eve.on("Current Brand Updated", function(_currentBrand){
		// console.log("SELECTED:",_currentBrand);
		// console.log("files in brand:",_currentBrand.projectsList);
	}); 
	// Eve.ignore("Current Brand Updated").until("app-loaded")

	Eve.on("Update Local Recent Brands", function(){

	});

	var initLocalRecentBrands = Eve.on("Local Recent Brands Updated", function(){
		pruneRecentBrands();
		initLocalRecentBrands.remove();
	});

	Eve.on("Local Persistent Data Updated", function(){
		console.log("local pd updated");
		_brands.recent = PersistentData.getLocal().recentBrands;
		Eve.emit("Local Recent Brands Updated");
	});

	

	/* return
	*/
	return {
		getCurrent: function(){
			return _currentBrand;
		},
		getRecent: function(){
			return _brands.recent || null;
		},
		getList: function(){
			return _brands.list || null;
		}
	};

})();



// ------------------
// Projects
// ------------------
var Projects = (function(){
	_projects = {};

	_currentProject = {
		name: null,
		path: null,
		files: null,
		currentFile: {
			name: null,
			path: null
		},
		infoQTheme: {
			"author": null,
			"lastModifiedFile": null,
			"LastModified": {
				"author": "",
				"date": ""
			},
			"version": "V4",
			"variables":"numberOfQuestions=-1 legacySQ=0 AnyDeviceSupport=1 CSS=BaseStylesV4.css Transitions=Slide,Fade,Flip,Barrel DefaultTransition=Fade"
		}
	};


	function setCurrentProject(projectName) {
		_currentProject.name = projectName;
		_currentProject.path = Brands.current.path + "/" + projectName;
		fs.readdir(_currentProject.path, function(err, files){
			_currentProject.files = [];
			for(var i = 0, ii = files.length; i < ii; i++) {
				var fsStats = fs.statSync(_currentProject.path+"/"+files[i]);
				if(fsStats.isFile() && files[i].charAt(0) !== "."){
					_currentProject.files.push(files[i]);
				}
			}
			Eve.emit("Current Project Updated", projectName);
		});
	}

	function updateCurrentProjectFiles() {
		fs.readdir(_currentProject.path, function(err, files){
			_currentProject.files = [];
			for(var i = 0, ii = files.length; i < ii; i++) {
				var fsStats = fs.statSync(_currentProject.path+"/"+files[i]);
				if(fsStats.isFile() && files[i].charAt(0) !== "."){
					_currentProject.files.push(files[i]);
				}
			}
			Eve.emit("Current Project Updated", projectName);
		});
	}


	Eve.on("Select Project", function(projectName){
		setCurrentProject(projectName);
	});

	Eve.on("Current Project Updated", function(){
		// console.log("current project has been set, good sir.");
		// console.log("_currentProject =>",_currentProject);
	});

	Eve.on("Update Current Project Files List", updateCurrentProjectFiles);

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

	return {
		getCurrent: function(){
			return _currentProject;
		}
	}

})();

// ------------------
// Code Editor
// ------------------
var codeEditor = (function(){




})();







