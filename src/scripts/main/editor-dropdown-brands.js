editorCore.dropdowns.brands = {

	

	setGlobalVariables: function(){
		window.brandSearchInput = el("#searchBrands");
		window.brandsListCont = el("#brandsListCont");
	},

	status: "closed",

	init: function(){
			var self = this;
			brandName.on("click", function(evt){
				if(editorCore.dropdowns.projects.status === "opened") editorCore.dropdowns.projects.close();
				if(editorCore.dropdowns.files.status === "opened") editorCore.dropdowns.files.close();
				if(!this.hasClass("inactive")){
					self.toggle();
					evt.stopPropagation();
				}
			});
			brandsDropdown.on("click", function(evt){
				evt.stopPropagation();
			});
	},

	select: function(_brandName){
		var self = this;

		function selectBrand(){
			console.log("selecting:",_brandName);
			core.brands.exists(_brandName, function(exists){
				ipc.send('asynchronous-message', 'disablePreviewModes');

					if(exists){
						el("#brandNameText").purge().text(_brandName);
						core.brands.select(_brandName);
						// activate projects dropdown
						editorCore.dropdowns.projects.activate();
						editorCore.dropdowns.files.deactivate();
						core.codeMirror.deactivate();
						myCodeMirror.markClean();
						editorCore.dropdowns.files.reset();
						core.preview.deactivate();
						editorCore.refreshBtn.deactivate();

						self.close();
					} else {
						console.log("brand ",_brandName,"does not exists")
						self.close();
						// refresh last open file
						core.localData.rmFromRecentBrands(_brandName, function(){
							alert("Brand not found. Brand removed from recent brands.");
						})
					}	
			});

		}

			if(!myCodeMirror.isClean()) {

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
									selectBrand();
								}
							},
							btn3: null,
						}) ;

				}	else {
					selectBrand();
				}

		
		
		
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

			brandsDropdown.el(".arrow")[0].rmClass("hide");
			
		},0);

	},

	close: function(){
		var self = this;
		self.status = "closed";
		baton(function(next){
			brandsDropdown.addClass("hide");
			self.search.activated = false;
			brandName.rmClass("dropdown-active");
			brandsDropdown.el(".arrow")[0].addClass("hide");
			setTimeout(next, 200);
		})
		.then(function(next){
			editorCore.dropdowns.brands.search.newBrandBtn.remove();
			self.purge();

			next();
		})
		.then(function(){
			self.refill();
			brandsDropdown.el(".arrow")[0].addClass("hide");
		})
		.run();
	},

	populate: function(){
		brandName.append(
			el("+div").addClass(["dropdown", "hide"]).append(

				el.join([
					el("+div").addClass(["arrow", "hide"]),

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
	},

	recent: {

		maxAmount: 15,

		populate: function(){
			console.log("start populating recent brands:",core.localData.brands.recent);
			var self = this;
			baton(function(next){
				editorCore.dropdowns.brands.search.newBrandBtn.remove();
				core.localData.updateRecentBrands(next);
			})
			.then(function(next){

				var recentBrandsArray = core.localData.brands.recent;

				console.log("recentBrandsArray::", recentBrandsArray);

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
					recentBrandsCont.addClass("no-recent").text("No recent brands to display.");
				}


				brandsListCont.purge().append( recentBrandsCont );

				el(".brand-item").on("click", function(){
					editorCore.dropdowns.brands.select(this.dataset.brandname);
				});


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
					console.log("reloading brands?");
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
			)
				
			brandsListCont.purge().append( noResultsContainer );

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

				// Add click listeners to each result
				el(".brand-item").on("click", function(){
					editorCore.dropdowns.brands.select(this.dataset.brandname);
				});

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

		// ADD BRAND BUTTON
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
						if(!btn.hasClass("disabled")) {
							core.brands.create(btn.dataset.brandname, function(){
								editorCore.dropdowns.brands.select(btn.dataset.brandname);
							});
						}
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


	}

};