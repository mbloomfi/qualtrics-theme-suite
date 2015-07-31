var etc = {

	template: function(_callback){
		var _template = {

			render: function(_obj, _domHook){
				var self = this;
				var utils = self.__utils__;

				var _object 	= ( typeof _obj === "undefined" || (_obj instanceof Object === false) ) ? {} : _obj;
				_object.state	=	( typeof _obj === "undefined" || (_obj instanceof Object === false) ) ? {} : _object.state;
				_object.props =	( typeof _obj === "undefined" || (_obj instanceof Object === false) ) ? {} : _object.props;
				_object.current = self.current;
				_object.inDom = self.inDom;

				var tempCurrent = utils.build.call(_object);

				// template returns nothing, don't set new current
				if(typeof tempCurrent === "undefined" || tempCurrent === undefined){
					return;
				}

				if(tempCurrent === null) {

					if(etc.__utils__.isInDom(utils.current)){

						if(typeof utils.current.delayedRemoval.callback === "function" && typeof utils.current.delayedRemoval.time === "number"){
							// console.log(" *Delaying Removal for ", utils.current);
							var elementPendingRemoval = utils.current;

							setTimeout(function(){
								elementPendingRemoval.rm();
							}, elementPendingRemoval.delayedRemoval.time);

							elementPendingRemoval.delayedRemoval.pending = true;
							elementPendingRemoval.delayedRemoval.callback.call(elementPendingRemoval);

						} 
						else {
							utils.current.rm();
						}

						
					}
				}

				else if(etc.__utils__.isElement(tempCurrent)){ 
					console.log("tempCurrent",tempCurrent);
					if( etc.__utils__.isInDom(utils.current) && utils.current.delayedRemoval.pending!==true ){
						// the currently rendered element is in the DOM
						utils.current.parentNode.replaceChild(tempCurrent, utils.current);
						utils.current = tempCurrent;
					}
					else {
						utils.appendToDom( tempCurrent , (etc.__utils__.isInDom( _domHook ) ? _domHook : null) );
					}

				}			
				return utils.current;	
			},


			current: function(){
				var self = _template;
				return (
					etc.__utils__.isInDom(self.__utils__.current) && (self.__utils__.current.delayedRemoval.pending === false)
					? 
					self.__utils__.current
					: 
					null
				);
				
			},

			inDom: function(){
				var self = _template;
				return (
					etc.__utils__.isInDom(self.__utils__.current) && (self.__utils__.current.delayedRemoval.pending === false)
					?
					true
					:
					false
				);
			},


			__utils__: {
				current: null,
				// temp: {},
				// prev: null,
				build: _callback,

				appendToDom: function( _newCurrent, _domHook){

					var self = this;
					self.current = _newCurrent;

					if(_domHook !== null) {

						_domHook.appendChild(self.current);
						
						if(typeof self.current.onAttach === "function"){
							setTimeout(function(){
								self.current.onAttach();
							}, 0);
						}
						
					}

					return self.current;

						
				}

			},

			getCurrent: function(){
				return this.__utils__.current;
			}

		}

		return _template;
	},



	el: function(_el, _props){
		var newElm = document.createElement(_el);
		newElm.props = (typeof _props === "object")?_props:{};
		newElm.props.nodeType = _el;

		for(var prop in _props){
			if(_props.hasOwnProperty(prop)){
				if(prop === "text"){
					newElm.textContent = _props[prop];
				} 
				else if(prop === "styles" || prop === "style"){
					for(var style in _props[prop]){
						if(_props[prop].hasOwnProperty(style)){
							newElm.style[style] = _props[prop][style];
						}
					}
				}
				else if(prop === "events"){
					for(var evt in _props[prop]){
						if(_props[prop].hasOwnProperty(evt)){
							if(evt === "attached"){
								newElm.onAttach = _props[prop][evt];
							} else {
								newElm.addEventListener(evt, _props[prop][evt]);
							}
							
						}
					}
				}

				else if(prop === "dataset"){
					for(var data in _props[prop]){
						if(_props[prop].hasOwnProperty(data)){
							newElm.dataset[data] = _props[prop][data];
						}
					}
				}

				else if (prop === "attr"){
					for(var attr in _props[prop]){
						if(_props[prop].hasOwnProperty(attr)){
							newElm.setAttribute(attr, _props[prop][attr]);
						}
					}
				}

				else {
					newElm[prop] = _props[prop];
				}
			}
		}

		newElm.rm = function(){
			var self = this;
			// console.log(" ");
			// console.log(" Removing ", self);

			if(self.parentNode) {
				self.parentNode.removeChild(self);
			}

			self = null;

		}

		newElm.append = function(_ELM){
			if(typeof _ELM === "undefined" || _ELM === null) return this;

			var elmsWithAttachListeners = [];
			if(etc.__utils__.isArray(_ELM)){
				var fragment = document.createDocumentFragment();
				for(var i = 0, ii = _ELM.length; i < ii ; i++){

					if(typeof _ELM[i].onAttach === "function"){
						elmsWithAttachListeners.push(_ELM[i]);
					}

					fragment.appendChild(_ELM[i]);
				}
				_ELM = fragment;
			}
			else if(typeof _ELM.onAttach === "function"){
					elmsWithAttachListeners.push(_ELM);
			}

			this.appendChild(_ELM);


			if(elmsWithAttachListeners.length > 0){
				setTimeout(function(){
					for(var i = 0, ii = elmsWithAttachListeners.length; i < ii; i++){
						elmsWithAttachListeners[i].onAttach();
					}
				}, 0);
			}

			return this;
		};

		newElm.delayedRemoval = {
			callback: null,
			time: null
		};

		newElm.delayedRemoval.callback = undefined;
		newElm.delayedRemoval.time = undefined;
		newElm.delayedRemoval.pending = false;

		newElm.delayRemoval = function(_callback, _time){
			this.delayedRemoval.callback = _callback;
			this.delayedRemoval.time = _time;
			this.delayedRemoval.pending = false;
			return this;
		}

		return newElm;
	},


	__utils__: {

		isInDom: function(_element){
			if(!this.isElement(_element)) return false;
			return ( document.contains(_element) || document.body.contains(_element) ) ? true : false ;
		},
		isElement: function(_obj){
			if(typeof _obj === "undefined" || _obj === null) return false;
			return (_obj instanceof HTMLElement || _obj instanceof Element) ? true : false ;
		},
		isArray: function(_obj){
			return (Array.isArray(_obj) || _obj instanceof Array) ? true : false;
		}
	}

};