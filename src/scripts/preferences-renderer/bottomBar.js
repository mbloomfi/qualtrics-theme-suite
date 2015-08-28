var bottomBar = (function(){

	// Cancel Button
	var cancelBtn = etc.template(function(){
		return etc.el("div", {
			id:"cancel",className:"btn",
			events: {
				click: function(){
					Eve.emit("cancelAll");
				}
			}
		}, "cancel changes");
	})


	// Save Button
	var saveBtn = etc.template(function(){
		return etc.el("div", {
			id:"save",className:"btn",
			events: {
				click: function(){
					Eve.emit("saveAll");
				}
			}
		}, "save changes");
	})


	// Buttons Container
	var bottomBarCont = etc.template(function(){
		var elm = etc.el("section", {
			id:"bottom-bar", className:"hide",
			events: {
				attached: function(){
					this.classList.remove("hide");
				}
			}
		});

		return elm.append([
			cancelBtn.render(), saveBtn.render()
		]);
	});




	Eve.on("init", function(){
		bottomBarCont.render(null, document.body);
	});

})();



