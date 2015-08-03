// This is the function that set the ratio between the editor and the preview screen
function setEditorPreviewRatio(_newIndex) {
  var i = global.sharedObject.menuStatus.currentEditorPreviewRatio;
  global.sharedObject.appMenu.items[5].submenu.items[0].submenu.items[i].checked = false;
  global.sharedObject.appMenu.items[5].submenu.items[0].submenu.items[_newIndex].checked = true;
  global.sharedObject.menuStatus.currentEditorPreviewRatio = _newIndex;
  mainWindow.webContents.executeJavaScript("editorPreviewBar.set("+_newIndex+"); window.dispatchEvent(new Event('resize'));");

}


