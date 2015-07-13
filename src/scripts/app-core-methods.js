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

		// sub-modes within the core edit/preview mode
		mode: {
			currentMode: "regular",
			regular: function(){
				console.log("switching to edit/preview => regular mode");
				if(this.currentMode === "thumbnail"){
					console.log("deactivating edit/preview => thumbnail mode");
					core.preview.thumbnail.deactivate();
				}
				core.preview.init();	
				this.currentMode = "regular";

			},
			
			thumbnail: function(){
				core.preview.thumbnail.init();
				this.currentMode = "thumbnail";
			},

			blank: function(){
				core.preview.hide();
			},
			
		},

		map: {

			"{~ProgressBar~}": '<div role="widget"><table class="ProgressBarContainer" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="18"><tbody><tr><td>0%</td><td><div class="ProgressBarFillContainer" id="ProgressBarFillContainer"><div class="ProgressBarFill" style="width: 18%"></div></div></td><td>100%</td></tr></tbody></table></div>',

			"{~Header~}":"Header Text Area",

			"{~Buttons~}": '<input id="PreviousButton" type="button" value="<<" name=""><input id="NextButton" onkeypress="if(!this.disabled){Qualtrics.SurveyEngine.navEnter(arguments[0],this, "NextButton"); };  " onclick="Qualtrics.SurveyEngine.navClick(event, "NextButton")" title=" >> " type="submit" name="NextButton" value=" >> ">',

			"{~Footer~}":"",

		},

		init: function(){
			console.log("init edit_preview => regular mode")
			if(core.localData.currentProject.name !== null){
				preview.src = "local/currentPreview.html";
				this.hidden = false;

			} else {
				this.hide();
			}
		},

		hidden: true,

		show: function(){
			if(core.localData.currentProject.name !== null){
				
				preview.src = "local/currentPreview.html";
				this.hidden = false;

			} else {
				this.hide();
			}
		},

		hide: function(){
			preview.src = "local/no-preview.html";
			this.hidden = true;
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
				console.log("(2) deactivating edit/preview => thumbnail mode");
				el("#thumbBox").rm();
				el("#thumbInterface").rm();
				console.log("finished deactivating edit/preview => thumbnail mode");
				editorCore.activate();
				this.active = false;

				this.box.mode = null;
				this.box.ratio.multiplier = 4;
				this.box.x = this.box.y = this.box.w = this.box.h = null;
				this.box.prevClientX = this.box.prevClientY = null;

				this.interface.mode = null;

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
						console.log("==",el("#thumbBox").style.width);
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
						console.log("creating box");
						var box = el("+div#thumbBox").attr("data-mode", "idle").attr("draggable", "false");
						if(typeof _callback === "function")_callback(box);
						self.mode = "idle";
					}

				},
				init: function(box){
					var self = this;

					self.mode = "idle";
					console.log("starting thumb viewer:", box);
					box.style.width = (self.ratio.width*4)+"px";
					box.style.height = (self.ratio.height*4)+"px";
					box.style.top = "3px";
					box.style.left = "3px";

					var counter = 0;

					box.on("mousedown", function(evt){
						this.addClass("grabbing");
						self.mode = "move";
						console.log("mousedown:",evt);
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

				},
				remove: function(){},
			},

			interface: {
				mode: null, //resize, move, idle

				init: function(_interface){
					var self = this;
					console.log("starting interface:", _interface);
					el("#body").append(_interface);

					el(".decrease-thumb-size")[0].onclick = function(){
						core.preview.thumbnail.box.ratio.decrement();
					}

					el(".increase-thumb-size")[0].onclick = function(){
						core.preview.thumbnail.box.ratio.increment();
					}

					el("#thumbCamera").onclick = function(){
						core.preview.thumbnail.capture();
					}

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
						console.log("creating box");
						var box = el("+div#thumbInterface").append(
							el.join([
								el("+section").append(
									el.join([
										el("+div").addClass("interface-header").text("Thumnail Size"),
										el("+div").addClass(["decrease-thumb-size", "thumbSizeBtn"]).text("–"),
										el("+div").addClass(["increase-thumb-size", "thumbSizeBtn"]).text("+")
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
				},

				
				remove: function(){},
			},

			capture: function(){
				var self = this;
				//hide #thumbBox before the screenshot
				

				setTimeout(function(){
					Global.mainWindow.capturePage({
						x: self.box.getX(), 
						y: self.box.getY(), 
						width: self.box.getWidth(), 
						height: self.box.getHeight()
					},function(_img){
						var pngImgBuff = _img.toPng();

						lwip.open(pngImgBuff, 'png', function(err, _image){
							_image.resize(self.box.ratio.width, self.box.ratio.height, function(){
								_image.writeFile(core.localData.currentProject.path+"/Thumb.gif", "png", function(err){
									if(err) return console.log("ERR:",err);
								});
								// fs.writeFile(core.localData.currentProject.path+"/Thumb.png", _image, function(err){
								// 	if(err) return console.log("ERR:",err);
								// 	fs.rename(core.localData.currentProject.path+"/Thumb.png", core.localData.currentProject.path+"/Thumb.gif", function(err){
								// 		if(err) return console.log("ERR:",err);
								// 	}); // end renameFile
								// }); // end writeFile

							});
					  });


								
					}); // end capturePage
				}, 5); // end setTimeout


				core.flash(function(){
					el("#thumbBox").rmClass("screenshot-in-progress");
				}); // end flash
					
			}


		}

	},

	flash: function(pinnacleCallback){
		var flash = el("+div").attr("style", "height:100%; width:100%; background:white; position:absolute; top:0; left:0; z-index:1000000; opacity:0; transition:opacity .1s ease;");
		el("#body").append(flash);


		var flashBaton = baton(function(next){
			flash.style.opacity = 1;
			setTimeout(next, 100);
		})

		.then(function(next){
			flash.style.transition = "opacity .4s ease";
			setTimeout(function(){ flash.style.opacity = 0; } ,0);
			if(typeof pinnacleCallback === "function") pinnacleCallback();
			setTimeout(next, 500);
		})

		.then(function(){
			flash.rm();
		})

		flashBaton.run();

		


	},


	/*
	core project modes (edit/preview, release manager, ??)
	*/
	mode: {
		currentMode: "edit/preview",
		releaseManager: function(){
			preview.src = "http://sun.qprod.net/releasemanager/";
			core.preview.hidden = false;
			this.currentMode  = "releaseManager";
		},
		edit_preview: function(){
			console.log("switching to edit/preview mode");
			core.preview.mode.regular();
			this.currentMode  = "edit/preview";
		}
	}
};





