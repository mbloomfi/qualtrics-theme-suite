function openPreferences() {
  if(global.sharedObject.preferencesWindow ===null){

    global.sharedObject.preferencesWindow = new BrowserWindow({
      "width": 800, 
      "height": 486, 
      "always-on-top": true,
      "fullscreen": false,
      "resizable": false,
      frame: false
    });

    mainWindow.webContents.executeJavaScript("dimmer.on();");
    global.sharedObject.preferencesWindow.loadUrl("file://"+__dirname+"/preferences.html");
    
    // global.sharedObject.preferencesWindow.toggleDevTools();

    global.sharedObject.preferencesWindow.on("close", function(){
      mainWindow.webContents.executeJavaScript("dimmer.off();");
      global.sharedObject.preferencesWindow = null;
    });

  } 
}