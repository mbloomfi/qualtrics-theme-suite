module.exports = (function(){
	var util = require("util");
	var _cache = {};
	function getElementById(id) {
		var element = document.getElementById(id);
		if(!element) return console.error("could not find element with id:",id);
		_cache[id] = addMethods(element);
		return _cache[id];
	}

	function getElementsByClassName(parent, className) {
		var elements = parent.getElementsByClassName(className);
		elements.each = function(toEach){
			var self = this;
			for(var i = 0, ii = self.length; i < ii; i++) {
				toEach(self[i]);
			}
		};
		return elements;
	}

	function createElement(el) {
		return addMethods(document.createElement(el));
	}

	function removeElement(el) {
		var element = el;
		if(util.isString(el)){
			element = dom(el);
		}
		if(element.parentNode) {
			element.parentNode.removeChild(element);
		}
		if(_cache[element.id]){
			// console.log("remove from cache:",element.id);
			delete _cache[element.id];
		}
	}

	function addMethods(obj) {
		obj.append = function() {
			for(var i = 0, ii = arguments.length; i < ii; i++){
				this.appendChild(arguments[i]);
			}
			return this;
		}

		obj.addClass = function() {
			for(var i = 0, ii = arguments.length; i < ii; i++){
				this.classList.add(arguments[i]);
			}
			return this;
		}

		obj.removeClass = function() {
			for(var i = 0, ii = arguments.length; i < ii; i++){
				this.classList.remove(arguments[i]);
			}
			return this;
		}

		obj.setId = function(id) {
			this.id = id;
			if(!_cache[id]){
				// console.log("add to cache:",id);
				_cache[id] = this;
			};
			return this;
		}

		obj.text = function(text) {
			this.textContent = text;
			return this;
		}

		obj.purge = function(text) {
			while (this.firstChild)
				this.removeChild(this.firstChild);
			return this;
		}

		obj.attr = function(key, val) {
			this.setAttribute(key, val);
			return this;
		}

		obj.queryByClass = function(className) {
			console.log("this",this)
			return getElementsByClassName(this, className);
		}

		return obj;
	}

	function parseDomInput(input) {
		// if elemnt already cached, return it
		if(_cache[input]) {
			// console.log("from cache:",input);
			return _cache[input];
		}
		return getElementById(input)
	}

	function _dom(input) {
		return parseDomInput(input);
	}

	_dom.get = parseDomInput;
	_dom.queryByClass = function(className){
		return getElementsByClassName(document.body, className);
	};
	_dom.create = createElement;
	_dom.remove = removeElement;

	return _dom;
})();
