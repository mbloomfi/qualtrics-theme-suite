var core = {

	// ----------------------------
	//  Persistent Data File
	// ----------------------------
	persistentDataFile: {
		update: function (_callback){
			var _DATA = {};
			_DATA.recentBrands = core.localData.recentBrands;
			//_DATA.x = core.localData.x;
			json.writeFile(Global.appRoot+"/local/persistent-data.json", _DATA, function(err){
				if(err) alert("Error Saving Changes");
				else if(_callback!==undefined){
					var args = Array.prototype.splice.call(arguments, 1);
					_callback.apply(null, args);
				}
			});
		},

		read: function (_successCallback){
			json.readFile(appRoot+"/local/persistent-data.json", function(_err, _data){
				if(!_err) {
					if(typeof _successCallback === "function") _successCallback(_data);
				}
				else {
					console.log("readPersistantData ERROR:",_err);
				}
			});
		}
	},

	// ----------------------------
	//  User Preferences File
	// ----------------------------
	userSettingsFile: {
		// function readUserPreferences(_successCallback){
		// 	
		// }
		update: function(){

		}
	},

	// ----------------------------
	//  Local Temp Data
	// ----------------------------
	localData: {
		recentBrands: null,
		brandList: null,
		userSettings: null,
		currentBrand: null,

		initUserSettings: function(){
			json.readFile(appRoot+"/local/user-settings.json", function(_err, _data){
				if(!_err){ 
					core.localData.userPreferences = _data;
					if(typeof _successCallback === "function") _successCallback();
				}
				else {
					console.log("User Preferences READ ERROR:", _err);
				}
			});
		},

		updateBrandsList: function(_CALLBACK){
			var pathToBrands = process.env.HOME+"/"+localSettingsData.files.pathToBrands;
			var brandList = [];
			fs.readdir(pathToBrands, function(_err, _files){
				if(_err) console.log("error");
				for(var i = 0, ii = _files.length; i < ii; i++){
					var stats = fs.statSync(pathToBrands+"/"+_files[i]);
					if(stats.isDirectory()) brandList.push(_files[i]);
				}
				core.localData.brandList = brandList;
				if(_CALLBACK!==undefined) _CALLBACK();
			});
		},

		updateRecentBrands: function(){
			if(core.localData.recentBrands===null){
				core.persistentDataFile.read(function(_persistent_data){
					core.localData.recentBrands = _persistent_data.recentBrands;
				})
			} else {
				core.localData.recentBrands.unshift(core.localData.currentBrand);
			}
		},

		filterBrands: function(criteria){
			var matches = [];
			for(var i = 0, ii = core.localData.brandList.length; i < ii; i++){
				if(core.localData.brandList[i].slice(0,criteria.length).toUpperCase() === criteria.toUpperCase())
					matches.push(core.localData.brandList[i]);
			}
			return matches;
		},

		updateAll: function (_successCallback){
			core.localData.data = persistentDataFile.read(function(_data){
				core.localData.data = _data;
				if(typeof _successCallback === "function") _successCallback();
			})
		}
	},

	// DELETE

	localBrandList: {
		update: function(_callback){


			var pathToBrands = process.env.HOME+"/"+localSettingsData.files.pathToBrands;
			var brandsList = [];
			fs.readdir(pathToBrands, function(_err, _files){
				if(_err) console.log("error");
				for(var i = 0, ii = _files.length; i < ii; i++){
					var stats = fs.statSync(pathToBrands+"/"+_files[i]);
					if(stats.isDirectory()) brandsList.push(_files[i]);
				}

				updatePersitentDataFile(_callback);

				core.localData.brandList = brandsList;
			});
		},
		filter: function(){},
	},


	editor: {
		brandDropDown: {
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
		projectDropDown: {
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
	},


		
}









// // SAVE BRANDS TO LOCAL PERSISTENT DATA
// function updateBrandsList(_callback){
// 	var pathToBrands = process.env.HOME+"/"+localSettingsData.files.pathToBrands;
// 	var brandsList = [];
// 	fs.readdir(pathToBrands, function(_err, _files){
// 		if(_err) console.log("error");
// 		for(var i = 0, ii = _files.length; i < ii; i++){
// 			var stats = fs.statSync(pathToBrands+"/"+_files[i]);
// 			if(stats.isDirectory()) brandsList.push(_files[i]);
// 		}

// 		updatePersitentDataFile(_callback);

// 		core.localData.brandList = brandsList;
// 	});
// }


// function filterBrands(next, criteria){
// 	var matches = [];
// 	for(var i = 0, ii = core.localData.brandList.length; i < ii; i++){
// 		if(core.localData.brandList[i].slice(0,criteria.length).toUpperCase() === criteria.toUpperCase())
// 			matches.push(core.localData.brandList[i]);
// 	}
// 	next(matches);
// }










/*
C
R
U
D

*/