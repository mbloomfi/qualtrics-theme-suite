'use strict';
// == Electron Natives ==
let remote = require('remote');
let app = remote.require('app');
let ipc = require('ipc');
let Menu = remote.require('menu');
let MenuItem = remote.require('menu-item');
let dialog = remote.require('dialog');

// == Node Natives ==
let path = require('path');
let https = require('https');
let Eve = Object.create(new (require('events').EventEmitter)());
let util = require('util')

// == Vendor ==
let fs = require('fs-extra');
// let lwip = require('lwip');
// let gulp = require('gulp');
// let sass = require('gulp-sass');
// let minifyCss = require('gulp-minify-css');
// let stylus = require('gulp-stylus');
// let autoprefixer = require('gulp-autoprefixer');
let shelljs = require('shelljs');

// == Local Modules == 
let loca = require('./local/scripts/modules/loca');
let fang = require('./local/scripts/modules/fang');
let dom = require('./local/scripts/modules/dom');

// == Custom ==
let Global = remote.getGlobal('sharedObject'); //see index.js
let appRoot = Global.appRoot;
let template = etc.template;
let menu; // see core.codeMirror.activate()

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
				console.log("brand already in recent!");
				console.log("_pData.recentBrands before:", _pData.recentBrands);
				_pData.recentBrands.splice(brandIndex, 1);
			}
			_pData.recentBrands.unshift(brandName);
			console.log("_pData.recentBrands after:", _pData.recentBrands);
			fs.writeFile(_pdPath, JSON.stringify(_pData), function(err){
				if(err) return Eve.emit("error", err);
				// console.log("_pData.recentBrands", _pData.recentBrands)
			});
		});
	}

	function resetRecentBrands(brandsList) {
		getPersistentData(function(_pData){
			_pData.recentBrands = brandsList;
			console.log("_pData:", _pData);
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
						console.log("_recentBrands =>",_recentBrands)
						if(_recentBrands.length) resetRecentBrands(_recentBrands);
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
		// 	_pData.recentBrands.unshift(brandName);
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
		// 	_pData.recentBrands.unshift(brandName);
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
	Eve.on("appStarted", pruneRecentBrands);
	Eve.on("currentBrandSet", addRecentBrand);
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
						dom.create("section").setId("brandsListCont")
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


			let searchTimeout;
			dom("searchBrands").addEventListener('keyup',function(e){
					let self = this;
					if(searchTimeout) {
					 clearTimeout(searchTimeout);
					}
					searchTimeout = setTimeout(function() {
						searchTimeout = undefined;
						let inputValue = self.value;
						if(inputValue.trim().length){

							getBrandsByCriteria(self.value, function(list){
								console.log("filteredList:",list);
								populate("search", list);
							});
						}
						else {
							Eve.emit("searchFieldEmpty");
						}
					}, 300);
			});
		}


		/**/
		function populate(mode, brandsList) {
			let brandsListCont = dom("brandsListCont").purge();

			if(mode === "recentBrands"){
				console.log("show recent brands",brandsList);
				let recentBrandsCont = dom.create("div").setId("recentBrandsCont");

				console.log("brandsList:", brandsList);

				// add each result
				if(brandsList.length > 0){
					recentBrandsCont.append(
						dom.create("div").addClass("header").text("Recent Brands")
					)
					let limit = 20;
					if(brandsList.length < limit) limit = brandsList.length;

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
				dom.queryByClass("brand-item").each(function(item){
					item.addEventListener("click", function(){
						Eve.emit("selectBrand", item.dataset.brandname);
						// console.log(`select ${item.dataset.brandname}`);
						// editorCore.dropdowns.brands.select(this.dataset.brandname);
					});
				});

			}
			else if(mode === "search"){
				let searchResultsCont = dom.create("div").setId("searchResultsCont");

				// if(matches.indexOf(criteria) === -1){
				// 	setTimeout(function(){ // helps with performance
				// 		editorCore.dropdowns.brands.search.newBrandBtn.add(criteria);
				// 		editorCore.dropdowns.brands.search.newBrandBtn.enable(criteria);
				// 		editorCore.dropdowns.brands.search.newBrandBtn.update(criteria);
				// 	},0);
				// } else {
				// 	setTimeout(function(){ // helps with performance
				// 		editorCore.dropdowns.brands.search.newBrandBtn.disable(criteria);
				// 		editorCore.dropdowns.brands.search.newBrandBtn.update(criteria);
				// 	},0);
				// }

				

				// header
				searchResultsCont.append(
					dom.create("div").addClass("header").text("Search Results")
				)

				// add each result
				for(let i = 0, ii = brandsList.length; i < ii; i++){
					searchResultsCont.append(
						dom.create("button").addClass("brand-item").attr("data-brandname",brandsList[i]).text(brandsList[i])
					)
				}

				// if(matches.length > 6){ // add arrow
					// searchResultsCont.append( el("+div").addClass("arrow-down") )
				// }

				brandsListCont.purge().append( searchResultsCont );

				// Add click listeners to each result
				dom.queryByClass("brand-item").each(function(item){
					item.addEventListener("click", function(){
						Eve.emit("selectBrand", item.dataset.brandname);
						// console.log(`select ${item.dataset.brandname}`);
						// editorCore.dropdowns.brands.select(this.dataset.brandname);
					});
				});

				// brandsListCont.rmClass("no-results");
				// if(editorCore.dropdowns.brands.search.newBrandBtn.exists) {
				// 		el("#createBrand").rmClass("no-results");
				// } 
				// console.log("this is where you update the dropdown with the search results");
			}
		}

		/*Remove this function. Selecting a brand should be a set of smaller functions (e.g. project.reset, etc.)*/
		function selectBrand(brandName) {

			console.log("selecting", brandName);
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

					let DS_Store = _tempBrandsList.indexOf(".DS_Store");
					if(DS_Store !== -1) {
						_tempBrandsList.splice(DS_Store, 1);
					}
					// make sure to clear the '_tempBrandsList' when the dropdown menu is closed
					// console.log("files:",files);
					callback(filterByCriteria(files, criteria));
				})
			}
			// console.log("path:",UserPreferences.getPathToBrands());
				
			// console.log("getting brands by criteria:", criteria);
		}

		/**/
		function getProjectList(brandPath, callback) {
			fs.readdir(brandPath, function(err, files){
				if(err) return Eve.emit("error", err);
				let DS_Store = files.indexOf(".DS_Store");
				if(DS_Store !== -1) {
					files.splice(DS_Store, 1);
				}
				callback(files);
				console.log("got projectsLists:", files);
			})
		}

		/**/
		function setCurrentBrand(brandName) {
			_currentBrand.name = brandName;
			_currentBrand.path = UserPreferences.getPathToBrands()+"/"+brandName;
			getProjectList(_currentBrand.path, function(projects){
					console.log("got projectsLists:", projects);
					_currentBrand.projectsList = projects;
					Eve.emit("currentBrandSet", _currentBrand.name);
			});
		}

		// function addRecentBrand(brandName) {
		// 	PersistentData.get(function(pData){
		// 		let recentBrands = pData.recentBrands;
				
		// 		// remove brand from recent data if exists
		// 		let brandIndex = recentBrands.indexOf(brandName);
		// 		if(brandIndex !== -1) {
		// 			recentBrands.splice(brandIndex, 1);
		// 		}
		// 		// add brand to front of array
		// 		recentBrands.unshift(brandName);
		// 	});

		// 	console.log("add " +  brandName + " to recent brands");
		// }


		
		
		// function open() {}
		// function open() {}
		// function open() {}

		Eve.on("appLoaded", init);

		Eve.on("brandsMenuBtnClicked", function(){
			toggle();
		});



		Eve.on("selectBrand", selectBrand);
		Eve.on("selectBrand", close);
		Eve.on("selectBrand", setCurrentBrand);
		// rename brand name field
		Eve.on("selectBrand", function(brandName){
			dom("brandNameText").text(brandName);
		});

		

		Eve.on("brandsDropdownOpened", function(){
			getRecentBrands(function(recentBrandsList){
				populate("recentBrands", recentBrandsList);
			});
		});

		Eve.on("searchFieldEmpty", function(){
			getRecentBrands(function(recentBrandsList){
				populate("recentBrands", recentBrandsList);
			});
		});

		Eve.on("documentBodyClicked", function(){
			if(_dropdownStatus === "opened") {
				close();
			}
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
			if(err) return Eve.emit("error", error);
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
			if(err) return Eve.emit("error", error);
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


	var dropdown = (function(){
		let _dropdownStatus = "closed";
		function activate() {
			// var currentBrand = core.localData.currentBrand;
			// self.reset();
			dom("projectName").removeClass("inactive");
			dom("projects_arrow").removeClass("inactive");
		}

		/**/
		function toggle() {
			// console.log("toggle brand menu");
			// if(_dropdownStatus === "opened") {
			// 	close();
			// }
			// else if(_dropdownStatus === "closed") {
			// 	open();
			// }
		}

		/**/
		function open() {
			_dropdownStatus = "opened";
			// dom("brandsDropdown").removeClass("hide")
			// 	.queryByClass("arrow")[0].classList.remove("hide");
			// dom("brandName").addClass("dropdown-active");
			// dom("searchBrands").focus();

			// Eve.emit("brandsDropdownOpened");
		}

		/**/
		function close() {
			_dropdownStatus = "closed";
			// clear the '_tempBrandsList' from cache
			// _tempBrandsList = [];

			// fang(
			// 	function(){
			// 		// self.search.activated = false;
			// 		dom("brandsDropdown").addClass("hide")
			// 			.queryByClass("arrow")[0].addClass("hide");
			// 		brandName.rmClass("dropdown-active");
			// 		setTimeout(this.next, 200);
			// 	},
			// 	function(){
			// 		dom("brandsListCont").purge();
			// 		// editorCore.dropdowns.brands.search.newBrandBtn.remove();
			// 		// self.purge();
			// 		this.next();
			// 	},
			// 	function(){
			// 		// self.refill();
			// 		// dom("brandsDropdown").el(".arrow")[0].addClass("hide");
			// 	}
			// ).init();
		}

		Eve.on("selectBrand", activate);


	})();

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
	let codeMirrorInterface = window.myCodeMirror;

	function resetContextMenu() {

	}

	function deactive() {
		
	}

	function activate() {
		
	}

	function setValue(code, ext) {

		codeMirrorInterface.setValue(code);

		var extMap = {
			".html": "htmlmixed",
			".css": "css",
			".scss": "text/x-scss",
			".styl": "text/x-styl",
			".js": "javascript",
			".qtheme": "application/json",
			".json": "application/json",
			".md": "markdown"
		}

		if(extMap.hasOwnProperty(ext.toLowerCase())){
			if(codeMirrorInterface.getOption("mode") !== extMap[ext]){
				codeMirrorInterface.setOption("mode", extMap[ext]);
			}	
		}
		else {
			codeMirrorInterface.setOption("mode", "");
		}



	}

	function compileStyles() {

	}



})();








