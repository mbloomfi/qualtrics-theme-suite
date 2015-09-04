let QTS = (function() {
	'use strict';

	// --------------
	// Global Eve Listeners
	// --------------

	Eve.on('preferencesSaved', function() {
		// console.log('prefs saved!');
		core.localData.snippets.readFromPersistentData(core.codeMirror.resetContextMenu, true);
	});


	Eve.on('codeEditorSaved', function() {
		editorCore.dropdowns.files.setClean();
		myCodeMirror.markClean();
		if (core.localData.currentFile.name === 'StyleSheet.scss') {
			core.preview.mode.regular.compileSass();
		}
	});

	Eve.on('error', function(message) {
		console.error('ERROR: ', message);

		fs.appendFile(
			'local/errorlog.txt',
			`\n~~~~~~~~\n${new Date()}\n${message}\n`,
			function(err) {
				console.error('errorlog.txt not found: ', err);
			}
		);
	});

	window.addEventListener('focus', function() {
		Eve.emit('windowFocused');
	});



	// ---------------------------------------
	// User Preferences
	//
	// ---------------------------------------

	// Menu Bar
	//


	// WHY the hell is this here?
	Eve.on('Menu Bar ~ File Renamed', function() {
		el('#editorBar').addClass('renamed_file');
		setTimeout(function() {
			el('#editorBar').rmClass('renamed_file');
		}, 300);
	});




	// ---------------------------------------
	// info.qthemne
	//
	function getInfoQTheme(pathToProject, callback) {
		fs.readFile(pathToProject, 'utf-8', function(err, data) {
			if (err) {
				Eve.emit('error', err);
				return callback(true, null);
			}

			let jsonData;

			try {
				jsonData = JSON.parse(data);
			} catch(e) {
				Eve.emit('error', err);
				jsonData = {};
			}

			callback(false, jsonData);
		});
	}


	function resetLocalInfoQtheme() {
		_currentProject.infoQTheme = {
			author: null,
			lastModifiedFile: null,
			LastModified: {
				author: '',
				date: ''
			},
			version: 'V4',
			variables: 'numberOfQuestions=-1 legacySQ=0 AnyDeviceSupport=1 CSS=BaseStylesV4.css Transitions=Slide,Fade,Flip,Barrel DefaultTransition=Fade'
		};
	}

	function writeInfoQTheme(pathToFile, jsonData) {
		fs.writeFile(pathToFile, JSON.stringify(jsonData));
	}




	Eve.on('brandSelected', function(brandName, pathToBrand) {
		// if (!brandName || !pathToBrand) return;
	});


	Eve.on('projectSelected', function(projectName) {
		if (!projectName) {
			Eve.emit('error', 'Prameters Missing');
			return;
		}


		// return console.log('project selected check!');
		

		getInfoQTheme(pathToProject, function(missingFile, json) {
			if (missingFile) {
				resetLocalInfoQtheme();

				writeInfoQTheme(
					`${_currentProject.path}/info.qtheme`,
					_currentProject.infoQTheme
				);

			}
			if (json.author === null) json.author = 'Sam Eaton';
		});
	});



	Eve.on('codeEditorSaved', function() {

	});



	

})();




