// INIT app
el.on("load", function(){
	//add global reference to editor and preview
	window.editor = el("#editor");
	window.preview = el("#preview");

	baton(function(next){
		
		
		core.localData.updateUserSettings(next);

	})

	.then(function(next){
		// console.log("reloading?");
		core.localData.updateBrandsList(next);

	})
	.then(function(next){

		core.localData.updateRecentBrands(next);

	})
	.then(function(next){

		core.localData.snippets.readFromPersistentData(next);

	})
	.then(function(next){

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
		})



		window.addEventListener("keypress", function(e){

		// console.log("e",e);
			// enter key
			if(e.keyCode === 13) {
				if(core.preview.mode.currentMode === "thumbnail"){
					var clickEvent = new MouseEvent("click");
					document.getElementById("thumbCamera").dispatchEvent(clickEvent);
				}
				else if(core.preview.mode.currentMode === "screenshot"){
					var clickEvent = new MouseEvent("click");
					document.getElementById("screenshotCamera").dispatchEvent(clickEvent);
					// console.log("take screenshot");
				}
			}

		});

		window.keystate = [];



		document.addEventListener('keydown',function(evt){
			keystate[evt.keyCode] = true;
			if (evt.keyCode === 38 || evt.keyCode === 40 || evt.keyCode === 39 || evt.keyCode === 37 || evt.keyCode === 32) {
				// evt.preventDefault();
				
			}

			// if 'minus' key
			if(evt.keyCode === 189){
				keystate[evt.keyCode] = false;

				//if 'COMMAND'
				if(keystate[91]){
					if(core.preview.mode.currentMode === "thumbnail"){
						var clickEvent = new MouseEvent("click");
						document.getElementById("decrease-thumb-size").dispatchEvent(clickEvent);
					}
				}
			}

			// if 'equals' key
			else if(evt.keyCode === 187){
				keystate[evt.keyCode] = false;

				//if 'COMMAND'
				if(keystate[91]){
					if(core.preview.mode.currentMode === "thumbnail"){
						var clickEvent = new MouseEvent("click");
						document.getElementById("increase-thumb-size").dispatchEvent(clickEvent);
					}
				}
			}

			// if 'right arrow' key
			else if(evt.keyCode === 39){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if(keystate[91] && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						if(keystate[91]){
							thumbBox.style.left = (parseInt(thumbBox.style.left) + (50))+"px";
						} else {
							thumbBox.style.left = (parseInt(thumbBox.style.left) + (10))+"px";
						}

						if( (parseInt(thumbBox.style.left) + thumbBox.clientWidth) > window.innerWidth ) thumbBox.style.left = (
							window.innerWidth - thumbBox.clientWidth
							)+"px";
						
						// thumbBox.style.top = (parseInt(thumbBox.style.top) + (evt.clientY - self.prevClientY))+"px";
						// var clickEvent = new MouseEvent("click");
						// document.getElementById("increase-thumb-size").dispatchEvent(clickEvent);
					}
				
			}

			// if 'left arrow' key
			else if(evt.keyCode === 37){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if(keystate[91] && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						if(keystate[91]){

							if(parseInt(thumbBox.style.left) - (50) < 0){
								thumbBox.style.left = "0px";
							} else {
								thumbBox.style.left = (parseInt(thumbBox.style.left) - (50))+"px";
							}
							
						} else {

							if(parseInt(thumbBox.style.left) - (10) < 0){
								thumbBox.style.left = "0px";
							} else {
								thumbBox.style.left = (parseInt(thumbBox.style.left) - (10))+"px";
							}

						}

					}
				
			}

			// if 'down arrow' key
			else if(evt.keyCode === 40){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if(keystate[91] && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						
						if(keystate[91]){
							thumbBox.style.top = (parseInt(thumbBox.style.top) + (50))+"px";
						} else {
							thumbBox.style.top = (parseInt(thumbBox.style.top) + (10))+"px";
						}
						// console.log("top",parseInt(thumbBox.style.top));
						// console.log("box height",thumbBox.clientHeight);
						// console.log("window height",window.innerHeight);


						if( (parseInt(thumbBox.style.top) + thumbBox.clientHeight) >= window.innerHeight) {
							// console.log("reset top")
							thumbBox.style.top = (
							window.innerHeight - thumbBox.clientHeight
							)+"px";
						}
							
						
						// thumbBox.style.top = (parseInt(thumbBox.style.top) + (evt.clientY - self.prevClientY))+"px";
						// var clickEvent = new MouseEvent("click");
						// document.getElementById("increase-thumb-size").dispatchEvent(clickEvent);
					}
				
			}

			// if 'up arrow' key
			else if(evt.keyCode === 38){
				keystate[evt.keyCode] = false;

				//if 'COMMAND' and 'OPTION' keys not pressed
				if(keystate[91] && keystate[18]){
					return;
				}	

					if(core.preview.mode.currentMode === "thumbnail"){
						var thumbBox = document.getElementById("thumbBox");
						if(keystate[91]){

							if(parseInt(thumbBox.style.top) - (50) < 0){
								thumbBox.style.top = "0px";
							} else {
								thumbBox.style.top = (parseInt(thumbBox.style.top) - (50))+"px";
							}


						} else {

							if(parseInt(thumbBox.style.top) - (10) < 0){
								thumbBox.style.top = "0px";
							} else {
								thumbBox.style.top = (parseInt(thumbBox.style.top) - (10))+"px";
							}
							
						}

						
						// thumbBox.style.top = (parseInt(thumbBox.style.top) + (evt.clientY - self.prevClientY))+"px";
						// var clickEvent = new MouseEvent("click");
						// document.getElementById("increase-thumb-size").dispatchEvent(clickEvent);
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
	})
	.run();
});