/* eslint-disable */
// INIT app
console.log("window loaded?");
window.addEventListener("load", function(){
	//add global reference to editor and preview
	console.log("window loaded");






	// baton(function(next){
		
		Eve.emit("appStarted");
	
	// })

	// .then(function(next){
	// 	console.log("app init");
	// 	core.localData.updateUserSettings(next);
	// })

	// .then(function(next){
	// 	// console.log("reloading?");
	// 	core.localData.updateBrandsList(next);

	// })
	// .then(function(next){

	// 	core.localData.updateRecentBrands(next);

	// })
	// .then(function(next){

	// 	core.localData.snippets.readFromPersistentData(next);

	// })
	// .then(function(next) {

	Eve.on("appLoaded", function(){
		console.log("app loaded!");
		window.editor = el("#editor");
		window.preview = el("#preview");

		editorCore.dropdowns.setDropdownGlobals();

		document.body.addEventListener('click', function(){
			Eve.emit("documentBodyClicked");
			
			// if(editorCore.dropdowns.projects.status === "opened"){
			// 	editorCore.dropdowns.projects.close();
			// }
			// if(editorCore.dropdowns.files.status === "opened"){
			// 	editorCore.dropdowns.files.close();
			// }
			// if(document.getElementById("image_preview_container")){
			// 	document.getElementById("image_preview_container").rm();
			// }
		});

		// editorCore.dropdowns.brands.populate();
		// editorCore.dropdowns.brands.init();
		
		editorCore.dropdowns.projects.populate();
		editorCore.dropdowns.projects.init();

		editorCore.dropdowns.files.prepare();
		editorCore.dropdowns.files.addFileDragListener();

		codemirrorInit();

		core.codeMirror.dirtyWatch();

		core.preview.init();
		//un-hide page // show editor and webview
		el.join( [editor, preview] ).rmClass("hide");


		window.addEventListener("resize", function(){
			core.preview.mode.screenshot.box.update();
		});



		window.addEventListener("keypress", function(e){

		// console.log("e",e);
			// enter key
			if(e.keyCode === 13) {
				
				if(core.preview.mode.currentMode === "thumbnail"){
					document.getElementById("thumbCamera").dispatchEvent(new MouseEvent("click"));
				}
				else if(core.preview.mode.currentMode === "screenshot"){
					document.getElementById("screenshotCamera").dispatchEvent(new MouseEvent("click"));
				}
			}

			

		});

		window.keystate = [];



		document.addEventListener('keydown',function(evt){

			if(evt.keyCode === 27) {

				if(core.preview.mode.currentMode === "thumbnail" || core.preview.mode.currentMode === "screenshot"){
					evt.preventDefault();
					core.preview.mode.regular.enable();
					myCodeMirror.focus();
				}

			}

			keystate[evt.keyCode] = true;
			if (evt.keyCode === 38 || evt.keyCode === 40 || evt.keyCode === 39 || evt.keyCode === 37 || evt.keyCode === 32) {
				// evt.preventDefault();
				
			}

			// if 'minus' key
			if(evt.keyCode === 189){
				keystate[evt.keyCode] = false;

				//if 'COMMAND'
				if(keystate[91]||keystate[93]){
					
					if(core.preview.mode.currentMode === "thumbnail"){
						document.getElementById("decrease-thumb-size").dispatchEvent(new MouseEvent("click"));
					}
				}
			}

			// if 'equals' key
			else if(evt.keyCode === 187){
				keystate[evt.keyCode] = false;

				//if 'COMMAND'
				if(keystate[91]||keystate[93]){
					
					if(core.preview.mode.currentMode === "thumbnail"){
						document.getElementById("increase-thumb-size").dispatchEvent(new MouseEvent("click"));
					}
				}
			}

			// if 'right arrow' key
			else if(evt.keyCode === 39){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if((keystate[91]||keystate[93]) && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						if(keystate[91]||keystate[93]){
							thumbBox.style.left = parseInt(thumbBox.style.left) + 50 + "px";
						} else {
							thumbBox.style.left = parseInt(thumbBox.style.left) + 10 + "px";
						}

						if( parseInt(thumbBox.style.left) + thumbBox.clientWidth > window.innerWidth ) {
							thumbBox.style.left = window.innerWidth - thumbBox.clientWidth + "px";
						}
					}
				
			}

			// if 'left arrow' key
			else if(evt.keyCode === 37){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if((keystate[91]||keystate[93]) && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						if((keystate[91]||keystate[93])){

							if(parseInt(thumbBox.style.left) - 50 < 0){
								thumbBox.style.left = "0px";
							} else {
								thumbBox.style.left = parseInt(thumbBox.style.left) - 50 + "px";
							}
							
						} else {

							if(parseInt(thumbBox.style.left) - 10 < 0){
								thumbBox.style.left = "0px";
							} else {
								thumbBox.style.left = parseInt(thumbBox.style.left) - 10 + "px";
							}

						}

					}
				
			}

			// if 'down arrow' key
			else if(evt.keyCode === 40){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if((keystate[91]||keystate[93]) && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						
						if((keystate[91]||keystate[93])){
							thumbBox.style.top = parseInt(thumbBox.style.top) + 50 + "px";
						} else {
							thumbBox.style.top = parseInt(thumbBox.style.top) + 10 + "px";
						}
						// console.log("top",parseInt(thumbBox.style.top));
						// console.log("box height",thumbBox.clientHeight);
						// console.log("window height",window.innerHeight);


						if( parseInt(thumbBox.style.top) + thumbBox.clientHeight >= window.innerHeight) {
							// console.log("reset top")
							thumbBox.style.top = window.innerHeight - thumbBox.clientHeight + "px";
						}

					}
				
			}

			// if 'up arrow' key
			else if(evt.keyCode === 38){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if((keystate[91]||keystate[93]) && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						if(keystate[91]||keystate[93]){

							if(parseInt(thumbBox.style.top) - 50 < 0){
								thumbBox.style.top = "0px";
							} else {
								thumbBox.style.top = parseInt(thumbBox.style.top) - 50 + "px";
							}


						} else {

							if(parseInt(thumbBox.style.top) - 10 < 0){
								thumbBox.style.top = "0px";
							} else {
								thumbBox.style.top = parseInt(thumbBox.style.top) - 10 + "px";
							}
							
						}

						
						// thumbBox.style.top = (parseInt(thumbBox.style.top) + (evt.clientY - self.prevClientY))+"px";
						// 
						// document.getElementById("increase-thumb-size").dispatchEvent(new MouseEvent("click"));
					}
				
			}





		});


		document.addEventListener('keyup',function(evt){

			keystate[evt.keyCode] = false;
			// console.log("keystate:",keystate);
		});

		preview.addEventListener("did-start-loading", function(){
			// preview.reload();
			preview.addClass("loading-fadeout");
			if(preview.src === "http://10.240.30.11/releasemanager") {
				// console.log("release manager redirecting!!");
			}
			// else if(preview.src === "local/no-preview.html"){
			// 	console.log("preview src:#")
			// 	core.preview.init();
			// }
			


			// core.preview.init();
		  // preview.src = "local/currentPreview.html";
		});

		preview.addEventListener("dom-ready", function(){
			// preview.reload();

			// console.log("dom ready!!");
			if(preview.src === "http://10.240.30.11/releasemanager") {

				preview.insertCSS("body {background:white !important;} #Page, #Footer {border-radius:0 !important; box-shadow:none !important; background:white !important;} #Page #Toolbar { display:none; border:none !important; border-width:0 !important; border-radius:8px; border-top:none !important; border-bottom:none !important; background: rgb(210,210,210) !important; overflow:hidden;} #Page #Content { border-top:none !important;}");
			}





			setTimeout(function(){
				preview.rmClass("loading-fadeout");
			},50);



			// core.preview.init();
		  // preview.src = "local/currentPreview.html";
		});


	});

		


// Init CodeMirror
// ---------------
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
		



	// })
	// .run();
});
/* eslint-enable */

