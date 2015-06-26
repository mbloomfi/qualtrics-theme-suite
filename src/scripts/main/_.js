!function(){window.el=function(e,t){function n(e){var n=e.charAt(0);switch(n){case"#":return r.getById(e.slice(1));case"+":if(e.slice(1).match(/#/)){var i=e.slice(1).split("#"),a=r.create(i[0],t);return el.isElementArray(a)?a.each(function(e){e.setAttribute("id",i[1])}):a.setAttribute("id",i[1]),a}return r.create(e.slice(1),t);case".":return r.getByClassName(e.slice(1));default:return r.getByTagName(e)}}var r=this===window?window.el:this;return"string"==typeof e?n(e):el.isElement(e)?el.elify(e):void 0},el.create=function(e,t){if(t&&"number"==typeof t){for(var n=[],r=0,i=t;i>r;r++)n.push(el.elify(document.createElement(e)));return n}return el.elify(document.createElement(e))},el.getById=function(e){return el.elify(document.getElementById(e))},el.getByClassName=function(e,t){var n=this===window.el?document:this,r=n.getElementsByClassName(e);return r=Array.prototype.slice.call(r),el.elify(r)},el.getByTagName=function(e,t){var n=this===window.el?document:this,r=n.getElementsByTagName(e);return r=Array.prototype.slice.call(r),el.elify(r)},el.on=function(e,t){var n=el.isElement(this)||el.isElementArray(this)?this:window;return el.isArray(n.__listeners__)||(n.__listeners__=[]),el.isArray(n.__listeners__[e])||(n.__listeners__[e]=[]),n.__listeners__[e].push(t),n.addEventListener(e,t),this},el.join=function(e){var t=[];if(el.isElement(e))t.push(e);else if(el.isArray(e))for(var n=0,r=e.length;r>n;n++)el.isElement(e[n])?t.push(e[n]):el.isElementArray(e[n])&&e[n].each(function(e){t.push(e)});return el.elify(t)},el.elify=function(e){function t(e){return e.el=el,e.getById=el.getById,e.getByClassName=el.getByClassName,e.getByTagName=el.getByTagName,e.getByAttribute=el.getByAttribute,e.elify=el.elify,e.on=el.on,e.join=el.join,e.addClass=function(e){function t(e){-1===(" "+n.className+" ").indexOf(" "+e+" ")&&(n.className=n.className.length>0?n.className+" "+e:e)}var n=this;if(el.isArray(e))for(var r=0,i=e.length;i>r;r++)t(e[r]);else t(e);return n},e.rmClass=function(e){if(-1!==(" "+this.className+" ").indexOf(" "+e+" ")){if(-1===this.className.indexOf(" "))return this.className="",this;for(var t="",n=this.className.split(" "),r=0;r<n.length;r++)n[r]!==e&&(t+=n[r]+" ");" "===t.substr(t.length-1)&&(t=t.slice(0,-1)),this.className=t}return this},e.hasClass=function(e){for(var t=this.className.split(" "),n=0;n<t.length;n++)if(t[n]===e)return!0;return!1},e.rm=function(){var e=this;return e.parentNode&&e.parentNode.removeChild(e),e},e.append=function(e){if(el.isElementArray(e)){var n=document.createDocumentFragment();e.each(function(e){e.el||(e=t(e)),n.appendChild(e)}),e=n}return this.appendChild(e),this},e.appendTo=function(e){var t=this;return el.isElementArray(e)?e.each(function(e){var n=t.cloneNode(!0);e.appendChild(n)}):e.appendChild(t),t},e.purge=function(){for(var e=this;e.firstChild;)e.removeChild(e.firstChild);return e},"BODY"===e.nodeName||"OPTION"===e.nodeName?Object.defineProperty(e,"text",{configurable:!0,enumerable:!0,writable:!0,value:function(t){return"string"==typeof t&&e.appendChild(document.createTextNode(t)),e}}):e.text=function(e){return"string"==typeof e&&this.appendChild(document.createTextNode(e)),this},e}return el.isElement(e)?t(e):(el.isCollection(e)&&(e=Array.prototype.slice.call(e)),e.each=el.each,e.each(function(e){t(e)}),e.addClass=function(n){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.addClass(n))}),e},e.rmClass=function(n){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.rmClass(n))}),e},e.hasClass=function(n,r){if("all"===r||"undefined"==typeof r){var i=!0;return e.each(function(e){"undefined"!=typeof e&&(void 0===e.el&&(e=t(e)),e.hasClass(n)||(i=!1))}),i}return"any"===r?(e.each(function(e){return"undefined"!=typeof e&&(e.el||(e=t(e)),e.hasClass(n))?!0:void 0}),!1):e},e.rm=function(n){return this.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.rm())}),e},e.append=function(n){if(el.isElementArray(n)){var r=document.createDocumentFragment();n.each(function(e){void 0===e.el&&(e=t(e)),r.appendChild(e)}),n=r}return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.append(n.cloneNode(!0)))}),e},e.appendTo=function(n,r){return e.each(function(e){"undefined"!=typeof e&&(void 0===e.el&&(e=t(e)),e.appendTo(n))}),r!==!1&&e.rm(),e},e.purge=function(){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.purge())}),e},e.text=function(n){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=t(e)),e.text(n))}),e},e.on=function(e,t){return this.each(function(n){n.addEventListener(e,t)}),this},e)},el.each=function(e){for(var t=this,n=0,r=t.length;r>n;n++)e(t[n],n,t)},el.isArray=function(e){return Array.isArray(e)||e instanceof Array?!0:!1},el.isElementArray=function(e){return(Array.isArray(e)||e instanceof Array)&&el.isElement(e[0])?!0:!1},el.isElement=function(e){var t;try{t=e instanceof HTMLElement}catch(n){t=e&&e.nodeType?!0:!1}return t},el.isCollection=function(e){var t;try{t=e instanceof HTMLCollection}catch(n){t="number"!=typeof e.length||void 0===typeof e.item||0!==e.length&&!isElement(e[0])?!1:!0}return t}}(),!function(e,t){function n(e){var n=t[e];t[e]=function(e){return i(n(e))}}function r(t,n,r){return(r=this).attachEvent("on"+t,function(t){var t=t||e.event;t.preventDefault=t.preventDefault||function(){t.returnValue=!1},t.stopPropagation=t.stopPropagation||function(){t.cancelBubble=!0},n.call(r,t)})}function i(e,t){if(t=e.length)for(;t--;)e[t].addEventListener=r;else e.addEventListener=r;return e}e.addEventListener||(i([t,e]),"Element"in e?e.Element.prototype.addEventListener=r:(t.attachEvent("onreadystatechange",function(){i(t.all)}),n("getElementsByTagName"),n("getElementById"),n("createElement"),i(t.all)))}(window,document);var remote=require("remote"),app=remote.require("app"),Global=remote.getGlobal("sharedObject");el.on("load",function(){window.editor=el("#editor"),window.preview=el("#preview"),el.join([editor,preview]).rmClass("hide")});var dimmer={on:function(){var e=el("+div").addClass("dimmer");el("body").append(e),setTimeout(function(){el(".dimmer")[0].addClass("show")},10)},off:function(){var e=el(".dimmer").rmClass("show");setTimeout(function(){e.rm()},500)}};!function(){window.Prompter={prompt:function(e){Prompter.container.purge(),null!==e.message&&void 0!==e.message&&(Prompter.messageCont=Prompter.container.append(el("+div").addClass("message").text(e.message))),null!==e.btn3&&void 0!==e.btn3&&(Prompter.container.append(el("+div").addClass(["btn","btn3"]).text(e.btn3.text)),Prompter.container.el(".btn3")[0].onclick=e.btn3.onClick),null!==e.btn2&&void 0!==e.btn2&&(Prompter.container.append(el("+div").addClass(["btn","btn2"]).text(e.btn2.text)),Prompter.container.el(".btn2")[0].onclick=e.btn2.onClick),null!==e.mainBtn&&void 0!==e.mainBtn&&(Prompter.container.append(el("+div").addClass(["mainBtn","btn"]).text(e.mainBtn.text)),Prompter.container.el(".mainBtn")[0].onclick=e.mainBtn.onClick),Prompter.container.addClass("show"),el("body")[0].append(el("+div").addClass("overlay")),setTimeout(function(){el(".overlay")[0].addClass("visible")},5)},hide:function(){Prompter.container.rmClass("show"),setTimeout(function(){Prompter.container.purge()},500);var e=el(".overlay")[0].rmClass("visible");setTimeout(function(){e.rm()},300)},setBtn:function(){}},Prompter.container=el("#Prompter")}(),function(){window.Quitter={quit:function(){remote.getGlobal("sharedObject").canQuit=!0,app.quit()},prompt:function(){Saver.isSaved()?Prompter.prompt({message:"Quit?",mainBtn:{text:"Yes",onClick:Quitter.quit},btn2:{text:"No",onClick:Quitter.cancel},btn3:null}):Saver.prompt()},cancel:function(){Global.canQuit=!1,Prompter.hide(),console.log("Quit Cancelled")}}}(),function(){window.Saver={prompt:function(){},isSaved:function(){return!0}}}();