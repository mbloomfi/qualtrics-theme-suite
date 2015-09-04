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
