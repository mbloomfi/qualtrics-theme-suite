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
			Prompter.container.rmClass("show");
			dimmer.off();
			Prompter.isPrompting = false;
			setTimeout(function(){
				Prompter.container.rm();

			}, 500);
		},

		setBtn: function(){

		}

	};
	
	
	
})();