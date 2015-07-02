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
		console.log("lpd",localPersistentData);
	}
};


// var dropdownCheck = baton(function(next, data){

// })
// .then(function(next){

// })

	

function enableDropdowns(){

	var dropdowns = {
		brands: "closed",
		projects: "closed"
	}
	

	var brandsDropdown = el("#brandName").el(".dropdown")[0];
	// var brandDropdown = el("#brandName").el(".dropdown")[0];

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
	}



	function closeDropdown(_dropdown) {
		if(_dropdown === "brands"){
			brandsDropdown.addClass("hide");
		}

	}

	brandName.on("click", function(){
		toggleDropdown("brands");
	});

	// openDropdown("brands");
	// closeDropdown("brands");
}
	