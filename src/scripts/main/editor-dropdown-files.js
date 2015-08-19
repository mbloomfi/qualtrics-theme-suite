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
		baton(function(next){
			filesDropdown.addClass("hide");
			filesDropdown.el(".arrow")[0].addClass("hide");
			fileName.rmClass("dropdown-active");
			setTimeout(next, 200);
		})
		.then(function(next){
			// self.purge();
			setTimeout(next, 10);
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