/* eslint-disable */
var core = Global.coreMethods = {
	updateApp: {
		pathToRepo: "/repos/qualtrics-themes-team/qualtrics-theme-suite/contents/",
		filesToCheck: ["index.html", "index.js", "preferences.html"],
		filesMap: {
			filesToUpdate:[]
		},
		processAborted: false,
		inProgress: false,

		init: function(){
			var self = this;
			if (self.inProgress) {
				return;
			}
			if(Prompter.isPrompting) {
				Prompter.hide();
				setTimeout(function(){
					self.checkFiles();
				}, 400);
			}
			else {
				self.checkFiles();
			}
		},

		checkFiles: function(){


			var self = this;
			var files = this.filesToCheck;
			var numFilesChecked = 0;
			self.inProgress = true;
			self.processAborted = false;

			Prompter.prompt({
					message: "Checking GitHub for changes...",
					mainBtn: {
						text: "Click to abort",
						onClick: function(){
							self.processAborted = true;
							Prompter.hide();
						}
					},
					btn2: null,
					btn3: null
				});

			function processRemoteGihtubFile(fileName, githubFileContents){
				self.filesMap[fileName] = {};
				fs.readFile(__dirname+"/"+fileName, "utf-8", function(err, localFileContents){
					if(err) return console.log("local read error:", err);
					// console.log(" ");
					// console.log(" ");
					self.filesMap[fileName].local = localFileContents;
					self.filesMap[fileName].github = githubFileContents;
					if(localFileContents !== githubFileContents) self.filesMap.filesToUpdate.push(fileName);
					numFilesChecked++;
					if(numFilesChecked === files.length){
						self.promptUpdate();
					}
				});
			}

			for(var i = 0, ii = files.length; i < ii; i++ ){
				self.getRemote(files[i], processRemoteGihtubFile);
			}
		},


		promptUpdate: function(){
			var self = this;
			Prompter.hide();

			if(self.processAborted){
				self.inProgress = false;
				self.processAborted = false;
				return console.log("Process was aborted");
			}

			//this timeout gives the Prompter time to hide before re-prompting
			setTimeout(function(){
				if(self.filesMap.filesToUpdate.length > 0){
					Prompter.prompt({
						message: "Update available...",
						mainBtn: {
							text: "Proceed with update",
							onClick: function(){
								Prompter.hide();
								// console.log("__dirname:", __dirname);
								self.updateFiles();
							}
						},
						btn2: {
							text: "Cancel",
							onClick: function(){
								Prompter.hide();
								setTimeout(function(){
									self.inProgress = false;
								// 	alert("Update Cancelled. You're a real jerk for not cancelling sooner...  \n\nI mean... uhhh... carry on!");
								}, 300);
							}
						},
						btn3: null
					});

				}
				else {
					self.inProgress = false;
					Prompter.prompt({
						message: "QTS is already up-to-date.",
						mainBtn: {
							text: "Click to kill this message",
							onClick: function(){
								Prompter.hide();
								setTimeout(function(){
									alert("You just killed that poor message. He had a wife and kids. But let me guess... it was just \"business\". Pshh. You're heartless.");
								}, 400);
								
								
							}
						},
						btn2: null,
						btn3: null
					});
				}
			}, 500);
				
		},
		getRemote: function(fileName, callback){
			var self = this;
			var https = require("https");
			var requestOptions = {
				hostname:"api.github.com",
				path:this.pathToRepo+fileName,
				method:'GET',
				headers: {'user-agent': 'electron-iojs'}
			};
			var req = https.request(requestOptions, function(res){
				var resBody = '';
				// console.log("RESPONSE:",res);
				res.on('data', function(chunk) {
					resBody += chunk.toString();
			  });


			  res.on("end", function(){
			  	// console.log("------");
			  	// console.log("resBody pre-parse:",resBody);
			  	try {
			  		resBody = JSON.parse(resBody);
				  	// console.log("resBody post-parse:",resBody);
				  	// console.log("resBody.content",resBody.content);
				  	var buff = new Buffer(resBody.content, 'base64');
				  	callback(fileName, buff.toString());
			  	}
			  	catch(e){
			  		console.error("uh-oh::",e);
			  		self.processAborted = true;
			  		Prompter.hide();
			  		alert("There was a minor hiccup with GitHub. Try again a a minute.")
			  	}
				  	
			    // console.log("Body: ", );
			    // console.log("File Contents:", buff.toString());
		    });
		
			});
			
			req.on('error', function(e) {
			  console.error('github error:',e);
			});
			req.end();
		},

		updateFiles: function(){
			var self = this;
			var files = self.filesMap.filesToUpdate;
			var errors = false;
			var updatedFiles = 0;
			if(files.length <= 0) return;


			function writeGithubFileToLocal(files, index){
				fs.writeFile(__dirname+"/"+files[index], self.filesMap[files[i]].github, function(err){
					if(err) {
						errors = true;
					}
					updatedFiles++;
					if(updatedFiles === files.length){
						self.inProgress = false;
						if(errors) {
							alert("Uh-oh... Looks like there was a minor hiccup. You may need to do this one manually");
							return; 
						}
						alert("You're all set! Knock 'em dead out there kiddo.\n\nRESTART THE APP!");
					}
				});
			}


			for(var i = 0, ii = files.length; i < ii; i++){
				writeGithubFileToLocal(files, i);
			}
		}

	},
	

	// ----------------------------
	//  Persistent Data File
	// ----------------------------
	persistentDataFile: {

		read: function (cb){
			console.error("dont use this method (persistentDataFile.read)");
			// fs.readJson(__dirname+"/local/persistent-data.json", function(err, _data) {
			// 	if(err) return Eve.emit("error", err);
			// 	if(util.isFunction(cb)) cb(_data);
			// });
		},

		update: function (cb){
			console.error("dont use this method (persistentDataFile.update)");
			// var _DATA = {};
			// _DATA.recentBrands = Brands.getRecent();
			// _DATA.snippets = core.localData.snippets.list;
			// //_DATA.x = core.localData.x;
			// fs.writeJson(__dirname+"/local/persistent-data.json", _DATA, function(err){
			// 	if(err) {
			// 		fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
			// 		alert("Error Saving Changes");
			// 	}
			// 	else if(cb!==undefined){
			// 		var args = Array.prototype.splice.call(arguments, 1);
			// 		cb.apply(null, args);
			// 	}
			// });
		}
		
	},

	// ----------------------------
	//  User Settings File
	// ----------------------------
	userSettingsFile: {
		read: function(_successCallback){
			console.error("dont use this method (userSettingsFile.read)");
			// fs.readJson(__dirname+"/local/user-settings.json", function(_err, _data){
			// 	if(!_err){ 
					
			// 		if(typeof _successCallback === "function") _successCallback(_data);
			// 	}
			// 	else {
			// 		fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
			// 		// console.log("User Settings READ ERROR:", _err);
			// 	}
			// });
		},

		update: function(_successCallback){
			console.error("dont use this method (userSettingsFile.update)");
			// var self = this;

			// if(core.localData.userSettings === null){
			// 	fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+"USER SETTEING ARE NULL?"+"\n\n", function(){});
			// 	alert("Error with settings, sucks to be you.");
			// 	return;
			// }

			// self.read(function(_data){
			// 	if(core.localData.userSettings !== _data){

			// 		fs.writeJson(__dirname+"/local/user-settings.json", core.localData.userSettings, function(err){
			// 			if(err) {
			// 				fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
			// 				alert("Error Saving Changes");
			// 			} 
							
			// 			else _successCallback();
			// 		});

			// 	}
			// });

			

			
		}
	},

	resetFinder: function(){
		console.error("dont use this method (resetFinder)");

		// Sync call to exec()
		// var version = exec('node --version', {silent:true}).output;

		// Async call to exec()
		// shelljs.exec('killall Finder', function(status, output) {
		//   console.log('Exit status:', status);
		//   console.log('Program output:', output);
		// });



		// function run_cmd(cmd, args, callBack ) {
		// 	var spawn = require('child_process').spawn;
		// 	var child = spawn(cmd, args);
		// 	var resp = "";

		// 	child.stdout.on('data', function (buffer) { resp += buffer.toString() });
		// 	child.stdout.on('end', function() { callBack (resp) });
		// }
		// run_cmd( "open Finder", ["-a"], function(text) { console.log (text) });
	},


	// ----------------------------
	//  Brands
	// ----------------------------
	brands: {

		getFullPathToBrands: function(){
			console.error("Do not use this method to get path to brands.");
			// return path.normalize(process.env.HOME+"/"+core.localData.brands.path);
		},

		select: function(_brandName){
			console.error("dont use this method (brands.select)");
			// add brand to recent brands, current brand
			// core.brands.setCurrentBrand(_brandName);
			// core.brands.projects.setCurrentProject(null);
		},

		create: function(_brandName, _CALLBACK){
			console.error("dont use this method (brands.create)");

			// var self = this;
			// // create folder with brands name
			// baton(function(){
			// 	self.exists(_brandName, this.next);
			// })
			// .then(function(exists){
			// 	var self = this;
			// 	if(exists) {
			// 		alert("Brand already exists. Nice try though.");
			// 	} else {
			// 		fs.mkdirp(core.brands.getFullPathToBrands()+"/"+_brandName, function(err){
			// 			if(!err) {
			// 				core.resetFinder();
			// 				self.next();
			// 			} else {
			// 				fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
			// 			}
			// 		});
			// 	}
				
			// })
			// .then(function(){

			// 	// editorCore.dropdowns.brands.close();
			// 	self.infoFile.create(_brandName);
			// 	_CALLBACK();
			// })();

		},

		

			
		/*
			Adds the current brand to the front of the recent brands
		*/
		updateRecentBrands: function(){
			console.error("dont use this method (brands.updateRecentBrands)");
			// var brand = core.localData.currentBrand;
			// var i = Brands.getRecent().indexOf(brand);
			// if(i !== -1) {
			// 	Brands.getRecent().splice(i, 1);
			// }
			// Brands.getRecent().unshift(brand);
			// core.persistentDataFile.update();
		},	

		setCurrentBrand: function(_brandName){
			console.error("dont use this method (brands.setCurrentBrand)");
			// core.localData.currentBrand = _brandName;
			// core.brands.updateRecentBrands();
		},


		exists: function(_brandName, _callback){
			console.error("dont use this method (brands.exists)");
			// var self = this;
			// // console.log(typeof core.localData.brands.path);
			// fs.stat(core.brands.getFullPathToBrands()+"/"+_brandName, function(err, stats){
			// 	if(err) {
			// 		fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
			// 		console.warn("brand does not exist:",err)
			// 		return _callback(false);
			// 	}

			// 	return _callback(stats.isDirectory());

			// });
		},


		hasInfoFile: function(_callback, _brandName){
			console.error("dont use this method (brands.hasInfoFile)");
			// console.error("do not use this method");
			// var self = this;
			// baton(function(){
			// 	//check if brand exists
			// 	self.exists(_brandName, this.next);
			// })
			// .then(function(_exists){
			// 	if(_exists){
			// 		this.next();
			// 	} 
			// 	else _callback(false);
			// })
			// .then(function(){
			// 	//check if brand has file
			// 	// console.log(typeof core.brands.getFullPathToBrands());
			// 	fs.stat(core.brands.getFullPathToBrands()+"/"+_brandName+"/"+self.infoFile.ext, function(err, stats){
			// 		if(err) {
			// 			fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
			// 			return _callback(false);
			// 		}

			// 		return _callback(stats.isFile());

			// 	});
			// })();
			
		},

		projects: {

			setCurrentProject: function(_projectName){
				console.error("dont use this method (projects.setCurrentProject)");
				// core.localData.currentProject.name = _projectName;
				// core.localData.currentProject.path = (_projectName !== null)
				// ?
				// (core.brands.getFullPathToBrands()+"/"+
				// core.localData.currentBrand+"/"+
				// core.localData.currentProject.name)
				// :
				// null
				// ;

			},

			infoFile: {

				update: function(pathToFile, key, value, callback){
					console.error("dont use this method (projects.infoFile.update)");
					fs.readFile(pathToFile, "utf-8", function(err, data){
						if(err, data){

						}
					});
				}
			},

			/*Runs a callback, passing it an array of the names of the projects*/
			list: function(_brandName, _callback){
				console.error("dont use this method (projects.list)");
				// baton(function(){
					
				// 	core.brands.exists(_brandName, this.next);
				// })
				// .then(function(exists){
				// 	if(exists){
				// 		var pathToBrand = core.brands.getFullPathToBrands() + "/" + _brandName;
				// 		this.next(pathToBrand);
				// 	}
				// })
				// .then(function(path){
				// 	var projectList = [];
				// 	// console.log(typeof path);
				// 	fs.readdir(path, function(_err, _projects){
				// 		if(_err) {
				// 			fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
				// 			// console.log("error listing projects");
				// 		}
				// 		for(var i = 0, ii = _projects.length; i < ii; i++){
				// 			var stats = fs.statSync(path+"/"+_projects[i]);
				// 			if(stats.isDirectory()) projectList.push(_projects[i]);
				// 		}
				// 		// currentBrand.projects = projectsList // ADD this
				// 		if(_callback!==undefined) _callback(projectList);
				// 	});
				// })();
				
				
				

			},

			create: function(_brandName, _projectName, _callback){
				console.error("dont use this method (projects.create)");
				// console.error("do not use this method");
				// var self = this;
				// // create folder with brands name
				// baton(function(){
				// 	core.brands.exists(_brandName, this.next);
				// })
				// .then(function(exists){
				// 	var self = this;
				// 	if(exists) {

				// 		// console.log(typeof core.brands.getFullPathToBrands());
				// 		fs.mkdirp(core.brands.getFullPathToBrands()+"/"+_brandName + "/" + _projectName, function(err){
				// 			if(!err) {
				// 				self.next();
				// 			} else {
				// 				fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
				// 			}
				// 		});
				// 	} else {
				// 		alert("Brand doesn't exists. Nice try though.");
				// 	}
					
				// })
				// .then(function(){
				// 	editorCore.dropdowns.projects.close();
				// 	if(_callback!==undefined) _callback();
				// 	// self.infoFile.create(_brandName);
				// })();
			},


			showInFinder: function(){
				console.error("dont use this method (projects.showInFinder)");
				// if(Projects.getCurrent().name !== null){
				// 	shelljs.exec('open '+core.localData.currentProject.path, function(status, output) {
				// 		// console.log('Exit status:', status);
				// 		// console.log('Program output:', output);
				// 	});
				// }
			},

			files: {
				current: {
					path: null,
					dirty: false
				},

				assets: function(_callback){
					console.error("dont use this method (projects.exists)");
					var projPath = Projects.getCurrent().path;
					var fileList = [];
					fs.readdir(projPath+"/assets", function(_err, _files){
						if(_err) {
							fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
							// console.log("error listing project assets");
						}
						// console.log("the files",_files);
						for(var i = 0, ii = _files.length; i < ii; i++){
							var stats = fs.statSync(projPath+"/assets/"+_files[i]);
							if(stats.isFile()) fileList.push(_files[i]);
						}
						// currentBrand.projects = projectsList // ADD this
						if(_callback!==undefined) _callback(fileList);
					});
				},


				viewImage: function(imgPath){
					console.error("dont use this method (projects.exists)");
					function updateImageDimensionsField(_image){
						var imgWidth = _image.width >= 700 ? "700+" : _image.width;
						var imgHeight = _image.height >= 650 ? "650+" : _image.height;
						document.getElementById("previewImgWidth").value = imgWidth;
						document.getElementById("previewImgHeight").value = imgHeight;
						console.log("updateImageDimensionsField");
					}

					

					function resizePreviewImage(imageElement) {
						var currentWidth = imageElement.width;
						var currentHeight = imageElement.height;
						var newHeight = parseFloat(document.getElementById("previewImgHeight").value);

						if( typeof newHeight !== "number" || isNaN(newHeight)){ 
							return; 
						}

						var ratio = newHeight/currentHeight;
						var newWidth = currentWidth*ratio;
						console.log("path",imageElement.dataset.path);

						var greaterValue = newHeight >= newWidth ? newHeight : newWidth;
						greaterValue = Math.round(greaterValue);


							function sipsCallback(code, output){
								console.log("test")
								imageElement.src = imageElement.dataset.path+"?"+(Date.now()+"");
							}

							shelljs.exec("sips -Z "+greaterValue+" "+imageElement.dataset.path, sipsCallback);

							


						// lwip.open(imageElement.dataset.path, function(err, image){


						// 	if(err) {

						// 		lwip.open(imageElement.dataset.path, 'png', function(err, image){
						// 			if(err) return console.error("lwip write error:",err);
						// 			image.resize(newWidth, newHeight, function(err, img){
						// 				img.writeFile(path.normalize(imageElement.dataset.path), function(err, img){
						// 					if(err) return console.error("lwip write error:",err);
						// 					console.log("resized image!");
						// 					imageElement.src = imageElement.dataset.path+"?"+(Date.now()+"");
						// 					// var cont = document.getElementById("image_preview_container");
						// 					// if(cont) {cont.rm();}		
						// 				});
						// 			});

						// 		});

						// 	} 
						// 	else {

						// 		image.resize(newWidth, newHeight, function(err, img){
						// 			img.writeFile(path.normalize(imageElement.dataset.path), function(err, img){
						// 				if(err) return console.error("lwip write error:",err);
						// 				console.log("resized image!");
						// 				imageElement.src = imageElement.dataset.path+"?"+(Date.now()+"");
						// 				// var cont = document.getElementById("image_preview_container");
						// 				// if(cont) {cont.rm();}		

						// 			});
						// 		});

						// 	}
								
						// });						

					}
					// image preview is removed at `editorCore.dropdowns.bodyClick`

					window.imagePreview = etc.template(function(){
						if(document.getElementById("image_preview_container")){
							var imgCont = document.getElementById("image_preview_container");
							var img = imgCont.getElementsByTagName('img')[0];
							img.src = imgPath+"?"+(Date.now()+"");
							img.dataset.path = imgPath;
							return;
						}

						var container = etc.el("div", {
							id:"image_preview_container",
							className:"light"
						});

						container.append(
							etc.el("div", {
								className: "change-image-bg-cont dark",
								events: {
									click: function(e){
										e.stopPropagation();										
										var imgCont = document.getElementById("image_preview_container");
										if(this.classList.contains("light")){
											this.classList.add("dark");
											this.classList.remove("light");
											imgCont.classList.remove("dark");
											imgCont.classList.add("light");
										} else {
											this.classList.remove("dark");
											this.classList.add("light");
											imgCont.classList.add("dark");
											imgCont.classList.remove("light");
										}
									}
								}
							})
						);

						container.append(
							etc.el("div", {
								className: "close-img-preview",
								events: {
									click: function(e){
										e.stopPropagation();
										var cont = document.getElementById("image_preview_container");
										if(cont) {cont.rm();}										
									}
								}
							}, "Close")
						);

						var resizeImgForm = etc.el("form", {
							id: "resizeImgForm",
							events: {
								click: function(e){
									e.stopPropagation();	
								}
							}
						})
						.append([
							etc.el("input", {
								id: "previewImgWidth",
								className: "readonly",
								attr: {
									readonly:""
								}
							})
						])
						.append([
							etc.el("span", {
								className: "x"
							}, "X")
						])
						.append([
							etc.el("input", {
								id: "previewImgHeight"
								// attr: {
								// 	// readonly:"",// REMOVE THIS LINE!!!
								// }
							})
						])
						.append([
							etc.el("input", {
								type: "submit",
								value: "Save Changes",
								id: "resizePreviewImgBtn",
								events: {
									click: function(e){
										e.preventDefault();
										var previewImage = document.getElementById("previewImage");
										resizePreviewImage(previewImage);
									}
								}
							})
						])

						// UNCOMMENT TO SEE RESIZING ***
						container.append(resizeImgForm);


						container.append(
							etc.el("img", {
								id: "previewImage",
								events: {
									load: function(){
										// UNCOMMENT TO SEE RESIZING ***
										updateImageDimensionsField(this);
									}
								},
								dataset: {
									path: this.props.path
								},
								src: this.props.path+"?"+(Date.now()+""),
								style: {
									maxHeight:'650px',
									maxWidth:'700px'
								}
							})
						);

						/*eslint-disable consistent-return */
						return container;
						/*eslint-enable consistent-return */

					});

					imagePreview.render({path:imgPath}, document.body);

					
					// shelljs.exec('open '+path, function(status, output) {
						// console.log('Exit status:', status);
					// 	console.log('Program output:', output);
					// });
				},

				/*Returns array of file names at current project path path*/
				list: function(_callback){ 

					var path = core.localData.currentProject.path;
					
					var fileList = [];
					fs.readdir(path, function(_err, _files){
						if(_err) {
							fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
							// console.log("error listing projects");
						}
						for(var i = 0, ii = _files.length; i < ii; i++){
							var stats = fs.statSync(path+"/"+_files[i]);
							if(stats.isFile()) fileList.push(_files[i]);
							if(stats.isDirectory() && _files[i] === "assets"){
								// console.log("has assets folder!!!");
							}
						}
						// currentBrand.projects = projectsList // ADD this
						if(_callback!==undefined) _callback(fileList);
					});

				}
			}

		}

	},


	// ----------------------------
	//  Local Temp Data
	// ----------------------------
	localData: {
		// brands: {
		// 	path: null,
		// 	current: {
		// 		name: null
		// 	},
		// 	list: [],
		// 	recent: []
		// },
		// userSettings: null,
		// currentBrand: null,
		// currentProject: {
		// 	name: null,
		// 	path: null
		// },


		// currentFile:{
		// 	name: null,
		// 	path: null,
		// 	dirty: null,
		// 	isNew: true,
		// 	watch: null,
		// 	clear: function(){
		// 		var self = this;
		// 		self.name = self.path = self.dirty = null;
		// 	}
		// },

		previewQuestionFiles: {
			list: [],
			current: {
				name: null,
				path: null
			}


		},

		snippets: {
			list: null,

			readFromPersistentData: function(_callback, force){
				// if local data is null
				if(core.localData.snippets.list === null || Brands.getRecent().length === 0 || force === true){
					core.persistentDataFile.read(function(_persistent_data){
						// console.log("persistent-data recent brands", _persistent_data.snippets)
						core.localData.snippets.list = _persistent_data.snippets;
						// console.log("1a) recentbrands:",Brands.getRecent());
						if(_callback) _callback();
					})
				} 
			},

			writeToPersitentData: function(_callback){
				core.persistentDataFile.read(function(_persistent_data){
					_persistent_data.snippets = core.localData.snippets.list;

					// console.log("new persistent-data"), _persistent_data;

					var _persistent_data = JSON.stringify(_persistent_data);

					fs.writeFile(__dirname+"/local/persistent-data.json", _persistent_data, function(err){
						if(err) {
							fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
							alert("Error Saving Changes");
						}
						if(_callback) _callback();
					});

					
				});
			},

			updateContextMenu: function(){

			}


		},

		pathToBaseFiles: __dirname+"/local/BaseFiles",

		updateUserSettings: function(_callback){ // should only be run on app init
			var self = this;
			core.userSettingsFile.read(function(_data){
				if(self.userSettings === null || core.localData.userSettings !== _data){
					self.userSettings = _data;
					self.brands.path = self.userSettings.files.brands.path;

					self.setCurrentPreviewQuestionsFile(_data.files.defaultPreviewFile);

					if(_callback) _callback();
				}
				
			});
		},



		updatePreviewFilesList: function(_callback){

			fs.readJson(__dirname+"/local/user-settings.json", function(_err, _data){
				if(!_err){ 
					
					if(typeof _successCallback === "function") _successCallback(_data);
				}
				else {
					fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
					// console.log("User Settings READ ERROR:", _err);
				}
			});
			if(_callback) _callback();
		},



		updateBrandsList: function(_CALLBACK){
			console.error("Do not use this method `updateBrandsList`");
			// var pathToBrands = core.localData.brands.path;
		
			// if(!core.localData.userSettings.files.brands.path) {
			// 	setTimeout(function(){
			// 		Prompter.prompt({
			// 			message:"Brands File Path: "+process.env.HOME+"/",
			// 			type: "question",
			// 			input: {
			// 				placeholder: "Desktop"
			// 			},
			// 			mainBtn:{
			// 				text:"Ok",
			// 				onClick: function(){
			// 					var prompterInput = document.getElementById("prompterInput");

			// 					if(prompterInput.value.length > 0){

			// 						Prompter.hide();
			// 						core.localData.userSettings.files.brands.path = prompterInput.value;
			// 						core.localData.brands.path = prompterInput.value;
			// 						console.log("core.localData.userSettings",core.localData.userSettings)
			// 						core.userSettingsFile.update(function(){
			// 							if(_CALLBACK) _CALLBACK();
			// 						});
									

			// 					}
			// 				}
			// 			}
			// 		});
			// 	}, 350);

			// } 
			// else {
				// var pathToBrands = core.brands.getFullPathToBrands();
				// var brandList = [];

				// fs.readdir(pathToBrands, function(_err, _files){
				// 	if(_err) {
				// 		fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
				// 		// console.log("error");
				// 	}
				// 	for(var i = 0, ii = _files.length; i < ii; i++) {
				// 		var stats = fs.statSync(pathToBrands+"/"+_files[i]);
				// 		if(stats.isDirectory()) brandList.push(_files[i]);
				// 	}
				// 	core.localData.brandList = brandList;
				// 	if(_CALLBACK!==undefined) _CALLBACK();
				// });

			// }

				
		},

		rmFromRecentBrands: function(_brandName, _CALLBACK){
			var brandNameIndex = Brands.getRecent().indexOf(_brandName)
			if(brandNameIndex !== -1){
				Brands.getRecent().splice(brandNameIndex, 1);
				core.persistentDataFile.update();
			}
			_CALLBACK();
		},

		updateRecentBrands: function(_CALLBACK){
			console.warn("Should not being using this method, use Eve.('Update Local Recent Brands');");
			/* Main purpose of this method is to: (1) Set the local recent brands 
			in case its null, and (2) Add the current brand to the front of recent 
			brands if its not already there */

			// if local data is null
			// if(Brands.getRecent() === null || Brands.getRecent().length === 0){
			// 	core.persistentDataFile.read(function(_persistent_data){
			// 		// console.log("persistent-data recent brands", _persistent_data.recentBrands)
			// 		Brands.getRecent() = _persistent_data.recentBrands;
			// 		// console.log("1a) recentbrands:",Brands.getRecent());
			// 		_CALLBACK();
			// 	})
			// } 
			
			// else {

			// 	// if current brand is not the most recent brand
			// 	if(core.localData.brands.current.name !== null && Brands.getRecent()[0] !== core.localData.brands.current.name){
			// 		Brands.getRecent().unshift(core.localData.currentBrand);
			// 		core.persistentDataFile.update(function(){
			// 			// console.log("1b) recentbrands:",Brands.getRecent());
			// 			_CALLBACK();
			// 		});
					
			// 	} 

			// 	// local recent brands is up to date
			// 	else {
			// 		// console.log("1c) recentbrands:",Brands.getRecent());
			// 		_CALLBACK();
			// 	}
			// }
		},

		filterBrands: function(criteria){
			console.log("criteria:",criteria);
			console.warn("this method is cursed!");
			var matches = [];
			for(var i = 0, ii = core.localData.brandList.length; i < ii; i++){
				if(core.localData.brandList[i].slice(0,criteria.length).toUpperCase() === criteria.toUpperCase()) {
					matches.push(core.localData.brandList[i]);
				}
			}
			return matches;
		},

		setCurrentFile: function(_fileName){
			core.localData.currentFile.name = _fileName;
			core.localData.currentFile.path = core.localData.currentProject.path+"/"+core.localData.currentFile.name;

		},

		setCurrentPreviewQuestionsFile: function(_fileName){
			// console.log("filename:",_fileName);
			var path = __dirname+"/local/preview-files";
			this.previewQuestionFiles.current.name = _fileName;
			this.previewQuestionFiles.current.path = path+"/"+_fileName;
			if(core.localData.currentProject.name !== null){
				core.preview.mode.regular.hardRefresh();
			}

		}
	},



	getFiles: function(path, _callback){
		var fileList = [];
		fs.readdir(path, function(_err, _files){
			if(_err) {
				fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
				// console.log("error getting files");
			}
			for(var i = 0, ii = _files.length; i < ii; i++){
				var stats = fs.statSync(path+"/"+_files[i]);
				if(stats.isFile()) fileList.push(_files[i]);
			}
			// currentBrand.projects = projectsList // ADD this
			if(_callback!==undefined) _callback(fileList);
		});
	},

	updateEditor: function() {

		var ext = path.extname(core.localData.currentFile.name);
		
		var extMap = {
			".html": "htmlmixed",
			".css": "css",
			".scss": "text/x-scss",
			".styl": "text/x-styl",
			".js": "javascript",
			".qtheme": "application/json",
			".json": "application/json",
			".md": "markdown"
		}

		if(extMap.hasOwnProperty(ext.toLowerCase())){
			if(myCodeMirror.getOption("mode") !== extMap[ext]){
				myCodeMirror.setOption("mode", extMap[ext]);
			}	
		}
		else {
			myCodeMirror.setOption("mode", "");
		}

		fs.readFile(core.localData.currentFile.path, "utf-8", function(err, data){
			if(err){ 
				fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
				// console.log("ERR",err);
			}
			else {
				myCodeMirror.setValue(data);
				myCodeMirror.markClean();
			}
		});

	},

	prompt: function(_dialogue, _confirm, _cancel, _confirmCallback){


	},


	codeMirror: {
		active: false,
		activate: function(){
			this.resetContextMenu();

			if(this.active === false){

				var codeMirrorCover = el("#codeMirror-cover");
				codeMirrorCover.addClass("hide");
				setTimeout(function(){
					codeMirrorCover.addClass("remove");
				},200);

				this.active = true;
				

			}
		},
		
		deactivate: function(){
			if(this.active === true){

				var codeMirrorCover = el("#codeMirror-cover");
				codeMirrorCover.rmClass("remove");
				setTimeout(function(){
					codeMirrorCover.rmClass("hide");
				},0);


				this.active = false;
				
				core.localData.currentFile.clear();
			}
		},


		saveEditorFile: function(){
			if(core.localData.currentFile.path !== null){
				fs.writeFile(core.localData.currentFile.path, myCodeMirror.getValue(), function(err){
					if(err){ 
						fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
						// console.log("ERR",err);
					}
					else {
						
						Eve.emit("Code Editor Saved");
						
						
					}
				});
			}
				
		},


		dirtyWatch: function(){
			myCodeMirror.on("change", function(){
				if(core.localData.currentFile.isNew === true){
					core.localData.currentFile.isNew = false;
				} else {
					if(!myCodeMirror.isClean()){
						editorCore.dropdowns.files.setDirty();
					} else {
						editorCore.dropdowns.files.setClean();
					}
				}
			})
		},

		resetContextMenu: function(){
			// 'menu' is declared in main.js
			menu = new Menu();
			var recentSnippetsList = [];
			fs.readFile(__dirname+"/local/persistent-data.json", function(_err, _data){
				if(!_err) {
					recentSnippetsList = JSON.parse(_data).snippets.slice(0,15);

					menu.append( new MenuItem({ label: 'Insert Snippet', enabled: false }) );
					for(var i = 0, ii = recentSnippetsList.length; i < ii; i++){
						menu.append( new MenuItem({ 
							label: recentSnippetsList[i].name ,
							thisSnippet: recentSnippetsList[i],

							/*eslint-disable no-loop-func */
							click: (function(i){
								var index = i;
								return function(){
									myCodeMirror.replaceSelection(recentSnippetsList[index].code);
								}
							})(i)
							/*eslint-disable no-loop-func */

						}) );
					}


				} else {
					fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
				}
			});
		}

	},


	flash: function(pinnacleCallback){
		var flash = el("+div").attr("style", "height:100%; width:100%; background:white; position:absolute; top:0; left:0; z-index:1000000; opacity:0; transition:opacity .1s ease;");
		el("#body").append(flash);


		var flashBaton = fang(
			function(){
				flash.style.opacity = 1;
				setTimeout(this.next, 100);
			},
			function(){
				flash.style.transition = "opacity .4s ease";
				setTimeout(function(){ flash.style.opacity = 0; } ,0);
				if(typeof pinnacleCallback === "function") pinnacleCallback();
				setTimeout(this.next, 500);
			},
			function(){
				flash.rm();
			}
		);

		flashBaton.init();

	
	},


	/*
	core project modes (edit/preview, release manager, ??ticket view)
	*/
	mode: {
		currentMode: "edit/preview",
		releaseManager: function(){
			preview.src = "http://10.240.30.11/releasemanager";
			core.preview.active = false;
			this.currentMode  = "releaseManager";
		},
		edit_preview: function(){
			// console.log("switching to edit/preview mode");
			core.preview.init();
			this.currentMode  = "edit/preview";
		}
	}
};
/* eslint-enable */





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
	
