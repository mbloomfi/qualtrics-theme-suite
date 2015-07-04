
// ----------------------------
//  Local Temp Data
// ----------------------------
var editorCore = {

	// ----------------------------
	//  Dropdowns
	// ----------------------------
	dropdowns: {

		setDropdownGlobals: function(){
			window.brandName = el("#brandName");
			window.projectName = el("#projectName");
		},

		bodyClick: function(){
			document.body.addEventListener('click', function(){
				if(editorCore.dropdowns.brands.status === "opened"){
					editorCore.dropdowns.brands.toggle();
				}
				else if(editorCore.dropdowns.projects.status === "opened"){
					editorCore.dropdowns.projects.toggle();
				}
			});
		},

		brands: {

			search: {
				preprare: baton(function(next, inputValue){
						setBrandSearchGlobals();
						next();
					})
					.then(function(next){
						prepareForBrandSearch();
					}),


			},

			status: "closed",

			init: function(){
					var self = this;
					brandName.on("click", function(evt){
						self.toggle();
					});
					brandsDropdown.on("click", function(evt){
						evt.stopPropagation();
					});
			},

			toggle: function(){
				if(this.status === "opened") {
					this.close();
					this.status = "closed";
				}
				else if(this.status === "closed") {
					this.open();
					this.status = "opened";
				}
			},

			open: function(){
				var self = this;
				brandsDropdown.rmClass("hide");
				prepareForBrandSearch.run();
				// self.init();
			},

			close: function(){
				baton(function(next){
					brandsDropdown.addClass("hide");
					setTimeout(next, 200);
				})
				.then(function(next){
					brandDropDown.purge();
					next();
				})
				.then(function(){
					brandDropDown.refill();
				})
				.run();
			},

			populate: function(){
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

					)

				);

				window.brandsDropdown = brandName.el(".dropdown")[0];
				// then enable dropdown
				
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

		},
		projects: {

			status: "closed",

			init: function(){
				// if(projectName.el(".dropdown")[0] === undefined || projectName.el(".dropdown")[0] === null){
				// 	editorCore.dropdowns.projects.populate();
				// }
				// window.projectsDropdown = projectName.el(".dropdown")[0];
				projectName.on("click", function(evt){
					editorCore.dropdowns.projects.toggle();
				});
				projectDropdown.on("click", function(evt){
					evt.stopPropagation();
				});
			},

			toggle: function(){
				if(this.status === "opened") {
					this.close();
					this.status = "closed";
				}
				else if(this.status === "closed") {
					this.open();
					this.status = "opened";
				}
			},

			open: function(){
				projectDropdown.rmClass("hide");
			},

			close: function(){
				baton(function(next){
					projectDropdown.addClass("hide");
					setTimeout(next, 200);
				})
				.then(function(next){
					projectDropdown.purge();
					setTimeout(next, 10);
				})
				.then(function(){
					projectDropDown.refill();
				}).run();
			},

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
	}
};



	