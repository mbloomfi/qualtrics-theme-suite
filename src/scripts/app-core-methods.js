var core = Global.coreMethods = {

	// ----------------------------
	//  Persistent Data File
	// ----------------------------
	persistentDataFile: {

		read: function (_successCallback){
			fs.readJson(__dirname+"/local/persistent-data.json", function(_err, _data){
				if(!_err) {
					if(typeof _successCallback === "function") _successCallback(_data);
				}
				else {
					fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
					console.log("readPersistantData ERROR:",_err);
				}
			});
		},

		update: function (_successCallback){
			var _DATA = {};
			_DATA.recentBrands = core.localData.brands.recent;
			_DATA.snippets = core.localData.snippets.list;
			//_DATA.x = core.localData.x;
			fs.writeJson(__dirname+"/local/persistent-data.json", _DATA, function(err){
				if(err) {
					fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
					alert("Error Saving Changes");
				}
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
			fs.readJson(__dirname+"/local/user-settings.json", function(_err, _data){
				if(!_err){ 
					
					if(typeof _successCallback === "function") _successCallback(_data);
				}
				else {
					fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
					console.log("User Settings READ ERROR:", _err);
				}
			});
		},

		update: function(_successCallback){
			var self = this;

			if(core.localData.userSettings === null){
				fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+"USER SETTEING ARE NULL?"+"\n\n", function(){});
				alert("Error with settings, sucks to be you.");
				return;
			}

			self.read(function(_data){
				if(core.localData.userSettings !== _data){

					fs.writeJson(__dirname+"/local/user-settings.json", core.localData.userSettings, function(err){
						if(err) {
							fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
							alert("Error Saving Changes");
						} 
							
						else _successCallback();
					});

				}
			});

			

			
		}
	},

	resetFinder: function(){


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
			return path.normalize(process.env.HOME+"/"+core.localData.brands.path);
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
					fs.mkdirp(core.brands.getFullPathToBrands()+"/"+_brandName, function(err){
						if(!err) {
							core.resetFinder();
							next();
						} else {
							fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
						}
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
			var i = core.localData.brands.recent.indexOf(brand);
			if(i !== -1) {
				core.localData.brands.recent.splice(i, 1);
			}
			core.localData.brands.recent.unshift(brand);
			core.persistentDataFile.update();
		},	

		setCurrentBrand: function(_brandName){
			core.localData.currentBrand = _brandName;
			core.brands.updateRecentBrands();
		},


		exists: function(_brandName, _callback){
			var self = this;
			console.log(typeof core.localData.brands.path);
			fs.stat(core.brands.getFullPathToBrands()+"/"+_brandName, function(err, stats){
				if(err) {
					fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
					console.error("brand exists error",err)
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
				console.log(typeof core.brands.getFullPathToBrands());
				fs.stat(core.brands.getFullPathToBrands()+"/"+_brandName+"/"+self.infoFile.ext, function(err, stats){
					if(err) {
						fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
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
				(core.brands.getFullPathToBrands()+"/"+
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
						var pathToBrand = core.brands.getFullPathToBrands() + "/" + _brandName;
						next(pathToBrand);
					}
				})
				.then(function(next, path){
					var projectList = [];
					console.log(typeof path);
					fs.readdir(path, function(_err, _projects){
						if(_err) {
							fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
							console.log("error listing projects");
						}
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
						console.log(typeof core.brands.getFullPathToBrands());
						fs.mkdirp(core.brands.getFullPathToBrands()+"/"+_brandName + "/" + _projectName, function(err){
							if(!err) {
								next();
							} else {
								fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
							}
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

			showInFinder: function(){
				if(core.localData.currentProject.name !== null){
					shelljs.exec('open '+core.localData.currentProject.path, function(status, output) {
						console.log('Exit status:', status);
						console.log('Program output:', output);
					});
				}
			},

			files: {
				current: {
					path: null,
					dirty: false
				},

				assets: function(_callback){
					var path = core.localData.currentProject.path;
					var fileList = [];
					fs.readdir(path+"/assets", function(_err, _files){
						if(_err) {
							fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
							console.log("error listing project assets");
						}
						console.log("the files",_files);
						for(var i = 0, ii = _files.length; i < ii; i++){
							var stats = fs.statSync(path+"/assets/"+_files[i]);
							if(stats.isFile()) fileList.push(_files[i]);
						}
						// currentBrand.projects = projectsList // ADD this
						if(_callback!==undefined) _callback(fileList);
					});
				},

				viewImage: function(path){

					window.imagePreview = etc.template(function(){
						if(document.getElementById("image_preview_container")){
							var imgCont = document.getElementById("image_preview_container");
							console.log("changing image")
							imgCont.getElementsByTagName('img')[0].src = path;
							return;
						}

						var container = etc.el("div", {
							id:"image_preview_container",
							style : {
								position:'absolute',
								top:'50%',
								left:'50%',
								transform: 'translate(-50%, -50%)',
								padding:'45px 10px 10px',
								backgroundColor:'rgba(250,250,250,1)',
								minWidth:'100px',
								minHeight:'50px',
								borderRadius:'2px',
								border:'1px solid rgb(200,200,200)',
								boxShadow:'0 3px 15px rgba(0,0,0,.3)'
							}
						});

						container.append(
							etc.el("div", {
								className: "change-image-bg-cont",
								style: {
									background:'rgb(255,0,0)',
									height:'25px',
									width:'50px',
									position:'absolute',
									top:'10px',
									right:'10px',
									display:'block',
									margin:'0 auto'
								}
							})
						)

						container.append(
							etc.el("img", {
								src: this.props.path,
								style: {
									maxHeight:'300px',
									maxWidth:'300px'
								}
							})
						);
						return container;
					});

					imagePreview.render({path:path}, document.body);
					// shelljs.exec('open '+path, function(status, output) {
					// 	console.log('Exit status:', status);
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
							console.log("error listing projects");
						}
						for(var i = 0, ii = _files.length; i < ii; i++){
							var stats = fs.statSync(path+"/"+_files[i]);
							if(stats.isFile()) fileList.push(_files[i]);
							if(stats.isDirectory() && _files[i] === "assets"){
								console.log("has assets folder!!!");
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
		brands: {
			path: null,
			current: {
				name: null
			},
			list: [],
			recent: []
		},
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

		previewQuestionFiles: {
			list: [],
			current: {
				name: null,
				path: null
			}


		},

		snippets: {
			list: null,

			readFromPersistentData: function(_callback){
				// if local data is null
				if(core.localData.snippets.list === null || core.localData.brands.recent.length === 0){
					core.persistentDataFile.read(function(_persistent_data){
						console.log("persistent-data recent brands", _persistent_data.snippets)
						core.localData.snippets.list = _persistent_data.snippets;
						// console.log("1a) recentbrands:",core.localData.brands.recent);
						if(_callback) _callback();
					})
				} 
			},

			writeToPersitentData: function(_callback){
				core.persistentDataFile.read(function(_persistent_data){
					_persistent_data.snippets = core.localData.snippets.list;

					console.log("new persistent-data"), _persistent_data;

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
					console.log("User Settings READ ERROR:", _err);
				}
			});
			if(_callback) _callback();
		},



		updateBrandsList: function(_CALLBACK){

			// var pathToBrands = core.localData.brands.path;
			var pathToBrands = core.brands.getFullPathToBrands();

			var brandList = [];


			console.log(typeof core.localData.brands.path);
			console.log("path",pathToBrands);
			fs.readdir(pathToBrands, function(_err, _files){
				if(_err) {
					fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
					console.log("error");
				}
				for(var i = 0, ii = _files.length; i < ii; i++) {
					var stats = fs.statSync(pathToBrands+"/"+_files[i]);
					if(stats.isDirectory()) brandList.push(_files[i]);
				}
				core.localData.brandList = brandList;
				if(_CALLBACK!==undefined) _CALLBACK();
			});
		},

		rmFromRecentBrands: function(_brandName, _CALLBACK){
			var brandNameIndex = core.localData.brands.recent.indexOf(_brandName)
			if(brandNameIndex !== -1){
				core.localData.brands.recent.splice(brandNameIndex, 1);
				core.persistentDataFile.update();
			}
			_CALLBACK();
		},

		updateRecentBrands: function(_CALLBACK){
			/* Main purpose of this method is to: (1) Set the local recent brands 
			in case its null, and (2) Add the current brand to the front of recent 
			brands if its not already there */

			// if local data is null
			if(core.localData.brands.recent === null || core.localData.brands.recent.length === 0){
				core.persistentDataFile.read(function(_persistent_data){
					console.log("persistent-data recent brands", _persistent_data.recentBrands)
					core.localData.brands.recent = _persistent_data.recentBrands;
					console.log("1a) recentbrands:",core.localData.brands.recent);
					_CALLBACK();
				})
			} 
			
			else {

				// if current brand is not the most recent brand
				if(core.localData.brands.current.name !== null && core.localData.brands.recent[0] !== core.localData.brands.current.name){
					core.localData.brands.recent.unshift(core.localData.currentBrand);
					core.persistentDataFile.update(function(){
						console.log("1b) recentbrands:",core.localData.brands.recent);
						_CALLBACK();
					});
					
				} 

				// local recent brands is up to date
				else {
					console.log("1c) recentbrands:",core.localData.brands.recent);
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
			console.log("filename:",_fileName);
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
				console.log("error getting files");
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
			if(err){ 
				fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
				console.log("ERR",err);
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
						console.log("ERR",err);
				}
					else {
						
						editorCore.dropdowns.files.setClean();
						myCodeMirror.markClean();
						if(core.localData.currentFile.name === "StyleSheet.scss"){
							core.preview.mode.regular.compileSass();
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
		},

		resetContextMenu: function(){
			// 'menu' is declared in main.js
			menu = new Menu();
			var recentSnippetsList = [];
			fs.readFile(__dirname+"/local/persistent-data.json", function(_err, _data){
				if(!_err) {
					recentSnippetsList = JSON.parse(_data).snippets.slice(0,10);

					menu.append( new MenuItem({ label: 'Insert Snippet', enabled: false }) );
					for(var i = 0, ii = recentSnippetsList.length; i < ii; i++){
						menu.append( new MenuItem({ 
							label: recentSnippetsList[i].name ,
							thisSnippet: recentSnippetsList[i],
							click: (function(i){
								var index = i;
								return function(){
									myCodeMirror.replaceSelection(recentSnippetsList[index].code);
								}
							})(i)
						}) );
					}
					menu.append( new MenuItem({ type: 'separator' }) );
					menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));

				} else {
					fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
				}
			});
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





