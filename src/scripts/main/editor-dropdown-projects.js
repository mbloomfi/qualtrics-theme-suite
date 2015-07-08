editorCore.dropdowns.projects = {

	status: "closed",

	select: function(_projectName){
		console.log("selecting", _projectName);
		var self = this;
		self.close();
		el("#projectNameText").purge().text(_projectName);

		// Add this functionality
		// core.brands.projects.select(_projectName);
		core.brands.projects.setCurrentProject(_projectName);
		editorCore.dropdowns.files.activate(_projectName);
		editorCore.dropdowns.files.populate(_projectName);


	},


	init: function(){
		var self = this;

		projectName.on("click", function(evt){
			if(editorCore.dropdowns.brands.status === "opened") editorCore.dropdowns.brands.close();
			if(editorCore.dropdowns.files.status === "opened") editorCore.dropdowns.files.close();
			if(!this.hasClass("inactive")){
				self.toggle();
				evt.stopPropagation();
			}
		});

		projectDropdown.on("click", function(evt){
			evt.stopPropagation();
		});
	},

	/*resets the title name and closes dropdown*/
	reset: function(){
		var self = this;
		if(self.status === "opened") self.close();
		el("#projectNameText").purge().text("Projects");
	},

	/**/
	activate: function() {
		var self = this;
		// read current brand from localData
		var currentBrand = core.localData.currentBrand;
		self.reset();
		projectName.rmClass("inactive");
		// remove inactive class
	},

	toggle: function(){
		if(this.status === "opened") {
			this.close();
		}
		else if(this.status === "closed") {
			this.open();
		}
	},

	addBaseFiles:function(_projectName){

	},

	open: function(){
		var self = this;
		self.status = "opened";

		self.refill();
		projectName.addClass("dropdown-active");
		projectDropdown.rmClass("hide");
		projectDropdown.el(".arrow")[0].rmClass("hide");
	},

	close: function(){
		var self = this;
		self.status = "closed";
		baton(function(next){
			projectDropdown.addClass("hide");
			projectName.rmClass("dropdown-active");
			projectDropdown.el(".arrow")[0].addClass("hide");
			setTimeout(next, 200);
		})
		.then(function(next){
			self.purge();
			setTimeout(next, 10);
		})
		.then(function(){
			// self.refill();
		}).run();
	},

	populate: function(){
		// initial populate; for individual projects, see refill
		projectName.append(

			el("+div").addClass(["dropdown", "hide"]).append(

				el.join([
					el("+div").addClass(["arrow", "hide"]),
					el("+div").addClass(["dropdownBody", "projects"]),
					el("+div").addClass("inputCont")
				])

			)

		);
		window.projectDropdown = projectName.el(".dropdown")[0];
		window.projectDropdownBody = projectName.el(".dropdownBody")[0];
		window.projectDropdownInputCont = projectName.el(".inputCont")[0];
	},

	noProjects: function(){
		console.log("no projects");
		projectDropdownBody.append(
			el("+div").addClass("no-projects").text("(no projects)")
		)
	},

	refill: function(){
		var self = this;
		core.brands.projects.list(core.localData.currentBrand, function(projects){

			var newProjectInput = el("+input#newProjectInput").attr("placeholder","Create New Project");
			var newProjectInputBtn = el("+div#newProject-btn").append(
				el.join([
					el("+div").addClass("vertical-bar"),
					el("+div").addClass("horizontal-bar")
				])
			);
			projectDropdownInputCont.append(newProjectInput);
			projectDropdownInputCont.append(newProjectInputBtn);

			if(projects.length === 0)
			{
				self.noProjects();
			} 

			else 
			{
				projectDropdownBody.append(
					el("+div").addClass("header").text("Projects")
				)
				for(var i = 0, ii = projects.length; i < ii; i++){
					projectDropdownBody.append(
						el("+button").addClass("project-item").attr("data-projectname",projects[i]).text(projects[i])
					)
				}

				// Add click listeners to each result
				el(".project-item").on("click", function(){
					editorCore.dropdowns.projects.select(this.dataset.projectname);
				});

			}

			function newProject(inputVal, projects){
					console.log("submit", inputVal);
					var match = false;
					for(var i = 0, ii = projects.length; i < ii; i++){
						if( projects[i].toUpperCase() === inputVal.toUpperCase() ) match = true;
					}

					if(!match){
						core.brands.projects.create(core.localData.currentBrand, inputVal, function(){
							editorCore.dropdowns.projects.copyBaseFilesToProject(inputVal, function(){
								console.log("select:", inputVal);
								editorCore.dropdowns.projects.select(inputVal);

							});
							
						});

					}
					else {
						alert("Project Name Already Exists");
					}
					console.log("arr", projects);
			}

			newProjectInput.on("keyup", function(e){
				if(e.keyCode === 13 || e.keyIdentifier === "Enter"){
					if(this.value.length > 0 && this.value.slice(0,1) !== " "){
						newProject(this.value, projects);
					}
				}
			});

			newProjectInputBtn.on("click", function(e){
				if(newProjectInput.value.length > 0 && newProjectInput.value.slice(0,1) !== " "){
					newProject(newProjectInput.value, projects);
				}
			});

				


		})
	},
	purge: function(){
		projectDropdownBody.purge();
		projectDropdownInputCont.purge();
	},

	copyBaseFilesToProject: function(_projectName, _callback){
		var _brandName = core.localData.currentBrand;
		var pathToProject = core.brands.getPathToBrands()+"/"+core.localData.currentBrand+"/"+_projectName;
		var pathToBaseFiles = core.localData.pathToBaseFiles;

		core.getFiles(pathToBaseFiles, function(files){
			console.log("these are the files:",files)
			for(var i = 0, ii = files.length; i < ii; i++){
				fs.copySync(pathToBaseFiles+"/"+files[i], pathToProject+"/"+files[i])
			}
			_callback();
		})


	},

	updateTextEditor: function(){}
};