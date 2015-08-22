// Eve.js by Sam Eaton (samueleaton)
// Source Code
// MIT License

var Eve = (function() {
	var _events = {};

	var _inactive = {
		ignoredEvents: {},
		deferredEvents: {}
	};

	var _triggers = {
		ignoreEvent: {},
		deferEvent: {}
	};
	
	var eventObserver = {
		add: function(evtName, fn) {
			var eventObject = {
				fn: fn
			};
			_events[evtName] = _events[evtName] || [];
			_events[evtName].push(eventObject);
		},

		remove: function(evtName, fn) {
			if (_events[evtName]) {
				for (var i = 0; i < _events[evtName].length; i++) {
					if (_events[evtName][i].fn === fn || _events[evtName][i].fn.toString() === fn.toString()) {
						_events[evtName].splice(i, 1);
						break;
					}
				}
			}
		},

		removeAll: function(evtName) {
			delete _events[evtName];
			delete _inactive.ignoredEvents[evtName];
		}
	};


	var eventEmitter = {

		checkTriggers: function(evtName, triggerObj, inactiveEvt, isDeferred) {
			if (triggerObj[evtName] && triggerObj[evtName].length) {
				while (triggerObj[evtName].length) {
					var emitter = triggerObj[evtName].shift();
					if (inactiveEvt[emitter]) {
						delete inactiveEvt[emitter];
						if (isDeferred) Eve.emit(emitter);
					}
				}
				delete triggerObj[evtName];
			}
		},

		emit: function() {
			var args = [];
			for (var i = 0, ii = arguments.length; i < ii; i++) {
				args[i] = arguments[i];
			}
			var evtName = args.shift();
			
			if (_inactive.ignoredEvents[evtName] || _inactive.deferredEvents[evtName]) return;

			function regularEmitter() {
				if (_events[evtName]) {
					for (var j = 0, jj = _events[evtName].length; j < jj; j++) {
						_events[evtName][j].fn.apply(null, args);
					}
				}
			}

			if (_events[evtName]) regularEmitter();
			eventEmitter.checkTriggers(evtName, _triggers.deferEvent, _inactive.deferredEvents, true);
			eventEmitter.checkTriggers(evtName, _triggers.ignoreEvent, _inactive.ignoredEvents, false);
		},



		ignore: function(evtName) {
			_inactive.ignoredEvents[evtName] = true;
			var _evtName = evtName;

			return {
				getEvt: function() {
					return _evtName;
				},
				until: function(ignoreUntil) {
					_triggers.ignoreEvent[ignoreUntil] = _triggers.ignoreEvent[ignoreUntil] ? _triggers.ignoreEvent[ignoreUntil] : [] ;
					_triggers.ignoreEvent[ignoreUntil].push(this.getEvt());
				}
			};
		},



		defer: function(evtName) {
			_inactive.deferredEvents[evtName] = true;
			var _evtName = evtName;

			return {
				getEvt: function() {
					return _evtName;
				},
				until: function(deferUntil) {
					_triggers.deferEvent[deferUntil] = _triggers.deferEvent[deferUntil] ? _triggers.deferEvent[deferUntil] : [] ;
					_triggers.deferEvent[deferUntil].push(this.getEvt());
				}
			};
		},


		/*
		Removes an event from _inactive.ignoredEvents and _inactive.deferredEvents
		*/
		observe: function(evtName) {
			delete _inactive.ignoredEvents[evtName];
			delete _inactive.deferredEvents[evtName];
		}
	};

	return {
		on: eventObserver.add,
		remove: eventObserver.remove,
		removeAll: eventObserver.removeAll,
		emit: eventEmitter.emit,
		ignore: eventEmitter.ignore,
		observe: eventEmitter.observe,
		defer: eventEmitter.defer
	};
})();
