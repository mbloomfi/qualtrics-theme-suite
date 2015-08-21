var QTS = (function(){


	// ---------------------------------------
	// User Preferences
	// 
	var _userPreferences = {};
	var _pathToBrands = null;

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

	Eve.on("Prepare App",function(){
		updateLocalUserPrefrences(function(){
			writeUserPrefrences();
			Eve.emit("App Init");
		});
	});

	Eve.on("Init App", function(){
		Eve.on("Local Preferences Updated", writeUserPrefrences);
		Eve.on("Window Focused", updateLocalUserPrefrences);
	});

	// ---------------------------------------
	// Menu Bar
	// 

	Eve.on("Menu Bar ~ File Renamed", function(){
		el("#editorBar").addClass("renamed_file");
		setTimeout(function(){
			el("#editorBar").rmClass("renamed_file");
		},300);
	})




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


	function resetLocalInfoQtheme(){
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
		if(!brandName || !pathToBrand) return;
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



	/* return
	*/
	return {

		getPathToBrands: function(){
			return _pathToBrands;
		}

	}

})();



// ------------------
// Brands
// ------------------
var Brands = (function(){
	_brands = {
		recent: null
	};

	_currentBrand = {
		name: null,
		path: null,
		projectsList: null
	};

	function setCurrentBrand(brandName) {
		_currentBrand.name = brandName;
		_currentBrand.path = QTS.getPathToBrands() + "/" + brandName;
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


	Eve.on("Select Brand", function(brandName){
		// console.log("selecting brand =>",brandName);
		setCurrentBrand(brandName);
	});



	Eve.on("Current Brand Updated", function(_currentBrand){
		// console.log("SELECTED:",_currentBrand);
		// console.log("files in brand:",_currentBrand.projectsList);
	});

	

	/* return
	*/
	return {
		getCurrent: function(){
			return _currentBrand;
		},
		getRecent: function(){
			return _brands.recent;
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