/* eslint-disable */
var dimmer = {
	on: function() {
		var _dimmer = el("+div").addClass("dimmer");
		el("body").append(_dimmer);
		setTimeout(function(){
			el(".dimmer")[0].addClass("show");
		},10);
	},
	off: function(){
		core.localData.updateUserSettings(function(){
			var _dimmer = el(".dimmer").rmClass("show");

			// if dropdowns are open, close them
			if(editorCore.dropdowns.projects.status === "opened") editorCore.dropdowns.projects.close();
			if(editorCore.dropdowns.brands.status === "opened") editorCore.dropdowns.brands.close();

			setTimeout(function(){
				_dimmer.rm();
				_dimmer = null;
			},500);
		});
	}
};

(function(){
	window.Prompter = {
		isPrompting: false,

		prompt: function(_promptObj){

			if(Prompter.isPrompting) return;
			Prompter.isPrompting = true;
			//show Prompter
			// Prompter.container.purge();

			Prompter.container = el("+section#Prompter").attr("style", "position:relative; z-index:10000;");

			if(_promptObj.message !== null && _promptObj.message !== undefined){
				Prompter.messageCont = Prompter.container.append( el("+div").addClass("message").text(_promptObj["message"]) );
			}

			if(typeof _promptObj.type !== "undefined" && _promptObj.type === "question"){
				var prompterInput = el("+input#prompterInput").addClass("prompterInput");

				if(_promptObj.input && _promptObj.input.placeholder) {
					prompterInput.setAttribute("placeholder", _promptObj.input.placeholder);
				}
				
				Prompter.container.append( prompterInput );
			}

			if(_promptObj.btn3 !== null && _promptObj.btn3 !== undefined){
				Prompter.container.append( el("+div").addClass(["btn", "btn3"]).text(_promptObj.btn3.text) );
				Prompter.container.el(".btn3")[0].onclick = _promptObj.btn3.onClick;
			}
			if(_promptObj.btn2 !== null && _promptObj.btn2 !== undefined){
				Prompter.container.append( el("+div").addClass(["btn", "btn2"]).text(_promptObj.btn2.text) );
				Prompter.container.el(".btn2")[0].onclick = _promptObj.btn2.onClick;
			}
			if(_promptObj.mainBtn !== null && _promptObj.mainBtn !== undefined){
				Prompter.container.append( el("+div").addClass(["mainBtn", "btn"]).text(_promptObj.mainBtn.text) );
				Prompter.container.el(".mainBtn")[0].onclick = _promptObj.mainBtn.onClick;
			}

			el("#body").append(Prompter.container);

			//show Prompter
			dimmer.on();
			
			// el("body")[0].append( el("+div").addClass("overlay") )
			setTimeout(function(){
				Prompter.container.addClass("show");
				if(_promptObj.type === "question") {
					document.getElementById("prompterInput").focus();
				}
			}, 150);
		},

		hide: function(){
			if(!Prompter.isPrompting) return null;
			Prompter.container.rmClass("show");
			dimmer.off();
			Prompter.isPrompting = false;
			setTimeout(function(){
				Prompter.container.rm();
			}, 300);
		},

		setBtn: function(){

		}

	};
})();
/* eslint-enable */

/* eslint-disable */
(function(){
	window.Quitter = {
		quit: function(){
			remote.getGlobal("sharedObject").canQuit = true;
			app.quit();
		},
		prompt: function(){
			(Saver.isSaved()) 
			? //true
				Prompter.prompt({
					message: "Quit?",
					mainBtn: {
						text: "Yes",
						onClick: Quitter.quit
					},
					btn2: {
						text: "No",
						onClick: Quitter.cancel
					},
					btn3: null,
				}) 
			: //false
				Saver.prompt()
			;
		},
		cancel: function(){
			Global.canQuit = false;
			Prompter.hide();
			console.log("Quit Cancelled");
		}
	};
})();
/* eslint-enable */

(function(){
	window.Saver = {
		prompt: function(){
			alert("Save Changes?");
		},
		isSaved: function(){
			return true;
		}
	};
})();

