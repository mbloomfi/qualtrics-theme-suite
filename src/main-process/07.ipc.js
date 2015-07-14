ipc.on('asynchronous-message', function(event, arg) {
	if(arg === "disablePreviewModes") previewModes.disable();
	else if(arg === "enablePreviewModes") previewModes.enable();
});

var previewModes = {
	enable: function(){
		appMenu.items[4].submenu.items[3].enabled = true;
		appMenu.items[4].submenu.items[4].enabled = true;
		appMenu.items[4].submenu.items[5].enabled = true;
		appMenu.items[4].submenu.items[6].enabled = true;
	},
	disable: function(){
		appMenu.items[4].submenu.items[3].enabled = false;
		appMenu.items[4].submenu.items[4].enabled = false;
		appMenu.items[4].submenu.items[5].enabled = false;
		appMenu.items[4].submenu.items[6].enabled = false;
	}
};
