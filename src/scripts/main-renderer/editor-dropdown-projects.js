editorCore.dropdowns.projects = {

	status: "closed",

	select: function(_projectName){
		var self = this;
		// console.log("selecting", _projectName);
		function selectProject(){
			self.close();
			el("#projectNameText").purge().text(_projectName);

			// Add this functionality
			// core.brands.projects.select(_projectName);
			
			core.brands.projects.setCurrentProject(_projectName);
			editorCore.dropdowns.files.activate(_projectName);
			// editorCore.dropdowns.files.populate(_projectName);
			// console.log("selecting project 1");
			core.codeMirror.deactivate();
			myCodeMirror.markClean();
			editorCore.dropdowns.files.reset();
			// console.log("selecting project 2");
			core.preview.mode.regular.clearWatchers();
			// console.log("checkpoint 1");
			core.preview.mode.regular.setWatchers(function(_err){

				if(_err) {
					fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+_err+"\n\n", function(){});
					console.warn("could not set watchers");
					core.preview.mode.regular.disable();
				}
				else {

					// console.log("there were NO errors!");
					// console.log("selecting project 3");
					core.preview.mode.regular.update();
					core.preview.mode.regular.enable();
					// console.log("selecting project 4");
					editorCore.dropdowns.files.autoSelectStyleSheet();
					editorCore.refreshBtn.activate();
					// console.log("checkpoint 2");
					setTimeout(function(){
						core.preview.mode.regular.compileSass();
					},0);

					// these allow the menu items in the preview dropdown to become selectable
					ipc.send('asynchronous-message', 'enablePreviewModes');

					// console.log("checkpoint 3");


				}

					


			}); // error happens here if no StyleSheet.css or Skin.html

			


			

		}
		
			


		if ( 
			!myCodeMirror.isClean() && 
			core.localData.currentProject.name !== _projectName 
		) {

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
							selectProject();
						}
					},
					btn3: null,
				}) ;

		}	else if(core.localData.currentProject.name !== _projectName){
			selectProject();
		} else {
			self.close();
		}

		Eve.emit("Select Project", _projectName);

	},


	init: function(){
		var self = this;

		projectName.on("click", function(evt){
			
			if(editorCore.dropdowns.brands.status === "opened") 
				editorCore.dropdowns.brands.close();
			
			if(editorCore.dropdowns.files.status === "opened") 
				editorCore.dropdowns.files.close();
			
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
		el("#projects_arrow").rmClass("inactive");
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
		projectDropdown.el(".arrow")[0].rmClass("hide");
	},

	close: function(){
		var self = this;
		self.status = "closed";

		baton(function(){
			projectDropdown.addClass("hide");
			projectDropdownBody.rmClass("dim");
			projectName.rmClass("dropdown-active");
			projectDropdown.el(".arrow")[0].addClass("hide");
			setTimeout(this.next, 200);
		})
		.then(function(){
			self.purge();
			setTimeout(this.next, 10);
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
		// console.log("no projects");
		projectDropdownBody.append(
			el("+div").addClass("no-projects").text("(no projects)")
		)
	},

	refill: function(){
		var self = this;
		core.brands.projects.list(core.localData.currentBrand, function(projects){

			var customCheck = etc.template(function(){

				var checked = this.props.checked;
				// console.log("checked?",checked);
				return etc.el("label", {
					id:"addBaseFilesCheck_custom",
					className:((checked)?"checked":""),
					getCheckStatus: function(){
						return document.getElementById('addBaseFilesCheck').checked;
					},
					update: function(){
						var self = this;
						setTimeout(function(){
							if(self.getCheckStatus()){
								self.classList.add("checked");
							} else {
								self.classList.remove("checked");
							}
						}, 0);
					},
					attr: {
						"for":"addBaseFilesCheck"
					},
					events: {
						click: function(){
							this.update();
						}
					}
				}).append(
					etc.el("img",{src:"local/images/checkmark.svg"})
				)


			});
				

			var addBaseFilesCheck = el("+input#addBaseFilesCheck").attr("type","checkbox").attr("checked","true");
			var addBaseFilesCheck_label = el("+label#addBaseFilesCheck_label").attr("for","addBaseFilesCheck").text("Add Base Files");
			addBaseFilesCheck_label.on("click", function(){
				document.getElementById('addBaseFilesCheck_custom').update();
			});
			var addBaseFilesCheck_cont = el("+div#addBaseFilesCheck_cont").addClass("hide").append(
				el.join([
					addBaseFilesCheck_label,
					customCheck.render({checked:true}),
					addBaseFilesCheck
				])
			);

			

			var newProjectInput = el("+input#newProjectInput").attr("placeholder","Create New Project").on("click",function(){
				document.getElementById('addBaseFilesCheck_cont').classList.remove("hide");
				projectDropdownBody.addClass("dim");
			});

			var newProjectInputBtn = el("+div#newProject-btn").append(
				el.join([
					el("+div").addClass("vertical-bar"),
					el("+div").addClass("horizontal-bar")
				])
			);



			projectDropdownInputCont.append(newProjectInput);
			projectDropdownInputCont.append(newProjectInputBtn);
			projectDropdownInputCont.append(addBaseFilesCheck_cont);

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
					var projectItem = el("+button").addClass("project-item").attr("data-projectname",projects[i]).text(projects[i]);
					if(projects[i] === core.localData.currentProject.name){
						projectItem.addClass("current").append(
							el("+img").addClass("finder").attr("src","local/images/folder.svg")
						);
					}
					projectDropdownBody.append(projectItem);
				}

				// Add click listeners to each result
				el(".project-item").on("click", function(){
					editorCore.dropdowns.projects.select(this.dataset.projectname);
				});
				try {
					document.querySelector(".finder").addEventListener("click", function(){
						core.brands.projects.showInFinder();
					})
				}
				catch(e){
					
				}
				


			}

			function newProject(inputVal, projects){
					// console.log("submit", inputVal);
					var match = false;
					for(var i = 0, ii = projects.length; i < ii; i++){
						if( projects[i].toUpperCase() === inputVal.toUpperCase() ) match = true;
					}

					if(!match){
						core.brands.projects.create(core.localData.currentBrand, inputVal, function(){

							if(document.getElementById('addBaseFilesCheck').checked){
								editorCore.dropdowns.projects.copyBaseFilesToProject(inputVal, function(){




									editorCore.dropdowns.projects.select(inputVal);
								});
							} else {
								editorCore.dropdowns.projects.select(inputVal);
							}

								
							
						});

					}
					else {
						alert("Project Name Already Exists");
					}
					// console.log("arr", projects);
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
		var pathToProject = core.brands.getFullPathToBrands()+"/"+core.localData.currentBrand+"/"+_projectName;
		var pathToBaseFiles = core.localData.pathToBaseFiles;

		core.getFiles(pathToBaseFiles, function(files){
			// console.log("these are the files:",files)
			for(var i = 0, ii = files.length; i < ii; i++){
				fs.copySync(pathToBaseFiles+"/"+files[i], pathToProject+"/"+files[i])
			}
			_callback();
		})


	},

	updateTextEditor: function(){}
};