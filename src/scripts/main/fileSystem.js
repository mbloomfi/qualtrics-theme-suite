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

json.readFile(appRoot+"/local/user-settings.json", function(_err, _data){
	if(!_err) localData = _data;

	else console.log("ERROR!!!!", _err);

	readBrands();

});

function readBrands(){
	var pathToBrands = process.env.HOME+"/"+localData.files.pathToBrands;
	var brandsList = [];
	fs.readdir(pathToBrands, function(_err, _files){

		if(_err) console.log("error");
		console.log("_files:",_files);
		for(var i = 0, ii = _files.length; i < ii; i++){
			var stats = fs.statSync(pathToBrands+"/"+_files[i]);
			if(stats.isDirectory()) brandsList.push(_files[i]);

		}

		console.log("brandsList", brandsList);
		

	});
}


function getBrandProjects(){

}


function getProjectFiles(){

}