// ------------------
// User Preferences
// ------------------
let UserPreferences = (function() {

	let _userPreferences = {
		path: path.normalize(`${__dirname}/local/user-settings.json`)
	};

	// default location if not set in user settings
	let _pathToBrands = path.resolve(process.env.HOME);

	let UserPreferencesInterface = loca(_userPreferences.path);

	UserPreferencesInterface.on('read', function(data) {

	});

	UserPreferencesInterface.once('read', function() {
		// console.log(');
		// console.log('This is only happening once!!!!');
		// console.log(');
	});



	function checkUsername(callback) {
		if (!_userPreferences.username) {
			setTimeout(function() {
				Prompter.prompt({
					message: 'What is your name?',
					type: 'question',
					input: {
						placeholder: 'John Doe'
					},
					mainBtn: {
						text: 'Ok',
						onClick: function() {
							let prompterInput = document.getElementById('prompterInput');

							if (prompterInput.value.length > 0) {

								Prompter.hide();
								_userPreferences.username = prompterInput.value;
								if (typeof callback === 'function') callback();

							}
						}
					}
				});
			}, 350);
				
		} else if (typeof callback === 'function') {
			callback();
		}
	}


	function checkBrandLocation(callback) {
		// console.log('username', _userPreferences.username);
		if (!_userPreferences.files.brands.path) {

			setTimeout(function() {
				Prompter.prompt({
					message: `Brands File Path: ${process.env.HOME}/`,
					type: 'question',
					input: {
						placeholder: 'Desktop'
					},
					mainBtn: {
						text: 'Ok',
						onClick: function() {
							let prompterInput = document.getElementById('prompterInput');

							if (prompterInput.value.length > 0) {

								Prompter.hide();
								_userPreferences.files.brands.path = prompterInput.value;
								if (typeof callback === 'function') callback();

							}
						}
					}
				});
			}, 350);

		} else {
			_pathToBrands = `${process.env.HOME}/${_userPreferences.files.brands.path}`;
			if (typeof callback === 'function') callback();
		}
	}


	function updateLocalUserPrefrences(callback) {
		fs.readFile(`${__dirname}/local/user-settings.json`, 'utf-8', function(err, data) {
			if (err) return Eve.emit('error', err);

			_userPreferences = JSON.parse(data);

			checkUsername(function() {
				checkBrandLocation(function() {
					Eve.emit('Local Preferences Updated');
					if (typeof callback === 'function') callback();
				});
			});

		});
	}

	function writeUserPrefrences() {
		fs.writeFile(`${__dirname}/local/user-settings.json`, JSON.stringify(_userPreferences), function(err) {
			if (err) {
				Eve.emit('error', err);
			} else {
				Eve.emit('preferencesFileWritten');
			}
		});
	}



	Eve.on('appStarted', function() {
		updateLocalUserPrefrences(function() {
			writeUserPrefrences();
			Eve.emit('appLoaded');
		});
	});

	Eve.on('windowFocused', updateLocalUserPrefrences);
	// Eve.ignore('windowFocused').until('appLoaded');

	Eve.on('Local Preferences Updated', writeUserPrefrences);
	// Eve.ignore('Local Preferences Updated').until('appLoaded');

	/*
	return
	*/
	return {

		getPathToBrands: function() {
			return _pathToBrands;
		},
		API: UserPreferencesInterface
	};
})();







