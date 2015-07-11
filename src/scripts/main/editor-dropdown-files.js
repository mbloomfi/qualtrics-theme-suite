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

					el("+div").addClass(["dropdownBody", "files"])
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

		var deleteFileIcon = el("+button#deleteFile").addClass("icon");
		deleteFileIcon.innerHTML = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 14 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path d="M2.114,2.558c2.6,-2.599 6.821,-2.599 9.421,0c2.599,2.6 2.599,6.821 0,9.421c-2.6,2.599 -6.821,2.599 -9.421,0c-2.599,-2.6 -2.599,-6.821 0,-9.421ZM4.084,3.09l6.919,6.919c1.273,-1.938 1.058,-4.57 -0.646,-6.273c-1.703,-1.704 -4.335,-1.919 -6.273,-0.646ZM9.565,11.447l-6.919,-6.919c-1.273,1.938 -1.058,4.57 0.646,6.273c1.703,1.704 4.335,1.919 6.273,0.646Z"/></svg>';

		var renameFileIcon = el("+button#renameFile").addClass("icon");
		renameFileIcon.innerHTML = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 10 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path d="M2.488,12.633l0,0l-1.971,1.235l0.084,-2.324l0,-0.001l1.887,1.09ZM8.244,2.664l-5.433,9.411l-1.888,-1.09l5.434,-9.411l1.887,1.09ZM8.566,2.106l-1.887,-1.09l0.586,-1.016l1.888,1.09l-0.587,1.016Z"/></svg>';


		core.brands.projects.files.list(function(files){
			// console.log("files",files);
			filesDropdownBody.append(
				el("+div").addClass("header").append(
					el.join([
						el("+span").text("Files"),
						el("+div").addClass("icon_cont").append(
							el.join([
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

			el(".file-item").on("click", function(){
				editorCore.dropdowns.files.select(this.dataset.filename);
			})


			var icons = el(".icon").on("click", function(){
				var self = this;

				icons.each(function(icon){
					if(self === icon && self.hasClass("active")){ 
						icon.rmClass("active");
						el(".file-item").rmClass(self.id);
					}
					else if(self !== icon) {
						icon.rmClass("active");
						el(".file-item").rmClass(icon.id);
					}
					else {
						console.log("self.id", self.id);
						icon.addClass("active");
						el(".file-item").addClass(self.id);
					}
				});

			});

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

			var filesTotal = files.length;
			var filesCopied = 0;
			

			for(var i = 0, ii = files.length; i<ii; i++){
					
				(function(_file){
					fs.copy(_file.path, core.localData.currentProject.path+"/"+_file.name, function(err){
						if(err) return console.log("ERR copying:",_file.name, err);
						console.log("copied:", _file.name);
						filesCopied++;
						if(filesCopied === filesTotal){
							console.log("All Files Copied");
						}
					});
				})(files[i]);
				
			}

			
			


		}



	}

};



