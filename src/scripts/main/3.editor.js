var brandDropDown = {
	populate: function(){
		var brandName = el("#brandName");
		brandName.append(
			el("+div").addClass("dropdown").append(
				el.join([
					el("+div#searchBrandsContainer").append(
						el("+input#searchBrands").text("serch brands").attr("placeholder", "Search")
					),
					el("+div#recentBrands").text("recent brands"),
					el("+div#newBrand").text("New Brand")
				])
			)
		);
		console.log("lpd",localPersistentData);
	}
};

function enableDropdowns(){
	var dropdowns = {
		brands: "closed",
		projects: "closed"
	}
	
	var brandsDropdown = el("#brandName").el(".dropdown")[0];
	// var brandDropdown = el("#brandName").el(".dropdown")[0];

	function openDropdown(dropdown) {
		if(dropdowns[dropdown] === "opened") return;

		baton(function(next, dropdown){
			console.log("dropdown opened:",dropdown);
			if(dropdown === "brands"){
				brandsDropdown.addClass("show");
			}
		}).yield(dropdown)

		dropdowns[dropdown] = "opened";
	}


	function closeDropdown(dropdown) {
		if(dropdowns[dropdown] === "closed") return;

		baton(function(next, dropdown){
			console.log("dropdown closed:",dropdown);
		}).yield(dropdown)

		dropdowns[dropdown] = "closed";
	}



	openDropdown("brands");
	// closeDropdown("brands");
}
	