/* eslint-disable */
core.preview = {
	active: false,
	

	init: function(){
		// console.log("init edit_preview => regular mode")
		if(Projects.getCurrent().name !== null){
			preview.src = path.normalize(__dirname+"/local/currentPreview.html");
			this.active = true;
		} else {
			this.deactivate();
		}
	},

	deactivate: function(){
		preview.src = path.normalize(__dirname+"/local/no-preview.html");
		this.active = false;
	},

	// sub-modes within the core edit/preview mode
	mode: {
		currentMode: "regular",


		regular: {

			skinFileWatcher: null,
			cssFileWatcher: null,

			enable: function(){
				// console.log("switching to edit/preview => regular mode");
				if(core.preview.mode.currentMode === "thumbnail"){
					// console.log("deactivating edit/preview => thumbnail mode");
					core.preview.mode.thumbnail.deactivate();
				}
				if(core.preview.mode.currentMode === "screenshot"){
					core.preview.mode.screenshot.deactivate();
				}

				if(core.localData.currentProject.name !== null){
					preview.src = path.normalize(__dirname+"/local/currentPreview.html");
					this.hidden = false;
				} 
				else {
					this.disable();
				}
				core.preview.init();	
				core.preview.mode.currentMode = "regular";
			},


			disable: function(){
				// console.log("disabling preview");
				preview.src = path.normalize(__dirname+"/local/no-preview.html");
				this.hidden = true;
			},

			map: {
				"{~ProgressBar~}": '<div role="widget"><table class="ProgressBarContainer" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="18"><tbody><tr><td>0%</td><td><div class="ProgressBarFillContainer" id="ProgressBarFillContainer"><div class="ProgressBarFill" style="width: 18%"></div></div></td><td>100%</td></tr></tbody></table></div>',

				"{~Header~}":"",

				"{~Buttons~}": '<input id="PreviousButton" type="button" value="Back" name=""><input id="NextButton" onkeypress="if(!this.disabled){Qualtrics.SurveyEngine.navEnter(arguments[0],this, "NextButton"); };  " onclick="Qualtrics.SurveyEngine.navClick(event, "NextButton")" title=" Next " type="submit" name="NextButton" value="Next">',

				"{~Footer~}":""
			},


			compileSass: function(){
				return gulp.src(core.localData.currentProject.path+"/StyleSheet.scss")
					.pipe(sass()).on('error', function(e){
						fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+e+"\n\n", function(){});
						alert("Sass Error!\nLine: "+e.line+"\n\""+e.message+"\"");
					})
					.pipe(autoprefixer())
					.pipe(minifyCss())
					.pipe(gulp.dest(core.localData.currentProject.path+"/"));
					// return stream;
			},

			clearWatchers: function(){
				// console.log("Clearing Watchers");
				var self = this;
				if(self.cssFileWatcher !== null){
					self.cssFileWatcher.close();
					self.cssFileWatcher = null;
				}
				if(self.skinFileWatcher !== null){
					self.skinFileWatcher.close();
					self.skinFileWatcher = null;
					
				}
			},

			setWatchers: function(_callback){
				// console.log("Setting Watchers:",_callback);

				var self = this;
				self.watchCssFile(function(_err){

					if(_err && _callback) {
						fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\twatch css file error\n"+_err+"\n\n", function(){});
						// console.log("watch css file error");
						return _callback(_err);
					}

					self.watchSkinFile(function(_err){
						if(_callback) {
							if(_err){
								fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\twatch skin file error\n"+_err+"\n\n", function(){});
							}
							// console.log("running set watcher callback");
							return _callback(_err);
						}
					});

				});
				

			},

			watchCssFile: function(_callback){
				var self = this;
				var path = core.localData.currentProject.path+"/StyleSheet.css";
				// console.log("ok, we are in the watch css");
				// try{
					fs.stat(path,function(_ERR){
						if(_ERR) {
							fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_ERR+"\n\n", function(){});
							console.warn("error watching CSS File:",_ERR);
							// console.log("");
							self.disable();
							if(_callback) _callback(true);
						}
						else {
							// console.log("path",core.localData.currentProject.path);
							self.cssFileWatcher = fs.watch(path, function(){
								// console.log("css changed!!!!");
								self.update(function(){
									setTimeout(function(){
										self.reload();
									}, 0);
								});
								
							});
							// console.log("no problemo with css");
							if(_callback) _callback(false);
							
						}
					})
							
				
				// }
				// catch(e){
					


					// if(_callback) return _callback(true);
				// }
					
				
			},

			watchSkinFile: function(_callback){
				var self = this;
				var path = core.localData.currentProject.path+"/Skin.html";

				fs.stat(path,function(_ERR){
					if(_ERR) {
						fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_ERR+"\n\n", function(){});
						console.warn("error watching CSS File:",_ERR);
						// console.log("");
						self.disable();
						if(_callback) _callback(true);
					}
					else {
						// console.log("path",core.localData.currentProject.path);
						self.skinFileWatcher = fs.watch(path, function(){
								self.update(function(){
									setTimeout(function(){
										self.reload();
									}, 0);
								});
						});
						// console.log("no problemo with skin");
						if(_callback) _callback(false);
					}
				});

					
				
			},



			reload: function(){
				// console.log("===runing reload===");
				function reloadPreview(){
					if(this.hasClass("active") && core.localData.currentProject.name !== null){
						var self = this;
						this.addClass("reloading");
						// preview.src=__dirname+"/local/no-preview.html";

						
						setTimeout(function(){
							core.preview.init();
							setTimeout(function(){
								preview.reloadIgnoringCache();
							}, 50);
						}, 50);
							
						
						setTimeout(function(){
							self.rmClass("reloading");
						}, 300);
					}
				}


				reloadPreview.bind(el("#refreshPreviewBtn"))();

			},

			update: function(_callback){
				// to run, use:  core.preview.update();
				// console.log("===runing update===");
				var self = this;
				// console.log("Updating current project:",core.localData.currentProject.name);
				fs.readFile(core.localData.currentProject.path+"/Skin.html", "utf-8", function(_errHtml, _html){
					if(_errHtml){ 
						fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_errHtml+"\n\n", function(){});
						console.error("ERR",_errHtml);
					}
					else {

						fs.readFile(core.localData.previewQuestionFiles.current.path, "utf-8", function(_errPreviewQuestions, _previewQuestions){
							if(_errPreviewQuestions){ 
								fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_errPreviewQuestions+"\n\n", function(){});
								console.error("ERR",_errPreviewQuestions);
							}
							else {

								fs.readFile(__dirname+"/local/previewTemplate.html", "utf-8", function(err,data){
									var newPreview = data.replace(
										"{~StyleSheet.css~}", path.resolve(core.localData.currentProject.path+"/StyleSheet.css")
									).replace(
										"{~SKIN.HTML~}", _html
									).replace(
										"{~ProgressBar~}", self.map["{~ProgressBar~}"]
									).replace(
										"{~Header~}", self.injectionHeader.value
									).replace(
										"{~Question~}", _previewQuestions
									).replace(
										"{~Buttons~}", self.map["{~Buttons~}"]
									).replace(
										"{~Footer~}", self.map["{~Footer~}"]
									).replace(
										"{~SKIN.HTML~}", _html
									);
									// console.log("")
									// console.log("")
									// console.log("new cuurentPreview.html (PRE-WRITE)::")
									// console.log("")
									// console.log(newPreview);

									setTimeout(function(){
										fs.writeFile(__dirname+"/local/currentPreview.html", newPreview, function(err){
											if(err) alert("ERROR!");
											// console.log("")
											// console.log("")
											// console.log("")
											// console.log("new cuurentPreview.html (POST-WRITE)::")
											// console.log("")
											// console.log(fs.readFileSync(__dirname+"/local/currentPreview.html", "utf-8")); 
											if(typeof _callback !== "undefined") _callback();
										});
									},0);

								});
										

							}
						});
					}
				});
			},

			injectionHeader: {
				value: "",
				on: function(){
					var self = this;
					self.value = "Header Text Area";
					core.preview.mode.regular.update(function(){
						core.preview.mode.regular.reload();
					});
				},
				off: function(){
					var self = this;
					self.value = "";
					core.preview.mode.regular.update(function(){
						core.preview.mode.regular.reload();
					});
				}
			},


			hardRefresh: function(){
				var self = this;

				ipc.send('asynchronous-message', 'disablePreviewModes');

				core.preview.deactivate();

				setTimeout(function(){

					fs.readFile(core.localData.currentProject.path+"/Skin.html", "utf-8", function(_errHtml, _html){
						if(_errHtml){ 
							fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_errHtml+"\n\n", function(){});
							console.error("ERR",_errHtml);
						}
						else {

							fs.readFile(core.localData.previewQuestionFiles.current.path, "utf-8", function(_errPreviewQuestions, _previewQuestions){
								if(_errPreviewQuestions){ 
									fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_errPreviewQuestions+"\n\n", function(){});
									console.error("ERR",_errPreviewQuestions);
								}
								else {
									// console.log("HARD REFRESH, rewriting preview file");

									fs.readFile(__dirname+"/local/previewTemplate.html", "utf-8", function(err,data){
										var newPreview = data.replace(
											"{~StyleSheet.css~}", core.localData.currentProject.path+"/StyleSheet.css"
										).replace(
											"{~SKIN.HTML~}", _html
										).replace(
											"{~ProgressBar~}", self.map["{~ProgressBar~}"]
										).replace(
											"{~Header~}", self.injectionHeader.value
										).replace(
											"{~Question~}", _previewQuestions
										).replace(
											"{~Buttons~}", self.map["{~Buttons~}"]
										).replace(
											"{~Footer~}", self.map["{~Footer~}"]
										).replace(
											"{~SKIN.HTML~}", _html
										);
										// console.log("")
										// console.log("new cuurentPreview.html (pre-write)::", newPreview);
											

										setTimeout(function(){

											fs.writeFile(__dirname+"/local/currentPreview.html", newPreview, function(err){
												if(err) alert("ERROR!");
												// console.log("")
												// console.log("new cuurentPreview.html (POST-write)::", fs.readFileSync(__dirname+"/local/currentPreview.html", "utf-8")); 

												setTimeout(function(){
													core.preview.init();

													ipc.send('asynchronous-message', 'enablePreviewModes');
												},300);
											});
										},300);

	
										
									});

									

								}
							});
						}
					});

				}, 500)


					


			}
		},


		devices: {

			active: false,

			enable: function(){
				// console.log("switching to edit/preview => regular mode");
				if(core.preview.mode.currentMode === "thumbnail"){
					// console.log("deactivating edit/preview => thumbnail mode");
					core.preview.mode.thumbnail.deactivate();
				}
				else if(core.preview.mode.currentMode === "regular"){
					core.preview.mode.regular.disable();
				}
				else if(core.preview.mode.currentMode === "screenshot"){
					core.preview.mode.screenshot.deactivate();
				}

				if(core.localData.currentProject.name !== null){
					preview.src = __dirname+"/local/currentPreview.html";
					this.hidden = false;
				} 
				else {
					this.disable();
				}
				core.preview.init();	
				core.preview.mode.currentMode = "regular";
			}

		},

		
		thumbnail: {

			active: false,

			enable: function(){
				if(core.preview.mode.currentMode === "thumbnail"){
					return;
				}
				else if(core.preview.mode.currentMode === "screenshot"){
					core.preview.mode.screenshot.deactivate();
				}
				core.preview.mode.thumbnail.init();
				core.preview.mode.currentMode = "thumbnail";
			},

			init: function(){
				var self = this;

				if(core.localData.currentProject.name !== null) {
					self.active = true;
					
					self.box.create(function(_box){
							self.box.init(_box);
					});

					self.interface.create(function(_interface){
						self.interface.init(_interface);
					});

					editorCore.deactivate();
				}

			},

			deactivate: function(){
				// console.log("(2) deactivating edit/preview => thumbnail mode");
				el("#thumbBox").rm();
				el("#thumbInterface").rm();
				// console.log("finished deactivating edit/preview => thumbnail mode");
				editorCore.activate();
				this.active = false;

				this.box.mode = null;
				this.box.ratio.multiplier = 4;
				this.box.x = this.box.y = this.box.w = this.box.h = null;
				this.box.prevClientX = this.box.prevClientY = null;

				this.interface.mode = null;

			},


			capture: function(){
				var self = this;
				//hide #thumbBox before the screenshot
				var thumbBoxContainer = document.getElementById("thumbBox");
				thumbBoxContainer.style.visibility = "hidden";
				setTimeout(function(){
					Global.mainWindow.capturePage({
						x: self.box.getX(), 
						y: self.box.getY(), 
						width: self.box.getWidth(), 
						height: self.box.getHeight()
					},function(_img){
						setTimeout(function(){
							thumbBoxContainer.style.visibility = "visible";
						},0);
						
						var pngImgBuff = _img.toPng();

						core.flash(function(){
							el("#thumbBox").rmClass("screenshot-in-progress");
						});

						lwip.open(pngImgBuff, 'png', function(err, _image){
							_image.resize(self.box.ratio.width, self.box.ratio.height, function(){
								_image.writeFile(core.localData.currentProject.path+"/Thumb.gif", "png", function(err){
									if(err) {
										fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
										return console.error("ERR:",err);
									}
								});
							});
					  });
					});
				}, 0);
			},



			box: {

				mode: null, //resize, move, idle

				getWidth: function(){
					return parseInt(el("#thumbBox").style.width);
				},
				getHeight: function(){
					return parseInt(el("#thumbBox").style.height);
				},
				getX: function(){
					return parseInt(el("#thumbBox").style.left);
				},
				getY: function(){
					return parseInt(el("#thumbBox").style.top);
				},

				ratio: {
					/*This is where the thumbnail size is set
					*/
					height: 65,
					width: 110,
					multiplier: 4,
					increment: function(){
						if(this.multiplier < 15){
							this.multiplier += 0.5;
							this.calibrate();
						}
					},
					decrement: function(){
						if(this.multiplier > 1){
							this.multiplier -= 0.5;
							this.calibrate();
						}
					},
					calibrate: function(){
						var self = this;
						// console.log("==",el("#thumbBox").style.width);
						el("#thumbBox").style.width = (self.width * self.multiplier)+"px";
						el("#thumbBox").style.height = (self.height * self.multiplier)+"px";
					}
				},

				x: null,
				y: null,
				w: null,
				h: null,
				prevClientX: null,
				prevClientY: null,
				
				create: function(_callback){
					var self = this;

					if(self.mode === null && core.localData.currentProject.name !== null){
						// console.log("creating box");
						var box = el("+div#thumbBox").attr("data-mode", "idle").attr("draggable", "false");
						if(typeof _callback === "function")_callback(box);
						self.mode = "idle";
					}

				},


				init: function(box){
					var self = this;

					self.mode = "idle";
					// console.log("starting thumb viewer:", box);
					box.style.width = (self.ratio.width*4)+"px";
					box.style.height = (self.ratio.height*4)+"px";
					box.style.top = "3px";
					box.style.left = "3px";

					var counter = 0;

					box.on("mousedown", function(evt){
						this.addClass("grabbing");
						self.mode = "move";
						// console.log("mousedown:",evt);
						self.prevClientX = evt.clientX; 
						self.prevClientY = evt.clientY; 
					});

					box.on("mousemove", function(evt){
						if(self.mode === "move"){
							this.style.left = (parseInt(this.style.left) + (evt.clientX - self.prevClientX))+"px";
							this.style.top = (parseInt(this.style.top)+(evt.clientY - self.prevClientY))+"px";
							self.prevClientX = evt.clientX; 
							self.prevClientY = evt.clientY; 
						}
					});

					box.on("mouseup", function(){
						this.rmClass("grabbing");
						self.mode = "idle";
						self.prevClientX = null; 
						self.prevClientY = null; 
					});

					box.on("mouseout", function(){
						box.rmClass("grabbing");
						self.mode = "idle";
						self.prevClientX = null; 
						self.prevClientY = null; 
					});

					el("#body").append(box);

				}

			},


			interface: {
				mode: null, //resize, move, idle

				init: function(_interface){
					var self = this;
					// console.log("starting interface:", _interface);
					el("#body").append(_interface);

					el("#decrease-thumb-size").addEventListener("click", function(){
						core.preview.mode.thumbnail.box.ratio.decrement();
					});

					el("#increase-thumb-size").addEventListener("click", function(){
						core.preview.mode.thumbnail.box.ratio.increment();
					});

					el("#thumbCamera").addEventListener("click", function(){
						core.preview.mode.thumbnail.capture();
					});

					el("#thumbCamera").onmouseover = function(){
						el("#thumbBox").addClass("screenshot-in-progress");
					}

					el("#thumbCamera").onmouseout = function(){
						el("#thumbBox").rmClass("screenshot-in-progress");
					}

				},


				create: function(_callback){ // comes before init
					var self = this;

					if(self.mode === null && core.localData.currentProject.name !== null){
						// console.log("creating box");
						var box = el("+div#thumbInterface").append(
							el.join([
								el("+section").append(
									el.join([
										el("+div").addClass("interface-header").text("Thumnail Size"),
										el("+div#decrease-thumb-size").addClass(["decrease-thumb-size", "thumbSizeBtn"]).text("–"),
										el("+div#increase-thumb-size").addClass(["increase-thumb-size", "thumbSizeBtn"]).text("+")
									])
								),
								el("+section").append(
									el.join([
										el("+div").addClass("interface-header").text("Capture"),
										el("+a#thumbCamera").addClass("interface-camera").attr("href","#").append(
											el("+img").addClass("interface-camera").attr("src","local/images/camera.svg")
										)
									])
								)
							])
						);
						self.mode = "idle";
						
						if(typeof _callback === "function")_callback(box);
						
					}
				}
			}

		},

		screenshot: {

			active: false,
			enable: function(){
				if(core.preview.mode.currentMode === "thumbnail"){
					core.preview.mode.thumbnail.deactivate();
				}
				else if(core.preview.mode.currentMode === "screenshot"){
					return;
				}
				this.active = true;
				core.preview.mode.currentMode = "screenshot";
				var box = this.box.create();
				this.box.init(box);

				var _interface = this.interface.create();
				this.interface.init(_interface);
				// console.log("enabled screenshot mode");
				editorCore.deactivate();

			},
			deactivate: function(){
				el("#screenshotBox").rm();
				el("#screenshotInterface").rm();

				editorCore.activate();
				this.active = false;
			},
			capture: function(){
				
				var self = this;
				
				setTimeout(function(){
					// console.log("pre-snapshot");

					function getX(){
						return (window.innerWidth - preview.clientWidth);
					}

					function getY(){
						return 0
					}
					function getW(){
						return preview.clientWidth;
					}
					function getH(){
						return preview.clientHeight;
					}

					Global.mainWindow.capturePage({
						x: getX(), 
						y: getY(), 
						width: getW(), 
						height: getH()
					},function(_img){
						// console.log("pre-flash");
						var pngImgBuff = _img.toPng();
						// console.log("pre-flash 2");
						core.flash(function(){
							// el("#thumbBox").rmClass("screenshot-in-progress");
						});
						// console.log("mid-snapshot");
						fs.outputFile(core.localData.currentProject.path+"/assets/"+core.localData.currentBrand+"-"+Date.now()+".png", pngImgBuff, function(err){
							if(err) {
								fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
								return console.error("ERR:",err);
							} 
								
							// console.log("post-snapshot");
						});

					});
				}, 0);
			},
			box: {
				dimensions: {
					width:"4px",
					height: "100%"
				},
				location: {
					x:null,
					y:null
				},

				create: function(){
					var box = el("+div#screenshotBox").attr("draggable", "false");
					box.style.height = "100%";
					box.style.width = "4px";
					box.style.top = "0";
					box.style.left = (editor.clientWidth)+"px";
					return box;
				},

				init: function(box){
					el("#body").append(box);
				},

				update: function(){
					// console.log("resizing");
					if(core.preview.mode.currentMode === "screenshot"){
						el("#screenshotBox").style.left = (editor.clientWidth)+"px";
					}
					
				}

			},


			interface: {
				create: function(_callback){ // comes before init
					var self = this;

					// if(self.mode === null && core.localData.currentProject.name !== null){
						// console.log("creating box");
						var _interface = el("+div#screenshotInterface").append(
							el("+section").append(
								el.join([
									el("+div").addClass("interface-header").text("Capture"),
									el("+a#screenshotCamera").addClass("interface-camera").attr("href","#").append(
										el("+img").addClass("interface-camera").attr("src","local/images/camera.svg")
									)
								])
							)
						);
						
						return _interface;
						
					// }
				},

				init: function(_interface){
					var self = this;

					el("#body").append(_interface);

					el("#screenshotCamera").onclick = function(){
						core.preview.mode.screenshot.capture();
					}

				}
				
			}
		},

		blank: {
			enable: function(){}		
		}
		
	}
};
/* eslint-disable */

