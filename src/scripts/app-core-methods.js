var core = Global.coreMethods = {

	// ----------------------------
	//  Persistent Data File
	// ----------------------------
	persistentDataFile: {

		read: function (_successCallback){
			fs.readJson(appRoot+"/local/persistent-data.json", function(_err, _data){
				if(!_err) {
					if(typeof _successCallback === "function") _successCallback(_data);
				}
				else {
					console.log("readPersistantData ERROR:",_err);
				}
			});
		},

		update: function (_successCallback){
			var _DATA = {};
			_DATA.recentBrands = core.localData.recentBrands;
			//_DATA.x = core.localData.x;
			fs.writeJson(Global.appRoot+"/local/persistent-data.json", _DATA, function(err){
				if(err) alert("Error Saving Changes");
				else if(_successCallback!==undefined){
					var args = Array.prototype.splice.call(arguments, 1);
					_successCallback.apply(null, args);
				}
			});
		}
		
	},

	// ----------------------------
	//  User Settings File
	// ----------------------------
	userSettingsFile: {

		read: function(_successCallback){
			fs.readJson(appRoot+"/local/user-settings.json", function(_err, _data){
				if(!_err){ 
					
					if(typeof _successCallback === "function") _successCallback(_data);
				}
				else {
					console.log("User Settings READ ERROR:", _err);
				}
			});
		},

		update: function(_successCallback){
			var self = this;

			if(core.localData.userSettings === null){
				alert("Error with settings, sucks to be you.");
				return;
			}

			self.read(function(_data){
				if(core.localData.userSettings !== _data){

					fs.writeJson(appRoot+"/local/user-settings.json", core.localData.userSettings, function(err){
						if(err) alert("Error Saving Changes");
						else _successCallback();
					});

				}
			});

			

			
		}
	},


	// ----------------------------
	//  Brands
	// ----------------------------
	brands: {

		getPathToBrands: function(){
			return path.normalize(process.env.HOME+"/"+core.localData.userSettings.files.pathToBrands);
		},

		select: function(_brandName){
			
			// add brand to recent brands, current brand
			core.brands.setCurrentBrand(_brandName);
			core.brands.projects.setCurrentProject(null);
		},

		create: function(_brandName, _CALLBACK){
			var self = this;
			// create folder with brands name
			baton(function(next){
				self.exists(_brandName, next);
			})
			.then(function(next, exists){

				if(exists) {
					alert("Brand already exists. Nice try though.");
				} else {
					fs.mkdirp(self.getPathToBrands()+"/"+_brandName, function(err){
						if(!err) next();
					});
				}
				
			})
			.then(function(next){
				// editorCore.dropdowns.brands.close();
				self.infoFile.create(_brandName);
				_CALLBACK();
			})
			.run();

		},

		infoFile: {
			ext: ".qtheme",
			create: function(_brandName){

				
			},
			update: function(_brandName, _key, _value){

			}
		},

			
		/*
			Adds the current brand to the front of the recent brands
		*/
		updateRecentBrands: function(){
			var brand = core.localData.currentBrand;
			var i = core.localData.recentBrands.indexOf(brand);
			if(i !== -1) {
				core.localData.recentBrands.splice(i, 1);
			}
			core.localData.recentBrands.unshift(brand);
			core.persistentDataFile.update();
		},	

		setCurrentBrand: function(_brandName){
			core.localData.currentBrand = _brandName;
			core.brands.updateRecentBrands();
		},


		exists: function(_brandName, _callback){
			var self = this;
			fs.stat(self.getPathToBrands()+"/"+_brandName, function(err, stats){
				if(err) {
					return _callback(false);
				}
				else {
					return _callback(stats.isDirectory());
				}
			});
		},


		hasInfoFile: function(_callback, _brandName){
			var self = this;
			baton(function(next){
				//check if brand exists
				self.exists(_brandName, next);
			})
			.then(function(next, _exists){
				if(_exists){
					next();
				} 
				else _callback(false);
			})
			.then(function(){
				//check if brand has file
				fs.stat(self.getPathToBrands()+"/"+_brandName+"/"+self.infoFile.ext, function(err, stats){
					if(err) {
						return _callback(false);
					}
					else {
						return _callback(stats.isFile());
					}
				});
			})
			.run();
			
		},

		projects: {

			setCurrentProject: function(_projectName){
				core.localData.currentProject.name = _projectName;


				core.localData.currentProject.path = (_projectName !== null)
				?
				(core.brands.getPathToBrands()+"/"+
				core.localData.currentBrand+"/"+
				core.localData.currentProject.name)
				:
				null
				;

			},

			/*Runs a callback, passing it an array of the names of the projects*/
			list: function(_brandName, _callback){
				
				baton(function(next){
					
					core.brands.exists(_brandName, next);
				})
				.then(function(next, exists){
					if(exists){
						var pathToBrand = core.brands.getPathToBrands() + "/" + _brandName;
						next(pathToBrand);
					}
				})
				.then(function(next, path){
					var projectList = [];
					fs.readdir(path, function(_err, _projects){
						if(_err) console.log("error listing projects");
						for(var i = 0, ii = _projects.length; i < ii; i++){
							var stats = fs.statSync(path+"/"+_projects[i]);
							if(stats.isDirectory()) projectList.push(_projects[i]);
						}
						// currentBrand.projects = projectsList // ADD this
						if(_callback!==undefined) _callback(projectList);
					});
				}).run();
				
				
				

			},

			create: function(_brandName, _projectName, _callback){
				var self = this;
				// create folder with brands name
				baton(function(next){
					core.brands.exists(_brandName, next);
				})
				.then(function(next, exists){

					if(exists) {
						fs.mkdirp(core.brands.getPathToBrands()+"/"+_brandName + "/" + _projectName, function(err){
							if(!err) next();
						});
					} else {
						alert("Brand doesn't exists. Nice try though.");
					}
					
				})
				.then(function(next){
					editorCore.dropdowns.projects.close();
					
					if(_callback!==undefined) _callback();
					// self.infoFile.create(_brandName);
				})
				.run();
			},

			files: {
				current: {
					path: null,
					dirty: false
				},

				/*Returns array of file names at current project path path*/
				list: function(_callback){ 
						var path = core.localData.currentProject.path;
						
						var fileList = [];
						fs.readdir(path, function(_err, _files){
							if(_err) console.log("error listing projects");
							for(var i = 0, ii = _files.length; i < ii; i++){
								var stats = fs.statSync(path+"/"+_files[i]);
								if(stats.isFile()) fileList.push(_files[i]);
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
		recentBrands: null,
		brandList: null,
		userSettings: null,
		currentBrand: null,
		currentProject: {
			name: null,
			path: null
		},
		currentFile:{
			name: null,
			path: null,
			dirty: null,
			isNew: true,
			watch: null,
			clear: function(){
				var self = this;
				self.name = self.path = self.dirty = null;
			}
		},
		currentPreviewQuestionsFile: {
			name: null,
			path: null
		},
		pathToBaseFiles: Global.appRoot+"/local/BaseFiles",

		updateUserSettings: function(_callback){ // should only be run on app init
			var self = this;
			core.userSettingsFile.read(function(_data){
				if(self.userSettings === null || core.localData.userSettings !== _data){
					self.userSettings = _data;

					self.setCurrentPreviewQuestionsFile(_data.files.defaultPreviewFile);

					if(_callback) _callback();
				}
				
			});
		},

		updateBrandsList: function(_CALLBACK){
			var pathToBrands = core.brands.getPathToBrands();
			var brandList = [];
			fs.readdir(pathToBrands, function(_err, _files){
				if(_err) console.log("error");
				for(var i = 0, ii = _files.length; i < ii; i++) {
					var stats = fs.statSync(pathToBrands+"/"+_files[i]);
					if(stats.isDirectory()) brandList.push(_files[i]);
				}
				core.localData.brandList = brandList;
				if(_CALLBACK!==undefined) _CALLBACK();
			});
		},

		rmFromRecentBrands: function(_brandName, _CALLBACK){
			var brandNameIndex = core.localData.recentBrands.indexOf(_brandName)
			if(brandNameIndex !== -1){
				core.localData.recentBrands.splice(brandNameIndex, 1);
				core.persistentDataFile.update();
			}
			_CALLBACK();
		},

		updateRecentBrands: function(_CALLBACK){
			/* Main purpose of this method is to: (1) Set the local recent brands 
			in case its null, and (2) Add the current brand to the front of recent 
			brands if its not already there */

			// if local data is null
			if(core.localData.recentBrands === null){
				core.persistentDataFile.read(function(_persistent_data){
					core.localData.recentBrands = _persistent_data.recentBrands;
					_CALLBACK();
				})
			} 
			
			else {

				// if current brand is not the most recent brand
				if(core.localData.currentBrand !== null && core.localData.recentBrands[0] !== core.localData.currentBrand){
					core.localData.recentBrands.unshift(core.localData.currentBrand);
					core.persistentDataFile.update(function(){
						_CALLBACK();
					});
					
				} 

				// local recent brands is up to date
				else {
					_CALLBACK();
				}
			}
		},

		filterBrands: function(criteria){
			var matches = [];
			for(var i = 0, ii = core.localData.brandList.length; i < ii; i++){
				if(core.localData.brandList[i].slice(0,criteria.length).toUpperCase() === criteria.toUpperCase())
					matches.push(core.localData.brandList[i]);
			}
			return matches;
		},

		setCurrentFile: function(_fileName){
			core.localData.currentFile.name = _fileName;

			core.localData.currentFile.path = core.localData.currentProject.path+"/"+core.localData.currentFile.name;

		},

		setCurrentPreviewQuestionsFile: function(_fileName){
			var path = Global.appRoot+"/local/preview-files";
			this.currentPreviewQuestionsFile.name = _fileName;
			this.currentPreviewQuestionsFile.path = path+"/"+_fileName;
		}
	},



	getFiles: function(path, _callback){
		var fileList = [];
		fs.readdir(path, function(_err, _files){
			if(_err) console.log("error getting files");
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
			".md": "markdown",
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
			if(err){ console.log("ERR",err);}
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
					if(err){ console.log("ERR",err);}
					else {
						
						editorCore.dropdowns.files.setClean();
						myCodeMirror.markClean();
						if(core.localData.currentFile.name === "StyleSheet.scss"){
							core.preview.compileSass();
						}
						
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
		}

	},

	preview: {
		isReady: false,
		skinFileWatcher: null,
		sassFileWatcher: null,
		cssFileWatcher: null,

		map: {

			"{~ProgressBar~}": '<div role="widget"><table class="ProgressBarContainer" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="18"><tbody><tr><td>0%</td><td><div class="ProgressBarFillContainer" id="ProgressBarFillContainer"><div class="ProgressBarFill" style="width: 18%"></div></div></td><td>100%</td></tr></tbody></table></div>',

			"{~Header~}":"Header Text Area",

			"{~Buttons~}": '<input id="PreviousButton" type="button" value="<<" name=""><input id="NextButton" onkeypress="if(!this.disabled){Qualtrics.SurveyEngine.navEnter(arguments[0],this, "NextButton"); };  " onclick="Qualtrics.SurveyEngine.navClick(event, "NextButton")" title=" >> " type="submit" name="NextButton" value=" >> ">',

			"{~Footer~}":"",

		},

		init: function(){
			this.hide();
		},

		hidden: true,

		show: function(){
			if(core.localData.currentProject.name !== null && this.hidden !== false){
				
				preview.src = "local/currentPreview.html";
				this.hidden = false;

			} else {
				
			}
		},

		hide: function(){
			preview.src = "local/no-preview.html";
			this.hidden = true;
		},

		mode: {
			preview: function(){

			},
			blank: function(){
				core.preview.hide();
			},
			releaseManager: function(){
				preview.src = "http://sun.qprod.net/releasemanager/";
				core.preview.hidden = false;
				
			}	
		},

		compileSass: function(){
			
			return gulp.src(core.localData.currentProject.path+"/StyleSheet.scss")
				.pipe(sass())
				.pipe(autoprefixer())
				.pipe(minifyCss())
				.pipe(gulp.dest(core.localData.currentProject.path+"/"));
		},

		clearWatchers: function(){
			var self = this;
			if(self.sassFileWatcher !== null){
				self.sassFileWatcher.close();
				self.sassFileWatcher = null;
				
			}
			if(self.cssFileWatcher !== null){
				self.cssFileWatcher.close();
				self.cssFileWatcher = null;
				
			}
			if(self.skinFileWatcher !== null){
				self.skinFileWatcher.close();
				self.skinFileWatcher = null;
				
			}
		},

		setWatchers: function(){
			var self = this;
			self.watchSassFile();
			self.watchCssFile();
			self.watchSkinFile();
		},

		watchSassFile: function(){
			// var self = this;
			
			// var path = core.localData.currentProject.path+"/StyleSheet.scss";
			// self.sassFileWatcher = fs.watch(path, function(evt, _fileName){
			// 	console.log("init sass 1");
			// 	console.log("evt:",evt, _fileName)
			// 	self.compileSass();
			// });
			
		},

		watchCssFile: function(){
			var self = this;
			var path = core.localData.currentProject.path+"/StyleSheet.css";
			
			self.cssFileWatcher = fs.watch(path, function(evt, _fileName){
				self.update();
				
				preview.reload();
			});
			
		},

		watchSkinFile: function(){
			var self = this;
			var path = core.localData.currentProject.path+"/Skin.html";
			
			self.skinFileWatcher = fs.watch(path, function(evt, _fileName){
				self.update();
				
				preview.reload();
			});
			
		},

		update: function(){
			// to run, use:  core.preview.update();

			var self = this;
			fs.readFile(core.localData.currentProject.path+"/Skin.html", "utf-8", function(_errHtml, _html){
				if(_errHtml){ console.log("ERR",_errHtml);}
				else {

					fs.readFile(core.localData.currentPreviewQuestionsFile.path, "utf-8", function(_errPreviewQuestions, _previewQuestions){
						if(_errPreviewQuestions){ console.log("ERR",_errPreviewQuestions);}
						else {
							
							
							gulp.src("local/previewTemplate.html")
							.pipe(replace("{~StyleSheet.css~}", core.localData.currentProject.path+"/StyleSheet.css"))
							.pipe(replace("{~SKIN.HTML~}", _html))
							.pipe(replace("{~ProgressBar~}", self.map["{~ProgressBar~}"]))
							.pipe(replace("{~Header~}", self.map["{~Header~}"]))
							.pipe(replace("{~Question~}", _previewQuestions ))
							.pipe(replace("{~Buttons~}", self.map["{~Buttons~}"] ))
							.pipe(replace("{~Footer~}", self.map["{~Footer~}"] ))
							.pipe(rename("currentPreview.html"))
							.pipe(gulp.dest("local/"));

							
						}
					});
				}
			});
		},

		screenshot: {

		},

		thumbnail: {

			active: false,

			init: function(){

				var self = this;
				self.active = true;
				
				self.box.create(function(_box){
						self.box.init(_box);
				});

				self.interface.create(function(_interface){
					self.interface.init(_interface);
				});

				core.codeMirror.deactivate();
				
				

			},

			box: {
				mode: "hidden", //resize, move, idle
				x: null,
				y: null,
				w: null,
				h: null,
				create: function(_callback){
					var self = this;

					if(self.mode === "hidden" && core.localData.currentProject.name !== null){
						console.log("creating box");
						var box = el("+div#thumbBox").attr("data-mode", "idle");
						if(typeof _callback === "function")_callback(box);
						self.mode = "idle";
					}

				},
				init: function(box){
					var self = this;
					console.log("starting thumb viewer:", box);
					box.style.width = "400px";
					box.style.height = "200px";
					
					box.style.top = "200px";
					box.style.left = "200px";

					el("#body").append(box);

				},
				remove: function(){},
			},

			interface: {
				mode: "hidden", //resize, move, idle
				x: null,
				y: null,
				w: null,
				h: null,
				create: function(_callback){
					var self = this;

					if(self.mode === "hidden" && core.localData.currentProject.name !== null){
						console.log("creating box");
						var box = el("+div#thumbInterface").append(
							el.join([
								el("+div").addClass("sizeControls").append(
									el.join([
										el("+div").addClass("interface-header").text("Thumnail Size"),
										el("+div").addClass(["increase-thumb-size", "thumbSizeBtn"]).text("+"),
										el("+div").addClass(["decrease-thumb-size", "thumbSizeBtn"]).text("–")
									])
								),
								el("+div").addClass("sizeControls").append(
									el.join([
										el("+div").addClass("interface-header").text("Take Screenshot")
									])
								)
							])
						);
						if(typeof _callback === "function")_callback(box);
						self.mode = "idle";
					}

				},
				init: function(_interface){
					var self = this;
					console.log("starting interface:", _interface);
					el("#body").append(_interface);

				},
				remove: function(){},
			},
		},

		testScreenShot: function(){
			Global.mainWindow.capturePage(function(_img){
				var pngImgBuff = _img.toPng();

				// lwip.open(pngImgBuff, 'png', function(err, img){
				// 	if(err) return console.log("ERR1:",err);
				// 	console.log("saving screenshot");
				// 	img.writeFile(core.localData.currentProject.path+"/Thumb.gif", "gif", function(){
				// 		if(err) return console.log("ERR2:",err);
				// 		console.log("saved screenshot!");
				// 	});
				// })

				fs.writeFile(core.localData.currentProject.path+"/Thumb.png",pngImgBuff, function(err){
					if(err) return console.log("ERR:",err);
					console.log("saved screenshot");
					fs.rename(core.localData.currentProject.path+"/Thumb.png", core.localData.currentProject.path+"/Thumb.gif", function(err){
						if(err) return console.log("ERR:",err);
						console.log("converted screenshot");
					});
				})
				// console.log("img",_img.toPng());
			})
		}

	}
};





