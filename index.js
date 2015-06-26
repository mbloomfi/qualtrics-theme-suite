var app = require("app");
var BrowserWindow = require("browser-window");
var gulp = require("gulp");
var Menu = require("menu");
// var Preferences = require("./local/preferences.js");

global.sharedObject = {
  canQuit: false,
  menuStatus: {
    devToolsOpen: false
  },
  preferencesWindow: null
};

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
    
    global.sharedObject.preferencesWindow.toggleDevTools();

    global.sharedObject.preferencesWindow.on("close", function(){
      mainWindow.webContents.executeJavaScript("dimmer.off();");
      global.sharedObject.preferencesWindow = null;
    });

  } 
}


var $$ = global.sharedObject;
// ==== APP MENU ====
var menuTemplate = [
  {
    label: "QTS",
    submenu: [
      {
        label: 'About QTS',
        selector: 'orderFrontStandardAboutPanel:'
      },
      {
        type: 'separator'
      },
      {
        label: "Preferences...",
        accelerator: "Command+,",
        click: function(){
          // if not open, then open
          openPreferences();

          // if open, bring to front
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide Electron',
        accelerator: 'Command+H',
        selector: 'hide:'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        selector: 'hideOtherApplications:'
      },
      {
        label: 'Show All',
        selector: 'unhideAllApplications:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        selector: 'terminate:'
      },
    ]
  },

  {
    label: "Project",
    submenu: [
      {
        label: 'Recent Projects',
        submenu: [
          {
            label:"underarmour (underarmour2 new)"
          },
          {
            label:"ferrari (ferrari_SPA)"
          },
          {
            label:"instagram (moments1)"
          }
        ]
      },
      {
        label: 'Project Files',
        submenu: [
          {
            label: "(empty)"
          }
        ]
      },
      {
        type: "separator"
      },
      {
        label: 'Duplicate Project'
      },
      {
        type: 'separator'
      },
      {
        label: 'Project Mode',
        enabled: false
      },
      {
        label: 'Edit/Preview',
        type: "checkbox",
        checked: true,
        accelerator: 'Shift+Command+E'
      },
      {
        label: 'Upload (Release Manager)',
        type: "checkbox",
        checked: false,
        accelerator: 'Shift+Command+U'
      }
    ]
  },

  {

    label: "Edit",
    submenu: [
      {
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      }
    ]
  },

  {
    label: "Snippets",
    submenu: [
      {
        label: 'Recent Snippets',
        submenu: []
      },
      {
        type: "separator"
      },
      {
        label: 'Snippets Library',
        accelerator: "Shift+Command+S"
      },
      {
        label: 'Key Bindings',
        accelerator: "Shift+Command+K"
      },
    ]
  },
  {
    label: "Preview",
    submenu: [
      {
        label: 'Preview File',
        submenu: [
          {
            label: "v4 Vertical",
            type: "checkbox",
            checked: true
          },
          {
            
            label: "v4 Horizontal",
            type: "checkbox",
            checked: false
          },
          {
            
            label: "v4 Full",
            type: "checkbox",
            checked: false
          },
          {
            type: "separator"
          },
          {
            label: "v3 Vertical",
            type: "checkbox",
            checked: false
          },
          {
            
            label: "v3 Horizontal",
            type: "checkbox",
            checked: false
          },
          {
            
            label: "v3 Full",
            type: "checkbox",
            checked: false
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        label: 'Preview Mode',
        enabled: false
      },
      {
        label: 'Regular',
        accelerator: 'Command+0'
      },
      {
        label: 'Mobile',
        accelerator: 'Command+1'
      },
      {
        label: 'Screenshot',
        accelerator: 'Command+2'
      },
      {
        label: 'Thumbnail',
        accelerator: 'Command+3'
      }
    ]
  },
  {
    label: "Window",
    submenu: [
      {
        label: "Editor/Preview Size Ratio",
        submenu: [
          {
            label: "Editor 20% | Preview 80%",
            type: "checkbox",
            checked: false
          },
          {
            label: "Editor 30% | Preview 70%",
            type: "checkbox",
            checked: false
          },
          {
            label: "Editor 40% | Preview 60%",
            type: "checkbox",
            checked: true
          },
          {
            label: "Editor 50% | Preview 50%",
            type: "checkbox",
            checked: false
          },
          {
            label: "Editor 60% | Preview 40%",
            type: "checkbox",
            checked: false
          },
          {
            label: "Editor 70% | Preview 30%",
            type: "checkbox",
            checked: false
          },
          {
            type: "separator"
          },
          {
            label: "Select Previous",
            accelerator: "Alt+Command+Up",
            click: function(){ console.log("Smaller Editor, Bigger Preview"); }
          },
          {
            label: "Select Next",
            accelerator: "Alt+Command+Down",
            click: function(){ console.log("Bigger Editor, Smaller Preview"); }
          },

        ]
      },
      {
        type: "separator"
      },
      {
        label: "Toggle Developer Tools",
        accelerator: "Alt+Command+J",
        click: function(){
          if($$.devToolsOpen){
            mainWindow.webContents.executeJavaScript("el('#preview').closeDevTools();");
            $$.devToolsOpen = false;
          } else {
            mainWindow.webContents.executeJavaScript("el('#preview').openDevTools();");
            $$.devToolsOpen = true;
          }  
        }
      },
      {
        label: "* Electron Developer Tools",
        accelerator: "Alt+Command+C",
        click: function(){mainWindow.toggleDevTools();}
      }
    ]
  },
  {
    label: "Help",
    submenu: [
      {
        label: 'Write'
      }
    ]
  }
    
];

var appMenu = Menu.buildFromTemplate(menuTemplate);






// create global reference
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // if (process.platform != 'darwin') {
    app.quit();
  // }
});

app.on("ready", function(){

  // MAIN WINDOW
  //==================
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

  // PREFERENCES WINDOW
  //===================

  




















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