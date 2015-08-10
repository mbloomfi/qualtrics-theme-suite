loca.on("error", function(err){
	console.error("loca err: ",err);
});

loca.init("persistentData", process.env.HOME+"/Library/QTS/persistent-data.json", function(err){
	if(err){
		loca.initLocal("persistentData", persistentDataTemplate);
		loca.persistentData.setPath(process.env.HOME+"/Library/QTS/persistent-data.json");
		loca.persistentData.commit(function(){}, true);
	}
});

loca.init("userSettings", process.env.HOME+"/Library/QTS/user-settings.json", function(err){
	if(err){
		loca.initLocal("userSettings", userSettingsTemplate);
		loca.userSettings.setPath(process.env.HOME+"/Library/QTS/user-settings.json");
		loca.userSettings.commit(function(){}, true);
	}
});




// file templates
var persistentDataTemplate = {
  "recentBrands": [],
  "snippets": []
};

var userSettingsTemplate = {
	"files":{
		"brands": {
			"path":"Desktop"
		},
		"defaultPreviewFile":"preview-file-4.html",
		"previewFiles":[
			{"fileName":"preview-file-1.html", "verboseName":"V4-Single"},
			{"fileName": "preview-file-2.html","verboseName": "V4-Full"},
			{"fileName":"preview-file-3.html","verboseName":"V4-Single-Dropdown-Matrix"},
			{"fileName":"preview-file-4.html","verboseName":"V4-Single-with-Matrix"}
		],
		"lastPreviewFileIndex":3
	},
	"preview":{
		"refreshPreview":"onSave",
		"defaultThumbnailName":"Thumb",
		"defaultThumbnailExt":".gif",
		"thumbnailExtensions":[".gif",".png",".jpg"]
	}
}