// ------------------
// Persistent Data
// ------------------
let PersistentData = (function() {
	// Get rid of local copy, it just adds confusion. Only read from disk.
	// let _pdLocal = {};
	let _pdPath = `${__dirname}/local/persistent-data.json`;

	// function resetLocalPersistentData() {
		
	// 	fs.readFile(_pdPath, 'utf-8', function(err, data) {
	// 		if (err) return Eve.emit('error', err);

	// 		let pd = JSON.parse(data);
	// 		_pdLocal = pd;

	// 		Eve.emit('Local Persistent Data Updated');

	// 	})
	// }
	function getPersistentData(callback) {
		fs.readFile(_pdPath, 'utf-8', function(err, data) {
			if (err) return Eve.emit('error', err);
			callback(JSON.parse(data));
		});
	}

	function addRecentBrand(brandName) {
		getPersistentData(function(_pData) {
			// first check if brand is already in recent brands
			let brandIndex = _pData.recentBrands.indexOf(brandName);

			if (brandIndex !== -1) {
				// console.log('brand already in recent!');
				// console.log('_pData.recentBrands before: ', _pData.recentBrands);
				_pData.recentBrands.splice(brandIndex, 1);
			}
			_pData.recentBrands.unshift(brandName);
			// console.log('_pData.recentBrands after: ', _pData.recentBrands);
			fs.writeFile(_pdPath, JSON.stringify(_pData), function(err) {
				if (err) return Eve.emit('error', err);
				// console.log('_pData.recentBrands', _pData.recentBrands)
			});
		});
	}

	function resetRecentBrands(brandsList) {
		getPersistentData(function(_pData) {
			_pData.recentBrands = brandsList;
			// console.log('_pData: ', _pData);
			fs.writeFile(_pdPath, JSON.stringify(_pData), function(err) {
				if (err) return Eve.emit('error', err);
			});
		});
	}

	function pruneRecentBrands() {

		getPersistentData(function(pData) {
			let _recentBrands = pData.recentBrands;
			let brandsPath = UserPreferences.getPathToBrands();
			let filesNotFound = [];
			let i = 0;

			_recentBrands.forEach(function(brandName) {
				fs.stat(`${brandsPath}/${brandName}`, function(err, stats) {
					i++;
					if (err) {
						filesNotFound.push(brandName);
					}
					if (i === _recentBrands.length) {
						resetRecentBrands(_.difference(_recentBrands, filesNotFound));
					}
				});
			});
		});

	}

	function addSnippet(snippetObject) {
		// getPersistentData(function(_pData) {
		// 	// first check if brand is already in recent brands
		// 	var brandIndex = _pData.recentBrands.indexOf(brandName);
		// 	if (brandIndex !== -1) {
		// 		_pData.recentBrands.splice(brandIndex, 1);
		// 	}
		// 	_pData.recentBrands.unshift(brandName);
		// 	fs.writeFile(_pdPath, JSON.stringify(_pData), function(err) {
		// 		if (err) return Eve.emit('error', err);
		// 	});
		// });
	}

	function removeSnippet(snippetId) {
		// getPersistentData(function(_pData) {
		// 	// first check if brand is already in recent brands
		// 	var brandIndex = _pData.recentBrands.indexOf(brandName);
		// 	if (brandIndex !== -1) {
		// 		_pData.recentBrands.splice(brandIndex, 1);
		// 	}
		// 	_pData.recentBrands.unshift(brandName);
		// 	fs.writeFile(_pdPath, JSON.stringify(_pData), function(err) {
		// 		if (err) return Eve.emit('error', err);
		// 	});
		// });
	}

	// Eve.on('appStarted', resetLocalPersistentData);
	
	// Eve.on('windowFocused', resetLocalPersistentData);

	// Eve.on('Recent Brands Changed', function(recentBrands) {
	// 	console.log('recent brands changed!');
	// 	// _pdLocal.recentBrands = recentBrands;
	// 	updatePersistentDataFile();
	// });
	Eve.on('appStarted', pruneRecentBrands);
	Eve.on('currentBrandSet', addRecentBrand);
	return {
		get: getPersistentData
		// getLocal: function() {
		// 	return _pdLocal;
		// }
	};

})();








