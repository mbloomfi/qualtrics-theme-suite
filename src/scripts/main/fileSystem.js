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



