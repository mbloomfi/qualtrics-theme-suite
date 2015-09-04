/* eslint-disable */
(function(){
	window.Quitter = {
		quit: function(){
			remote.getGlobal("sharedObject").canQuit = true;
			app.quit();
		},
		prompt: function(){
			(Saver.isSaved()) 
			? //true
				Prompter.prompt({
					message: "Quit?",
					mainBtn: {
						text: "Yes",
						onClick: Quitter.quit
					},
					btn2: {
						text: "No",
						onClick: Quitter.cancel
					},
					btn3: null,
				}) 
			: //false
				Saver.prompt()
			;
		},
		cancel: function(){
			Global.canQuit = false;
			Prompter.hide();
			console.log("Quit Cancelled");
		}
	};
})();
/* eslint-enable */
