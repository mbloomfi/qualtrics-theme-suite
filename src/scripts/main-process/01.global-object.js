global.sharedObject = {
	appMenu: null,
  canQuit: false,
  menuStatus: {
    devToolsOpen: false,
    currentEditorPreviewRatio: 3
  },
  pathToProject: null,
  preferencesWindow: null,
  mainWindow: null
};



global.sharedObject.appRoot = __dirname;

function ace (_func){
	"use strict";
	// These b methods should be extracted (except for the utils). 
	// That way each ace doesnt have to reproduce the same base code over and over.
	var b = {
		run : function(){
			var args = [];
          
            for(var i = 0, ii = arguments.length; i < ii; i++){
              args.push(arguments[i]);  
            }
          
			b.utils.i = -1;
			return b.next.apply(this, args);
		},
		block : function(_callback){
			if(typeof _callback === "function") this.utils.queue.push(_callback.bind(this));
			return this;
		},
		next : function(){
			// converts all incoming arguments into array
            var args = [];
          
            for(var i = 0, ii = arguments.length; i < ii; i++){
              args.push(arguments[i]);  
            }
			// if a proceeding function has been defined (using the 'then' method)
			if(typeof b.utils.queue[b.utils.i+1] !== "undefined"){

				// increment the current call index
				b.utils.i++;

				// run the next function
				return b.utils.queue[b.utils.i].apply(b, args);
			}
		},
		utils : { 
			// the queue that will hold all of the blocks in the series
			queue:[], 
			// index starts at -1 so that the first item is index zero
			i:-1
		}

	};

	// this allows them to us this.*method* inside of their callback, and then run it
	// window.block = b.block;
	// window.block = window.block.bind(b);
	_func.bind(b)(_func.arguments);
	// window.block = undefined;

	return b.run.bind(b);
}


