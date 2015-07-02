// var dataChief = {
// // Things to do
// 	remote: null,
// 	local: null,
// 	// read a json file // read remote->local
// 	setRemote = function(_path){
// 	},
// 	// write to a json // save local->remote
// 	setLocal = function(){},
// };



function readUserPreferences(_successCallback){
	json.readFile(appRoot+"/local/user-settings.json", function(_err, _data){
		if(!_err){ 
			localSettingsData = _data;
			if(typeof _successCallback === "function") _successCallback();
		}
		else {
			logError("readUserPreferences ERROR:",_err);
		}
	});
}

function readPersistantData(_successCallback){
	json.readFile(appRoot+"/local/persistent-data.json", function(_err, _data){
		if(!_err) {
			localPersistentData = _data;
			if(typeof _successCallback === "function") _successCallback();
		}
		else {
			logError("readPersistantData ERROR:",_err);
		}
	});
}


function readBrands(_callback, _string){
	var pathToBrands = process.env.HOME+"/"+localSettingsData.files.pathToBrands;
	var brandsList = [];
	fs.readdir(pathToBrands, function(_err, _files){

		if(_err) console.log("error");
		console.log("_files:",_files);
		for(var i = 0, ii = _files.length; i < ii; i++){
			var stats = fs.statSync(pathToBrands+"/"+_files[i]);
			if(stats.isDirectory()) brandsList.push(_files[i]);

		}
		_callback(brandsList);
		// console.log("brandsList", brandsList);
	});
}

function updateSearchResults(_arr){
	console.log(_arr)
}


function getBrandProjects(){

}


function getProjectFiles(){

}