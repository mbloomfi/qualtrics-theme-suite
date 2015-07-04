var prepareForBrandSearch = 
baton(function(next, inputValue){
	setBrandSearchGlobals();
	next();
})
.then(function(next){
	console.log("prepare");
	prepareBrandSearch();
});

var searchBrands = 
baton(function(next, inputValue){
	var matches = core.localData.filterBrands(inputValue);
	next(matches);
})
.then(function(next, matches){
	updateSearchResults(matches);
});


function setBrandSearchGlobals(){
	window.brandSearchInput = el("#searchBrands");
	window.brandsListCont = el("#brandsListCont");
}

function prepareBrandSearch() {

	var timeout = undefined;

	brandSearchInput.on("keyup", function(){
		// Will delay the search for brands for 300ms and 
		// batch the keystrokes into a single search
		if(timeout != undefined) {
		 clearTimeout(timeout);
		}
		timeout = setTimeout(function() {
			timeout = undefined;
			var inputValue = brandSearchInput.value;
			if(inputValue.length > 0 && inputValue.slice(0,1) !== " "){
				// BEGIN SEARCHING
				console.log("start searching");
				searchBrands.run(inputValue);
			} else {
				// empty
			}
		}, 300);

	});

	// SAVE BRANDS TO LOCAL PERSISTENT DATA
	brandSearchInput.on("focus", function(){
		core.localData.updateBrandsList();
	});

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