/*!
<el> by samueleaton
*/
!function(){el=function(e,t){function n(e){var n=e.charAt(0);switch(n){case"#":return i.getById(e.slice(1));case"+":if(e.slice(1).match(/#/)){var r=e.slice(1).split("#"),l=i.create(r[0],t);return el.isElementArray(l)?l.each(function(e){e.setAttribute("id",r[1])}):l.setAttribute("id",r[1]),l}return i.create(e.slice(1),t);case".":return i.getByClassName(e.slice(1));default:return i.getByTagName(e)}}var i=this===window?window.el:this;return"string"==typeof e?n(e):el.isElement(e)?el.elify(e):el.isCollection(e)||el.isNodeList(e)||el.isElementArray(e)?el.elify(e):void 0},el.create=function(e,t){if(t&&"number"==typeof t){for(var n=[],i=0,r=t;r>i;i++)n.push(el.elify(document.createElement(e)));return n}return el.elify(document.createElement(e))},el.getById=function(e){if(this===window.el)return el.elify(document.getElementById(e));if(el.isElement(this)){if(document.contains(this))return el.elify(document.getElementById(e));var t=this,n=!1,i=null;return t.el("*").each(function(t){return t.getAttribute("id")===e?(n=!0,i=t,0):void 0}),i}},el.getByClassName=function(e,t){var n=this===window.el?document:this,i=n.getElementsByClassName(e);return i=Array.prototype.slice.call(i),el.elify(i)},el.getByTagName=function(e,t){var n=this===window.el?document:this,i=n.getElementsByTagName(e);return i=Array.prototype.slice.call(i),el.elify(i)},el.on=function(e,t){var n=el.isElement(this)||el.isElementArray(this)?this:window;return n.addEventListener(e,t),this},el.join=function(e){var t=[];if(el.isArray(e))for(var n=0,i=e.length;i>n;n++)el.isElement(e[n])?t.push(e[n]):el.isElementArray(e[n])&&e[n].each(function(e){t.push(e)});return el.elify(t)},el.elify=function(e){function t(e){return e.el=el,e.getById=el.getById,e.getByClassName=el.getByClassName,e.getByTagName=el.getByTagName,e.getByAttribute=el.getByAttribute,e.elify=el.elify,e.on=el.on,e.addClass=function(e){var t=this;if(el.isArray(e))for(var n=0,i=e.length;i>n;n++)t.classList.add(e[n]);else"string"==typeof e&&t.classList.add(e);return t},e.rmClass=function(e){var t=this;if(el.isArray(e))for(var n=0,i=e.length;i>n;n++)t.classList.remove(e[n]);else"string"==typeof e&&t.classList.remove(e);return t},e.hasClass=function(e){return this.classList.contains(e)},e.rm=function(){var e=this;return e.parentNode&&e.parentNode.removeChild(e),e},e.append=function(e){if(el.isElementArray(e)){var n=document.createDocumentFragment();e.each(function(e){e.el||(e=t(e)),n.appendChild(e)}),e=n}return this.appendChild(e),this},e.appendTo=function(e){var t=this;return el.isElementArray(e)?e.each(function(e){var n=t.cloneNode(!0);e.appendChild(n)}):e.appendChild(t),t},e.purge=function(){for(var e=this;e.firstChild;)e.removeChild(e.firstChild);return e},Object.defineProperty(e,"text",{configurable:!0,enumerable:!0,writable:!0,value:function(t){return"string"==typeof t&&e.appendChild(document.createTextNode(t)),e}}),e.attr=function(e,t){return"string"==typeof e&&this.setAttribute(e,void 0!==t?t:""),this},e}return el.isElement(e)?t(e):((el.isCollection(e)||el.isNodeList(e))&&(e=Array.prototype.slice.call(e)),e.each=function(e){for(var t=this,n=0,i=t.length;i>n;n++)if(0===e(t[n],n,t))return this===window.el?void 0:this;return this===window.el?void 0:this},e.each(function(e){t(e)}),e.addClass=function(n){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.addClass(n))}),e},e.rmClass=function(n){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.rmClass(n))}),e},e.hasClass=function(n,i){if("all"===i||"undefined"==typeof i){var r=!0;return e.each(function(e){"undefined"!=typeof e&&(void 0===e.el&&(e=t(e)),e.hasClass(n)||(r=!1))}),r}return"any"===i?(e.each(function(e){return"undefined"!=typeof e&&(e.el||(e=t(e)),e.hasClass(n))?!0:void 0}),!1):e},e.rm=function(n){return this.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.rm())}),e},e.append=function(n){if(el.isElementArray(n)){var i=document.createDocumentFragment();n.each(function(e){void 0===e.el&&(e=t(e)),i.appendChild(e)}),n=i}return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.append(n.cloneNode(!0)))}),e},e.appendTo=function(n,i){return e.each(function(e){"undefined"!=typeof e&&(void 0===e.el&&(e=t(e)),e.appendTo(n))}),i!==!1&&e.rm(),e},e.purge=function(){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.purge())}),e},e.text=function(n){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.text(n))}),e},e.attr=function(n,i){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.attr(n,i))}),e},e.on=function(e,t){return this.each(function(n){n.addEventListener(e,t)}),this},e)},el.isArray=function(e){return Array.isArray(e)||e instanceof Array?!0:!1},el.isElementArray=function(e){return(Array.isArray(e)||e instanceof Array)&&el.isElement(e[0])?!0:!1},el.isElement=function(e){var t;try{t=e instanceof HTMLElement||e instanceof Element}catch(n){t=e&&e.nodeType?!0:!1}return t},el.isCollection=function(e){return e instanceof HTMLCollection},el.isNodeList=function(e){return e instanceof NodeList}}();
function baton(u){var _={run:function(){var u=Array.prototype.splice.call(arguments,0);return _.__utils__.i=-1,_["yield"].apply(null,u)},then:function(u){return"function"==typeof u&&_.__utils__.queue.push(u),_},"yield":function(u){var t=Array.prototype.splice.call(arguments,0);return t.unshift(_["yield"]),"undefined"!=typeof _.__utils__.queue[_.__utils__.i+1]?(_.__utils__.i++,_.__utils__.queue[_.__utils__.i].apply(null,t)):u},__utils__:{queue:[],i:-1}};return Object.create(_).then(u)}

function pause(time, _callback) {
	var args = Array.prototype.splice.call(arguments, 2);
	console.log("args:",args);
	setTimeout(function(){
		_callback.apply(null, args);
	}, time);
}
// --------------------------------
//				GLOBAL VARS
// --------------------------------
var remote = require("remote");
var app = remote.require("app");
var Global = remote.getGlobal("sharedObject"); //see index.js
var appRoot = Global.appRoot;
var fs = require("fs");
var json = require("jsonfile");
var escape = require("escape-html");
var mkdirp = require("mkdirp");
var path = require("path");
var core = Global.coreMethods = {

	// ----------------------------
	//  Persistent Data File
	// ----------------------------
	persistentDataFile: {

		read: function (_successCallback){
			json.readFile(appRoot+"/local/persistent-data.json", function(_err, _data){
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
			json.writeFile(Global.appRoot+"/local/persistent-data.json", _DATA, function(err){
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
			json.readFile(appRoot+"/local/user-settings.json", function(_err, _data){
				if(!_err){ 
					// console.log("user settings file: ",_data);
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

					json.writeFile(appRoot+"/local/user-settings.json", core.localData.userSettings, function(err){
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
			// console.log("core has it under control:", _brandName);
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
					mkdirp(self.getPathToBrands()+"/"+_brandName, function(err){
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

				// console.log("creating info file for:", _brandName);
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

				core.localData.currentProject.path = 
					core.brands.getPathToBrands()+"/"+
					core.localData.currentBrand+"/"+
					core.localData.currentProject.name;

			},

			/*Runs a callback, passing it an array of the names of the projects*/
			list: function(_brandName, _callback){
				
				baton(function(next){
					// console.log("brandName:", _brandName);
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
				
				
				// console.log("pathToBrand",pathToBrand);

			},

			create: function(_brandName, _projectName, _callback){
				var self = this;
				// create folder with brands name
				baton(function(next){
					core.brands.exists(_brandName, next);
				})
				.then(function(next, exists){

					if(exists) {
						mkdirp(core.brands.getPathToBrands()+"/"+_brandName + "/" + _projectName, function(err){
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

				list: function(_callback){
						var path = core.localData.currentProject.path;
						console.log("path to projects:", path);
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
		pathToBaseFiles: Global.appRoot+"/local/BaseFiles",

		updateUserSettings: function(_callback){ // should only be run on app init
			core.userSettingsFile.read(function(_data){
				if(core.localData.userSettings === null || core.localData.userSettings !== _data){
					core.localData.userSettings = _data;

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
			".scss": "sass",
			".styl": "stylus",
			".js": "javascript",
			".qtheme": "json",
			".json": "json"
		}

		if(extMap.hasOwnProperty(ext)){
			if(myCodeMirror.getOption("mode") !== extMap[ext]){
				myCodeMirror.setOption("mode", extMap[ext]);
			}	


			fs.readFile(core.localData.currentFile.path, "utf-8", function(err, data){
				if(err){ console.log("ERR",err);}
				else {
					// console.log("file Contents", data);
					myCodeMirror.setValue(data);
					myCodeMirror.markClean();
				}
			});
			// console.log("brand:", core.localData.currentBrand);
			// console.log("project:", core.localData.currentProject);
			// console.log("file:", core.localData.currentFile);
			// console.log("ext:", ext);
			// console.log("====");
		}
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
				console.log("activating");

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
				console.log("deactivating");
				core.localData.currentFile.clear();
			}
		},


		saveEditorFile: function(){
			if(core.localData.currentFile.path !== null){
				fs.writeFile(core.localData.currentFile.path, myCodeMirror.getValue(), function(err){
					if(err){ console.log("ERR",err);}
					else {
						// console.log("file Contents", data);
						editorCore.dropdowns.files.setClean();
						myCodeMirror.markClean();
						if(core.localData.currentFile.name === "StyleSheet.scss"){
							core.preview.compileSass();
						}
						console.log("saved code!");
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

			// "{~Question~}": function(){

			// },
			"{~Question~}": '<input type="hidden" name="SE~Context" value="Response"><!-- *************** SKIN QUESTION #0 ************************** --><div class="QuestionOuter MC BorderColor " id="QID5" questionid="QID5" posttag="QID5"><script>try {Qualtrics.SurveyEngine.QuestionInfo["QID5"] = {"QuestionID":"QID5","postTag":"QID5","QuestionText":"If you had to live in a single hotel chain for the rest of your life, which would it be?","QuestionType":"MC","Choices":{"1":{"RecodeValue":1,"VariableName":"Hyatt","Text":"Hyatt","Exclusive":false},"2":{"RecodeValue":2,"VariableName":"Hilton","Text":"Hilton","Exclusive":false},"3":{"RecodeValue":3,"VariableName":"Marriott","Text":"Marriott","Exclusive":false},"4":{"RecodeValue":4,"VariableName":"Sheraton","Text":"Sheraton","Exclusive":false}},"Validation":{"Settings":{"ForceResponse":"OFF","ForceResponseType":"ON","Type":"None"}},"Selector":"SAVR","SubSelector":"TX"};}catch(e){}</scr'+'ipt><!-- Debugging stuff --><div class="Inner SAVR BorderColor"><div class="InnerInner TX BorderColor"><input type="HIDDEN" id="QM~QID5~Displayed" name="QM~QID5~Displayed" value="1"> <input type="HIDDEN" id="QR~QID5~QuestionID" name="QR~QID5~QuestionID" value="QID5"><input type="HIDDEN" id="QR~QID5~DisplayOrder" name="QR~QID5~DisplayOrder" value="1|2|3|4"><input type="HIDDEN" id="QR~QID5~QuestionType" name="QR~QID5~QuestionType" value="MC"><input type="HIDDEN" id="QR~QID5~Selector" name="QR~QID5~Selector" value="SAVR"><input type="HIDDEN" id="QR~QID5~SubSelector" name="QR~QID5~SubSelector" value="TX"><fieldset><h2 class="noStyle"><div class="QuestionText BorderColor">If you had to live in a single hotel chain for the rest of your life, which would it be?</div></h2><div class="QuestionBody"><ul class="ChoiceStructure"><li class="Selection reg"><input choiceid="1" class="radio" type="radio" name="QR~QID5" id="QR~QID5~1" value="QR~QID5~1"><label for="QR~QID5~1" class="q-radio"></label><span class="LabelWrapper"><label for="QR~QID5~1" class="SingleAnswer">Hyatt</label></span><div class="clear"></div></li> <li class="Selection alt"><input choiceid="2" class="radio" type="radio" name="QR~QID5" id="QR~QID5~2" value="QR~QID5~2"><label for="QR~QID5~2" class="q-radio"></label><span class="LabelWrapper"><label for="QR~QID5~2" class="SingleAnswer">Hilton</label></span><div class="clear"></div></li> <li class="Selection reg"><input choiceid="3" class="radio" type="radio" name="QR~QID5" id="QR~QID5~3" value="QR~QID5~3"><label for="QR~QID5~3" class="q-radio"></label><span class="LabelWrapper"><label for="QR~QID5~3" class="SingleAnswer q-checked">Marriott</label></span><div class="clear"></div></li> <li class="Selection alt"><input choiceid="4" class="radio" type="radio" name="QR~QID5" id="QR~QID5~4" value="QR~QID5~4"><label for="QR~QID5~4" class="q-radio"></label><span class="LabelWrapper"><label for="QR~QID5~4" class="SingleAnswer">Sheraton</label></span><div class="clear"></div></li> </ul> <div class="clear zero"> </div><input type="hidden" name="Transformation~QID5" value="YToxOntzOjc6IlFSflFJRDUiO3M6MTY6Int2YWx1ZX09U2VsZWN0ZWQiO30="></div></fieldset></div></div></div><!-- ^^^^^^^^^^^^^^^^^^^^^^ SKIN QUESTION #8 ^^^^^^^^^^^^^^^^^ -->',




			"{~Buttons~}": '<input id="PreviousButton" type="button" value="<<" name=""><input id="NextButton" onkeypress="if(!this.disabled){Qualtrics.SurveyEngine.navEnter(arguments[0],this, "NextButton"); };  " onclick="Qualtrics.SurveyEngine.navClick(event, "NextButton")" title=" >> " type="submit" name="NextButton" value=" >> ">',

			"{~Footer~}":"",

		},

		init: function(){
			this.hide();
		},

		hidden: true,

		show: function(){
			if(core.localData.currentProject.name !== null && this.hidden !== false){
				console.log("showing preview file; hidden:", false);
				preview.src = "local/currentPreview.html";
				this.hidden = false;

			} else {
				console.log("cant show file");
			}
		},

		hide: function(){
			preview.src = "local/no-preview.html";
			console.log("hidden:", true);
			this.hidden = true;
		},

		compileSass: function(){
			console.log("compiling sass")
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
				console.log("stopped watching 1")
			}
			if(self.cssFileWatcher !== null){
				self.cssFileWatcher.close();
				self.cssFileWatcher = null;
				console.log("stopped watching 2")
			}
			if(self.skinFileWatcher !== null){
				self.skinFileWatcher.close();
				self.skinFileWatcher = null;
				console.log("stopped watching 3")
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
			// console.log("self.sassFileWatcher",self.sassFileWatcher)
			// var path = core.localData.currentProject.path+"/StyleSheet.scss";
			// self.sassFileWatcher = fs.watch(path, function(evt, _fileName){
			// 	console.log("init sass 1");
			// 	console.log("evt:",evt, _fileName)
			// 	self.compileSass();
			// });
			// console.log("watching 1")
		},

		watchCssFile: function(){
			var self = this;
			var path = core.localData.currentProject.path+"/StyleSheet.css";
			self.cssFileWatcher = fs.watch(path, function(evt, _fileName){
				self.update();
				console.log("reloading 2");
				preview.reload();
			});
			console.log("watching 2")
		},

		watchSkinFile: function(){
			var self = this;
			var path = core.localData.currentProject.path+"/Skin.html";
			self.skinFileWatcher = fs.watch(path, function(evt, _fileName){
				self.update();
				console.log("reloading 3")
				preview.reload();
			});
			console.log("watching 3")
		},

		update: function(){
			// to run, use:  core.preview.update();

			var self = this;
			fs.readFile(core.localData.currentProject.path+"/Skin.html", "utf-8", function(_errHtml, _html){
				if(_errHtml){ console.log("ERR",_errHtml);}
				else {
							
					gulp.src("local/previewTemplate.html")
					.pipe(replace("{~StyleSheet.css~}", core.localData.currentProject.path+"/StyleSheet.css"))
					.pipe(replace("{~SKIN.HTML~}", _html))
					.pipe(replace("{~ProgressBar~}", self.map["{~ProgressBar~}"]))
					.pipe(replace("{~Header~}", self.map["{~Header~}"]))
					.pipe(replace("{~Question~}", self.map["{~Question~}"] ))
					.pipe(replace("{~Buttons~}", self.map["{~Buttons~}"] ))
					.pipe(replace("{~Footer~}", self.map["{~Footer~}"] ))
					.pipe(rename("currentPreview.html"))
					.pipe(gulp.dest("local/"));

					console.log("updated preview");

				}
			});

			
		}

	}
};








// --------------------------------
//	Set core.LocalData
// --------------------------------
core.localData.updateUserSettings();



var currentPanel = {};

var logo = el("#logo");
var panel = el("#panel");
var navOptions = el(".nav_option");

// --------------------------------
//	Slide-in menus, btns etc.
// --------------------------------
setTimeout(function(){
	panel.rmClass("hide");
	logo.rmClass("hide");
	el("#nav").rmClass("hide");
	el("html")[0].rmClass("white");
	el("body")[0].rmClass("white");
	el("#bottom-bar").rmClass("hide");
}, 200);

	

// --------------------------------
//				CANCEL BUTTON
// --------------------------------
el("#cancel").on("click", function(){
	Global.preferencesWindow.close();
})


// --------------------------------
//				SAVE BUTTON
// --------------------------------
el("#save").on("click", function(e){
	savePreferences();
});

function savePreferences() {
	// saves from localData.userSettings to user-settings.json
		core.userSettingsFile.update(function(){ // on success
			logo.addClass("saved");
			setTimeout(function(){
				Global.preferencesWindow.close();
			}, 450);
		});
}


// --------------------------------
//			PREFERENCES NAV
// --------------------------------
el("#QTS-option").on("click", function(){
	panel.transitionTo.run("QTS");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#files-option").on("click", function(){
	panel.transitionTo.run("files");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#snippets-option").on("click", function(){
	panel.transitionTo.run("snippets");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#preview-option").on("click", function(){
	panel.transitionTo.run("preview");
	navOptions.rmClass("current");
	this.addClass("current");
})
el("#window-option").on("click", function(){
	panel.transitionTo.run("window");
	navOptions.rmClass("current");
	this.addClass("current");
})


// --------------------------------
//		CHANGE PREFERENCES PANEL
// --------------------------------
panel.transitionTo = baton(function(next, _newPanelName){

	panel.addClass("hide");
	var _newPanel = panel.buildPanel(_newPanelName);
	panel.insertData(_newPanelName);

	setTimeout(function(){
		next(_newPanel);
	}, 300);

})
.then(function(next, _newPanel){

	panel.setPanel(next, _newPanel);
	panel.rmClass("hide");

})
.then(function(next){
	// console.log("currentPanel:",currentPanel);
	currentPanel.on("submit", function(evt){
		evt.preventDefault();
	});

});


// --------------------------------
//			BUILD PANEL (FORM)
// --------------------------------
panel.buildPanel = function(_newPanel) {
	if(_newPanel === "QTS"){

		currentPanel = el("+form#qtsForm").addClass("QTS").append(
			el("+label").text("QTS Thing").append( el("+input") )
		);
		return currentPanel;
	} 

	else if(_newPanel === "files"){

		currentPanel = el("+form#filesForm").addClass("files");
		//Path To Brands
		currentPanel.append( 
			el("+label#path-to-brands-label").append( 
				el.join([
					el("+div").text("Path To Brands"),
					el("+span#homeDirectory").text(process.env.HOME+"/ "),
					el("+input#path-to-brands")
				])
				 
			) 
		);
		//Default Preview File
		currentPanel.append( 
			el("+label").text("Default Preview File").append( 
				el("+div").addClass("select_cont").append(
					el("+select#default-preview-file").attr("name", "default-preview-file")
				)
			)
		);
		//Manage Preview Files
		currentPanel.append( el("+button").text("Manage Preview Files") );
		return currentPanel;
	} 

	else if(_newPanel === "snippets"){

		currentPanel = el("+form#snippetsForm").addClass("snippets").append(
			el("+label").text("Snippets Stuff").append( el("+input") )
		);

		return currentPanel;

	} 

	else if(_newPanel === "preview"){
		
		currentPanel = el("+form#previewForm").addClass("preview").append(
			el.join([
				el("+div").addClass("fieldSet").append(
					el.join([
						el("+h2").text("Refresh Preview Window"),
						el("+label").addClass(["radioLabel"]).text("On Save").append(
							el("+span").text(" (⌘S) ")
						).text(" and Command ").append(
							el.join([
								el("+span").text(" (⌘R) "),
								el("+input#onSave").attr("type", "radio").attr("value", 1).attr("name", "refreshPreview")
							])
						),
						el("+label").addClass("radioLabel").text("On Command Only").append(
							el.join([
								el("+span").text(" (⌘R) "),
								el("+input#onCommand").attr("type", "radio").attr("value", 2).attr("name", "refreshPreview")
							])
						)
					])
				),
				el("+div").addClass("fieldSet").append(
					el.join([
						el("+h2").text("Default Thumbnail Name"),
						el("+input#thumbnailName").addClass("thumbnailName").attr("name", "thumbnailName"),
						el("+div").addClass(["select_cont", "inline-block"]).append( el("+select#default-thumbnail-ext") )
					])
				),
			])
		);
		return currentPanel;
	} 

	else if(_newPanel === "window"){

		currentPanel = el("+form#windowForm").addClass("window").append(
			el("+label").text("Window Thing").append( el("+input") )
		);
		return currentPanel;

	}
}


// --------------------------------
//		APPLY THE BUILT PANNEL
// --------------------------------
panel.setPanel = function(next, _newPanel) {
	panel.purge().append(_newPanel);
	checkAndRadio();
	next();
}


// --------------------------------
//		INSERT DATA INTO PANEL
// --------------------------------
panel.insertData = function(_panel){
	if(_panel === "QTS"){

	} else if(_panel === "files"){

		// add path to Brands folder
		var pathToBrands = currentPanel.el("#path-to-brands").attr("value",core.localData.userSettings.files.pathToBrands);

		// Populate the preview files and select the default		
		var defaultPreviewFile = currentPanel.el("#default-preview-file");
		// ADD OPTIONS
		var tempArray = [];		
		for(var i = 0, ii = core.localData.userSettings.files.previewFiles.length; i < ii; i++ ){
			var pF = core.localData.userSettings.files.previewFiles;			
			var currentOption = el("+option").attr("value", pF[i].fileName).text( pF[i].verboseName );
			if( pF[i].fileName === core.localData.userSettings.files.defaultPreviewFile ) currentOption.selected = true;
			tempArray.push(currentOption);	
		}		

		defaultPreviewFile.append( el(tempArray) );		


		currentPanel.el("#path-to-brands").on("blur", function(){
			if(this.value !== core.localData.userSettings.files.pathToBrands){
				core.localData.userSettings.files.pathToBrands = this.value;
			}
		});
		currentPanel.el("#default-preview-file").on("blur", function(){
			if(this.options[this.selectedIndex].value !== core.localData.userSettings.files.defaultPreviewFile){
				core.localData.userSettings.files.defaultPreviewFile = this.options[this.selectedIndex].value;
			}
		});


	} else if(_panel === "snippets"){

	} else if(_panel === "preview"){
		currentPanel.el("#"+core.localData.userSettings.preview.refreshPreview).checked = true;
		currentPanel.el("#thumbnailName").attr("value", core.localData.userSettings.preview.defaultThumbnailName);

		var defaultThumbnailExt = currentPanel.el("#default-thumbnail-ext");
		// ADD OPTIONS
		var tempArray = [];		
		for(var i = 0, ii = core.localData.userSettings.preview.thumbnailExtensions.length; i < ii; i++ ){
			var tnE = core.localData.userSettings.preview.thumbnailExtensions;		
			var currentOption = el("+option").attr("value", tnE[i]).text( tnE[i] );
			if( tnE[i] === core.localData.userSettings.preview.defaultThumbnailExt ) currentOption.selected = true;
			tempArray.push(currentOption);
		}		
		defaultThumbnailExt.append( el(tempArray) );		



		currentPanel.el("#onSave").on("focus", function(){
		if(core.localData.userSettings.preview.refreshPreview !== this.id){
			core.localData.userSettings.preview.refreshPreview = this.id;
		}
	});
	currentPanel.el("#onCommand").on("focus", function(){
		if(core.localData.userSettings.preview.refreshPreview !== this.id){
			core.localData.userSettings.preview.refreshPreview = this.id;
		}
	});


	} else if(_panel === "window"){

	}

}


// --------------------------------
// ELIFY APPENDED CHECK/RADIO BTNS
// --------------------------------
function checkAndRadio(){
	el(document.querySelectorAll("input[type=radio]"))
}






