var app = require("app");
var BrowserWindow = require("browser-window");
var gulp = require("gulp");
var Menu = require("menu");
var ipc = require("ipc");
global.sharedObject = {
  canQuit: false,
  menuStatus: {
    devToolsOpen: false,
    currentEditorPreviewRatio: 3
  },
  preferencesWindow: null,
  mainWindow: null
};

global.sharedObject.appRoot = __dirname;
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

// This is the function that set the ratio between the editor and the preview screen
function setEditorPreviewRatio(_newIndex) {
  var i = global.sharedObject.menuStatus.currentEditorPreviewRatio;
  appMenu.items[5].submenu.items[0].submenu.items[i].checked = false;
  appMenu.items[5].submenu.items[0].submenu.items[_newIndex].checked = true;
  global.sharedObject.menuStatus.currentEditorPreviewRatio = _newIndex;
  mainWindow.webContents.executeJavaScript("editorPreviewBar.set("+_newIndex+"); window.dispatchEvent(new Event('resize'));");

}
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
        type: "separator"
      },
      {
        label: 'File',
        enabled: false
      },
      {
        label: 'Save File',
        accelerator: 'Command+S',
        click: function(){
          mainWindow.webContents.executeJavaScript("core.codeMirror.saveEditorFile()");
        }
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
        accelerator: 'Shift+Command+E',
        click: function(){
          appMenu.items[1].submenu.items[10].checked = false;
          mainWindow.webContents.executeJavaScript("core.preview.mode.blank()");
        }
      },
      {
        label: 'Upload (Release Manager)',
        type: "checkbox",
        checked: false,
        accelerator: 'Shift+Command+U',
        click: function(){
          appMenu.items[1].submenu.items[9].checked = false;
          mainWindow.webContents.executeJavaScript("core.preview.mode.releaseManager()");
        }
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
          // These should be read from the user settings
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
        enabled: false,
        uncheckPreviewModes: function(exception){
          var previewModes = appMenu.items[4].submenu.items;
          for(var i = 0, ii = previewModes.length; i < ii; i++){
            if(previewModes[i].type === "checkbox" && previewModes[i].enabled === true){
              if(previewModes[i] === exception){
                previewModes[i].checked = true;
              } else {
                previewModes[i].checked = false;
              }
              
            }
          }
          appMenu.items[4].submenu.items[2]
        }
      },
      {
        label: 'Regular',
        accelerator: 'Command+0',
        type: "checkbox",
        checked: true,
        click: function(){
          var self = appMenu.items[4].submenu.items[3];
          appMenu.items[4].submenu.items[2].uncheckPreviewModes(self);
        }
      },
      {
        label: 'Mobile',
        accelerator: 'Command+1',
        type: "checkbox",
        checked: false,
        click: function(){
          var self = appMenu.items[4].submenu.items[4];
          appMenu.items[4].submenu.items[2].uncheckPreviewModes(self);
        }
      },
      {
        label: 'Screenshot',
        accelerator: 'Command+2',
        type: "checkbox",
        checked: false,
        click: function(){
          var self = appMenu.items[4].submenu.items[5];
          appMenu.items[4].submenu.items[2].uncheckPreviewModes(self);
        }
      },
      {
        label: 'Thumbnail',
        accelerator: 'Command+3',
        type: "checkbox",
        checked: false,
        enabled: false,
        click: function(){
          var self = appMenu.items[4].submenu.items[6];
          appMenu.items[4].submenu.items[2].uncheckPreviewModes(self);
          mainWindow.webContents.executeJavaScript("core.preview.thumbnail.init()");
        }
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
            label: "Editor 10% | Preview 90%",
            type: "checkbox",
            checked: false,
            click: function(){
              setEditorPreviewRatio(0);
            }
          },
          {
            label: "Editor 20% | Preview 80%",
            type: "checkbox",
            checked: false,
            click: function(){
              setEditorPreviewRatio(1);
            }
          },
          {
            label: "Editor 30% | Preview 70%",
            type: "checkbox",
            checked: false,
            click: function(){
              setEditorPreviewRatio(2);
            }
          },
          {
            label: "Editor 40% | Preview 60%",
            type: "checkbox",
            checked: true,
            click: function(){
              setEditorPreviewRatio(3);
            }
          },
          {
            label: "Editor 50% | Preview 50%",
            type: "checkbox",
            checked: false,
            click: function(){
              setEditorPreviewRatio(4);
            }
          },
          {
            label: "Editor 60% | Preview 40%",
            type: "checkbox",
            checked: false,
            click: function(){
              setEditorPreviewRatio(5);
            }
          },
          {
            label: "Editor 70% | Preview 30%",
            type: "checkbox",
            checked: false,
            click: function(){
              setEditorPreviewRatio(6);
            }
          },
          {
            label: "Editor 75% | Preview 25%",
            type: "checkbox",
            checked: false,
            click: function(){
              setEditorPreviewRatio(7);
            }
          },
          {
            label: "Editor 80% | Preview 20%",
            type: "checkbox",
            checked: false,
            click: function(){
              setEditorPreviewRatio(8);
            }
          },
          {
            label: "Editor 85% | Preview 15%",
            type: "checkbox",
            checked: false,
            click: function(){
              setEditorPreviewRatio(9);
            }
          },
          {
            label: "Editor 90% | Preview 10%",
            type: "checkbox",
            checked: false,
            click: function(){
              setEditorPreviewRatio(10);
            }
          },
          {
            type: "separator"
          },
          {
            label: "Select Previous",
            accelerator: "Alt+Command+Left",
            click: function(){ 
              var i = global.sharedObject.menuStatus.currentEditorPreviewRatio;
              if(i > 0){ setEditorPreviewRatio(i-1); }
            }
          },
          {
            label: "Select Next",
            accelerator: "Alt+Command+Right",
            click: function(){ 
              var i = global.sharedObject.menuStatus.currentEditorPreviewRatio;
              if(i < 10){ setEditorPreviewRatio(i+1); }
            }
          },
          {
            type: "separator"
          },
          {
            label: "Select Previous (2x)",
            accelerator: "Control+Alt+Command+Left",
            click: function(){ 
              var i = global.sharedObject.menuStatus.currentEditorPreviewRatio;

              if  (i === 1) { setEditorPreviewRatio(i-1); }
              else if (i>1) { setEditorPreviewRatio(i-2); }
            }
          },
          {
            label: "Select Next (2x)",
            accelerator: "Control+Alt+Command+Right",
            click: function(){ 
              var i = global.sharedObject.menuStatus.currentEditorPreviewRatio;

              if  (i === 9) { setEditorPreviewRatio(i+1); }
              else if (i<9) { setEditorPreviewRatio(i+2); }
            }
          }

        ]
      },
      {
        type: "separator"
      },
      {
        label: "Toggle Developer Tools",
        accelerator: "Alt+Command+J",
        click: function(){
          if(global.sharedObject.devToolsOpen){
            mainWindow.webContents.executeJavaScript("el('#preview').closeDevTools();");
            global.sharedObject.devToolsOpen = false;
          } else {
            mainWindow.webContents.executeJavaScript("el('#preview').openDevTools();");
            global.sharedObject.devToolsOpen = true;
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

app.commandLine.appendSwitch('ppapi-flash-path', __dirname+'/local/PepperFlashPlayer.plugin');
app.commandLine.appendSwitch('ppapi-flash-version', '18.0.0.194');

// MAIN RENDERER
var mainWindow = global.sharedObject.mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    app.quit();  
});


app.on("ready", function(){

  Menu.setApplicationMenu(appMenu);

	mainWindow = global.sharedObject.mainWindow = new BrowserWindow({
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

//GULP
function runGulp(){


}

function runGulp_Dev(){ // will not be called for production
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
}
  
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