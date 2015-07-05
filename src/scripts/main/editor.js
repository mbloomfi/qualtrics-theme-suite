
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
					editorCore.dropdowns.brands.close();
				}
				if(editorCore.dropdowns.projects.status === "opened"){
					editorCore.dropdowns.projects.close();
				}
			});
		},

		brands: {

			recent: {

				maxAmount: 15,

				populate: function(){
					var self = this;
					baton(function(next){
						editorCore.dropdowns.brands.search.newBrandBtn.remove();
						core.localData.updateRecentBrands(next);
					})
					.then(function(next){

						var recentBrandsArray = core.localData.recentBrands;

						var recentBrandsCont = el("+div#recentBrandsCont");

						// header
						recentBrandsCont.append(
							el("+div").addClass("header").text("Recent Brands")
						)

						// add each result
						if(recentBrandsArray.length > 0){

							var brandLimit = (recentBrandsArray.length > self.maxAmount) ? self.maxAmount : recentBrandsArray.length;

							for(var i = 0; i < brandLimit; i++){
								recentBrandsCont.append(
									el("+button").addClass("brand-item").attr("data-brandname",recentBrandsArray[i]).text(recentBrandsArray[i])
								)
							}

						} 

						else {
							recentBrandsCont.text("No recent brands to display.");
						}


						brandsListCont.purge().append( recentBrandsCont );


					})
					.run();
				}

			},


			search: {

				activated: false,

				prepare:	function() {
					var self = this;
					baton(function(next, inputValue){
						editorCore.dropdowns.brands.setGlobalVariables();
						next();
					})
					.then(function(next){
						self.prepareInputListener();
						// SAVE BRANDS TO LOCAL PERSISTENT DATA
						brandSearchInput.on("focus", function(){
							core.localData.updateBrandsList();
						});

					}).run();
				},

				prepareInputListener: function(){
					var self = this;
					var timeout = undefined;

					// Will delay the search for brands for 300ms and 
					// batch the keystrokes into a single search

					brandSearchInput.on("keyup", function(){
						if(timeout != undefined) {
						 clearTimeout(timeout);
						}
						timeout = setTimeout(function() {
							timeout = undefined;
							var inputValue = brandSearchInput.value;
							if(inputValue.length > 0 && inputValue.slice(0,1) !== " "){
								// BEGIN SEARCHING
								self.updateResults(inputValue);
							} else {
								editorCore.dropdowns.brands.recent.populate();
							}
							if(!self.activated){ 
								self.activated = true;
							}
						}, 300);
					});

				},

				noResults: function(_brandName){

					var nameSize;
					if(_brandName.length < 8) nameSize = "small";
					else if(_brandName.length < 14) nameSize = "medium";
					else nameSize = "large";

					var noResultsContainer = el("+div").addClass("noResultsCont").append(
						el("+div").addClass("noResults").text("(No results)")
						// el.join([
							
							// el("+div#noResult-createBrand").addClass(nameSize).append(
							// 	el.join([
							// 		el("+div").text("Create Brand for :"),
							// 		el("+div").text(_brandName).attr("data-brandname", _brandName)
							// 	])
							// ),

						// ])
					)
						
					brandsListCont.purge().append( noResultsContainer );


					// el("#noResult-createBrand").on("click", function(){
					// 	core.brands.create(_brandName);
					// });

				},

				updateResults: function(criteria){
					var self = this;
					var matches = core.localData.filterBrands(criteria);

					
					if(matches.length > 0){

						var searchResultsCont = el("+div#searchResultsCont");

						if(matches.indexOf(criteria) === -1){
							setTimeout(function(){ // helps with performance
								editorCore.dropdowns.brands.search.newBrandBtn.add(criteria);
								editorCore.dropdowns.brands.search.newBrandBtn.enable(criteria);
								editorCore.dropdowns.brands.search.newBrandBtn.update(criteria);
							},0);
						} else {
							setTimeout(function(){ // helps with performance
								editorCore.dropdowns.brands.search.newBrandBtn.disable(criteria);
								editorCore.dropdowns.brands.search.newBrandBtn.update(criteria);
							},0);
						}

						

						// header
						searchResultsCont.append(
							el("+div").addClass("header").text("Search Results")
						)

						// add each result
						for(var i = 0, ii = matches.length; i < ii; i++){
							searchResultsCont.append(
								el("+button").addClass("brand-item").attr("data-brandname",matches[i]).text(matches[i])
							)
						}

						// if(matches.length > 6){ // add arrow
							// searchResultsCont.append( el("+div").addClass("arrow-down") )
						// }

						brandsListCont.purge().append( searchResultsCont );

						brandsListCont.rmClass("no-results");
						if(editorCore.dropdowns.brands.search.newBrandBtn.exists) {
								el("#createBrand").rmClass("no-results");
						} 
					}


					// no results
					else {
						self.noResults(criteria);

						if(!editorCore.dropdowns.brands.search.newBrandBtn.exists) {
							editorCore.dropdowns.brands.search.newBrandBtn.add(criteria);
						} 
						if(!editorCore.dropdowns.brands.search.newBrandBtn.enabled) {
							editorCore.dropdowns.brands.search.newBrandBtn.enable(criteria);
						}
						editorCore.dropdowns.brands.search.newBrandBtn.update(criteria);
						brandsListCont.addClass("no-results");
						el("#createBrand").addClass("no-results");
					}


				},

				newBrandBtn: {
					enabled: false,
					exists: false,
					add: function(_brandName){
						if(!this.exists){
							var btn = el("+button#createBrand").attr("data-brandname", _brandName).text("Create Brand");
							brandName.el(".dropdown")[0].el(".dropdownBody")[0].append(btn);
							brandsListCont.addClass("showBottomBtn");
							this.exists = true;
							btn.on("click", function(){
								if(!btn.hasClass("disabled")) core.brands.create(btn.dataset.brandname);
							});
						}
					},
					remove: function(){
						if(this.exists){
							el("#createBrand").rm();
							brandsListCont.rmClass("showBottomBtn");
							this.exists = false;
							this.enabled = false;
						}
					},
					enable: function(_brandName){
						if(!this.enabled){
							el("#createBrand").rmClass("disabled").attr("data-brandname", _brandName);
							this.enabled = true;
						}
					},
					disable: function(){
						if(this.enabled){
							el("#createBrand").addClass("disabled");
							this.enabled = false;
						}
					},
					update: function(_brandName){
						if(this.exists){
							el("#createBrand").attr("data-brandname", _brandName);
						}
					}
				}





			},

			setGlobalVariables: function(){
				window.brandSearchInput = el("#searchBrands");
				window.brandsListCont = el("#brandsListCont");
			},

			status: "closed",

			init: function(){
					var self = this;
					brandName.on("click", function(evt){
						if(editorCore.dropdowns.projects.status === "opened") editorCore.dropdowns.projects.close();
						self.toggle();
						evt.stopPropagation();
					});
					brandsDropdown.on("click", function(evt){
						evt.stopPropagation();
					});
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
				self.search.prepare();
				self.recent.populate();

				setTimeout(function(){
					brandsDropdown.rmClass("hide");
					brandName.addClass("dropdown-active");
				},0);

			},

			close: function(){
				var self = this;
				self.status = "closed";
				baton(function(next){
					brandsDropdown.addClass("hide");
					self.search.activated = false;
					brandName.rmClass("dropdown-active");
					setTimeout(next, 200);
				})
				.then(function(next){
					editorCore.dropdowns.brands.search.newBrandBtn.remove();
					self.purge();
					next();
				})
				.then(function(){
					self.refill();
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
										el("+input#searchBrands").attr("placeholder", "Search")
									),
									el("+section#brandsListCont").append(
										el("+div#recentBrands").text("Recent Brands")
									)
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
								)
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
				var self = this;
				projectName.on("click", function(evt){
					if(editorCore.dropdowns.brands.status === "opened") editorCore.dropdowns.brands.close();
					self.toggle();
					evt.stopPropagation();
				});
				projectDropdown.on("click", function(evt){
					evt.stopPropagation();
				});
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
					self.refill();
				}).run();
			},

			populate: function(){
				projectName.append(

					el("+div").addClass(["dropdown", "hide"]).append(

						el.join([
							el("+div").addClass("arrow"),

							el("+div").addClass("dropdownBody").append(
								el("+div").text("dropdown")
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



	