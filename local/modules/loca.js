var fs = require("fs");
var EventEmitter = Object.create(new (require("events").EventEmitter)());

function Loca(filePath, fileEncoding, fileType) {
	var fileInfo = {
		type: fileType || "json",
		encoding: fileEncoding || "utf-8",
		path: filePath
	};

	function parseJson(data) {
		var jsonData;
		try {
			jsonData = JSON.parse(data);
		} catch(e) {
			EventEmitter.emit("error", e);
			return null;
		}
		return jsonData;
	}

	function readFile(callback){
		
	}

	EventEmitter.read = function() {
		fs.readFile(fileInfo.path, fileInfo.encoding, function(err, data){
			if(err) return EventEmitter.emit("error", err);
			var fileContents = data;
			if(fileInfo.type === "json") fileContents = parseJson(data);
			EventEmitter.emit("read", fileContents);
		});
		return this;
	};

	EventEmitter.write = function(newData) {
		if(!newData) return EventEmitter.emit("error");
		var data = newData;
		if(fileInfo.type === "json") {
			if(typeof newData !== "string") {
				var data = JSON.stringify(newData, null, "\t");
			}
		}
		fs.writeFile(fileInfo.path, data, function(err){
			if(err) return EventEmitter.emit("error", err);
				EventEmitter.emit("write", true);
		});
		return this;
	};


	return EventEmitter;


}

module.exports = Loca;