/* eslint-disable */
editorCore.dropdowns.brands = {
	setGlobalVariables: function(){
		window.brandSearchInput = el("#searchBrands");
			brandSearchInput.on("keyup", function(e){
				if(e.keyCode === 13 || e.keyIdentifier === "Enter"){
					
					if(this.value.length > 0 && this.value.slice(0,1) !== " "){
						if(document.getElementById("createBrand")){
							document.getElementById("createBrand").dispatchEvent(new MouseEvent("click"));
						}
					}
				}
			});

		window.brandsListCont = el("#brandsListCont");
	},

	status: "closed",

	// prepares click listener and behavior
	init: function(){
		console.error("dont use this method (brands.init)");
			// var self = this;
			// brandName.on("click", function(evt){
			// 	Eve.emit("Brands Menu Btn Clicked");
			// 	if(editorCore.dropdowns.projects.status === "opened") editorCore.dropdowns.projects.close();
			// 	if(editorCore.dropdowns.files.status === "opened") editorCore.dropdowns.files.close();
			// 	if(!this.hasClass("inactive")){
			// 		self.toggle();
			// 		evt.stopPropagation();
			// 	}
			// });
			// brandsDropdown.on("click", function(evt){
			// 	evt.stopPropagation();
			// });
	},

	select: function(_brandName){
		var self = this;

		function selectBrand(){
			// console.log("selecting:",_brandName);
			core.brands.exists(_brandName, function(exists){
				ipc.send('asynchronous-message', 'disablePreviewModes');

					if(exists){
						el("#brandNameText").purge().text(_brandName);
						core.brands.select(_brandName);
						// activate projects dropdown
						editorCore.dropdowns.projects.activate();
						editorCore.dropdowns.files.deactivate();
						core.codeMirror.deactivate();
						myCodeMirror.markClean();
						editorCore.dropdowns.files.reset();
						core.preview.deactivate();
						editorCore.refreshBtn.deactivate();

						self.close();
					} else {
						// console.log("brand ",_brandName,"does not exists")
						self.close();
						// refresh last open file
						core.localData.rmFromRecentBrands(_brandName, function(){
							alert("Brand not found. Brand removed from recent brands.");
						})
					}	
			});

		}

			if(!myCodeMirror.isClean()) {

						Prompter.prompt({
							message: "Current File Not Saved.",
							mainBtn: {
								text: "Cancel",
								onClick: function(){
									Prompter.hide();
								}
							},
							btn2: {
								text: "Continue Anyway",
								onClick: function(){
									Prompter.hide();
									selectBrand();
								}
							},
							btn3: null
						}) ;

				}	else {
					selectBrand();
				}

		Eve.emit("Brand Selected", _brandName);
		
		
	},

	toggle: function(){

		if(this.status === "opened") {
			this.close();
		}
		else if(this.status === "closed") {
			this.open();
		}
	},

	open: function(){

		var self = this;
		self.status = "opened";
		self.search.prepare();
		self.recent.populate();

		setTimeout(function(){
			brandsDropdown.rmClass("hide");
			brandName.addClass("dropdown-active");

			brandsDropdown.el(".arrow")[0].rmClass("hide");

			setTimeout(function(){
				brandSearchInput.focus();
			},0);
			
		},0);

	},

	close: function(){
		var self = this;
		self.status = "closed";

		baton(function(){
			brandsDropdown.addClass("hide");
			self.search.activated = false;
			brandName.rmClass("dropdown-active");
			brandsDropdown.el(".arrow")[0].addClass("hide");
			setTimeout(this.next, 200);
		})
		.then(function(){
			editorCore.dropdowns.brands.search.newBrandBtn.remove();
			self.purge();
			this.next();
		})
		.then(function(){
			self.refill();
			brandsDropdown.el(".arrow")[0].addClass("hide");
		})();

	},

	populate: function(){
		console.error("dont use this method (brands.populate)");
		// console.log("populating brands dropdown");
		// brandName.append(
		// 	el("+div#brandsDropdown").addClass(["dropdown", "hide"]).append(

		// 		el.join([
		// 			el("+div").addClass(["arrow", "hide"]),

		// 			el("+div").addClass("dropdownBody").append(

		// 				el.join([
		// 					el("+div#searchBrandsContainer").append(
		// 						el("+input#searchBrands").attr("placeholder", "Search")
		// 					),
		// 					el("+section#brandsListCont").append(
		// 						el("+div#recentBrands").text("Recent Brands")
		// 					)
		// 				])

		// 			)
		// 		])

		// 	)

		// );

		// window.brandsDropdown = brandName.el(".dropdown")[0];

		// then enable dropdown
		
	},

	// **cut this method**
	refill: function(){
		console.log("refilling brands dropdown");
		brandsDropdown.append(
			el.join([
				el("+div").addClass("arrow"),

				el("+div").addClass("dropdownBody").append(

					el.join([
						el("+div#searchBrandsContainer").append(
							el("+input#searchBrands").attr("placeholder", "Search")
						),
						el("+section#brandsListCont").append(
							el("+div#recentBrands").text("recent brands")
						)
					])

				)
			])
		);
	},
	

	purge: function(){
		brandsDropdown.purge();
	},

	recent: {

		maxAmount: 15,

		populate: function(){
			// console.log("start populating recent brands:",core.localData.brands.recent);
			var self = this;

			editorCore.dropdowns.brands.search.newBrandBtn.remove();


			var recentBrandsArray = Brands.getRecent();

			// console.log("recentBrandsArray::", recentBrandsArray);

			var recentBrandsCont = el("+div#recentBrandsCont");

			// header
			recentBrandsCont.append(
				el("+div").addClass("header").text("Recent Brands")
			)

			// add each result
			if(recentBrandsArray.length > 0){

				var brandLimit = (recentBrandsArray.length > self.maxAmount) ? self.maxAmount : recentBrandsArray.length;

				for(var i = 0; i < brandLimit; i++){
					recentBrandsCont.append(
						el("+button").addClass("brand-item").attr("data-brandname",recentBrandsArray[i]).text(recentBrandsArray[i])
					)
				}

			} 

			else {
				recentBrandsCont.addClass("no-recent").text("No recent brands to display.");
			}


			brandsListCont.purge().append( recentBrandsCont );

			el(".brand-item").on("click", function(){
				editorCore.dropdowns.brands.select(this.dataset.brandname);
			});


			
		}

	},


	search: {

		activated: false,

		prepare:	function() {
			var self = this;
			fang(
				function(){
					editorCore.dropdowns.brands.setGlobalVariables();
					this.next();
				},
				function(){
					self.prepareInputListener();
					// SAVE BRANDS TO LOCAL PERSISTENT DATA
					brandSearchInput.on("focus", function(){
						Eve.emit("Brand Input Focused");
					});
				}
			).init();
		},

		prepareInputListener: function(){
			var self = this;
			var timeout = undefined;

			// Will delay the search for brands for 300ms and 
			// batch the keystrokes into a single search

			brandSearchInput.on("keyup", function(){
				if(timeout !== undefined) {
				 clearTimeout(timeout);
				}
				timeout = setTimeout(function() {
					timeout = undefined;
					var inputValue = brandSearchInput.value;
					if(inputValue.length > 0 && inputValue.slice(0,1) !== " "){
						// BEGIN SEARCHING
						self.updateResults(inputValue);
					} else {
						editorCore.dropdowns.brands.recent.populate();
					}
					if(!self.activated){ 
						self.activated = true;
					}
				}, 300);
			});

		},

		noResults: function(_brandName){
			console.log("no Results!")
			var nameSize;
			if(_brandName.length < 8) nameSize = "small";
			else if(_brandName.length < 14) nameSize = "medium";
			else nameSize = "large";

			var noResultsContainer = el("+div").addClass("noResultsCont").append(
				el("+div").addClass("noResults").text("(No results)")
			)
				
			brandsListCont.purge().append( noResultsContainer );

		},

		updateResults: function(criteria){
			var self = this;

			// filter brands by criteria
			var matches = [];
			var brandList = Brands.getList()
			for(var i = 0, ii = brandList.length; i < ii; i++){
				if(brandList[i].slice(0,criteria.length).toUpperCase() === criteria.toUpperCase()) {
					matches.push(brandList[i]);
				}
			}
			
			if(matches.length > 0){

				var searchResultsCont = el("+div#searchResultsCont");

				if(matches.indexOf(criteria) === -1){
					setTimeout(function(){ // helps with performance
						editorCore.dropdowns.brands.search.newBrandBtn.add(criteria);
						editorCore.dropdowns.brands.search.newBrandBtn.enable(criteria);
						editorCore.dropdowns.brands.search.newBrandBtn.update(criteria);
					},0);
				} else {
					setTimeout(function(){ // helps with performance
						editorCore.dropdowns.brands.search.newBrandBtn.disable(criteria);
						editorCore.dropdowns.brands.search.newBrandBtn.update(criteria);
					},0);
				}

				

				// header
				searchResultsCont.append(
					el("+div").addClass("header").text("Search Results")
				)

				// add each result
				for(var i = 0, ii = matches.length; i < ii; i++){
					searchResultsCont.append(
						el("+button").addClass("brand-item").attr("data-brandname",matches[i]).text(matches[i])
					)
				}

				// if(matches.length > 6){ // add arrow
					// searchResultsCont.append( el("+div").addClass("arrow-down") )
				// }

				brandsListCont.purge().append( searchResultsCont );

				// Add click listeners to each result
				el(".brand-item").on("click", function(){
					editorCore.dropdowns.brands.select(this.dataset.brandname);
				});

				brandsListCont.rmClass("no-results");
				if(editorCore.dropdowns.brands.search.newBrandBtn.exists) {
						el("#createBrand").rmClass("no-results");
				} 
			}


			// no results
			else {
				self.noResults(criteria);

				if(!editorCore.dropdowns.brands.search.newBrandBtn.exists) {
					editorCore.dropdowns.brands.search.newBrandBtn.add(criteria);
				} 
				if(!editorCore.dropdowns.brands.search.newBrandBtn.enabled) {
					editorCore.dropdowns.brands.search.newBrandBtn.enable(criteria);
				}
				editorCore.dropdowns.brands.search.newBrandBtn.update(criteria);
				brandsListCont.addClass("no-results");
				el("#createBrand").addClass("no-results");
			}


		},

		// ADD BRAND BUTTON
		newBrandBtn: {
			enabled: false,
			exists: false,
			add: function(_brandName){
				if(!this.exists){
					var btn = el("+button#createBrand").attr("data-brandname", _brandName).text("Create Brand");
					brandName.el(".dropdown")[0].el(".dropdownBody")[0].append(btn);
					brandsListCont.addClass("showBottomBtn");
					this.exists = true;
					btn.on("click", function(){
						if(!btn.hasClass("disabled")) {
							core.brands.create(btn.dataset.brandname, function(){
								editorCore.dropdowns.brands.select(btn.dataset.brandname);
							});
						}
					});
				}
			},
			remove: function(){
				if(this.exists){
					el("#createBrand").rm();
					brandsListCont.rmClass("showBottomBtn");
					this.exists = false;
					this.enabled = false;
				}
			},
			enable: function(_brandName){
				if(!this.enabled){
					el("#createBrand").rmClass("disabled").attr("data-brandname", _brandName);
					this.enabled = true;
				}
			},
			disable: function(){
				if(this.enabled){
					el("#createBrand").addClass("disabled");
					this.enabled = false;
				}
			},
			update: function(_brandName){
				if(this.exists){
					el("#createBrand").attr("data-brandname", _brandName);
				}
			}
		}


	}

};
/* eslint-enable */

