"use strict";

const fs = require("fs");
const EventEmitter = require("events").EventEmitter;

module.exports = (function(){
	const _fileInfo = {
		type: "json",
		encoding: "utf-8",
		path: null
	};

	function _setFileInfo(filePath, fileEncoding, fileType) {
		const fileInfo = Object.create(_fileInfo);
		fileInfo.path = filePath;
		fileInfo.type = fileType || fileInfo.type;
		fileInfo.encoding = fileEncoding || fileInfo.encoding;
		return fileInfo;
	}

	function _parseJson(data) {
		let jsonData;
		try {
			jsonData = JSON.parse(data);
		} catch(e) {
			_EventEmitter.emit("error", e);
			return null;
		}
		return jsonData;
	}

	function Loca(filePath, fileEncoding, fileType) {
		if(!filePath) return null;

		const _EventEmitter = new EventEmitter();
		const fileInfo = _setFileInfo(filePath, fileEncoding, fileType);

		_EventEmitter.read = function() {
			fs.readFile(fileInfo.path, fileInfo.encoding, function(err, data){
				if(err) return _EventEmitter.emit("error", err);
				let fileContents = data;
				if(fileInfo.type === "json") fileContents = _parseJson(data);
				_EventEmitter.emit("read", fileContents);
			});
			return this;
		};

		_EventEmitter.write = function(newData) {
			if(!newData) return _EventEmitter.emit("error");
			let data = newData;
			if(fileInfo.type === "json") {
				if(typeof newData !== "string") {
					data = JSON.stringify(newData, null, "\t");
				}
			}
			fs.writeFile(fileInfo.path, data, function(err){
				if(err) return _EventEmitter.emit("error", err);
					_EventEmitter.emit("write", true);
			});
			return this;
		};

		return _EventEmitter;
	}

	return Loca;
})();
