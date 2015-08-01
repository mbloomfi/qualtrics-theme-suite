var Data = (function(){
	var snippetsList;
	var preferncesData;



	var local = {
		// read preferences and persistent data
		init: function(){
			console.log("init local data");
		}
	};

	function saveLocalToFiles(){
		console.log("saving local data to disk");
	}

	Eve.on("init", local.init);

	Eve.on("saveAll", saveLocalToFiles);

})();