/* eslint-disable */
editorCore.dropdowns.files = {
	status: "closed",
	active: false,


	prepare: function(){
		var self = this;
		// console.log("running PREPARE")
		window.fileName = el("#fileName");
		fileName.append(

			el("+div").addClass(["dropdown", "hide"]).append(

				el.join([
					el("+div").addClass(["arrow", "hide"]),

					el("+div#dropdownBody-files").addClass(["dropdownBody", "files"])
				])

			)

		);

		window.filesDropdown = fileName.el(".dropdown")[0];
		window.filesDropdownBody = filesDropdown.el(".dropdownBody")[0];

		fileName.on("click", function(evt){

			if(editorCore.dropdowns.brands.status === "opened") {
				editorCore.dropdowns.brands.close();
			}
			if(editorCore.dropdowns.projects.status === "opened") {
				editorCore.dropdowns.projects.close();
			}
			
			// console.log("status:",editorCore.dropdowns.files.status);
			// console.log("active:",!this.hasClass("inactive"));

			if(!this.hasClass("inactive")){
				self.toggle();
				evt.stopPropagation();
			}
		});

		filesDropdown.on("click", function(evt){
			evt.stopPropagation();
		});
	},

	activate: function(_projectName){
		var self = this;
		if(self.active === false) {
			fileName.rmClass("inactive");
			el("#files_arrow").rmClass("inactive");
			// console.log("getting files for:", _projectName);
			self.active = true;
		}
	},
	deactivate: function(_projectName){
		var self = this;
		// console.log("check1");
		if(self.active === true) {
			// console.log("check2");
			fileName.addClass("inactive");
			el("#files_arrow").addClass("inactive");
			self.active = false;
			
			self.purge();

			
		}
	},

	autoSelectStyleSheet: function(){
		var self = this;
		// self.purge();
		// el("#fileNameText").purge().text("Files");
		core.brands.projects.files.list(function(files){
			var StyleSheet;
			if(files.indexOf("StyleSheet.scss") !== -1) StyleSheet = "StyleSheet.scss";
			else if(files.indexOf("StyleSheet.styl") !== -1) StyleSheet = "StyleSheet.styl";
			else StyleSheet = null;

			self.select(StyleSheet);
		});
	},

	populate: function(_callback){
		var self = this;

		// DELETE FILES ICON
		var deleteFileIcon = el("+button#deleteFile").addClass("icon");
		deleteFileIcon.innerHTML = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 14 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path d="M2.114,2.558c2.6,-2.599 6.821,-2.599 9.421,0c2.599,2.6 2.599,6.821 0,9.421c-2.6,2.599 -6.821,2.599 -9.421,0c-2.599,-2.6 -2.599,-6.821 0,-9.421ZM4.084,3.09l6.919,6.919c1.273,-1.938 1.058,-4.57 -0.646,-6.273c-1.703,-1.704 -4.335,-1.919 -6.273,-0.646ZM9.565,11.447l-6.919,-6.919c-1.273,1.938 -1.058,4.57 0.646,6.273c1.703,1.704 4.335,1.919 6.273,0.646Z"/></svg>';

		// RENAME FILES ICON
		var renameFileIcon = el("+button#renameFile").addClass("icon");
		renameFileIcon.innerHTML = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 10 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path d="M2.488,12.633l0,0l-1.971,1.235l0.084,-2.324l0,-0.001l1.887,1.09ZM8.244,2.664l-5.433,9.411l-1.888,-1.09l5.434,-9.411l1.887,1.09ZM8.566,2.106l-1.887,-1.09l0.586,-1.016l1.888,1.09l-0.587,1.016Z"/></svg>';


//-------------------
//	assets dropdown
//-------------------
// var assetsIcon = template(function(){
// 	return etc.el("div", {
// 		id:"assetsIcon",
// 		className:"",
// 		style: {
// 			background:"lime",
// 			width:"30px",
// 			height:"100%",
// 			position:"absolute",
// 			top: 0,
// 			right:'75px'
// 		},
// 		events: {
// 			click: function() {
// 				console.log("clicked assets icon");
// 			}		
// 		}
// 	})
// });

// assetsIcon.render({}, document.getElementById('editorBarInner'));


		// ASSETS ICON
		var assetsIcon = el("+button#assetsIcon").addClass("icon");
		assetsIcon.innerHTML = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 36 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g><path d="M34.135,1.686c0,-0.773 -0.628,-1.4 -1.401,-1.4c-5.421,0 -24.987,0 -30.407,0c-0.774,0 -1.401,0.627 -1.401,1.4c0,4.299 0,17.268 0,21.566c0,0.774 0.627,1.401 1.401,1.401c5.42,0 24.986,0 30.407,0c0.773,0 1.401,-0.627 1.401,-1.401c0,-4.298 0,-17.267 0,-21.566ZM32.776,2.98c0,-0.774 -0.627,-1.401 -1.401,-1.401c-5.093,0 -22.591,0 -27.684,0c-0.773,0 -1.401,0.627 -1.401,1.401c0,3.934 0,15.05 0,18.984c0,0.774 0.628,1.401 1.401,1.401c5.093,0 22.591,0 27.684,0c0.774,0 1.401,-0.627 1.401,-1.401c0,-3.934 0,-15.05 0,-18.984Z" class="primary"/><g><clipPath id="_clip1"><rect x="3.052" y="2.361" width="28.882" height="20.27"/></clipPath><g clip-path="url(#_clip1)"><path d="M9.845,22.631l-9.148,0l9.486,-12.177l4.574,5.871l-4.912,6.306Z" class="primary"/><path d="M22.894,7.551l11.748,15.08l-23.495,0l11.747,-15.08Z"  class="primary"/><circle cx="7.314" cy="4.49" r="3.061" class="secondary"/></g></g></g></svg>';


		core.brands.projects.files.list(function(files){
			// console.log("files",files);
			filesDropdownBody.append(
				el("+div").addClass("header").append(
					el.join([
						el("+span").text("Files"),
						el("+div").addClass("icon_cont").append(
							el.join([
								assetsIcon,
								renameFileIcon,
								deleteFileIcon
							])
						)
					])
				)
			);

			for(var i = 0, ii = files.length; i < ii; i ++){
				// if file is not a Dot file (e.g. ".DS_Store")
				if(files[i].charAt(0) !== "."){
					var _file = el("+button").addClass("file-item").attr("data-filename", files[i]).text(files[i]);

					if(files[i] === core.localData.currentFile.name){
						_file.addClass("current");
					}
					if(files[i].indexOf("StyleSheet.scss") !== -1 || files[i].indexOf("StyleSheet.styl") !== -1){
						_file.addClass("bold");
					}

					filesDropdownBody.append(_file);
				}
			}

			_callback();


			// RENAME/DELETE ICON CLICK
			var icons = el(".icon").on("click", function(){
				var self = this;

				icons.each(function(icon){
					el(".file-item").rmClass(icon.id);

					// Deselect Icon
					if((self === icon && self.hasClass("active")) || self !== icon){ 
						icon.rmClass("active");
						el(".file-item").rmClass(icon.id);
						el("#dropdownBody-files").rmClass(icon.id);

						if(self.id === "assetsIcon") {
							editorCore.dropdowns.files.assetMode.off();
						}
					}
					
					// Select Icon
					else {
						icon.addClass("active");
						el(".file-item").addClass(self.id);
						el("#dropdownBody-files").addClass(icon.id);

						if(self.id === "assetsIcon") {
							editorCore.dropdowns.files.assetMode.on();
						}
					}




				});
			});


			// CLICK ON FILE-ITEM
			el(".file-item").on("click", function(){

				// IF DELETE
				if(this.hasClass("deleteFile")){
					self.deleteFile(this.dataset.filename);
				}

				// IF RENAME
				else if(this.hasClass("renameFile")){
					if(!this.hasClass("renaming")){
						var currentName = this.dataset.filename;
						var renameFile_form = el("+form").addClass("renameFile-btn").append(
							el.join([
								el("+input").attr("value",this.dataset.filename),
								el("+button").addClass("renameFile-btn").text("Rename").attr("type", "submit")
							])
						);


						renameFile_form.on("submit", function(e){

							e.preventDefault();

							Eve.emit("Rename File", {
								path: core.localData.currentProject.path+"/",
								oldName: currentName,
								newName: this.el("input")[0].value
							}, function(){
								editorCore.dropdowns.files.close();
								Eve.emit("Menu Bar ~ File Renamed");
							});

						});
						this.addClass("renaming");
						this.append(renameFile_form);
					}
				}

				// IF NORMAL SELECT
				else {
					self.select(this.dataset.filename);
				}
			});
			

		});
	},

	assetMode: {
		on: function(){

			var dropdownBody_Files = el('#dropdownBody-files');
			// console.log("will get assets");
			core.brands.projects.files.assets(function(files){
				// console.log("got assets");
				var fragment = document.createDocumentFragment();
				for(var i = 0, ii = files.length; i < ii; i++){

					// if file is not a Dot file (e.g. ".DS_Store")
					if(files[i].charAt(0) !== "."){
						var _file = el("+button").addClass(["file-item","asset-file-item"]).attr("data-filename", files[i]).text(files[i]);
						fragment.appendChild(_file);
					}
				}

				dropdownBody_Files.append(fragment);

				var assetFiles = dropdownBody_Files.el(".asset-file-item");
				assetFiles.on("click", function(){
					var thisImage = this;

					thisImage.addClass("clicked");
					core.brands.projects.files.viewImage(core.localData.currentProject.path+"/assets/"+thisImage.dataset.filename);
					setTimeout(function(){
						thisImage.rmClass("clicked");
					}, 300);
					// editorCore.dropdowns.files.close();
				});

			})
		},

		off: function(){
			var assetFileItems = document.getElementsByClassName("asset-file-item");
			while(assetFileItems[0]){
				assetFileItems[0].parentNode.removeChild(assetFileItems[0]);
			}
			
		}
	},

	deleteFile: function(_fileName){
		var self = this;
		var pathToProj = core.localData.currentProject.path+"/";
		fs.unlink(pathToProj+_fileName, function(err){
			if(err){ 
				fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
				alert("Error Deleting File:\n"+err); 
		}
			else {
				el("#editorBar").addClass("deleted_file");
				setTimeout(function(){
					el("#editorBar").rmClass("deleted_file");
				},300);
			}
			self.close();

		})
	},

	renameFile: function(_prevFileName, _newFileName){
		var self = this;
		var pathToProj = core.localData.currentProject.path+"/";
		fs.rename(pathToProj+_prevFileName, pathToProj+_newFileName, function(err){
			if(err){ 
				fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
				alert("Error Renaming File:\n"+err); 
			}
			else {
				el("#editorBar").addClass("renamed_file");
				setTimeout(function(){
					el("#editorBar").rmClass("renamed_file");
				},300);
			}
			self.close();
		})
	},

	toggle: function(){
		// console.log("current status:", this.status);
		if(this.status === "opened") {
			this.close();
			// console.log("11 closing files 11");
		}
		else if(this.status === "closed") {
			this.open();
		}
	},

	open: function(){
		// console.log("opening files");
		var self = this;
		self.status = "opened";
		self.populate(function(){
			filesDropdown.rmClass("hide");
			filesDropdown.el(".arrow")[0].rmClass("hide");
		});
		fileName.addClass("dropdown-active");
	},

	close: function(_callback){
		// console.log("!!closing files!!");
		var self = this;
		
		// console.log("status,",self.status)
		//if already closed, return
		if(self.status === "closed") return;

		self.status = "closed";
		baton(function(){
			filesDropdown.addClass("hide");
			filesDropdown.el(".arrow")[0].addClass("hide");
			fileName.rmClass("dropdown-active");
			setTimeout(this.next, 200);
		})
		.then(function(){
			// self.purge();
			setTimeout(this.next, 10);
		})
		.then(function(){
			// self.refill();
			el("#dropdownBody-files").rmClass("deleteFile");
			el("#dropdownBody-files").rmClass("renameFile");
			self.purge();
			if(typeof _callback !== "undefined")_callback();
		}).run();
	},

	reset: function(){
		core.preview.mode.regular.clearWatchers();
		el("#fileNameText").purge().text("Files");
	},

	select: function(_fileName){
		var self = this;

		// if filename is null, return
		if(_fileName === null) return;


		function selectFile() {
			// console.log("Selecting File: ", _fileName);
			el("#fileNameText").purge().text(_fileName);
			editorCore.dropdowns.files.close();
			core.codeMirror.activate();
			core.localData.setCurrentFile(_fileName);
			core.localData.currentFile.isNew = true;

			core.updateEditor();
			core.preview.mode.regular.update();
		}

		function isImage(fileName){
			var ext = path.extname(fileName).toUpperCase();
			var imageExtensions = {
				".PNG":true,
				".JPG":true,
				".JPEG":true,
				".GIF":true,
				".SVG":true
			};
			return imageExtensions[ext];
		}

			
		if(!myCodeMirror.isClean() && _fileName !== core.localData.currentFile.name) {

				Prompter.prompt({
					message: "Current File Not Saved.",
					mainBtn: {
						text: "Cancel",
						onClick: function(){
							Prompter.hide();
						}
					},
					btn2: {
						text: "Continue Anyway",
						onClick: function(){
							Prompter.hide();
							selectFile();
						}
					},
					btn3: null
				}) ;

		}	else if(_fileName !== core.localData.currentFile.name){

			if(isImage(_fileName)) {
				var imagePath = core.localData.currentProject.path+"/"+_fileName;
				imagePath = path.resolve(imagePath);
				core.brands.projects.files.viewImage(imagePath);
			} else {
				selectFile();
			}
		} else {
			self.close();
		}


	},
	purge: function() {
		filesDropdownBody.purge();
	},

	setDirty: function(){
		el("#fileNameText").purge().append(
			el("+span").addClass("dirty").text("*")
		).text(core.localData.currentFile.name);
		core.localData.currentFile.dirty = true;
	},

	setClean: function(){
		el("#fileNameText").purge().text(core.localData.currentFile.name);
		core.localData.currentFile.dirty = false;
	},



	addFileDragListener: function(){
		var self = this;
		var dragCounter = 0;
		var editorBar = el("#editorBar");

		editorBar.on("dragenter", function(evt){
			if(core.localData.currentProject.name !== null){
				dragCounter++;
				// if not dragging file(s), do nothing
				if(evt.dataTransfer.files.length > 0){
					evt.preventDefault();
					editorBar.addClass("file_drag");
				}
			}
			
		});

		editorBar.on("dragleave", function(evt){
			if(core.localData.currentProject.name !== null){
				dragCounter--;
				// console.log("DRAG LEAVE???");
				if(dragCounter === 0) editorBar.rmClass("file_drag");
			}
			
		});

		editorBar.on("dragover", function(evt){
			if(core.localData.currentProject.name !== null){

				// if(evt.dataTransfer.files.length > 0) evt.preventDefault();
				evt.preventDefault();


			}
			
		});

		editorBar.on("drop", function(evt){
			if(core.localData.currentProject.name !== null){
				// if not dragging file(s), do nothing
				if(evt.dataTransfer.files.length > 0){
					evt.preventDefault();
					editorBar.rmClass("file_drag");
					dragCounter = 0;
					copyFiles(evt.dataTransfer.files);
				}
				else if(typeof evt.dataTransfer.getData('URL') === "string"){
					evt.preventDefault();
					editorBar.rmClass("file_drag");
					dragCounter = 0;
					downloadFile(evt.dataTransfer.getData('URL'));
					el("#editorBar").addClass("img_dragged");
					setTimeout(function(){
						el("#editorBar").rmClass("img_dragged");
					},300);
				}
				if(self.status === "opened"){

					self.close(function(){
						setTimeout(function(){
							self.open();
						}, 100);
					});
						
				}
				editorCore.dropdowns.projects.close();
				
			}
			
		});


		function downloadFile(url) {
			var extension;
			
		  var request = https.get(url, function(response) {

		  	if(response.headers["content-type"] === "image/jpeg") extension = ".jpg";
		  	else if(response.headers["content-type"] === "image/png") extension = ".png";
		  	else if(response.headers["content-type"] === "image/gif") extension = ".gif";
		  	else extension = ".txt";

		  	var dest = core.localData.currentProject.path+"/"+((new Date * (Math.random()+1)).toString(36).substring(0,8))+extension;
			  var file = fs.createWriteStream(dest);

		  	// console.log("res",response)
		    response.pipe(file);
		    file.on('finish', function() {
		      file.close();
		    });
		  });
		}

		function copyFiles(files){
			//check if file(s) of folder

			// console.log(files);

			var filesTotal = files.length;
			var filesCopied = 0;

			function copyFile(_file) {
				fs.copy(_file.path, core.localData.currentProject.path+"/"+_file.name, function(err){
					if(err) {
						fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
						return console.log("ERR copying:",_file.name, err);
					}
					// console.log("copied:", _file.name);
					filesCopied++;
					if(filesCopied === filesTotal){
						// console.log("All Files Copied");
					}
				});
			}
			

			for(var i = 0, ii = files.length; i<ii; i++){
				copyFile(files[i]);
			}

		}

	}

};
/* eslint-enable */








