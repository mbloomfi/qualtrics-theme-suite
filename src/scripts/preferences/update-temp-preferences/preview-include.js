currentPanel.el("#onSave").on("focus", function(){
	if(localUserPrefData.preview.refreshPreview !== this.id){
		localUserPrefData.preview.refreshPreview = this.id;
	}
});

currentPanel.el("#onCommand").on("focus", function(){
	if(localUserPrefData.preview.refreshPreview !== this.id){
		localUserPrefData.preview.refreshPreview = this.id;
	}
});

