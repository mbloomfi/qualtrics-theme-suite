// // Eve.js by Sam Eaton (samueleaton)
// // Source Code
// // MIT License

// var Eve = (function() {
// 	var _events = {};

// 	var _eventInfo = {};
	
// 	var eventObserver = {
// 		add: function(evtName, fn) {
// 			var eventObject = {
// 				fn: fn
// 			};
// 			_events[evtName] = _events[evtName] || [];
// 			_events[evtName].push(eventObject);

// 			return {
// 				evt: evtName,
// 				fn: fn,
// 				ignore: function() {
// 					return Eve.ignore(this.evt);
// 				},
// 				remove: function() {
// 					return Eve.remove(this.evt, this.fn);
// 				},
// 				removeAll: function() {
// 					return Eve.removeAll(this.evt);
// 				},
// 				defer: function() {
// 					return Eve.defer(this.evt);
// 				},
// 				observe: function() {
// 					Eve.observe(this.evt);
// 				}
// 			};
// 		},

// 		remove: function(evtName, fn) {
// 			if (_events[evtName]) {
// 				for (var i = 0; i < _events[evtName].length; i++) {
// 					if (_events[evtName][i].fn === fn || _events[evtName][i].fn.toString() === fn.toString()) {
// 						_events[evtName].splice(i, 1);
// 						break;
// 					}
// 				}
// 			}
// 		},

// 		removeAll: function(evtName) {
// 			delete _events[evtName];
// 			_eventInfo[evtName] = _eventInfo[evtName] || {};
// 			delete _eventInfo[evtName];
// 		}
// 	};


// 	var eventEmitter = {
// 		count: function(evtName) {
// 			return (_eventInfo[evtName] && _eventInfo[evtName].emitCount) || 0;
// 		},

// 		checkInactive: function(evtName) {
// 			if (!_eventInfo[evtName]) return;

// 			if (_eventInfo[evtName].ignore) {
// 				delete _eventInfo[evtName].ignore;
// 			}
// 			if (_eventInfo[evtName].defer) {
// 				delete _eventInfo[evtName].defer;
// 				Eve.emit(evtName);
// 			}
// 		},

// 		checkTriggers: function(evtName) {
// 			if (!_eventInfo[evtName]) return;

// 			function ifIsTrigger(triggerObj) {
// 				while (triggerObj.length) {
// 					var emitter = triggerObj.shift();
// 					eventEmitter.checkInactive(emitter);
// 				}
// 				triggerObj = null;
// 			}

// 			if (_eventInfo[evtName].ignoreTrigger) {
// 				ifIsTrigger(_eventInfo[evtName].ignoreTrigger);
// 			}
// 			if (_eventInfo[evtName].deferTrigger) {
// 				ifIsTrigger(_eventInfo[evtName].deferTrigger);
// 			}
// 		},

// 		emit: function() {
// 			var args = [];
// 			for (var i = 0, ii = arguments.length; i < ii; i++) {
// 				args[i] = arguments[i];
// 			}
// 			var evtName = args.shift();
			
// 			_eventInfo[evtName] = _eventInfo[evtName] || {};
// 			if (_eventInfo[evtName].ignore || _eventInfo[evtName].defer) return;

// 			_eventInfo[evtName].emitCount = _eventInfo[evtName].emitCount || 0;
// 			_eventInfo[evtName].emitCount++;

// 			function regularEmitter() {
// 				if (_events[evtName]) {
// 					for (var j = 0, jj = _events[evtName].length; j < jj; j++) {
// 						_events[evtName][j].fn.apply(null, args);
// 					}
// 				}
// 			}

// 			if (_events[evtName]) regularEmitter();
// 			eventEmitter.checkTriggers(evtName);
// 		},



// 		ignore: function(evtName) {
// 			_eventInfo[evtName] = _eventInfo[evtName] || {};
// 			_eventInfo[evtName].ignore = true;
// 			// _eventInfo[evtName].ignore = true;
// 			var _evtName = evtName;

// 			return {
// 				getEvt: function() {
// 					return _evtName;
// 				},
// 				until: function(triggerName) {
// 					_eventInfo[triggerName] = _eventInfo[triggerName] || {};
// 					_eventInfo[triggerName].ignoreTrigger = _eventInfo[triggerName].ignoreTrigger || [];
// 					_eventInfo[triggerName].ignoreTrigger.push(this.getEvt());
// 				}
// 			};
// 		},



// 		defer: function(evtName) {
// 			_eventInfo[evtName] = _eventInfo[evtName] || {};
// 			_eventInfo[evtName].defer = true;
// 			var _evtName = evtName;

// 			return {
// 				getEvt: function() {
// 					return _evtName;
// 				},
// 				until: function(triggerName) {
// 					_eventInfo[triggerName] = _eventInfo[triggerName] || {};
// 					_eventInfo[triggerName].deferTrigger = _eventInfo[triggerName].deferTrigger || [];
// 					_eventInfo[triggerName].deferTrigger.push(this.getEvt());
// 				}
// 			};
// 		},


// 		/*
// 		Removes an event from _inactive.ignoredEvents and _inactive.deferredEvents
// 		*/
// 		observe: function(evtName) {
// 			_eventInfo[evtName] = _eventInfo[evtName] || {};
// 			delete _eventInfo[evtName].ignore;
// 			delete _eventInfo[evtName].defer;
// 		}



// 	};

// 	return {
// 		on: eventObserver.add,
// 		remove: eventObserver.remove,
// 		removeAll: eventObserver.removeAll,
// 		emit: eventEmitter.emit,
// 		emitCount: eventEmitter.count,
// 		ignore: eventEmitter.ignore,
// 		observe: eventEmitter.observe,
// 		defer: eventEmitter.defer
// 	};
// })();
