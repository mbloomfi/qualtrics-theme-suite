(function(){
	window.Prompter = {
		prompt: function(_promptObj){
			//show Prompter
			Prompter.container.purge();

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

			//show Prompter
			Prompter.container.addClass("show");
			el("body")[0].append( el("+div").addClass("overlay") )
			setTimeout(function(){
				el(".overlay")[0].addClass("visible");
			}, 5);
		},

		hide: function(){
			Prompter.container.rmClass("show");
			setTimeout(function(){
				Prompter.container.purge();
			}, 500);
			var overlay = el(".overlay")[0].rmClass("visible");
			setTimeout(function(){
				overlay.rm();
			}, 300);
		},

		setBtn: function(){

		}

	};
	
	Prompter.container = el("#Prompter");
	
})();