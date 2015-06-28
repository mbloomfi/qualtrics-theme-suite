pathToBrands.on("blur", function(){
	if(this.value !== tempUserPrefData.files.pathToBrands){
		tempUserPrefData.files.pathToBrands = this.value;
		panel.updateTempFile();
	}
});

currentPanel.el("#default-preview-file").on("blur", function(){
	console.log("checkblur");
	if(this.options[this.selectedIndex].value !== tempUserPrefData.files.defaultPreviewFile){
		tempUserPrefData.files.defaultPreviewFile = this.options[this.selectedIndex].value;
		panel.updateTempFile();
	}
});
