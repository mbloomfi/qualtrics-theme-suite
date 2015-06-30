function openPreferences() {
  if(global.sharedObject.preferencesWindow ===null){

    global.sharedObject.preferencesWindow = new BrowserWindow({
    	// The "height" and "width" properties were very inconsistent, they are set right underneath
      "width": 800, 
      "height": 486, 
      "always-on-top": true,
      "fullscreen": false,
      "resizable": false,
      frame: false
    });
    global.sharedObject.preferencesWindow.setSize(800,530);
    mainWindow.webContents.executeJavaScript("dimmer.on();");
    global.sharedObject.preferencesWindow.loadUrl("file://"+__dirname+"/preferences.html");




    var globalShortcut = require('global-shortcut');

    // Register a 'ctrl+x' shortcut listener.
    globalShortcut.register('Alt+Command+K', function() { global.sharedObject.preferencesWindow.toggleDevTools(); });




    

    global.sharedObject.preferencesWindow.on("close", function(){
      globalShortcut.unregister('Alt+Command+K');
      mainWindow.webContents.executeJavaScript("dimmer.off();");
      global.sharedObject.preferencesWindow = null;
    });

  } 
}
