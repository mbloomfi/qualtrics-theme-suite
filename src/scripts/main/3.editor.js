var brandDropDown = {
	populate: function(){
		var brandName = el("#brandName");
		brandName.append(

			el("+div").addClass(["dropdown", "hide"]).append(

				el.join([
					el("+div").addClass("arrow"),

					el("+div").addClass("dropdownBody").append(

						el.join([
							el("+div#searchBrandsContainer").append(
								el("+input#searchBrands").text("serch brands").attr("placeholder", "Search")
							),
							el("+div#recentBrands").text("recent brands"),
							el("+div#newBrand").text("New Brand")
						])

					)
				])

			) //dropdown

		);
	}
};

var projectDropDown = {
	populate: function(){
		var projectName = el("#projectName");
		projectName.append(

			el("+div").addClass(["dropdown", "hide"]).append(

				el.join([
					el("+div").addClass("arrow"),

					el("+div").addClass("dropdownBody").append(
						el("+div").text("dropdown")
						// el.join([
						// 	el("+div#searchBrandsContainer").append(
						// 		el("+input#searchBrands").text("serch brands").attr("placeholder", "Search")
						// 	),
						// 	el("+div#recentBrands").text("recent brands"),
						// 	el("+div#newBrand").text("New Brand")
						// ])

					)
				])

			)

		);
	}
}


// var dropdownCheck = baton(function(next, data){

// })
// .then(function(next){

// })

var processBrandSearch = 
baton(readBrands)
	.then(updateSearchResults)

function initBrandSearch() {

	var brandSearchInput = el("#searchBrands");
	brandSearchInput.on("keyup", function(){
		console.log("keyup");
		var inputValue = brandSearchInput.value;
		if(inputValue.length > 0){
			for(var i = 0, ii = inputValue.length; i < ii; i++){

			}
		}
	})
}


	

function enableDropdowns(){


	var dropdowns = {
		brands: "closed",
		projects: "closed"
	}
	
	var brandName = el("#brandName");
	var projectName = el("#projectName");

	var brandsDropdown = brandName.el(".dropdown")[0];
	var projectDropdown = projectName.el(".dropdown")[0];

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
		}
		else if(_dropdown === "projects") {
			projectDropdown.rmClass("hide");
		}
		
	}
	function closeDropdown(_dropdown) {
		if(_dropdown === "brands"){
			brandsDropdown.addClass("hide");
		}
		else if(_dropdown === "projects") {
			projectDropdown.addClass("hide");
		}
		
	}

	brandName.on("click", function(evt){
		toggleDropdown("brands");
	});

	projectName.on("click", function(evt){
		toggleDropdown("projects");
	});

	brandsDropdown.on("click", function(evt){
		evt.stopPropagation();
	});

	projectDropdown.on("click", function(evt){
		evt.stopPropagation();
	});


	el("body")[0].on("click", function(evt){
		if(dropdowns["brands"] === "opened" && evt.target !== brandName){
			toggleDropdown("brands");
		}
		else if(dropdowns["projects"] === "opened" && evt.target !== projectName){
			toggleDropdown("projects");
		}
	});



	
}
	