/* eslint-disable */
editorCore.dropdowns.projects = {

	status: "closed",

	select: function(_projectName){
		var self = this;
		// console.log("selecting", _projectName);
		function selectProject(){
			self.close();
			el("#projectNameText").purge().text(_projectName);

			// Add this functionality
			// core.brands.projects.select(_projectName);
			
			core.brands.projects.setCurrentProject(_projectName);
			editorCore.dropdowns.files.activate(_projectName);
			// editorCore.dropdowns.files.populate(_projectName);
			// console.log("selecting project 1");
			core.codeMirror.deactivate();
			myCodeMirror.markClean();
			editorCore.dropdowns.files.reset();
			// console.log("selecting project 2");
			core.preview.mode.regular.clearWatchers();
			// console.log("checkpoint 1");
			core.preview.mode.regular.setWatchers(function(_err){

				if(_err) {
					fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
					console.warn("could not set watchers");
					core.preview.mode.regular.disable();
				}
				else {

					// console.log("there were NO errors!");
					// console.log("selecting project 3");
					core.preview.mode.regular.update();
					core.preview.mode.regular.enable();
					// console.log("selecting project 4");
					editorCore.dropdowns.files.autoSelectStyleSheet();
					editorCore.refreshBtn.activate();
					// console.log("checkpoint 2");
					setTimeout(function(){
						core.preview.mode.regular.compileSass();
					},0);

					// these allow the menu items in the preview dropdown to become selectable
					ipc.send('asynchronous-message', 'enablePreviewModes');

					// console.log("checkpoint 3");


				}

					


			}); // error happens here if no StyleSheet.css or Skin.html

			


			

		}
		
			


		if ( 
			!myCodeMirror.isClean() && 
			core.localData.currentProject.name !== _projectName 
		) {

				Prompter.prompt({
					message: "Current File Not Saved.",
					mainBtn: {
						text: "Cancel",
						onClick: function(){
							Prompter.hide();
						}
					},
					btn2: {
						text: "Continue Anyway",
						onClick: function(){
							Prompter.hide();
							selectProject();
						}
					},
					btn3: null,
				}) ;

		}	else if(core.localData.currentProject.name !== _projectName){
			selectProject();
		} else {
			self.close();
		}

		Eve.emit("Select Project", _projectName);

	},


	init: function(){
		var self = this;

		projectName.on("click", function(evt){
			
			if(editorCore.dropdowns.brands.status === "opened") 
				editorCore.dropdowns.brands.close();
			
			if(editorCore.dropdowns.files.status === "opened") 
				editorCore.dropdowns.files.close();
			
			if(!this.hasClass("inactive")){
				self.toggle();
				evt.stopPropagation();
			}
		});

		projectDropdown.on("click", function(evt){
			evt.stopPropagation();
		});
	},

	/*resets the title name and closes dropdown*/
	reset: function(){
		var self = this;
		if(self.status === "opened") self.close();
		el("#projectNameText").purge().text("Projects");
	},

	/**/
	activate: function() {
		var self = this;
		// read current brand from localData
		var currentBrand = core.localData.currentBrand;
		self.reset();
		projectName.rmClass("inactive");
		el("#projects_arrow").rmClass("inactive");
		// remove inactive class
	},

	toggle: function(){
		if(this.status === "opened") {
			this.close();
		}
		else if(this.status === "closed") {
			this.open();
		}
	},



	open: function(){
		var self = this;
		self.status = "opened";

		self.refill();
		projectName.addClass("dropdown-active");
		projectDropdown.rmClass("hide");
		projectDropdown.el(".arrow")[0].rmClass("hide");
	},

	close: function(){
		var self = this;
		self.status = "closed";

		baton(function(){
			projectDropdown.addClass("hide");
			projectDropdownBody.rmClass("dim");
			projectName.rmClass("dropdown-active");
			projectDropdown.el(".arrow")[0].addClass("hide");
			setTimeout(this.next, 200);
		})
		.then(function(){
			self.purge();
			setTimeout(this.next, 10);
		})
		.then(function(){
			// self.refill();
		}).run();
	},

	populate: function(){
		// initial populate; for individual projects, see refill
		projectName.append(

			el("+div").addClass(["dropdown", "hide"]).append(

				el.join([
					el("+div").addClass(["arrow", "hide"]),
					el("+div").addClass(["dropdownBody", "projects"]),
					el("+div").addClass("inputCont")
				])

			)

		);
		window.projectDropdown = projectName.el(".dropdown")[0];
		window.projectDropdownBody = projectName.el(".dropdownBody")[0];
		window.projectDropdownInputCont = projectName.el(".inputCont")[0];
	},

	noProjects: function(){
		// console.log("no projects");
		projectDropdownBody.append(
			el("+div").addClass("no-projects").text("(no projects)")
		)
	},

	refill: function(){
		var self = this;
		core.brands.projects.list(core.localData.currentBrand, function(projects){

			var customCheck = etc.template(function(){

				var checked = this.props.checked;
				// console.log("checked?",checked);
				return etc.el("label", {
					id:"addBaseFilesCheck_custom",
					className:((checked)?"checked":""),
					getCheckStatus: function(){
						return document.getElementById('addBaseFilesCheck').checked;
					},
					update: function(){
						var self = this;
						setTimeout(function(){
							if(self.getCheckStatus()){
								self.classList.add("checked");
							} else {
								self.classList.remove("checked");
							}
						}, 0);
					},
					attr: {
						"for":"addBaseFilesCheck"
					},
					events: {
						click: function(){
							this.update();
						}
					}
				}).append(
					etc.el("img",{src:"local/images/checkmark.svg"})
				)


			});
				

			var addBaseFilesCheck = el("+input#addBaseFilesCheck").attr("type","checkbox").attr("checked","true");
			var addBaseFilesCheck_label = el("+label#addBaseFilesCheck_label").attr("for","addBaseFilesCheck").text("Add Base Files");
			addBaseFilesCheck_label.on("click", function(){
				document.getElementById('addBaseFilesCheck_custom').update();
			});
			var addBaseFilesCheck_cont = el("+div#addBaseFilesCheck_cont").addClass("hide").append(
				el.join([
					addBaseFilesCheck_label,
					customCheck.render({checked:true}),
					addBaseFilesCheck
				])
			);

			

			var newProjectInput = el("+input#newProjectInput").attr("placeholder","Create New Project").on("click",function(){
				document.getElementById('addBaseFilesCheck_cont').classList.remove("hide");
				projectDropdownBody.addClass("dim");
			});

			var newProjectInputBtn = el("+div#newProject-btn").append(
				el.join([
					el("+div").addClass("vertical-bar"),
					el("+div").addClass("horizontal-bar")
				])
			);



			projectDropdownInputCont.append(newProjectInput);
			projectDropdownInputCont.append(newProjectInputBtn);
			projectDropdownInputCont.append(addBaseFilesCheck_cont);

			if(projects.length === 0)
			{
				self.noProjects();
			} 

			else 
			{
				projectDropdownBody.append(
					el("+div").addClass("header").text("Projects")
				)
				for(var i = 0, ii = projects.length; i < ii; i++){
					var projectItem = el("+button").addClass("project-item").attr("data-projectname",projects[i]).text(projects[i]);
					if(projects[i] === core.localData.currentProject.name){
						projectItem.addClass("current").append(
							el("+img").addClass("finder").attr("src","local/images/folder.svg")
						);
					}
					projectDropdownBody.append(projectItem);
				}

				// Add click listeners to each result
				el(".project-item").on("click", function(){
					editorCore.dropdowns.projects.select(this.dataset.projectname);
				});
				try {
					document.querySelector(".finder").addEventListener("click", function(){
						core.brands.projects.showInFinder();
					})
				}
				catch(e){
					
				}
				


			}

			function newProject(inputVal, projects){
					// console.log("submit", inputVal);
					var match = false;
					for(var i = 0, ii = projects.length; i < ii; i++){
						if( projects[i].toUpperCase() === inputVal.toUpperCase() ) match = true;
					}

					if(!match){
						core.brands.projects.create(core.localData.currentBrand, inputVal, function(){

							if(document.getElementById('addBaseFilesCheck').checked){
								editorCore.dropdowns.projects.copyBaseFilesToProject(inputVal, function(){




									editorCore.dropdowns.projects.select(inputVal);
								});
							} else {
								editorCore.dropdowns.projects.select(inputVal);
							}

								
							
						});

					}
					else {
						alert("Project Name Already Exists");
					}
					// console.log("arr", projects);
			}

			newProjectInput.on("keyup", function(e){
				if(e.keyCode === 13 || e.keyIdentifier === "Enter"){
					if(this.value.length > 0 && this.value.slice(0,1) !== " "){
						newProject(this.value, projects);
					}
				}
			});

			newProjectInputBtn.on("click", function(e){
				if(newProjectInput.value.length > 0 && newProjectInput.value.slice(0,1) !== " "){
					newProject(newProjectInput.value, projects);
				}
			});

				


		})
	},
	purge: function(){
		projectDropdownBody.purge();
		projectDropdownInputCont.purge();
	},



	copyBaseFilesToProject: function(_projectName, _callback){
		var _brandName = core.localData.currentBrand;
		var pathToProject = core.brands.getFullPathToBrands()+"/"+core.localData.currentBrand+"/"+_projectName;
		var pathToBaseFiles = core.localData.pathToBaseFiles;

		core.getFiles(pathToBaseFiles, function(files){
			// console.log("these are the files:",files)
			for(var i = 0, ii = files.length; i < ii; i++){
				fs.copySync(pathToBaseFiles+"/"+files[i], pathToProject+"/"+files[i])
			}
			_callback();
		})


	},

	updateTextEditor: function(){}
};
/* eslint-enable */
