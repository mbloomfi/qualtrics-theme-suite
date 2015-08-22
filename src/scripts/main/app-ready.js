// INIT app
window.addEventListener("load", function(){
	//add global reference to editor and preview
	






	// baton(function(next){
		
		Eve.emit("app-started");
	
	// })

	// .then(function(next){
	// 	console.log("app init");
	// 	core.localData.updateUserSettings(next);
	// })

	// .then(function(next){
	// 	// console.log("reloading?");
	// 	core.localData.updateBrandsList(next);

	// })
	// .then(function(next){

	// 	core.localData.updateRecentBrands(next);

	// })
	// .then(function(next){

	// 	core.localData.snippets.readFromPersistentData(next);

	// })
	// .then(function(next) {

	Eve.on("app-loaded", function(){
		window.editor = el("#editor");
		window.preview = el("#preview");

		editorCore.dropdowns.setDropdownGlobals();

		editorCore.dropdowns.bodyClick();

		editorCore.dropdowns.brands.populate();
		editorCore.dropdowns.brands.init();
		
		editorCore.dropdowns.projects.populate();
		editorCore.dropdowns.projects.init();

		editorCore.dropdowns.files.prepare();
		editorCore.dropdowns.files.addFileDragListener();

		codemirrorInit();

		core.codeMirror.dirtyWatch();

		core.preview.init();
		//un-hide page // show editor and webview
		el.join( [editor, preview] ).rmClass("hide");


		window.addEventListener("resize", function(){
			core.preview.mode.screenshot.box.update();
		});



		window.addEventListener("keypress", function(e){

		// console.log("e",e);
			// enter key
			if(e.keyCode === 13) {
				
				if(core.preview.mode.currentMode === "thumbnail"){
					document.getElementById("thumbCamera").dispatchEvent(new MouseEvent("click"));
				}
				else if(core.preview.mode.currentMode === "screenshot"){
					document.getElementById("screenshotCamera").dispatchEvent(new MouseEvent("click"));
				}
			}

			

		});

		window.keystate = [];



		document.addEventListener('keydown',function(evt){

			if(evt.keyCode === 27) {

				if(core.preview.mode.currentMode === "thumbnail" || core.preview.mode.currentMode === "screenshot"){
					evt.preventDefault();
					core.preview.mode.regular.enable();
					myCodeMirror.focus();
				}

			}

			keystate[evt.keyCode] = true;
			if (evt.keyCode === 38 || evt.keyCode === 40 || evt.keyCode === 39 || evt.keyCode === 37 || evt.keyCode === 32) {
				// evt.preventDefault();
				
			}

			// if 'minus' key
			if(evt.keyCode === 189){
				keystate[evt.keyCode] = false;

				//if 'COMMAND'
				if(keystate[91]||keystate[93]){
					
					if(core.preview.mode.currentMode === "thumbnail"){
						document.getElementById("decrease-thumb-size").dispatchEvent(new MouseEvent("click"));
					}
				}
			}

			// if 'equals' key
			else if(evt.keyCode === 187){
				keystate[evt.keyCode] = false;

				//if 'COMMAND'
				if(keystate[91]||keystate[93]){
					
					if(core.preview.mode.currentMode === "thumbnail"){
						document.getElementById("increase-thumb-size").dispatchEvent(new MouseEvent("click"));
					}
				}
			}

			// if 'right arrow' key
			else if(evt.keyCode === 39){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if((keystate[91]||keystate[93]) && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						if(keystate[91]||keystate[93]){
							thumbBox.style.left = parseInt(thumbBox.style.left) + 50 + "px";
						} else {
							thumbBox.style.left = parseInt(thumbBox.style.left) + 10 + "px";
						}

						if( parseInt(thumbBox.style.left) + thumbBox.clientWidth > window.innerWidth ) {
							thumbBox.style.left = window.innerWidth - thumbBox.clientWidth + "px";
						}
					}
				
			}

			// if 'left arrow' key
			else if(evt.keyCode === 37){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if((keystate[91]||keystate[93]) && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						if((keystate[91]||keystate[93])){

							if(parseInt(thumbBox.style.left) - 50 < 0){
								thumbBox.style.left = "0px";
							} else {
								thumbBox.style.left = parseInt(thumbBox.style.left) - 50 + "px";
							}
							
						} else {

							if(parseInt(thumbBox.style.left) - 10 < 0){
								thumbBox.style.left = "0px";
							} else {
								thumbBox.style.left = parseInt(thumbBox.style.left) - 10 + "px";
							}

						}

					}
				
			}

			// if 'down arrow' key
			else if(evt.keyCode === 40){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if((keystate[91]||keystate[93]) && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						
						if((keystate[91]||keystate[93])){
							thumbBox.style.top = parseInt(thumbBox.style.top) + 50 + "px";
						} else {
							thumbBox.style.top = parseInt(thumbBox.style.top) + 10 + "px";
						}
						// console.log("top",parseInt(thumbBox.style.top));
						// console.log("box height",thumbBox.clientHeight);
						// console.log("window height",window.innerHeight);


						if( parseInt(thumbBox.style.top) + thumbBox.clientHeight >= window.innerHeight) {
							// console.log("reset top")
							thumbBox.style.top = window.innerHeight - thumbBox.clientHeight + "px";
						}

					}
				
			}

			// if 'up arrow' key
			else if(evt.keyCode === 38){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if((keystate[91]||keystate[93]) && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						if(keystate[91]||keystate[93]){

							if(parseInt(thumbBox.style.top) - 50 < 0){
								thumbBox.style.top = "0px";
							} else {
								thumbBox.style.top = parseInt(thumbBox.style.top) - 50 + "px";
							}


						} else {

							if(parseInt(thumbBox.style.top) - 10 < 0){
								thumbBox.style.top = "0px";
							} else {
								thumbBox.style.top = parseInt(thumbBox.style.top) - 10 + "px";
							}
							
						}

						
						// thumbBox.style.top = (parseInt(thumbBox.style.top) + (evt.clientY - self.prevClientY))+"px";
						// 
						// document.getElementById("increase-thumb-size").dispatchEvent(new MouseEvent("click"));
					}
				
			}





		});


		document.addEventListener('keyup',function(evt){

			keystate[evt.keyCode] = false;
			// console.log("keystate:",keystate);
		});

		preview.addEventListener("did-start-loading", function(){
			// preview.reload();
			preview.addClass("loading-fadeout");
			if(preview.src === "http://10.240.30.11/releasemanager") {
				// console.log("release manager redirecting!!");
			}
			// else if(preview.src === "local/no-preview.html"){
			// 	console.log("preview src:#")
			// 	core.preview.init();
			// }
			


			// core.preview.init();
		  // preview.src = "local/currentPreview.html";
		});

		preview.addEventListener("dom-ready", function(){
			// preview.reload();

			// console.log("dom ready!!");
			if(preview.src === "http://10.240.30.11/releasemanager") {

				preview.insertCSS("body {background:white !important;} #Page, #Footer {border-radius:0 !important; box-shadow:none !important; background:white !important;} #Page #Toolbar { display:none; border:none !important; border-width:0 !important; border-radius:8px; border-top:none !important; border-bottom:none !important; background: rgb(210,210,210) !important; overflow:hidden;} #Page #Content { border-top:none !important;}");
			}





			setTimeout(function(){
				preview.rmClass("loading-fadeout");
			},50);



			// core.preview.init();
		  // preview.src = "local/currentPreview.html";
		});


	});

		



		



	// })
	// .run();
});