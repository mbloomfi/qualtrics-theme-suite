// DROPDOWNS
var dropdowns = {
	brands: "closed",
	projects: "closed"
};

function setDropdownGlobals(){
	window.brandName = el("#brandName");
	window.projectName = el("#projectName");
}

function toggleDropdown(_dropdown){
	if(dropdowns[_dropdown] === "opened") {
		closeDropdown(_dropdown);
		dropdowns[_dropdown] = "closed";
	}
	else if(dropdowns[_dropdown] === "closed") {
		openDropdown(_dropdown);
		dropdowns[_dropdown] = "opened";
	}
}

function openDropdown(_dropdown) {
	if(_dropdown === "brands"){
		brandsDropdown.rmClass("hide");
		initBrandSearch();
	}
	else if(_dropdown === "projects") {
		projectDropdown.rmClass("hide");
	}
}

function closeDropdown(_dropdown) {

	if(_dropdown === "brands"){

		baton(function(next){
			brandsDropdown.addClass("hide");
			pause(200, next);
		})
		.then(function(next){
			brandDropDown.purge();
			pause(10, next);
		})
		.then(function(){
			brandDropDown.refill();
		})
		.run();

	}

	else if(_dropdown === "projects") {

		baton(function(next){
			projectDropdown.addClass("hide");
			pause(200, next);
		})
		.then(function(next){
			projectDropdown.purge();
			pause(10, next);
		})
		.then(function(){
			projectDropDown.refill();
		}).run();

	}
	
}

function enableBrandDropdowns(_dropdown_type){
	if(_dropdown_type === "brands"){

		window.brandsDropdown = brandName.el(".dropdown")[0];

		brandName.on("click", function(evt){
			toggleDropdown("brands");
		});

		brandsDropdown.on("click", function(evt){
			evt.stopPropagation();
		});

	} else if(_dropdown_type === "projects") {

		projectName.on("click", function(evt){
			toggleDropdown("projects");
		});

		projectDropdown.on("click", function(evt){
			evt.stopPropagation();
		});
	}

	el("body")[0].on("click", function(evt){
		if(dropdowns["brands"] === "opened" && evt.target !== brandName){
			toggleDropdown("brands");
		}
		else if(dropdowns["projects"] === "opened" && evt.target !== projectName){
			toggleDropdown("projects");
		}
	});
	
}
	