var etc = {

	template: function(_callback){
		var _template = {

			render: function(_props, _domHook){
				var self = this;
				var utils = self.__utils__;

				var _dataInject = {};
				// var _dataInject = ( typeof _props === "undefined" || (_props instanceof Object === false) ) ? {} : _props;
				// _dataInject.state	=	( typeof _props === "undefined" || (_props instanceof Object === false) ) ? {} : _dataInject.state;
				_dataInject.props =	( typeof _props === "undefined" || (_props instanceof Object === false) ) ? {} : _props;
				_dataInject.current = self.current;
				_dataInject.inDom = self.inDom;

				var tempCurrent = utils.build.call(_dataInject);

				// template returns nothing, don't set new current
				if(typeof tempCurrent === "undefined" || tempCurrent === undefined){
					return;
				}

				// if RENDER returns NULL
				if(tempCurrent === null) {

					if(etc.isInDom(utils.current)){

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

				// if RENDER return an element
				else if(etc.isElement(tempCurrent)){
					if( etc.isInDom(utils.current) && utils.current.delayedRemoval.pending!==true ){
						// the currently rendered element is in the DOM
						utils.current.parentNode.replaceChild(tempCurrent, utils.current);
						utils.current = tempCurrent;
					}
					else {
						utils.appendToDom( tempCurrent , (etc.isInDom( _domHook ) ? _domHook : null) );
					}

				}			
				return utils.current;	
			},


			current: function(){
				var self = _template;
				return (
					etc.isInDom(self.__utils__.current) && (self.__utils__.current.delayedRemoval.pending === false)
					? 
					self.__utils__.current
					: 
					null
				);
				
			},

			inDom: function(){
				var self = _template;
				return (
					etc.isInDom(self.__utils__.current) && (self.__utils__.current.delayedRemoval.pending === false)
					?
					true
					:
					false
				);
			},


			// setState: function(stateObject){
			// 	for(var _state in stateObject){
			// 		if(stateObject.hasOwnProperty(_state)){

			// 		}
			// 	}
			// },

			__utils__: {
				current: null,
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



	el: function(_el, _attr, _append){
		var newElm = document.createElement(_el);
		newElm.props = (typeof _attr === "object")?_attr:{};
		newElm.props.nodeType = _el;

		for(var prop in _attr){
			if(_attr.hasOwnProperty(prop)){
				if(prop === "text"){
					newElm.textContent = _attr[prop];
				} 
				else if(prop === "styles" || prop === "style"){
					for(var style in _attr[prop]){
						if(_attr[prop].hasOwnProperty(style)){
							newElm.style[style] = _attr[prop][style];
						}
					}
				}
				else if(prop === "events"){
					for(var evt in _attr[prop]){
						if(_attr[prop].hasOwnProperty(evt)){
							if(evt === "attached"){
								newElm.onAttach = _attr[prop][evt];
							} else {
								newElm.addEventListener(evt, _attr[prop][evt]);
							}
							
						}
					}
				}

				else if(prop === "dataset"){
					for(var data in _attr[prop]){
						if(_attr[prop].hasOwnProperty(data)){
							newElm.dataset[data] = _attr[prop][data];
						}
					}
				}

				else if (prop === "attr"){
					for(var attr in _attr[prop]){
						if(_attr[prop].hasOwnProperty(attr)){
							newElm.setAttribute(attr, _attr[prop][attr]);
						}
					}
				}

				else {
					// console.log("prop",prop);
					// console.log("attr",_attr[prop]);
					newElm[prop] = _attr[prop];
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
			else if(typeof _ELM === "string"){
				this.textContent += _ELM;
				return this;
			}

			var elmsWithAttachListeners = [];
			if(etc.isArray(_ELM)){
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

		return newElm.append(_append);;
	},

	isInDom: function(_element){
		if(!etc.isElement(_element)) return false;
		return ( document.contains(_element) || document.body.contains(_element) ) ? true : false ;
	},
	isElement: function(_obj){
		if(typeof _obj === "undefined" || _obj === null) return false;
		return (_obj instanceof HTMLElement || _obj instanceof Element) ? true : false ;
	},
	isArray: function(_obj){
		return (Array.isArray(_obj) || _obj instanceof Array) ? true : false;
	}

};
