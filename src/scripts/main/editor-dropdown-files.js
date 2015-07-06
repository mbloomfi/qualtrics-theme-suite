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
					el("+div").addClass("arrow"),

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
			// console.log("getting files for:", _projectName);
			self.active = true;
		}
	},
	deactivate: function(_projectName){
		var self = this;
		if(self.active === true) {
			fileName.addClass("inactive");
			self.active = false;
		}
	},

	populate: function(_projectName){
		var self = this;
		self.purge();
		console.log("==populating")
		core.brands.projects.files.list(_projectName, function(files){
			console.log("files",files);
			filesDropdownBody.append(
				el("+div").addClass("header").text("Files")
			)
			for(var i = 0, ii = files.length; i < ii; i ++){
				if(files[i].indexOf("StyleSheet") !== -1){
					filesDropdownBody.append(
						el("+div").addClass(["file-item", "bold"]).attr("data-filename", files[i]).text(files[i])
					)
				}
				else {
					filesDropdownBody.append(
						el("+div").addClass("file-item").attr("data-filename", files[i]).text(files[i])
					)
				}
					
			}
		});
	},

	toggle: function(){
		// console.log("current status:", this.status);
		if(this.status === "opened") {
			this.close();
		}
		else if(this.status === "closed") {
			this.open();
		}
	},
	open: function(){
		// console.log("opening files");
		var self = this;
		self.status = "opened";

		// self.refill();
		// projectName.addClass("dropdown-active");
		filesDropdown.rmClass("hide");
	},
	close: function(){
		// console.log("closing files");
		var self = this;
		self.status = "closed";
		baton(function(next){
			filesDropdown.addClass("hide");
			// projectName.rmClass("dropdown-active");
			setTimeout(next, 200);
		})
		.then(function(next){
			// self.purge();
			setTimeout(next, 10);
		})
		.then(function(){
			// self.refill();
		}).run();
	},
	update: function(_projectName){
		// add file-items container
		// add the add new container
	},
	select: function(_projectName){

	},
	purge: function() {
		filesDropdownBody.purge();
	}

};