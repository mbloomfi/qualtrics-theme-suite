module.exports = (function(){
	var _elements = {};

	function getElementById(id) {
		dom[id] = addMethods(document.getElementById(id));
		return dom[id];
	}

	function createElement(el) {
		return addMethods(document.createElement(el));
	}

	function removeElement(el) {
		if(el.parentNode) 
			el.parentNode.removeChild(el);
	}

	function addMethods(obj) {
		obj.append = function() {
			for(var i = 0, ii = arguments.length; i < ii; i++){
				self.appendChild(arguments[i]);
			}
			return self;
		}

		obj.addClass = function() {
			for(var i = 0, ii = arguments.length; i < ii; i++){
				this.classList.add(arguments[i]);
			}
			return this;
		}

		obj.setId = function(id) {
			this.id = id;
			if(!dom[id]){
				dom[id] = this;
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

		return obj;
	}

	function parseDomInput(input) {
		// if elemnt already cached, return it
		if(dom[input]) {
			return dom[input];
		}

		return getElementById(input)
	}

	function _dom(input) {
		return parseDomInput(input);
	}

	_dom.get = parseDomInput;
	_dom.create = createElement;
	_dom.remove = removeElement;

	return _dom;
})();
