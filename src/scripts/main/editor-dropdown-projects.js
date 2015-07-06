editorCore.dropdowns.projects = {

	status: "closed",

	select: function(_projectName){
		console.log("selecting", _projectName);
		var self = this;
		self.close();
		el("#projectNameText").purge().text(_projectName);

		// Add this functionality
		// core.brands.projects.select(_projectName);
		
	},


	init: function(){
		var self = this;

		projectName.on("click", function(evt){
			if(editorCore.dropdowns.brands.status === "opened") editorCore.dropdowns.brands.close();
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

	open: function(){
		var self = this;
		self.status = "opened";

		self.refill();
		projectName.addClass("dropdown-active");
		projectDropdown.rmClass("hide");
	},

	close: function(){
		var self = this;
		self.status = "closed";
		baton(function(next){
			projectDropdown.addClass("hide");
			projectName.rmClass("dropdown-active");
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
					el("+div").addClass("arrow"),
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
						alert("Creating Project");
						core.brands.projects.create(core.localData.currentBrand, inputVal);
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
	}
};