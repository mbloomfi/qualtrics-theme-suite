var fang = (function(){
	
	// "use strict";

	// Initiates Fang Series
	var _fang = {
		// Adds Function to Fang Series
		then: function(_callback){
			if(typeof _callback === "function") _fang.utils.queue.push(_callback);
			return _fang;
		},

		// Runs the Next Function in the Series
		next: function(){
			// converts all incoming arguments into array
			var args = Array.prototype.splice.call(arguments, 0);

			// if a proceeding function has been defined (using the 'then' method)
			if(typeof _fang.utils.queue[_fang.utils.i+1] !== "undefined"){

				// increment the current call index
				_fang.utils.i++;

				// run the next function
				return _fang.utils.queue[_fang.utils.i].apply({next:_fang.next}, args);
			}
		},

		utils: {
			// the queue that will hold all of the function in the series
			queue:[], 

			// index starts at -1 so that the first item is index zero
			i:-1 
		}
	};
	

	return function(){

		var newFang = Object.create(_fang);
		
		for(var i = 0, ii = arguments.length; i < ii; i++){
			if(typeof arguments[i] === "function") newFang.then(arguments[i]);
		}

		function run(){
			var args = [];
			for(var i = 0, ii = arguments.length; i < ii; i++){
				args.push(arguments[i]);
			}
			newFang.utils.i = -1;
			return newFang.next.apply(null, args);
		}

		// run.append = newFang.then;

		return run;
	};
})();