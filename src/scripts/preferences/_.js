!function(){window.el=function(e,n){function t(e){var t=e.charAt(0);switch(t){case"#":return r.getById(e.slice(1));case"+":return r.create(e.slice(1),n);case".":return r.getByClassName(e.slice(1));default:return r.getByTagName(e)}}var r=this===window?window.el:this;return"string"==typeof e?t(e):el.isElement(e)?el.elify(e):void 0},el.create=function(e,n){if(n&&"number"==typeof n){for(var t=[],r=0,i=n;i>r;r++)t.push(el.elify(document.createElement(e)));return t}return el.elify(document.createElement(e))},el.getById=function(e){return el.elify(document.getElementById(e))},el.getByClassName=function(e,n){var t=this===window.el?document:this,r=t.getElementsByClassName(e);return r=Array.prototype.slice.call(r),el.elify(r)},el.getByTagName=function(e,n){var t=this===window.el?document:this,r=t.getElementsByTagName(e);return r=Array.prototype.slice.call(r),el.elify(r)},el.on=function(e,n){var t=el.isElement(this)||el.isElementArray(this)?this:window;return el.isArray(t.__listeners__)||(t.__listeners__=[]),el.isArray(t.__listeners__[e])||(t.__listeners__[e]=[]),t.__listeners__[e].push(n),t.addEventListener(e,n),this},el.join=function(e){var n=[];if(el.isElement(e))n.push(e);else if(el.isArray(e))for(var t=0,r=e.length;r>t;t++)el.isElement(e[t])?n.push(e[t]):el.isElementArray(e[t])&&e[t].each(function(e){n.push(e)});return el.elify(n)},el.elify=function(e){function n(e){return e.el=el,e.getById=el.getById,e.getByClassName=el.getByClassName,e.getByTagName=el.getByTagName,e.getByAttribute=el.getByAttribute,e.elify=el.elify,e.on=el.on,e.join=el.join,e.addClass=function(e){function n(e){-1===(" "+t.className+" ").indexOf(" "+e+" ")&&(t.className=t.className.length>0?t.className+" "+e:e)}var t=this;if(el.isArray(e))for(var r=0,i=e.length;i>r;r++)n(e[r]);else n(e);return t},e.rmClass=function(e){if(-1!==(" "+this.className+" ").indexOf(" "+e+" ")){if(-1===this.className.indexOf(" "))return this.className="",this;for(var n="",t=this.className.split(" "),r=0;r<t.length;r++)t[r]!==e&&(n+=t[r]+" ");" "===n.substr(n.length-1)&&(n=n.slice(0,-1)),this.className=n}return this},e.hasClass=function(e){for(var n=this.className.split(" "),t=0;t<n.length;t++)if(n[t]===e)return!0;return!1},e.rm=function(){var e=this;return e.parentNode&&e.parentNode.removeChild(e),e},e.append=function(e){if(el.isElementArray(e)){var t=document.createDocumentFragment();e.each(function(e){e.el||(e=n(e)),t.appendChild(e)}),e=t}return this.appendChild(e),this},e.appendTo=function(e){var n=this;return el.isElementArray(e)?e.each(function(e){var t=n.cloneNode(!0);e.appendChild(t)}):e.appendChild(n),n},e.purge=function(){for(var e=this;e.firstChild;)e.removeChild(e.firstChild);return e},"BODY"===e.nodeName?Object.defineProperty(e,"text",{configurable:!0,enumerable:!0,writable:!0,value:function(n){return"string"==typeof n&&e.appendChild(document.createTextNode(n)),e}}):e.text=function(e){return"string"==typeof e&&this.appendChild(document.createTextNode(e)),this},e}return el.isElement(e)?n(e):(el.isCollection(e)&&(e=Array.prototype.slice.call(e)),e.each=el.each,e.each(function(e){n(e)}),e.addClass=function(t){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=n(e)),e.addClass(t))}),e},e.rmClass=function(t){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=n(e)),e.rmClass(t))}),e},e.hasClass=function(t,r){if("all"===r||"undefined"==typeof r){var i=!0;return e.each(function(e){"undefined"!=typeof e&&(void 0===e.el&&(e=n(e)),e.hasClass(t)||(i=!1))}),i}return"any"===r?(e.each(function(e){return"undefined"!=typeof e&&(e.el||(e=n(e)),e.hasClass(t))?!0:void 0}),!1):e},e.rm=function(t){return this.each(function(e){"undefined"!=typeof e&&(e.el||(e=n(e)),e.rm())}),e},e.append=function(t){if(el.isElementArray(t)){var r=document.createDocumentFragment();t.each(function(e){void 0===e.el&&(e=n(e)),r.appendChild(e)}),t=r}return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=n(e)),e.append(t.cloneNode(!0)))}),e},e.appendTo=function(t,r){return e.each(function(e){"undefined"!=typeof e&&(void 0===e.el&&(e=n(e)),e.appendTo(t))}),r!==!1&&e.rm(),e},e.purge=function(){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=n(e)),e.purge())}),e},e.text=function(t){return e.each(function(e){"undefined"!=typeof e&&(e.el||(e=n(e)),e.text(t))}),e},e.on=function(e,n){return this.each(function(t){t.addEventListener(e,n)}),this},e)},el.each=function(e){for(var n=this,t=0,r=n.length;r>t;t++)e(n[t],t,n)},el.isArray=function(e){return Array.isArray(e)||e instanceof Array?!0:!1},el.isElementArray=function(e){return(Array.isArray(e)||e instanceof Array)&&el.isElement(e[0])?!0:!1},el.isElement=function(e){var n;try{n=e instanceof HTMLElement}catch(t){n=e&&e.nodeType?!0:!1}return n},el.isCollection=function(e){var n;try{n=e instanceof HTMLCollection}catch(t){n="number"!=typeof e.length||void 0===typeof e.item||0!==e.length&&!isElement(e[0])?!1:!0}return n}}(),!function(e,n){function t(e){var t=n[e];n[e]=function(e){return i(t(e))}}function r(n,t,r){return(r=this).attachEvent("on"+n,function(n){var n=n||e.event;n.preventDefault=n.preventDefault||function(){n.returnValue=!1},n.stopPropagation=n.stopPropagation||function(){n.cancelBubble=!0},t.call(r,n)})}function i(e,n){if(n=e.length)for(;n--;)e[n].addEventListener=r;else e.addEventListener=r;return e}e.addEventListener||(i([n,e]),"Element"in e?e.Element.prototype.addEventListener=r:(n.attachEvent("onreadystatechange",function(){i(n.all)}),t("getElementsByTagName"),t("getElementById"),t("createElement"),i(n.all)))}(window,document),setTimeout(function(){el("#nav").rmClass("hide")},10);