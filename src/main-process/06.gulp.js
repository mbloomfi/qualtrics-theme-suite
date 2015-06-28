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
  