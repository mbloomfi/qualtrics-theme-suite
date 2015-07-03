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
							el("+section#brandsListCont").append(
								el("+div#recentBrands").text("recent brands")
							),
							el("+div#newBrand").text("New Brand")
						])

					)
				])

			) //dropdown

		);

		window.brandsDropdown = brandName.el(".dropdown")[0];
	},
	refill: function(){
		brandsDropdown.append(
			el.join([
				el("+div").addClass("arrow"),

				el("+div").addClass("dropdownBody").append(

					el.join([
						el("+div#searchBrandsContainer").append(
							el("+input#searchBrands").text("serch brands").attr("placeholder", "Search")
						),
						el("+section#brandsListCont").append(
							el("+div#recentBrands").text("recent brands")
						),
						el("+div#newBrand").text("New Brand")
					])

				)
			])
		);
	},
	purge: function(){
		brandsDropdown.purge();
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
		window.projectDropdown = projectName.el(".dropdown")[0];
	},
	refill: function(){
		projectDropdown.append(
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
		);
	},
	purge: function(){
		projectDropdown.purge();
	}
}



	



// DROPDOWNS
function enableDropdowns(){
	var dropdowns = {
		brands: "closed",
		projects: "closed"
	};
	
	var brandName = el("#brandName");
	var projectName = el("#projectName");

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
				pause(next, 200)
			})
			.then(function(next){
				brandDropDown.purge();
				pause(next,10);
			})
			.then(function(){
				brandDropDown.refill();
			})
			.run();
		}

		else if(_dropdown === "projects") {
			baton(function(next){
				projectDropdown.addClass("hide");
				pause(next, 200);
			})
			.then(function(next){
				projectDropdown.purge();
				pause(next,10);
			})
			.then(function(){
				projectDropDown.refill();
			}).run();
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
	