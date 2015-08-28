/*!
<el> by samueleaton
*/
(function(){

/*
INIT
*/
el = function(_string, _num){
	var self = (this === window)? window.el : this;
	function getElement(_string){
		var firstChar = _string.charAt(0);
		switch (firstChar){
			case "#": 
				return self.getById(_string.slice(1));

			case "+":
				if(_string.slice(1).match(/#/)){ 
					var elmArr = _string.slice(1).split("#");
					var node = self.create(elmArr[0],_num);
					if(el.isElementArray(node)){
						node.each(function(elm){
							elm.setAttribute("id", elmArr[1]);
						})
					} else {
						node.setAttribute("id",elmArr[1])
					}
					return node;
				}
				return self.create(_string.slice(1),_num); // single

			case ".":
				return self.getByClassName(_string.slice(1));

			default:
				return self.getByTagName(_string);
		}
	}

	if(typeof _string === "string"){
		return getElement(_string);
	}
	else if( el.isElement(_string) ){
		return el.elify(_string);
	}
	else if(el.isCollection(_string) || el.isNodeList(_string) || el.isElementArray(_string)) {
		return el.elify(_string)
	}

}

/*
CORE
*/
el.create = function(_string, _num){
	if(_num && typeof _num === "number"){
		var elements = [];
		for(var i = 0, ii = _num; i < ii; i++){
			elements.push(el.elify(document.createElement(_string), _string));
		}
			return elements;
	}
	return el.elify(document.createElement(_string), _string);
}

el.getById = function(_string){
	if(this===window.el){
		return el.elify(document.getElementById(_string), _string);
	} else if(el.isElement(this)){

		if(document.contains(this)) return el.elify(document.getElementById(_string), _string);
		
		else { // element is in memory, NOT in the DOM
			var self = this;
			var found = false;
			var elm = null;
			self.el("*").each(function(element){
				if(element.getAttribute("id")===_string) {
					found = true;
					elm = element;
					return 0;
				}
			});
			return elm;
		}
	}
}

el.getByClassName = function(_string, _num){
	var self = (this === window.el) ? document : this;
	var elements = self.getElementsByClassName(_string);
	elements = Array.prototype.slice.call(elements);
	return el.elify(elements, _string);
}

el.getByTagName = function(_string, _num){
	var self = (this === window.el) ? document : this;
	var elements = self.getElementsByTagName(_string);
	elements = Array.prototype.slice.call(elements);
	return el.elify(elements, _string);
}

el.on = function(_evt, _handler){
	var self = (el.isElement(this)||el.isElementArray(this)) ? this : window;
	self.addEventListener(_evt,_handler);
	return this;
}

el.join = function(_arr){
	var tempArray = [];
	if(el.isArray(_arr)){
		for(var i = 0, ii = _arr.length; i<ii; i++){
			if( el.isElement(_arr[i]) ){ 
				tempArray.push(_arr[i])
			} else if( el.isElementArray(_arr[i]) ){
				_arr[i].each(function(_element){
					tempArray.push(_element);
				});
			}
		}
	}
	return el.elify(tempArray);
}

el.template = function(_callback, _appendTo){

	var _template = {
		current: null,
		temp: null,
		appendTo: (_appendTo!==undefined) ? _appendTo : document.body ,
		build: function(){
			return _callback();
		},
		update: function(){
			var self = this;
			self.temp = self.build();
			if(self.temp === null){
				if(el.isInDom(self.current)){
					self.current.rm();
				}
				self.current = self.temp;
			}
			else if(el.isInDom(self.current)){
				self.current.parentNode.replaceChild(self.temp, self.current);
				self.current = self.temp;
			} 
			else {
				self.init();
			}
		},
		init: function(){
			var self = this;
			// var inertionAction = (_config["appendTo"]!==undefined) ? _config["appendTo"] : document.body ;
			self.current = self.temp = self.build();
			if(self.current !== null && self.current !== undefined){
				if(typeof self.appendTo === "function"){
					self.current.appendTo(self.appendTo());
				}
				else {
					self.current.appendTo(self.appendTo);
				}
				return self.current;
			}
		}
	};
	return _template;
},

el.elify = function(_obj, _originalString){
	function addMethods(_ELEMENT){
	//CORE METHODS
		_ELEMENT.el = el;
		_ELEMENT.getById = el.getById;
		_ELEMENT.getByClassName = el.getByClassName;
		_ELEMENT.getByTagName = el.getByTagName;
		_ELEMENT.getByAttribute = el.getByAttribute;
		_ELEMENT.elify = el.elify;
		_ELEMENT.on = el.on;

	//SPECIAL METHODS
		_ELEMENT.addClass = function(_str){
			var self = this;
			
			function appendClass(_string){
				if( (' '+self.className+' ').indexOf(' '+_string+' ') === -1 ){
					if(self.className.length > 0){
						self.className = self.className + " " + _string;
					} else {
						self.className = _string;
					}
				}
			}

			if(el.isArray(_str))
				for(var i = 0, ii = _str.length; i<ii; i++) appendClass(_str[i]);
			else
				appendClass(_str);

			return self;
		};

		_ELEMENT.rmClass = function(_str){
			if( (' '+this.className+' ').indexOf(' '+_str+' ') !== -1 ){
				if(this.className.indexOf(" ") === -1){
					this.className = "";
					return this;
				}
				var newClassName = "";
				var classes = this.className.split(" ");
				for(var i = 0; i < classes.length; i++) {
					if(classes[i] !== _str) {
						newClassName += classes[i] + " ";
					}
				}
				// remove trailing space
				if(newClassName.substr(newClassName.length - 1) === " "){
					newClassName = newClassName.slice(0, -1);
				}
				this.className = newClassName;
			}
			return this;
		};

		_ELEMENT.hasClass = function(_str){
			var classes = this.className.split(" ");
			for(var i = 0; i < classes.length; i++) {
				if(classes[i] === _str) {
					return true;
				}
			}
			return false;
		};

		_ELEMENT.rm = function(){
			var self = this;
			if(self.parentNode) 
				self.parentNode.removeChild(self);
			return self;
		};

		_ELEMENT.append = function(_el){
			if(el.isElementArray(_el)){
				var fragment = document.createDocumentFragment();
				_el.each(function(single){
					if(!single.el) single = addMethods(single);
					fragment.appendChild(single);
				});
				_el = fragment;
			}
			this.appendChild(_el);
			return this;
		};

		_ELEMENT.appendTo = function(_el){
			var self = this;
			if(el.isElementArray(_el)){
				_el.each(function(eachEl){
					var newNode = self.cloneNode(true);
					eachEl.appendChild(newNode);
				})
			} else {
				_el.appendChild(self);
			}
			return self;
		};

		_ELEMENT.purge = function(){
			var self = this;
			while (self.firstChild)
				self.removeChild(self.firstChild);
			return self;
		};
		
		Object.defineProperty(_ELEMENT, "text", {
				configurable: true, 
				enumerable: true, 
				writable: true, 
				value: function(_string){
					if(typeof _string === "string")
						_ELEMENT.appendChild(document.createTextNode(_string));
					return _ELEMENT;
				}
			}
		);

		_ELEMENT.attr = function(_string, _value){
			if(typeof _string === "string")
				this.setAttribute( _string, (_value!==undefined)?_value:"" );
			return this;
		};


		return _ELEMENT;
	}
	
	//SINGLE ELEMENT

	if(el.isElement(_obj)){  
		return addMethods(_obj);	
	}

	//COLLECTION OR ARRAY
	if(el.isCollection(_obj) || el.isNodeList(_obj)) 
		_obj = Array.prototype.slice.call(_obj);
	
	if(_obj === null || _obj === undefined)
		return console.error("'"+_originalString+"' element(s) not found");

	_obj.each = function(_callback){
		for(var t=this,e=0,n=t.length;n>e;e++) {
			if(_callback(t[e],e,t) === 0) return (this===window.el) ? undefined : this;
		}
		return (this===window.el) ? undefined : this;
	};

	_obj.each(function(elm){ 
		addMethods(elm);
	});

	_obj.addClass = function(_class){
		_obj.each(function(_item){
					if(typeof _item !== "undefined"){
						if(!_item.el) _item = addMethods(_item);
						_item.addClass(_class);
					}
		})
		return _obj;
	};

	_obj.rmClass = function(_class){
		_obj.each(function(_item){
					if(typeof _item !== "undefined"){
						if(!_item.el) _item = addMethods(_item);
						_item.rmClass(_class);
					}
		})
		return _obj;
	};

	_obj.hasClass = function(_class, _which){
		if(_which === "all" || typeof _which === "undefined"){
			var allHaveClass = true;
			_obj.each(function(_item){
				if(typeof _item !== "undefined"){	
					if(_item.el === undefined) _item = addMethods(_item);
					// if ANY trigger the if statement then not ALL have the class
					if (!_item.hasClass(_class)) allHaveClass = false;
				}
			});
			return allHaveClass;
		} else if(_which === "any"){
			_obj.each(function(_item){
				if(typeof _item !== "undefined"){
					if(!_item.el) _item = addMethods(_item);
					// if ANY trigger the if statement then one has the class
					if (_item.hasClass(_class)) return true;
				}	
			});
			// none triggered the if statement
			return false; 
		}
		return _obj;
	};

	_obj.rm = function(_class){
		this.each(function(_item){
			if(typeof _item !== "undefined"){
				if(!_item.el) _item = addMethods(_item);
				_item.rm();
			}	
		})
		return _obj;
	};

	_obj.append = function(_el){
		// if incoming is array, put into fragment
		if(el.isElementArray(_el)){
			var fragment = document.createDocumentFragment();
			_el.each(function(single){
				if(single.el === undefined) single = addMethods(single);
				fragment.appendChild(single);
			});
			_el = fragment;
		}
		_obj.each(function(_item){
			if(typeof _item !== "undefined"){
				if(!_item.el) _item = addMethods(_item);
				_item.append(_el.cloneNode(true));
			}	
		})

		return _obj;
	};

	_obj.appendTo = function(_el, _copy){
		_obj.each(function(_item){
			if(typeof _item !== "undefined"){
				if(_item.el === undefined) _item = addMethods(_item);
				_item.appendTo(_el);
			}	
		})
		if(_copy !== false) _obj.rm();
		return _obj;
	};

	_obj.purge = function(){
		_obj.each(function(_item){
			if(typeof _item !== "undefined"){
				if(!_item.el) _item = addMethods(_item);
				_item.purge();
			}
		})
		return _obj;
	};
	
	_obj.text = function(_string){
		_obj.each(function(_item){
			if(typeof _item !== "undefined"){
				if(!_item.el) _item = addMethods(_item);
				_item.text(_string);
			}
		})
		return _obj;
	};

	_obj.attr = function(_string, _value){
		_obj.each(function(_item){
			if(typeof _item !== "undefined"){
				if(!_item.el) _item = addMethods(_item);
				_item.attr(_string, _value);
			}
		})
		return _obj;
	};


	_obj.on = function(_evt, _handler){
		this.each(function(_element){
			_element.addEventListener(_evt,_handler);
		});
		return this;
	}

	return _obj;
}

/*
UTILS
*/
el.isArray = function(_obj){
	if(Array.isArray(_obj) || _obj instanceof Array) return true;
	return false;
};

el.isElementArray = function(_obj){
	if( 
			(Array.isArray(_obj) || _obj instanceof Array) 
			&& el.isElement(_obj[0])
		) return true;
	else return false;
};

el.isElement = function(_obj){
	var _isElement;
	try{
		_isElement = (_obj instanceof HTMLElement || _obj instanceof Element);
	}catch(e){
		_isElement = (_obj && _obj.nodeType) ? true : false ;
	}
	return _isElement;
};

el.isCollection = function (_obj){
	return _obj instanceof HTMLCollection;
};

el.isNodeList = function (_obj){
	return _obj instanceof NodeList;
};

el.isInDom = function(_element){
	return (document.contains(_element)) ? true : false ;
}

})();
