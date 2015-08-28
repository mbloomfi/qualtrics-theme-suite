var nav = (function(){

	var navQTS = etc.template(function(){
		return etc.el("div", {
			id:"QTS-option", className:"nav_option", 
			dataset:{panel:"qts"}, 
			events:{
				click: function(){
					Eve.emit("navSelect", this.dataset.panel);
					this.classList.add("current");
				}
			}
		}, "QTS");
	});

	var navFiles = etc.template(function(){
		return etc.el("div", {id:"files-option", className:"nav_option", 
			dataset:{panel:"files"}, 
			events:{
				click: function(){
					Eve.emit("navSelect", this.dataset.panel);
					this.classList.add("current");
				}
			}
		}, "Files");
	});

	var navSnippets = etc.template(function(){
		return etc.el("div", {id:"snippets-option", className:"nav_option", 
			dataset:{panel:"snippets"}, 
			events:{
				click: function(){
					Eve.emit("navSelect", this.dataset.panel);
					this.classList.add("current");
				}
			}
		}, "Snippets");
	});

	var navPreview = etc.template(function(){
		return etc.el("div", {id:"preview-option", className:"nav_option", 
			dataset:{panel:"preview"}, 
			events:{
				click: function(){
					Eve.emit("navSelect", this.dataset.panel);
					this.classList.add("current");
				}
			}
		}, "Preview");
	});

	var navWindow = etc.template(function(){
		return etc.el("div", {id:"window-option", className:"nav_option", 
			dataset:{panel:"window"}, 
			events:{
				click: function(){
					Eve.emit("navSelect", this.dataset.panel);
					this.classList.add("current");
				}
			}
		}, "Window");
	});


	var navTemplate = etc.template(function(){
		var navCont = etc.el("nav", {
			id:"nav", className:"hide",
			events: {
				attached: function(){
					this.classList.remove("hide");
				}
			}
		});
		return navCont.append([
			navQTS.render(),
			navFiles.render(),
			navSnippets.render(),
			navPreview.render(),
			navWindow.render()
		]);
	});


	Eve.on("navSelect", function(_selectedNav){
		var navOptions = document.getElementsByClassName("nav_option");
		for(var i = 0, ii = navOptions.length; i < ii; i++) {
			navOptions[i].classList.remove("current");
		}
	})

	Eve.on("init", function(){
		navTemplate.render(null, document.body);
	});


})();

