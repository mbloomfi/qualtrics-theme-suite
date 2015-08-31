let QTS = (function(){
	"use strict";

	// --------------
	// Global Eve Listeners
	// --------------

	Eve.on("preferencesSaved", function(){
		console.log("prefs saved!");
		core.localData.snippets.readFromPersistentData(core.codeMirror.resetContextMenu, true);
	});


	Eve.on("codeEditorSaved", function(){
		editorCore.dropdowns.files.setClean();
		myCodeMirror.markClean();
		if(core.localData.currentFile.name === "StyleSheet.scss"){
			core.preview.mode.regular.compileSass();
		}
	});

	Eve.on("error", function(message){
		console.error("ERROR:", message);

		fs.appendFile(
			"local/errorlog.txt",
			`\n~~~~~~~~\n${new Date}\n${message}\n`,
			function(err){
				console.error("errorlog.txt not found");
			}
		);
	});

	window.addEventListener("focus", function(){
		Eve.emit("windowFocused");
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

			let jsonData;

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




	Eve.on("brandSelected", function(brandName, pathToBrand){
		// if(!brandName || !pathToBrand) return;
	});


	Eve.on("projectSelected", function(projectName){
		if(!projectName) {
			Eve.emit("error", "Prameters Missing");
			return;
		}


		// return console.log("project selected check!");
		

		getInfoQTheme(pathToProject, function(missingFile, json){
			if(missingFile){
				resetLocalInfoQtheme();

				writeInfoQTheme(
					`${_currentProject.path}/info.qtheme`,
					_currentProject.infoQTheme
				);

			}
			if(json.author === null) json.author = "Sam Eaton";
		});
	});



	Eve.on("codeEditorSaved", function(){

	});



	

})();




// ------------------
// User Preferences
// ------------------
let UserPreferences = (function(){

	let _userPreferences = {
		path: path.normalize(`${__dirname}/local/user-settings.json`)
	};

	// default location if not set in user settings
	let _pathToBrands = path.resolve(process.env.HOME);

	let UserPreferencesInterface = loca(_userPreferences.path);

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
							let prompterInput = document.getElementById("prompterInput");

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
					message:`Brands File Path: ${process.env.HOME}/`,
					type: "question",
					input: {
						placeholder: "Desktop"
					},
					mainBtn:{
						text:"Ok",
						onClick: function(){
							let prompterInput = document.getElementById("prompterInput");

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
			_pathToBrands = `${process.env.HOME}/${_userPreferences.files.brands.path}`;
			if(typeof callback === "function") callback();
		}
	}


	function updateLocalUserPrefrences(callback){
		fs.readFile(`${__dirname}/local/user-settings.json`, "utf-8", function(err, data){
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
		fs.writeFile(`${__dirname}/local/user-settings.json`, JSON.stringify(_userPreferences), function(err){
			if(err) {
				Eve.emit("error", err);
			}
			else {
				Eve.emit("preferencesFileWritten");
			}
		});
	}



	Eve.on("appStarted",function(){
		updateLocalUserPrefrences(function(){
			writeUserPrefrences();
			Eve.emit("appLoaded");
		});
	});

	Eve.on("windowFocused", updateLocalUserPrefrences);
	// Eve.ignore("windowFocused").until("appLoaded");

	Eve.on("Local Preferences Updated", writeUserPrefrences);
	// Eve.ignore("Local Preferences Updated").until("appLoaded");

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
let PersistentData = (function(){
	// Get rid of local copy, it just adds confusion. Only read from disk.
	// let _pdLocal = {};
	let _pdPath = `${__dirname}/local/persistent-data.json`;

	// function resetLocalPersistentData() {
		
	// 	fs.readFile(_pdPath, "utf-8", function(err, data){
	// 		if(err) return Eve.emit("error",err);

	// 		let pd = JSON.parse(data);
	// 		_pdLocal = pd;

	// 		Eve.emit("Local Persistent Data Updated");

	// 	})
	// }
	function getPersistentData(callback) {
		fs.readFile(_pdPath, 'utf-8', function(err, data){
			if(err) return Eve.emit("error", err);
			callback(JSON.parse(data));
		});
	}

	function addRecentBrand(brandName) {
		getPersistentData(function(_pData){
			// first check if brand is already in recent brands
			let brandIndex = _pData.recentBrands.indexOf(brandName);
			if (brandIndex !== -1) {
				_pData.recentBrands.splice(brandIndex, 1);
			}
			_pData.recentBrands.shift(brandName);
			fs.writeFile(_pdPath, JSON.stringify(_pData), function(err){
				if(err) return Eve.emit("error", err);
			});
		});
	}

	function resetRecentBrands(brandsList) {
		getPersistentData(function(_pData){
			_pData.recentBrands = brandsList;
			fs.writeFile(_pdPath, JSON.stringify(_pData), function(err){
				if(err) return Eve.emit("error", err);
			});
		});
	}

	function pruneRecentBrands() {
		getPersistentData(function(pData){

			let _recentBrands = pData.recentBrands;
			let brandsPath = UserPreferences.getPathToBrands();
			let pruneBrands = [];
			let checkedBrands = 0;
			let totalRecentBrands = _recentBrands.length;
			let i = _recentBrands.length;

			function checkFileStatus(err, stats, index) {
				checkedBrands++;

				// prune brand if not found
				if(err) {
					pruneBrands.push(_recentBrands[index]);
				}

				// after checking all recent brands
				if(checkedBrands === totalRecentBrands) {
					if(pruneBrands.length > 0) {
						pruneBrands.forEach(function(brandToPrune){
							let brandIndex = _recentBrands.indexOf(brandToPrune);
							_recentBrands.splice(brandIndex, 1);
						});
						// set recent brands to new, pruned list
						resetRecentBrands(_recentBrands);
					}
				}
			}

			while(i--) {
				let _i = i;
				/* eslint-disable no-loop-func */
				fs.stat(`${brandsPath}/${_recentBrands[i]}`, function(err, stats){
					checkFileStatus(err, stats, _i);
				});
				/* eslint-enable no-loop-func */
			}	
		});
	}

	function addSnippet(snippetObject) {
		// getPersistentData(function(_pData){
		// 	// first check if brand is already in recent brands
		// 	var brandIndex = _pData.recentBrands.indexOf(brandName);
		// 	if (brandIndex !== -1) {
		// 		_pData.recentBrands.splice(brandIndex, 1);
		// 	}
		// 	_pData.recentBrands.shift(brandName);
		// 	fs.writeFile(_pdPath, JSON.stringify(_pData), function(err){
		// 		if(err) return Eve.emit("error", err);
		// 	});
		// });
	}

	function removeSnippet(snippetId) {
		// getPersistentData(function(_pData){
		// 	// first check if brand is already in recent brands
		// 	var brandIndex = _pData.recentBrands.indexOf(brandName);
		// 	if (brandIndex !== -1) {
		// 		_pData.recentBrands.splice(brandIndex, 1);
		// 	}
		// 	_pData.recentBrands.shift(brandName);
		// 	fs.writeFile(_pdPath, JSON.stringify(_pData), function(err){
		// 		if(err) return Eve.emit("error", err);
		// 	});
		// });
	}

	// Eve.on("appStarted", resetLocalPersistentData);
	
	// Eve.on("windowFocused", resetLocalPersistentData);

	// Eve.on("Recent Brands Changed", function(recentBrands){
	// 	console.log("recent brands changed!");
	// 	// _pdLocal.recentBrands = recentBrands;
	// 	updatePersistentDataFile();
	// });
	Eve.on("appStarted", pruneRecentBrands)

	return {
		get: getPersistentData
		// getLocal: function(){
		// 	return _pdLocal;
		// }
	}

})();








// ------------------
// Brands
// ------------------
let Brands = (function(){
	// let _brands = {
	// 	recent: null,
	// 	list: null
	// };

	let _currentBrand = {
		name: null,
		path: null,
		projectsList: null
	};

	function setCurrentBrand(brandName) {
		_currentBrand.name = brandName;
		_currentBrand.path = `${UserPreferences.getPathToBrands()}/${brandName}`;
		fs.readdir(_currentBrand.path, function(err, files){
			if(err) return Eve.emit("error",err);

			_currentBrand.projectsList = [];
			for(let i = 0, ii = files.length; i < ii; i++) {
				let fsStats = fs.statSync(`${_currentBrand.path}/${files[i]}`);
				if(fsStats.isDirectory()){
					_currentBrand.projectsList.push(files[i]);
				}
			}
			Eve.emit("Current Brand Updated", _currentBrand);
		});
	}

	function getRecentBrands(callback) {
		PersistentData.get(function(pData){
			console.log("pData:", pData);
			callback(pData.recentBrands);
		});
	}



	


	// function resetLocalBrandsList() {
	// 	console.error("dont do this");
	// 	// let brandsPath = UserPreferences.getPathToBrands();
	// 	// fs.readdir(brandsPath, function(err, files){
	// 	// 	if(err) return Eve.emit("error",err);
	// 	// 	let brandsList = [];
	// 	// 	for(let i = 0, ii = files.length; i < ii; i++) {
	// 	// 		let fsStats = fs.statSync(brandsPath+"/"+files[i]);
	// 	// 		if(fsStats.isDirectory()){
	// 	// 			brandsList.push(files[i]);
	// 	// 		}
	// 	// 	}
	// 	// 	_brands.list = brandsList;
	// 	// 	Eve.emit("Local Brands List Updated", _currentBrand);
	// 	// });
	// }

	// Eve.on("appLoaded", function(){
	// 	console.log("app loaded");
	// 	pruneRecentBrands();
	// })


	Eve.on("brandSelected", function(brandName){
		// console.log("selecting brand =>",brandName);
		setCurrentBrand(brandName);
	});

	

	Eve.on("Current Brand Updated", function(_currentBrand){
		// console.log("SELECTED:",_currentBrand);
		// console.log("files in brand:",_currentBrand.projectsList);
	}); 
	// Eve.ignore("Current Brand Updated").until("appLoaded")


	// Eve.once("Local Recent Brands Updated", function(){
	// 	pruneRecentBrands();
	// });

	// // !!!!!!!!! don't need this !!!!!!!!!!!!!!
	// Eve.on("Local Persistent Data Updated", function(){
	// 	console.log("local pd updated");
	// 	_brands.recent = PersistentData.getLocal().recentBrands;
	// 	Eve.emit("Local Recent Brands Updated");
	// });

	let dropdownMenu = (function(){

		/* _tempBrandsList is ONLY to be used when searching for brands (getBrandsByCriteria). 
		That is when the extra speed from caching is needed. 
		Otherwise, just search manually.*/
		let _tempBrandsList = [];
		/* -------------------- */

		let _dropdownStatus = "closed";

		/**/
		function init() {
			dom("brandName").append(
				dom.create('div').setId('brandsDropdown').addClass("dropdown", "hide").append(
					dom.create("div").addClass("arrow", "hide"),
					dom.create("div").addClass("dropdownBody").append(
						dom.create("div").setId("searchBrandsContainer").append(
							dom.create("input").setId("searchBrands").attr("placeholder", "Search")
						),
						dom.create("section").setId("brandsListCont").append(
							
						)
					)
				)
			);

			dom("brandName").addEventListener('click', function(evt){
				Eve.emit("brandsMenuBtnClicked");

				// these methods should be in the project interface, not in the brand
				// if(editorCore.dropdowns.projects.status === "opened") editorCore.dropdowns.projects.close();
				// if(editorCore.dropdowns.files.status === "opened") editorCore.dropdowns.files.close();
				if(!this.classList.contains("inactive")){
					evt.stopPropagation();
				}
			});

			dom("brandsDropdown").addEventListener("click", function(evt){
				evt.stopPropagation();
			});

			dom("searchBrands").addEventListener('keyup',function(e){
				if(this.value.trim().length) {
					getBrandsByCriteria(this.value, function(list){
						console.log("filteredList:",list);
						populate("search", list);
					});
				}
					
			});
		}


		/**/
		function populate(mode, brandsList) {
			if(mode === "recentBrands"){
				let brandsListCont = dom("brandsListCont");
				let recentBrandsCont = dom.create("div").setId("recentBrandsCont");

				console.log("brandsList:", brandsList);

				// add each result
				if(brandsList.length > 0){
					recentBrandsCont.append(
						dom.create("div").addClass("header").text("Recent Brands")
					)
					let limit = 20;
					console.log("show recent brands!");
					for(let i = 0; i < limit; i++){
						recentBrandsCont.append(
							dom.create("button").addClass("brand-item")
								.attr("data-brandname",brandsList[i]).text(brandsList[i])
						)
					}		
					brandsListCont.append(recentBrandsCont);	
				} 

				else {
					brandsListCont.append(
						recentBrandsCont.addClass("no-recent").text("Search for brands.")
					);
				}


				// brandsListCont.purge().append( recentBrandsCont );
				// el(".brand-item").on("click", function(){
				// 	editorCore.dropdowns.brands.select(this.dataset.brandname);
				// });

			}
			else if(mode === "search"){
				console.log("this is where you update the dropdown with the search results");
			}
		}

		/**/
		function selectBrand() {

		}

		/**/
		function toggle() {
			console.log("toggle brand menu");
			if(_dropdownStatus === "opened") {
				close();
			}
			else if(_dropdownStatus === "closed") {
				open();
			}
		}

		/**/
		function open() {
			_dropdownStatus = "opened";
			dom("brandsDropdown").removeClass("hide")
				.queryByClass("arrow")[0].classList.remove("hide");
			dom("brandName").addClass("dropdown-active");
			dom("searchBrands").focus();

			Eve.emit("brandsDropdownOpened");
		}

		/**/
		function close() {
			_dropdownStatus = "closed";
			// clear the '_tempBrandsList' from cache
			_tempBrandsList = [];

			fang(
				function(){
					// self.search.activated = false;
					dom("brandsDropdown").addClass("hide")
						.queryByClass("arrow")[0].addClass("hide");
					brandName.rmClass("dropdown-active");
					setTimeout(this.next, 200);
				},
				function(){
					dom("brandsListCont").purge();
					// editorCore.dropdowns.brands.search.newBrandBtn.remove();
					// self.purge();
					this.next();
				},
				function(){
					// self.refill();
					// dom("brandsDropdown").el(".arrow")[0].addClass("hide");
				}
			).init();
		}

		/*should only be called by 'getBrandsByCriteria'*/
		function filterByCriteria(list, criteria) {
			let filteredList = [];
			list.forEach(function(file){
				if(file.toUpperCase().indexOf(criteria.toUpperCase()) !== -1) filteredList.push(file);
			})
			// console.log("list?", filteredList);
			return filteredList;
		}

		/**/
		function getBrandsByCriteria(criteria, callback) {
			if(_tempBrandsList.length) {
				console.log("cached!!!");
				callback(filterByCriteria(_tempBrandsList, criteria));
			}
			else {
				fs.readdir(UserPreferences.getPathToBrands(), function(err, files){
					if(err) return Eve.emit("error", err);
					_tempBrandsList = files;
					// make sure to clear the '_tempBrandsList' when the dropdown menu is closed
					// console.log("files:",files);
					callback(filterByCriteria(files, criteria));
				})
			}
			// console.log("path:",UserPreferences.getPathToBrands());
				
			// console.log("getting brands by criteria:", criteria);
		}
		
		
		// function open() {}
		// function open() {}
		// function open() {}

		Eve.on("appLoaded", init);

		Eve.on("brandsMenuBtnClicked", function(){
			toggle();
		})

		Eve.on("brandsDropdownOpened", function(){
			getRecentBrands(function(recentBrandsList){
				populate("recentBrands", recentBrandsList);
			});
		});

	})();

	/* return
	*/
	return {
		getCurrent: function(){
			return _currentBrand;
		},
		getRecent: function(){
			console.error("dont do this");
			// return _brands.recent || null;
		}
	};

})();



// ------------------
// Projects
// ------------------
let Projects = (function(){
	let _projects = {};

	let _currentProject = {
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
		_currentProject.path = `${Brands.current.path}/${projectName}`;
		fs.readdir(_currentProject.path, function(err, files){
			_currentProject.files = [];
			for(let i = 0, ii = files.length; i < ii; i++) {
				let fsStats = fs.statSync(`${_currentProject.path}/${files[i]}`);
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
			for(let i = 0, ii = files.length; i < ii; i++) {
				let fsStats = fs.statSync(`${_currentProject.path}/${files[i]}`);
				if(fsStats.isFile() && files[i].charAt(0) !== "."){
					_currentProject.files.push(files[i]);
				}
			}
			Eve.emit("Current Project Updated", projectName);
		});
	}

	// !!!!!! this is not an event !!!!!!!!
	Eve.on("Select Project", function(projectName){
		setCurrentProject(projectName);
	});

	Eve.on("Current Project Updated", function(){
		// console.log("current project has been set, good sir.");
		// console.log("_currentProject =>",_currentProject);
	});

	// !!!!!! this is not an event !!!!!!!!
	Eve.on("Update Current Project Files List", updateCurrentProjectFiles);

	// !!!!!! this is not an event !!!!!!!!
	Eve.on("Rename File", function(data, callback){
		if(!data.path || !data.newName || !data.oldName) {
			return Eve.emit("error", "Rename File Error");
		}
		fs.rename(data.path + data.oldName, data.path + data.newName, function(err){
			if(err){ 
				return Eve.emit("error", "Rename File Error");
			}
			if(typeof callback === "function") {
				callback();
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
// Code Editor (codemirror)
// ------------------
let Editor = (function(){
	function resetContextMenu() {

	}

	function deactive() {
		
	}

	function activate() {
		
	}

	function setText() {

	}

	function compileStyles() {

	}



})();







