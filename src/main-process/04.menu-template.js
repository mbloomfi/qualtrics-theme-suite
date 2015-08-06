// ==== APP MENU ====
// var cameraImg = nativeImage.createFromPath("local/images/camera.svg");



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
        label: 'Finder Hard Reset',
        click: function(){
           shelljs.exec("killall Finder", function(status, output){
            console.log('Exit status:', status);
            console.log('Program output:', output);
           })
        }
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
        label: 'Show Project in Finder',
        accelerator: 'Shift+Command+F',
        click: function(){
           mainWindow.webContents.executeJavaScript("core.brands.projects.showInFinder();");
        }
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
          global.sharedObject.appMenu.items[1].submenu.items[10].checked = false;
          mainWindow.webContents.executeJavaScript("core.mode.edit_preview()");
        }
      },
      {
        label: 'Upload (Release Manager)',
        type: "checkbox",
        checked: false,
        accelerator: 'Shift+Command+U',
        click: function(){
          global.sharedObject.appMenu.items[1].submenu.items[9].checked = false;
          mainWindow.webContents.executeJavaScript("core.mode.releaseManager()");
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
      },
      {
        type:'separator'
      },
      {
        label: "Increase Font Size",
        accelerator: 'Command+=',
        click:function(){
          mainWindow.webContents.executeJavaScript("editorCore.increaseFontSize();");
        }
      },
      {
        label: "Decrease Font Size",
        accelerator: 'Command+-',
        click:function(){
          mainWindow.webContents.executeJavaScript("editorCore.decreaseFontSize();");
        }
      }

    ]
  },


  {
    label: "Snippets",
    submenu: [
       //all snippets
        {label: "label 1"},
        {label: "label 2"}
        
    ]
  },


  {
    label: "Preview",
    submenu: [
      {
        label: 'Preview File',

        submenu: [
          // These should be read from the user settings
          // {
          //   label: "v4 Vertical",
          //   type: "checkbox",
          //   checked: true
          // },
          // {
            
          //   label: "v4 Horizontal",
          //   type: "checkbox",
          //   checked: false
          // },
          // {
            
          //   label: "v4 Full",
          //   type: "checkbox",
          //   checked: false
          // },
          // {
          //   type: "separator"
          // },
          // {
          //   label: "v3 Vertical",
          //   type: "checkbox",
          //   checked: false
          // },
          // {
            
          //   label: "v3 Horizontal",
          //   type: "checkbox",
          //   checked: false
          // },
          // {
            
          //   label: "v3 Full",
          //   type: "checkbox",
          //   checked: false
          // }
        ]
      },
      {
        type: 'separator'
      },


      {
        label: 'Show Header',
        enabled: false,
        type:"checkbox",
        checked: false,
        accelerator: 'Command+Shift+H',
        click: function(){
          var self = global.sharedObject.appMenu.items[4].submenu.items[2];
          if(self.checked){
            // self.checked = false;
            // console.log("self.checked", self.checked);
            mainWindow.webContents.executeJavaScript("core.preview.mode.regular.injectionHeader.on();");
          } else {
            // self.checked = true;
            // console.log("self.checked", self.checked);
            mainWindow.webContents.executeJavaScript("core.preview.mode.regular.injectionHeader.off();");
          }

        }
      },


      {
        type: 'separator'
      },


      {
        label: 'Preview Mode',
        enabled: false,
        uncheckPreviewModes: function(exception){
          var previewModes = global.sharedObject.appMenu.items[4].submenu.items;
          for(var i = 0, ii = previewModes.length; i < ii; i++){
            if(previewModes[i].type === "checkbox" && previewModes[i].enabled === true && previewModes[i].isPreviewMode === true){
              if(previewModes[i] === exception){
                previewModes[i].checked = true;
              } else {
                previewModes[i].checked = false;
              }
              
            }
          }
          global.sharedObject.appMenu.items[4].submenu.items[2]
        }
      },
      {
        label: 'Regular',
        accelerator: 'Command+0',
        type: "checkbox",
        checked: true,
        enabled: false,
        isPreviewMode: true,
        click: function(){
          var self = global.sharedObject.appMenu.items[4].submenu.items[5];
          global.sharedObject.appMenu.items[4].submenu.items[4].uncheckPreviewModes(self);
          mainWindow.webContents.executeJavaScript("core.preview.mode.regular.enable();");
        }
      },
      {
        label: 'Devices',
        accelerator: 'Command+1',
        type: "checkbox",
        checked: false,
        enabled: false,
        isPreviewMode: true,
        click: function(){
          var self = global.sharedObject.appMenu.items[4].submenu.items[6];
          global.sharedObject.appMenu.items[4].submenu.items[4].uncheckPreviewModes(self);
          mainWindow.webContents.executeJavaScript("core.preview.mode.devices.enable();");
        }
      },
      {
        label: 'Screenshot',
        accelerator: 'Command+2',
        type: "checkbox",
        checked: false,
        enabled: false,
        isPreviewMode: true,
        // icon: 'local/images/camera-small.png',
        click: function(){
          var self = global.sharedObject.appMenu.items[4].submenu.items[7];
          global.sharedObject.appMenu.items[4].submenu.items[4].uncheckPreviewModes(self);
          mainWindow.webContents.executeJavaScript("core.preview.mode.screenshot.enable();");
        }
      },
      {
        label: 'Thumbnail',
        accelerator: 'Command+3',
        type: "checkbox",
        checked: false,
        enabled: false,
        isPreviewMode: true,
        click: function(){
          var self = global.sharedObject.appMenu.items[4].submenu.items[8];
          global.sharedObject.appMenu.items[4].submenu.items[4].uncheckPreviewModes(self);
          mainWindow.webContents.executeJavaScript("core.preview.mode.thumbnail.enable();");
        }
      },

      {
        type: 'separator'
      },

      {
        label: 'Hard Refresh',
        accelerator: 'Command+Shift+R',
        click: function(){
          mainWindow.webContents.executeJavaScript("core.preview.mode.regular.hardRefresh();");
        }
      },
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
      }

      ,
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

// console.log("menu index:",menuTemplate[4].submenu[0].submenu);

// menuTemplate.populatePreviewFiles = function(_callback){
//   var menuTemplate[4].submenu[0].submenu
// };
// function updateMainMenuSnippets(){
//   console.log("");
// }



function setPreviewFiles(_callback){
  fs.readFile(__dirname+"/local/user-settings.json", function(err, _file){
    if(err) {
      fs.appendFile(__dirname+"/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){})
      return console.log("ERROR:",err);
    }
    var OBJECT = JSON.parse(_file);
    var previewFilesList = OBJECT.files.previewFiles;
    var submenuIndex = 0;
    for(var i = 0, ii = previewFilesList.length; i < ii; i++){

      (function(previewFilesList, i){

        // var fileStats = fs.statSync("./local/preview-files/"+previewFilesList[i]);
          console.log("Object:",OBJECT.files.defaultPreviewFile);
          console.log("previewFilesList",previewFilesList);

          menuTemplate[4].submenu[0].submenu[i] = {
            label: previewFilesList[i].verboseName,
            type: "radio",
            name: "previewFile",
            checked: (OBJECT.files.defaultPreviewFile === previewFilesList[i].fileName)?true:false,
            click: function(){
              mainWindow.webContents.executeJavaScript("core.localData.setCurrentPreviewQuestionsFile('"+previewFilesList[i].fileName+"');");
            }
          };
         


      })(previewFilesList, i);

    }

    global.sharedObject.appMenu = Menu.buildFromTemplate(menuTemplate);
    // console.log(menuTemplate[4].submenu[0].submenu)
    if(typeof _callback !== "undefined") _callback();
    
    
  });
  
}






