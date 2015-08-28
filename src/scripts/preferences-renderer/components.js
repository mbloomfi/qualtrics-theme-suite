// // --------------------
// // main panel
// // --------------------
// var manageSnippetsCont = etc.template(function(){
// 	return etc.el("form",{id:"snippetsForm",className:"snippets"}).append([
// 		snippetListCont.render(),
// 		snippetInfoCont.render(),
// 		snippetCodemirror.render(),
// 		saveSnippetBtn.render()
// 	]);
// });


// var snippetListCont = etc.template(function(){
// 	return etc.el("div",{id:"snippetsListCont"});
// });



// var snippetInfoCont = etc.template(function(){
// 	return etc.el("div",{id:"snippetInfo"});
// });


// var snippetNameField = etc.template(function(){
// 	return etc.el("input",{
// 		id:"snippetName", placeholder:"Snippet Name",
// 		events: {
// 			keyup: function(){
// 				console.log("keyup");
// 			},
// 			paste: function(){
// 				console.log("paste");
// 			}
// 		}
// 	});
// });




// var snippetTypeRadios = etc.template(function(){

// 	var container = etc.el("div",
// 	{
// 		id:"snippetTypeCont",
// 		events: {
// 			keyup: function(){
// 				console.log("keyup");
// 			},
// 			paste: function(){
// 				console.log("paste");
// 			}
// 		}
// 	});

// 	var cssCont = etc.el("label",{id:"snippetType-css"},"css").append(
// 		etc.el("input",{id:"snippetRadio-css", type:"radio", value: "css", name: "snippet-radio"})
// 	);

// 	var jsCont = etc.el("label",{id:"snippetType-js"},"JS").append(
// 		etc.el("input",{id:"snippetRadio-js", type:"radio", value: "js", name: "snippet-radio"})
// 	);

// 	return container.render().append([
// 		cssCont.render(), jsCont.render()
// 	]);
// });



// var snippetCodemirror = etc.template(function(){
// 	return etc.el("div", {id:"snippetCodemirror"});
// });


// var saveSnippetBtn = etc.template(function(){
// 	return etc.el("button", {id:"saveSnippet", onclick:function(){ Snippet.saveToLocal(); }}, "Save Snippet");

// });  

