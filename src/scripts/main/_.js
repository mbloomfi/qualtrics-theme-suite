!function(){el=function(e,t){function n(e){var n=e.charAt(0);switch(n){case"#":return i.getById(e.slice(1));case"+":if(e.slice(1).match(/#/)){var r=e.slice(1).split("#"),o=i.create(r[0],t);return el.isElementArray(o)?o.each(function(e){e.setAttribute("id",r[1])}):o.setAttribute("id",r[1]),o}return i.create(e.slice(1),t);case".":return i.getByClassName(e.slice(1));default:return i.getByTagName(e)}}var i=this===window?window.el:this;return"string"==typeof e?n(e):el.isElement(e)?el.elify(e):el.isCollection(e)||el.isNodeList(e)?el.elify(e):void 0},el.create=function(e,t){if(t&&"number"==typeof t){for(var n=[],i=0,r=t;r>i;i++)n.push(el.elify(document.createElement(e)));return n}return el.elify(document.createElement(e))},el.getById=function(e){return el.elify(document.getElementById(e))},el.getByClassName=function(e,t){var n=this===window.el?document:this,i=n.getElementsByClassName(e);return i=Array.prototype.slice.call(i),el.elify(i)},el.getByTagName=function(e,t){var n=this===window.el?document:this,i=n.getElementsByTagName(e);return i=Array.prototype.slice.call(i),el.elify(i)},el.on=function(e,t){var n=el.isElement(this)||el.isElementArray(this)?this:window;return n.addEventListener(e,t),this},el.join=function(e){var t=[];if(el.isArray(e))for(var n=0,i=e.length;i>n;n++)el.isElement(e[n])?t.push(e[n]):el.isElementArray(e[n])&&e[n].each(function(e){t.push(e)});return el.elify(t)},el.elify=function(e){function t(e){return e.el=el,e.getById=el.getById,e.getByClassName=el.getByClassName,e.getByTagName=el.getByTagName,e.getByAttribute=el.getByAttribute,e.elify=el.elify,e.on=el.on,e.addClass=function(e){var t=this;if(el.isArray(e))for(var n=0,i=e.length;i>n;n++)t.classList.add(e[n]);else"string"==typeof e&&t.classList.add(e);return t},e.rmClass=function(e){var t=this;if(el.isArray(e))for(var n=0,i=e.length;i>n;n++)t.classList.remove(e[n]);else"string"==typeof e&&t.classList.remove(e);return t},e.hasClass=function(e){return this.classList.contains(e)},e.rm=function(){var e=this;return e.parentNode&&e.parentNode.removeChild(e),e},e.append=function(e){if(el.isElementArray(e)){var n=document.createDocumentFragment();e.each(function(e){e.el||(e=t(e)),n.appendChild(e)}),e=n}return this.appendChild(e),this},e.appendTo=function(e){var t=this;return el.isElementArray(e)?e.each(function(e){var n=t.cloneNode(!0);e.appendChild(n)}):e.appendChild(t),t},e.purge=function(){for(var e=this;e.firstChild;)e.removeChild(e.firstChild);return e},Object.defineProperty(e,"text",{configurable:!0,enumerable:!0,writable:!0,value:function(t){return"string"==typeof t&&e.appendChild(document.createTextNode(t)),e}}),e.attr=function(e,t){return"string"==typeof e&&this.setAttribute(e,void 0!==t?t:""),this},e}return el.isElement(e)?t(e):((el.isCollection(e)||el.isNodeList(e))&&(e=Array.prototype.slice.call(e)),e.each=el.each,e.each(function(e){t(e)}),e.addClass=function(n){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.addClass(n))}),e},e.rmClass=function(n){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.rmClass(n))}),e},e.hasClass=function(n,i){if("all"===i||"undefined"==typeof i){var r=!0;return e.each(function(e){"undefined"!=typeof e&&(void 0===e.el&&(e=t(e)),e.hasClass(n)||(r=!1))}),r}return"any"===i?(e.each(function(e){return"undefined"!=typeof e&&(e.el||(e=t(e)),e.hasClass(n))?!0:void 0}),!1):e},e.rm=function(n){return this.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.rm())}),e},e.append=function(n){if(el.isElementArray(n)){var i=document.createDocumentFragment();n.each(function(e){void 0===e.el&&(e=t(e)),i.appendChild(e)}),n=i}return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.append(n.cloneNode(!0)))}),e},e.appendTo=function(n,i){return e.each(function(e){"undefined"!=typeof e&&(void 0===e.el&&(e=t(e)),e.appendTo(n))}),i!==!1&&e.rm(),e},e.purge=function(){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.purge())}),e},e.text=function(n){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.text(n))}),e},e.attr=function(n,i){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.attr(n,i))}),e},e.on=function(e,t){return this.each(function(n){n.addEventListener(e,t)}),this},e)},el.each=function(e){for(var t=this,n=0,i=t.length;i>n;n++)e(t[n],n,t)},el.isArray=function(e){return Array.isArray(e)||e instanceof Array?!0:!1},el.isElementArray=function(e){return(Array.isArray(e)||e instanceof Array)&&el.isElement(e[0])?!0:!1},el.isElement=function(e){var t;try{t=e instanceof HTMLElement}catch(n){t=e&&e.nodeType?!0:!1}return t},el.isCollection=function(e){return e instanceof HTMLCollection},el.isNodeList=function(e){return e instanceof NodeList}}();var remote=require("remote"),app=remote.require("app"),Global=remote.getGlobal("sharedObject");el.on("load",function(){window.editor=el("#editor"),window.preview=el("#preview"),el.join([editor,preview]).rmClass("hide")});var dimmer={on:function(){var e=el("+div").addClass("dimmer");el("body").append(e),setTimeout(function(){el(".dimmer")[0].addClass("show")},10)},off:function(){var e=el(".dimmer").rmClass("show");setTimeout(function(){e.rm()},500)}};editorPreviewBar={set:function(e){var t=null,n=null;0===e?(t="10%",n="90%"):1===e?(t="20%",n="80%"):2===e?(t="30%",n="70%"):3===e?(t="40%",n="60%"):4===e?(t="50%",n="50%"):5===e?(t="60%",n="40%"):6===e?(t="70%",n="30%"):7===e?(t="80%",n="20%"):8===e&&(t="90%",n="10%"),el("#editor_preview_ratio").purge().text("section#editor{ width:"+t+"; } webview#preview{ width:"+n+"; }")}},function(){window.Prompter={prompt:function(e){Prompter.container.purge(),null!==e.message&&void 0!==e.message&&(Prompter.messageCont=Prompter.container.append(el("+div").addClass("message").text(e.message))),null!==e.btn3&&void 0!==e.btn3&&(Prompter.container.append(el("+div").addClass(["btn","btn3"]).text(e.btn3.text)),Prompter.container.el(".btn3")[0].onclick=e.btn3.onClick),null!==e.btn2&&void 0!==e.btn2&&(Prompter.container.append(el("+div").addClass(["btn","btn2"]).text(e.btn2.text)),Prompter.container.el(".btn2")[0].onclick=e.btn2.onClick),null!==e.mainBtn&&void 0!==e.mainBtn&&(Prompter.container.append(el("+div").addClass(["mainBtn","btn"]).text(e.mainBtn.text)),Prompter.container.el(".mainBtn")[0].onclick=e.mainBtn.onClick),Prompter.container.addClass("show"),el("body")[0].append(el("+div").addClass("overlay")),setTimeout(function(){el(".overlay")[0].addClass("visible")},5)},hide:function(){Prompter.container.rmClass("show"),setTimeout(function(){Prompter.container.purge()},500);var e=el(".overlay")[0].rmClass("visible");setTimeout(function(){e.rm()},300)},setBtn:function(){}},Prompter.container=el("#Prompter")}(),function(){window.Quitter={quit:function(){remote.getGlobal("sharedObject").canQuit=!0,app.quit()},prompt:function(){Saver.isSaved()?Prompter.prompt({message:"Quit?",mainBtn:{text:"Yes",onClick:Quitter.quit},btn2:{text:"No",onClick:Quitter.cancel},btn3:null}):Saver.prompt()},cancel:function(){Global.canQuit=!1,Prompter.hide(),console.log("Quit Cancelled")}}}(),function(){window.Saver={prompt:function(){},isSaved:function(){return!0}}}();