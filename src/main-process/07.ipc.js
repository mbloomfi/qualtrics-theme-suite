ipc.on('asynchronous-message', function(event, arg) {
	if(arg === "disablePreviewModes") previewModes.disable();
	else if(arg === "enablePreviewModes") previewModes.enable();
});

var previewModes = {
	enable: function(){
		appMenu.items[4].submenu.items[2].enabled = true;
		appMenu.items[4].submenu.items[5].enabled = true;
		appMenu.items[4].submenu.items[6].enabled = true;
		appMenu.items[4].submenu.items[7].enabled = true;
		appMenu.items[4].submenu.items[8].enabled = true;
	},
	disable: function(){
		appMenu.items[4].submenu.items[2].enabled = false;
		appMenu.items[4].submenu.items[5].enabled = false;
		appMenu.items[4].submenu.items[6].enabled = false;
		appMenu.items[4].submenu.items[7].enabled = false;
		appMenu.items[4].submenu.items[8].enabled = false;
	}
};
