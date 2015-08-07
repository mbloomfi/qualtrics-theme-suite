// app.commandLine.appendSwitch('ppapi-flash-path', __dirname+'/local/PepperFlashPlayer.plugin');
// app.commandLine.appendSwitch('ppapi-flash-version', '18.0.0.194');

// MAIN RENDERER
var mainWindow = global.sharedObject.mainWindow = null;


// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit();  
});



app.on("ready", function(){



	




	setPreviewFiles(function(){
		
		Menu.setApplicationMenu(global.sharedObject.appMenu);

		mainWindow = global.sharedObject.mainWindow = new BrowserWindow({
			width: 1800, 
			height: 1000,
			"min-height": 500,
			"min-width": 200
		});

		mainWindow.loadUrl("file://"+__dirname+"/index.html");

		mainWindow.on('close', function(e) {
			if(!global.sharedObject.canQuit){
				e.preventDefault();
				mainWindow.focusOnWebView();
				// console.log("Prompting for Quit");
				mainWindow.webContents.executeJavaScript("Quitter.prompt();");
			}
	  });

		//this is where the problem is. there is an issue with the menu
		// the above few blocks of code were in here in set preview files.


		
		
		


		// Run Gulp Listening

	  // runGulp(); // This will only be run when project is loaded
	  runGulp_Dev(); // comment-out for production
	});

	  

  // console.log(__dirname);
});

