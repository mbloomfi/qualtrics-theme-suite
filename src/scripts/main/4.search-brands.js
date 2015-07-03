var processBrandSearch = 
baton(function(next, inputValue){

	filterBrands(next, inputValue);

})
.then(function(next, matches){

	updateSearchResults(matches);

})



function initBrandSearch() {
	window.brandSearchInput = el("#searchBrands");
	window.brandsListCont = el("#brandsListCont");
	var timeout = undefined;
	brandSearchInput.on("keyup", function(){

		// Will delay the search for brands for 500ms and 
		// batch the keystrokes into a single search
		if(timeout != undefined) {
		 clearTimeout(timeout);
		}
		timeout = setTimeout(function() {
			timeout = undefined;
			var inputValue = brandSearchInput.value;
			if(inputValue.length > 0 && inputValue.slice(0,1) !== " "){

				// BEGIN SEARCHING
				processBrandSearch.run(inputValue)

			} else {
				// empty
			}
		}, 300);

	})

	// SAVE BRANDS TO LOCAL PERSISTENT DATA
	brandSearchInput.on("focus", function(){
		updateBrandsList();
	});
}

// SAVE BRANDS TO LOCAL PERSISTENT DATA
function updateBrandsList(_callback){
	var pathToBrands = process.env.HOME+"/"+localSettingsData.files.pathToBrands;
	var brandsList = [];
	fs.readdir(pathToBrands, function(_err, _files){
		if(_err) console.log("error");
		for(var i = 0, ii = _files.length; i < ii; i++){
			var stats = fs.statSync(pathToBrands+"/"+_files[i]);
			if(stats.isDirectory()) brandsList.push(_files[i]);
		}

		updatePersitentDataFile(_callback);

		localPersistentData.brandList = brandsList;
	});
}


function filterBrands(next, criteria){
	var matches = [];
	for(var i = 0, ii = localPersistentData.brandList.length; i < ii; i++){
		if(localPersistentData.brandList[i].slice(0,criteria.length) === criteria)
			matches.push(localPersistentData.brandList[i]);
	}
	next(matches);
}


function updateSearchResults(matches){
	var searchResultsCont = el("+div#searchResultsCont");
	for(var i = 0, ii = matches.length; i < ii; i++){
		searchResultsCont.append(
			el("+div").addClass("search-result").text(matches[i])
		)
	}

	if(matches.length > 6){ // add arrow
		searchResultsCont.append( el("+div").addClass("arrow-down") )
	}

	brandsListCont.purge().append( searchResultsCont );
}


function getBrandProjects(){

}

function getProjectFiles(){

}