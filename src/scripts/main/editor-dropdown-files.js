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

					el("+div").addClass(["dropdownBody", "files"]).text("files here")
				])

			)

		);

		window.filesDropdown = fileName.el(".dropdown")[0];
		window.filesDropdownBody = filesDropdown.el(".dropdownBody")[0];

		fileName.on("click", function(evt){

			if(editorCore.dropdowns.brands.status === "opened")
				editorCore.dropdowns.brands.close();
			if(editorCore.dropdowns.projects.status === "opened")
				editorCore.dropdowns.projects.close();
			
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
		console.log("check1");
		if(self.active === true) {
			console.log("check2");
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
		// self.purge();
		// el("#fileNameText").purge().text("Files");
		core.brands.projects.files.list(function(files){
			// console.log("files",files);
			filesDropdownBody.append(
				el("+div").addClass("header").text("Files")
			);

			for(var i = 0, ii = files.length; i < ii; i ++){
				var _file = el("+div").addClass("file-item").attr("data-filename", files[i]).text(files[i]);

				if(files[i] === core.localData.currentFile.name){
					_file.addClass("current");
				}
				if(files[i].indexOf("StyleSheet.scss") !== -1 || files[i].indexOf("StyleSheet.styl") !== -1){
					_file.addClass("bold");
				}

				filesDropdownBody.append(_file);
					
			}

			_callback();

			el(".file-item").on("click", function(){
				editorCore.dropdowns.files.select(this.dataset.filename);
			})
		});
	},

	toggle: function(){
		// console.log("current status:", this.status);
		if(this.status === "opened") {
			this.close();
			console.log("11 closing files 11");
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
		// self.refill();
		// projectName.addClass("dropdown-active");
		
	},

	close: function(){
		console.log("!!closing files!!");
		var self = this;
		
		console.log("status,",self.status)
		//if already closed, return
		if(self.status === "closed") return;

		self.status = "closed";
		baton(function(next){
			filesDropdown.addClass("hide");
			filesDropdown.el(".arrow")[0].addClass("hide");
			// projectName.rmClass("dropdown-active");
			setTimeout(next, 200);
		})
		.then(function(next){
			// self.purge();
			setTimeout(next, 10);
		})
		.then(function(){
			// self.refill();
			self.purge();
		}).run();
	},

	reset: function(){
		core.preview.clearWatchers();
		el("#fileNameText").purge().text("Files");
	},

	select: function(_fileName){
		var self = this;

		// if filename is null, return
		if(_fileName === null) return;

		function selectFile() {
			el("#fileNameText").purge().text(_fileName);
			editorCore.dropdowns.files.close();
			core.codeMirror.activate();
			core.localData.setCurrentFile(_fileName);
			core.localData.currentFile.isNew = true;

			core.updateEditor();

			core.preview.update();
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
					btn3: null,
				}) ;

		}	else if(_fileName !== core.localData.currentFile.name){
			selectFile();
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
				console.log("DRAG LEAVE???");
				if(dragCounter === 0) editorBar.rmClass("file_drag");
			}
			
		});

		editorBar.on("dragover", function(evt){
			if(core.localData.currentProject.name !== null){

				// if not dragging file(s), do nothing
				if(evt.dataTransfer.files.length > 0) evt.preventDefault();

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
			}
			
		});


		function copyFiles(files){
			//check if file(s) of folder

			console.log(files);
			

			for(var i = 0, ii = files.length; i<ii; i++){
				// filePaths.push(files[i].path);
				
					
					(function(_file){
						fs.copy(_file.path, core.localData.currentProject.path+"/"+_file.name, function(err){
							if(err) return console.log("ERR copying:",_file.name, err);
							console.log("copied:", _file.name);
						});
					})(files[i]);
				
			}

			
			


		}



	}

};



