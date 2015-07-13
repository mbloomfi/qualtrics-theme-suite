ipc.on('asynchronous-message', function(event, arg) {
	console.log("arg:", arg);
	if(arg === "disableThumnailMode") thumbnailMode.disable();
	if(arg === "enableThumnailMode") thumbnailMode.enable();
	// event.sender.send('asynchronous-reply', 'pong');
});


var thumbnailMode = {
	disable: function(){
		appMenu.items[4].submenu.items[6].enabled = false;
	},

	enable: function(){
		appMenu.items[4].submenu.items[6].enabled = true;
	}
}