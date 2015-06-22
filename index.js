var app = require("app");
var BrowserWindow = require("browser-window");
var gulp = require("gulp");

// create global reference
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // if (process.platform != 'darwin') {
    app.quit();
  // }
});

app.on("ready", function(){
	mainWindow = new BrowserWindow({width: 1600, height: 900});
	mainWindow.loadUrl("file://"+__dirname+"/index.html");

	global.sharedObject = {
		canQuit: false
	};
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
    mainWindow.reload();
  });
  gulp.task("watch", function(){
    gulp.watch("index.html",["reload"]);
  });
  gulp.tasks["watch"].fn();

  console.log(__dirname);
});