// ------------------
// Brands
// ------------------
let Brands = (function() {

	let _currentBrand = {
		name: null,
		path: null,
		projectsList: null
	};

	function setCurrentBrand(brandName) {
		_currentBrand.name = brandName;
		_currentBrand.path = `${UserPreferences.getPathToBrands()}/${brandName}`;

		fs.readdir(_currentBrand.path, function(err, files) {
			if (err) return Eve.emit('error', err);
			let projectsList = files.filter(function(file) {
				let fsStats = fs.statSync(`${_currentBrand.path}/${file}`); // eslint-disable-line no-sync

				return fsStats.isDirectory();
			});

			_currentBrand.projectsList = projectsList;
		});
	}

	function getRecentBrands(callback) {
		PersistentData.get(function(pData) {
			// console.log('pData: ', pData);
			callback(pData.recentBrands);
		});
	}
	
	let dropdownMenu = (function() {
		/* _tempBrandsList is ONLY to be used when searching for brands (getBrandsByCriteria).
		That is when the extra speed from caching is needed.
		Otherwise, just search manually.*/
		let _tempBrandsList = [];
		/* -------------------- */

		let _dropdownStatus = 'closed';

		/**/
		function init() {
			dom('brandName').append(
				dom.create('div').setId('brandsDropdown').addClass('dropdown', 'hide').append(
					dom.create('div').addClass('arrow', 'hide'),
					dom.create('div').addClass('dropdownBody').append(
						dom.create('div').setId('searchBrandsContainer').append(
							dom.create('input').setId('searchBrands').attr('placeholder', 'Search')
						),
						dom.create('section').setId('brandsListCont')
					)
				)
			);

			dom('brandName').addEventListener('click', function(evt) {
				Eve.emit('brandsMenuBtnClicked');
				if (!this.classList.contains('inactive')) {
					evt.stopPropagation();
				}
			});

			dom('brandsDropdown').addEventListener('click', function(evt) {
				evt.stopPropagation();
			});

			let searchTimeout;

			dom('searchBrands').addEventListener('keyup', function(e) {
				let self = this;

				if (searchTimeout) {
					clearTimeout(searchTimeout);
				}
				searchTimeout = setTimeout(function() {
					searchTimeout = null;
					let inputValue = self.value;

					if (inputValue.trim().length) {

						getBrandsByCriteria(self.value, function(list) { // eslint-disable-line no-use-before-define
							// console.log('filteredList: ',list);
							populate('search', list); // eslint-disable-line no-use-before-define
						});
					} else {
						Eve.emit('searchFieldEmpty');
					}
				}, 300);
			});
		}


		/**/
		function populate(mode, brandsList) {
			let brandsListCont = dom('brandsListCont').purge();

			if (mode === 'recentBrands') {
				// console.log('show recent brands',brandsList);
				let recentBrandsCont = dom.create('div').setId('recentBrandsCont');

				// console.log('brandsList: ', brandsList);

				// add each result
				if (brandsList.length > 0) {
					recentBrandsCont.append(
						dom.create('div').addClass('header').text('Recent Brands')
					);
					let limit = 20;

					if (brandsList.length < limit) limit = brandsList.length;

					for (let i = 0; i < limit; i++) {
						recentBrandsCont.append(
							dom.create('button').addClass('brand-item')
								.attr('data-brandname', brandsList[i]).text(brandsList[i])
						);
					}
					brandsListCont.append(recentBrandsCont);
				} else {
					brandsListCont.append(
						recentBrandsCont.addClass('no-recent').text('Search for brands.')
					);
				}

				dom.queryByClass('brand-item').each(function(item) {
					item.addEventListener('click', function() {
						Eve.emit('brandSelected', item.dataset.brandname);
					});
				});

			} else if (mode === 'search') {
				let searchResultsCont = dom.create('div').setId('searchResultsCont');

				// header
				searchResultsCont.append(
					dom.create('div').addClass('header').text('Search Results')
				);

				// add each result
				for (let i = 0, ii = brandsList.length; i < ii; i++) {
					searchResultsCont.append(
						dom.create('button').addClass('brand-item').attr('data-brandname', brandsList[i]).text(brandsList[i])
					);
				}

				brandsListCont.purge().append(searchResultsCont);

				// Add click listeners to each result
				dom.queryByClass('brand-item').each(function(item) {
					item.addEventListener('click', function() {
						Eve.emit('brandSelected', item.dataset.brandname);
					});
				});
			}
		}

		/*Remove this function. Selecting a brand should be a set of smaller functions (e.g. project.reset, etc.)*/
		function selectBrand(brandName) {

			// console.log('selecting', brandName);
		}

		/**/
		function open() {
			if (_dropdownStatus === 'opened') return;

			_dropdownStatus = 'opened';
			dom('brandsDropdown').removeClass('hide')
				.queryByClass('arrow')[0].classList.remove('hide');
			dom('brandName').addClass('dropdown-active');
			dom('searchBrands').focus();

			Eve.emit('brandsDropdownOpened');
		}

		/**/
		function close() {
			if (_dropdownStatus === 'closed') return;

			_dropdownStatus = 'closed';
			// clears the '_tempBrandsList' from cache
			_tempBrandsList = [];

			dom('brandsDropdown').addClass('hide').queryByClass('arrow')[0]
				.addClass('hide');
			dom('brandName').rmClass('dropdown-active');
			setTimeout(function() {
				if (_dropdownStatus === 'closed') dom('brandsListCont').purge();
			}, 200);
		}

		/*should only be called by 'getBrandsByCriteria'*/
		function filterByCriteria(list, criteria) {
			let filteredList = [];

			list.forEach(function(file) {
				if (file.toUpperCase().indexOf(criteria.toUpperCase()) !== -1) filteredList.push(file);
			});
			// console.log('list?', filteredList);
			return filteredList;
		}

		/**/
		function getBrandsByCriteria(criteria, callback) {
			if (_tempBrandsList.length) {
				// console.log('cached!!!');
				callback(filterByCriteria(_tempBrandsList, criteria));
			} else {
				fs.readdir(UserPreferences.getPathToBrands(), function(err, files) {
					if (err) return Eve.emit('error', err);
					_tempBrandsList = files;
					let DSStore = _tempBrandsList.indexOf('.DS_Store');

					if (DSStore !== -1) {
						_tempBrandsList.splice(DSStore, 1);
					}
					// make sure to clear the '_tempBrandsList' when the dropdown menu is closed
					// console.log('files: ',files);
					callback(filterByCriteria(files, criteria));
				});
			}
		}

		/**/
		function getProjectList(brandPath, callback) {
			fs.readdir(brandPath, function(err, files) {
				if (err) return Eve.emit('error', err);
				let DSStore = files.indexOf('.DS_Store');

				if (DSStore !== -1) {
					files.splice(DSStore, 1);
				}
				callback(files);
				// console.log('got projectsLists: ', files);
			});
		}

		Eve.on('appLoaded', init);

		Eve.on('brandsMenuBtnClicked', function() {
			if (_dropdownStatus === 'opened') {
				process.nextTick(close);
			} else if (_dropdownStatus === 'closed') {
				getRecentBrands(function(recentBrandsList) {
					populate('recentBrands', recentBrandsList);
					process.nextTick(open);
				});
			}
		});

		Eve.on('brandSelected', selectBrand);
		Eve.on('brandSelected', close);
		Eve.on('brandSelected', setCurrentBrand);
		// rename brand name field
		Eve.on('brandSelected', function(brandName) {
			dom('brandNameText').text(brandName);
		});

		Eve.on('brandsDropdownOpened', function() {
			getRecentBrands(function(recentBrandsList) {
				populate('recentBrands', recentBrandsList);
			});
		});

		Eve.on('searchFieldEmpty', function() {
			getRecentBrands(function(recentBrandsList) {
				populate('recentBrands', recentBrandsList);
			});
		});

		Eve.on('projectsMenuBtnClicked', close);

		Eve.on('documentBodyClicked', function() {
			if (_dropdownStatus === 'opened') {
				close();
			}
		});

	})();



	/* return
	*/
	return {
		getCurrent: function() {
			return _currentBrand;
		},
		getRecent: function() {
			console.error('dont do this');
			// return _brands.recent || null;
		}
	};

})();






