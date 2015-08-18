var Data = (function(){
	var snippetsList;
	var currentSnippet = null;
	var preferencesData;
	var pathToBrands;
	var previewFilesList = [];



	var local = {
		// read preferences and persistent data
		init: function(){
			console.log("init local data");
			fs.readFile(__dirname+"/local/persistent-data.json", function(_err, _data){
				if(!_err) {
					snippetsList = JSON.parse(_data).snippets;
				}
				else {
					console.log("local init ERROR:",_err);
				}
			});

			fs.readdir(__dirname+"/local/preview-files", function(_err, _files){
				if(_err) return console.error("local init ERROR:",_err);
				for(var i = 0, ii = _files.length; i < ii ; i++){
					var stats = fs.statSync(__dirname+"/local/preview-files"+"/"+_files[i]);
					if(stats.isFile() && _files[i].charAt(0) !== ".") previewFilesList.push(_files[i]);
				}
			});

			fs.readFile(__dirname+"/local/user-settings.json", function(_err, _data){
				if(_err) return console.error("local init ERROR:",_err);
				preferencesData = JSON.parse(_data);
				pathToBrands = preferencesData.files.brands.path;
				console.log("preferencesData:",preferencesData);
			});
		}
	};

	function saveLocalToFiles(){
		sanitizeSnippets();

		fs.readFile(__dirname+"/local/persistent-data.json", function(_err, _data){
			if(!_err) {
				var persData = JSON.parse(_data);
				persData.snippets = snippetsList;
				persData = JSON.stringify(persData);

				fs.writeFile(__dirname+"/local/persistent-data.json",persData,function(_err){
					if(!_err){

						fs.writeFile(__dirname+"/local/user-settings.json",JSON.stringify(preferencesData),function(_err){
							if(!_err){

								document.getElementById('Q-logo').classList.add("saved");
								setTimeout(function(){
									Global.mainWindow.webContents.executeJavaScript("core.localData.snippets.readFromPersistentData(core.codeMirror.resetContextMenu, true);");
									Global.preferencesWindow.close();
								}, 450);

							}
							else {
								alert("Save Error!")
							}
						});
								
					} else {
						console.log("ERROR", _err);
					}
				})

			}
			else {
				console.log("local init ERROR:",_err);
			}
		});
		console.log("saving local data to disk");
	}

	function cancelAll(){
		Eve.off("saveAll", saveLocalToFiles);
		console.log("cancel all changes");
		document.getElementById('Q-logo').classList.add("deleted");
		setTimeout(function(){
			Global.preferencesWindow.close();
		}, 200);
	}

	function sanitizeSnippets(){
		currentSnippet = null;
		snippetsList.forEach(function(snip, i, arr){
			if(snip.name === ""){
				snip.name = snip.id;
			}
			if(snip.type === ""){
				snip.type = "css";
			}
		});
	}



	Eve.on("init", local.init);
	Eve.on("saveAll", saveLocalToFiles);
	Eve.on("cancelAll", cancelAll);



	// CREATE NEW SNIPPET
	Eve.on("createNewSnippet", function(){
		console.log("creating new snippet");
		var snippetItems = document.getElementsByClassName("snippet-item");
		for(var i = 0, ii = snippetItems.length; i < ii; i++){
			snippetItems[i].classList.remove("selected");
		}
		document.getElementById('snippetName').classList.remove("error");
		var snippetID = ((Date.now() * (Math.random()+1)).toString(36).substring(0,8)) + "-" + ((Date.now() * (Math.random()+1)).toString(36).substring(0,4));
		var snippetItem = etc.el("div", {
			className:"snippet-item selected",
			dataset: {
				id: snippetID
			},
			events: {
				click: function(){
					var currentSnippet = Data.getCurrentSnippet()
					if( currentSnippet === null || currentSnippet.name.trim().search(/[\w\s]+/i) !== -1 ){
					
						var snippetItems = document.getElementsByClassName("snippet-item");
						for(var i = 0, ii = snippetItems.length; i < ii; i++){
							snippetItems[i].classList.remove("selected");
						}
						this.classList.add("selected");
							
						Eve.emit("selectedSnippet", this.dataset.id);
					} else {
						console.log("current snippet name invalid");
						Eve.emit("snippetNameInvalid");
					}
					
				}
			}
		}).append([
			etc.el("div", {className:"snippet_name"}, "No Name"),
			etc.el("div", {className:"snippet-type"}, "css")
		]);
		snippetsList.push({name:"", type:"css", id:snippetID, code: ""});
		var snippetsListCont = document.getElementById("snippetsListCont").append(snippetItem);
		console.log("snippetItem",snippetItem);
		var click = new MouseEvent("click", {
	    bubbles: true,
	    cancelable: true,
	    view: window,
	  });
		snippetItem.dispatchEvent(click);
	});





	Eve.on("selectedSnippet", function(_id){
		var inactiveElements = document.getElementsByClassName("inactive-no_snippet");
		while(inactiveElements.length > 0){
			inactiveElements[0].classList.remove("inactive-no_snippet");
		}

		//remove highlighting from all snippet items
		document.getElementById('snippetName').classList.remove("error");

		//find the snippet in the local snippet list and set it to currentSnippet
		currentSnippet = snippetsList.filter(function(snip, ind, arr){
			if(snip.id === _id) return true;
		})[0];

		//update the editor area
		document.getElementById('snippetName').value = currentSnippet.name;
		document.getElementById('snippetRadio-'+currentSnippet.type).checked = true;
		if(currentSnippet.type === "css"){
			snippetCodemirror.setOption("mode","text/x-scss");
		} else if(currentSnippet.type === "js"){
			snippetCodemirror.setOption("mode","javascript");
		}
		snippetCodemirror.setValue(currentSnippet.code);
	});




	Eve.on("deleteCurrentSnippet", function(){
		if(currentSnippet === null) {
			return;
		}

		//update the snippet in localData array
		snippetsList.some(function(snip, index, arr){
			if(currentSnippet.id === snip.id ){

				var qLogo = document.getElementById('Q-logo');
				qLogo.classList.add("deleted");
				setTimeout(function(){
					qLogo.classList.remove("deleted");
				}, 200);

				
				// update the snippet info in the list of snippets
				var snippetItems = document.getElementsByClassName("snippet-item");
				for(var i = 0, ii = snippetItems.length; i < ii; i++){
					if(snippetItems[i].dataset.id === currentSnippet.id) {
						snippetItems[i].parentNode.removeChild(snippetItems[i]);
					}
				}


				snippetsList.splice(index, 1);
				currentSnippet = null;

				document.getElementById('deleteSnippetBtn').classList.add("inactive-no_snippet");
				document.getElementById('saveSnippetBtn').classList.add("inactive-no_snippet");
				document.getElementById('snippetEditSection').classList.add("inactive-no_snippet");

				

				return true;
			}
		});
	});




	Eve.on("saveCurrentSnippet", function(){
		if(currentSnippet === null) {
			return;
		}
		//get name from input field
		currentSnippet.name = document.getElementById('snippetName').value.trim();

		//get type from radio buttons
		var snippetRadios = document.getElementsByClassName("snippet-radio");
		console.log("snippetsRadios:",snippetRadios);
		for(var i = 0, ii = snippetRadios.length; i < ii; i++){
			console.log("snippetRadios[i];",snippetRadios[i]);
			if(snippetRadios[i].checked) currentSnippet.type = snippetRadios[i].value;
		}
		console.log("currentSnippet.type:",currentSnippet.type);

		//get code from codemirror
		currentSnippet.code = snippetCodemirror.getValue();

		//update the snippet in localData array
		snippetsList.some(function(snip, index, arr){
			if(currentSnippet.id === snip.id ){
				snippetsList[index] = currentSnippet;
				return true;
			}
		});

		// update the snippet info in the list of snippets
		var snippetItems = document.getElementsByClassName("snippet-item");
		for(var i = 0, ii = snippetItems.length; i < ii; i++){
			if(snippetItems[i].dataset.id === currentSnippet.id) {
				snippetItems[i].getElementsByClassName("snippet_name")[0].textContent = currentSnippet.name;
				snippetItems[i].getElementsByClassName("snippet-type")[0].textContent = currentSnippet.type;
			}
		}

		var qLogo = document.getElementById('Q-logo');
		qLogo.classList.add("saved");
		setTimeout(function(){
			qLogo.classList.remove("saved");
		}, 400);
	});



	Eve.on("snippetArrowUp", function(){
		console.log("currentSnippet",currentSnippet);
		if(currentSnippet === null || snippetsList[0].id === currentSnippet.id) return;
		else {
			var snippetItem = {};
			var snippetItems = document.getElementsByClassName("snippet-item");

			for(var i = 0, ii = snippetItems.length; i < ii; i++){
				if(snippetItems[i].dataset.id === currentSnippet.id) {
					snippetItem.element = snippetItems[i];
					snippetItem.index = i;
				}
			}

			var previousSibling = snippetItem.element.previousSibling;
			var parentNode = snippetItem.element.parentNode;
			parentNode.removeChild(snippetItem.element);
			parentNode.insertBefore(snippetItem.element,previousSibling);

			snippetItem.element.scrollIntoView();

			currentSnippet = snippetsList.splice(snippetItem.index, 1)[0];
			snippetsList.splice((snippetItem.index-1), 0, currentSnippet);

			for(var i = 0, ii = snippetItems.length; i < ii; i++){
				if (i < 10) {
					// if(i === 0) snippetItems[i].classList.add("first");
					// else if(i === 9) snippetItems[i].classList.add("top10");
					snippetItems[i].classList.add("top10");
				}
				else {
					snippetItems[i].classList.remove("top10");
				}
			}
		}
	});



	Eve.on("snippetArrowDown", function(){
		console.log("currentSnippet",currentSnippet);
		if(currentSnippet === null || snippetsList[snippetsList.length-1].id === currentSnippet.id) return;
		else {
			var snippetItem = {};
			var snippetItems = document.getElementsByClassName("snippet-item");

			for(var i = 0, ii = snippetItems.length; i < ii; i++){
				if(snippetItems[i].dataset.id === currentSnippet.id) {
					snippetItem.element = snippetItems[i];
					snippetItem.index = i;
				}
			}

			

			var nextSibling = snippetItem.element.nextSibling;
			var parentNode = snippetItem.element.parentNode;
			parentNode.removeChild(snippetItem.element);
			parentNode.insertBefore(snippetItem.element,nextSibling.nextSibling);

			currentSnippet = snippetsList.splice(snippetItem.index, 1)[0];
			snippetsList.splice((snippetItem.index+1), 0, currentSnippet);

			snippetItem.element.scrollIntoView(false);

			
			for(var i = 0, ii = snippetItems.length; i < ii; i++){
				if (i < 10) {
					snippetItems[i].classList.add("top10");
				}
				else {
					snippetItems[i].classList.remove("top10");
				}
			}

		}
	});



	Eve.on("manageSnippetsInit", sanitizeSnippets);

	Eve.on("pathToBrands-inputChange", function(){
		pathToBrands = preferencesData.files.brands.path = document.getElementById("path-to-brands").value;
	});



	return {
		getSnippets: function(){
			return snippetsList;
		},

		getCurrentSnippet: function(){
			return currentSnippet;
		},

		getPreviewFiles: function(){
			return previewFilesList;
		},

		getPathToBrands: function(){
			return pathToBrands;
		}

	}

})();