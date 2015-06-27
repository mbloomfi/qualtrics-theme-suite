var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	//doesnt work!!!!!!!
    app.quit();
});

app.on("ready", function(){

  Menu.setApplicationMenu(appMenu);

	mainWindow = new BrowserWindow({width: 1600, height: 900});
	mainWindow.loadUrl("file://"+__dirname+"/index.html");
	
	mainWindow.on('close', function(e) {
		if(!global.sharedObject.canQuit){
			e.preventDefault()
			mainWindow.webContents.executeJavaScript("Quitter.prompt();");
			console.log("Prompting for Quit");
		} else {
			console.log("Application Terminated. Good bye.");
		}
		// alert("sure?");
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // mainWindow = null;
  });

  //GULP TASKS
  gulp.task("reload", function(){
    setTimeout(function(){
      mainWindow.reload();
      if(global.sharedObject.preferencesWindow) global.sharedObject.preferencesWindow.reload();
    },500);
    
  });
  gulp.task("watch", function(){
    gulp.watch("index.html",["reload"]);
  });
  gulp.tasks["watch"].fn();

  // console.log(__dirname);
});
