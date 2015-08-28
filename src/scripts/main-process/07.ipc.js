ipc.on('asynchronous-message', function(event, arg) {
	if(arg === "disablePreviewModes") previewModes.disable();
	else if(arg === "enablePreviewModes") previewModes.enable();
	else if(arg === "resetAppMenu") {
		console.log("BEFORE:appmenu reset>>",global.sharedObject.appMenu.items[3].submenu.items[0].submenu);
		global.sharedObject.appMenu.items[3].submenu.items[0].submenu.items[0].label = "new name";
		global.sharedObject.appMenu.items[3].submenu.items[0].submenu.items[0].enabled = false;
		console.log("AFTER:appmenu reset>>",global.sharedObject.appMenu.items[3].submenu.items[0].submenu);
		// Menu.setApplicationMenu(global.sharedObject.appMenu);
		global.sharedObject.mainWindow.setMenu(global.sharedObject.appMenu);
		// global.sharedObject.appMenu.items[3].submenu.items[0].enabled = false;
	}
});

var previewModes = {
	enable: function(){
		global.sharedObject.appMenu.items[4].submenu.items[2].enabled = true;
		global.sharedObject.appMenu.items[4].submenu.items[5].enabled = true;
		global.sharedObject.appMenu.items[4].submenu.items[6].enabled = true;
		global.sharedObject.appMenu.items[4].submenu.items[7].enabled = true;
		global.sharedObject.appMenu.items[4].submenu.items[8].enabled = true;
	},
	disable: function(){
		global.sharedObject.appMenu.items[4].submenu.items[2].enabled = false;
		global.sharedObject.appMenu.items[4].submenu.items[5].enabled = false;
		global.sharedObject.appMenu.items[4].submenu.items[6].enabled = false;
		global.sharedObject.appMenu.items[4].submenu.items[7].enabled = false;
		global.sharedObject.appMenu.items[4].submenu.items[8].enabled = false;
	}
};


