var dimmer = {
	on: function() {
		var _dimmer = el("+div").addClass("dimmer");
		el("body").append(_dimmer);
		setTimeout(function(){
			el(".dimmer")[0].addClass("show");
		},10);
	},
	off: function(){
		core.localData.updateUserSettings(function(){
			var _dimmer = el(".dimmer").rmClass("show");

			// if dropdowns are open, close them
			if(editorCore.dropdowns.projects.status === "opened") editorCore.dropdowns.projects.close();
			if(editorCore.dropdowns.brands.status === "opened") editorCore.dropdowns.brands.close();

			setTimeout(function(){
				_dimmer.rm();
				_dimmer = null;
			},500);
		});
	}
};

(function(){
	window.Prompter = {
		isPrompting: false,

		prompt: function(_promptObj){

			if(Prompter.isPrompting) return;
			Prompter.isPrompting = true;
			//show Prompter
			// Prompter.container.purge();

			Prompter.container = el("+section#Prompter").attr("style", "position:relative; z-index:10000;");

			if(_promptObj.message !== null && _promptObj.message !== undefined){
				Prompter.messageCont = Prompter.container.append( el("+div").addClass("message").text(_promptObj["message"]) );
			}
			if(_promptObj.btn3 !== null && _promptObj.btn3 !== undefined){
				Prompter.container.append( el("+div").addClass(["btn", "btn3"]).text(_promptObj.btn3.text) );
				Prompter.container.el(".btn3")[0].onclick = _promptObj.btn3.onClick;
			}
			if(_promptObj.btn2 !== null && _promptObj.btn2 !== undefined){
				Prompter.container.append( el("+div").addClass(["btn", "btn2"]).text(_promptObj.btn2.text) );
				Prompter.container.el(".btn2")[0].onclick = _promptObj.btn2.onClick;
			}
			if(_promptObj.mainBtn !== null && _promptObj.mainBtn !== undefined){
				Prompter.container.append( el("+div").addClass(["mainBtn", "btn"]).text(_promptObj.mainBtn.text) );
				Prompter.container.el(".mainBtn")[0].onclick = _promptObj.mainBtn.onClick;
			}

			el("#body").append(Prompter.container);

			//show Prompter
			dimmer.on();
			
			// el("body")[0].append( el("+div").addClass("overlay") )
			setTimeout(function(){
				Prompter.container.addClass("show");
			}, 150);
		},

		hide: function(){
			if(!Prompter.isPrompting) return null;
			Prompter.container.rmClass("show");
			dimmer.off();
			Prompter.isPrompting = false;
			setTimeout(function(){
				Prompter.container.rm();
			}, 300);
		},

		setBtn: function(){

		}

	};
	
	
	
})();