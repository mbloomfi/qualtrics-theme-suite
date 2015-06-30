// MAIN RENDERER
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit();  
});


app.on("ready", function(){

  Menu.setApplicationMenu(appMenu);

	mainWindow = new BrowserWindow({
		width: 1800, 
		height: 1000,
		"min-height": 400,
		"min-width": 200
	});
	mainWindow.loadUrl("file://"+__dirname+"/index.html");
	
	mainWindow.on('close', function(e) {
		if(!global.sharedObject.canQuit){
			e.preventDefault();
			mainWindow.focusOnWebView();
			console.log("Prompting for Quit");
			mainWindow.webContents.executeJavaScript("Quitter.prompt();");
		}
  });


	// Run Gulp Listening

  runGulp(); // This will only be run when project is loaded
  runGulp_Dev(); // comment-out for production

  // console.log(__dirname);
});
