var core = Global.coreMethods = {

	// ----------------------------
	//  Persistent Data File
	// ----------------------------
	persistentDataFile: {

		read: function (_successCallback){
			json.readFile(appRoot+"/local/persistent-data.json", function(_err, _data){
				if(!_err) {
					if(typeof _successCallback === "function") _successCallback(_data);
				}
				else {
					console.log("readPersistantData ERROR:",_err);
				}
			});
		},

		update: function (_successCallback){
			var _DATA = {};
			_DATA.recentBrands = core.localData.recentBrands;
			//_DATA.x = core.localData.x;
			json.writeFile(Global.appRoot+"/local/persistent-data.json", _DATA, function(err){
				if(err) alert("Error Saving Changes");
				else if(_successCallback!==undefined){
					var args = Array.prototype.splice.call(arguments, 1);
					_successCallback.apply(null, args);
				}
			});
		}
		
	},

	// ----------------------------
	//  User Settings File
	// ----------------------------
	userSettingsFile: {
		// function readUserSettings(_successCallback){
		// 	
		// }
		read: function(_successCallback){
			json.readFile(appRoot+"/local/user-settings.json", function(_err, _data){
				if(!_err){ 
					if(typeof _successCallback === "function") _successCallback(_data);
				}
				else {
					console.log("User Settings READ ERROR:", _err);
				}
			});
		},
		update: function(_successCallback){
			var self = this;

			if(core.localData.userSettings === null){
				alert("Error with settings, sucks to be you.");
				return;
			}

			self.read(function(_data){
				if(core.localData.userSettings !== _data){

					json.writeFile(appRoot+"/local/user-settings.json", core.localData.userSettings, function(err){
						if(err) alert("Error Saving Changes");
						else _successCallback();
					});

				}
			});

			

			
		}
	},

	brands: {

		create: function(){

		},

		addRecentBrand: function(){

		},

		setCurrentBrand: function(){

		},


		exists: function(){

		},

		hasInfoFile: function(){

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

		updateUserSettings: function(_callback){ // should only be run on app init
			core.userSettingsFile.read(function(_data){
				if(core.localData.userSettings === null || core.localData.userSettings !== _data){
					core.localData.userSettings = _data;

					if(_callback) _callback();
				}
				
			});
		},

		updateBrandsList: function(_CALLBACK){
			var pathToBrands = process.env.HOME+"/"+core.localData.userSettings.files.pathToBrands;
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

		updateRecentBrands: function(_CALLBACK){
			if(core.localData.recentBrands===null){
				core.persistentDataFile.read(function(_persistent_data){
					core.localData.recentBrands = _persistent_data.recentBrands;
					_CALLBACK();
				})
			} else {
				if(core.localData.currentBrand !== null){
					core.localData.recentBrands.unshift(core.localData.currentBrand);
					_CALLBACK();
				}
			}
		},

		filterBrands: function(criteria){
			var matches = [];
			for(var i = 0, ii = core.localData.brandList.length; i < ii; i++){
				if(core.localData.brandList[i].slice(0,criteria.length).toUpperCase() === criteria.toUpperCase())
					matches.push(core.localData.brandList[i]);
			}
			return matches;
		}
		// ,

		// updateAll: function (_successCallback){
		// 	core.localData.data = persistentDataFile.read(function(_data){
		// 		core.localData.data = _data;
		// 		if(typeof _successCallback === "function") _successCallback();
		// 	})
		// }
	}


		
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