// ------------------
// Projects
// ------------------
let Projects = (function() {
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
			author: null,
			lastModifiedFile: null,
			LastModified: {
				author: '',
				date: ''
			},
			version: 'V4',
			variables: 'numberOfQuestions=-1 legacySQ=0 AnyDeviceSupport=1 CSS=BaseStylesV4.css Transitions=Slide,Fade,Flip,Barrel DefaultTransition=Fade'
		}
	};


	function setCurrentProject(projectName) {
		_currentProject.name = projectName;
		_currentProject.path = `${Brands.current.path}/${projectName}`;

		fs.readdir(_currentProject.path, function(err, files) {
			if (err) return Eve.emit('error', err);
			let projectFiles = files.filter(function(file) {
				let fsStats = fs.statSync(`${_currentProject.path}/${file}`); // eslint-disable-line no-sync

				return fsStats.isDirectory();
			});
			
			_currentProject.files = projectFiles;
		});
	}

	// !!!!!! this is not an event !!!!!!!!
	// Eve.on('Select Project', function(projectName) {
	// 	setCurrentProject(projectName);
	// });

	// Eve.on('Current Project Updated', function() {
	// 	// console.log('current project has been set, good sir.');
	// 	// console.log('_currentProject =>',_currentProject);
	// });

	// !!!!!! this is not an event !!!!!!!!
	// Eve.on('Update Current Project Files List', updateCurrentProjectFiles);

	// !!!!!! this is not an event !!!!!!!!
	// Eve.on('Rename File', function(data, callback) {
	// 	if (!data.path || !data.newName || !data.oldName) {
	// 		return Eve.emit('error', 'Rename File Error');
	// 	}
	// 	fs.rename(data.path + data.oldName, data.path + data.newName, function(err) {
	// 		if (err) {
	// 			return Eve.emit('error', 'Rename File Error');
	// 		}
	// 		if (typeof callback === 'function') {
	// 			callback();
	// 		}
	// 	});
	// });


	let dropdown = (function() {
		let _dropdownStatus = 'closed';

		function init() {
			dom('projectName').append(
				dom.create('div').setId('projectsDropdown').addClass('dropdown', 'hide').append(
					dom.create('div').addClass('arrow', 'hide'),
					dom.create('div').addClass('dropdownBody', 'projects'),
					dom.create('div').addClass('inputCont')
				)
			);


			dom('projectName').addEventListener('click', function(evt) {
				Eve.emit('projectsMenuBtnClicked');
				// console.log('CLICKED???');
				if (!this.classList.contains('inactive')) {
					evt.stopPropagation();
				}
			});

			dom('projectsDropdown').addEventListener('click', function(evt) {
				evt.stopPropagation();
			});

			// console.log('init project dropdown');

		}

		function populate() {

		}

		function activate() {
			dom('projectName').removeClass('inactive');
			dom('projects_arrow').removeClass('inactive');
		}


		/**/
		function open() {
			// console.log('open brand menu');
			_dropdownStatus = 'opened';
			// dom('brandsDropdown').removeClass('hide')
			// 	.queryByClass('arrow')[0].classList.remove('hide');
			// dom('brandName').addClass('dropdown-active');
			// dom('searchBrands').focus();

			// Eve.emit('brandsDropdownOpened');
		}

		/**/
		function close() {
			// console.log('close brand menu');
			_dropdownStatus = 'closed';
			// clear the '_tempBrandsList' from cache
			// _tempBrandsList = [];

			// fang(
			// 	function() {
			// 		// self.search.activated = false;
			// 		dom('brandsDropdown').addClass('hide')
			// 			.queryByClass('arrow')[0].addClass('hide');
			// 		brandName.rmClass('dropdown-active');
			// 		setTimeout(this.next, 200);
			// 	},
			// 	function() {
			// 		dom('brandsListCont').purge();
			// 		// editorCore.dropdowns.brands.search.newBrandBtn.remove();
			// 		// self.purge();
			// 		this.next();
			// 	},
			// 	function() {
			// 		// self.refill();
			// 		// dom('brandsDropdown').el('.arrow')[0].addClass('hide');
			// 	}
			// ).init();
		}

		Eve.on('appLoaded', init);

		Eve.on('projectsMenuBtnClicked', function() {
			if (_dropdownStatus === 'opened') {
				process.nextTick(close);
			} else if (_dropdownStatus === 'closed') {
				let projects = Brands.getCurrent().projectsList;

				// getRecentBrands(function(recentBrandsList) {
				// 	populate('recentBrands', recentBrandsList);
				// 	process.nextTick(open);
				// });
			}
		});

		Eve.on('brandSelected', activate);




	})();

	return {
		getCurrent: function() {
			return _currentProject;
		}
	};

})();



// ------------------
// Code Editor (codemirror)
// ------------------
let Editor = (function() {
	let codeMirrorInterface = window.myCodeMirror;

	function resetContextMenu() {

	}

	function deactive() {
		
	}

	function activate() {
		
	}

	function setValue(code, ext) {

		codeMirrorInterface.setValue(code);

		let extMap = {
			'.html': 'htmlmixed',
			'.css': 'css',
			'.scss': 'text/x-scss',
			'.styl': 'text/x-styl',
			'.js': 'javascript',
			'.qtheme': 'application/json',
			'.json': 'application/json',
			'.md': 'markdown'
		};

		if (extMap.hasOwnProperty(ext.toLowerCase())) {
			if (codeMirrorInterface.getOption('mode') !== extMap[ext]) {
				codeMirrorInterface.setOption('mode', extMap[ext]);
			}
		} else {
			codeMirrorInterface.setOption('mode', '');
		}



	}

	function compileStyles() {

	}



})();







