currentPanel.el("#path-to-brands").on("blur", function(){
	if(this.value !== localUserPrefData.files.pathToBrands){
		localUserPrefData.files.pathToBrands = this.value;
	}
});

currentPanel.el("#default-preview-file").on("blur", function(){
	if(this.options[this.selectedIndex].value !== localUserPrefData.files.defaultPreviewFile){
		localUserPrefData.files.defaultPreviewFile = this.options[this.selectedIndex].value;
	}
});
