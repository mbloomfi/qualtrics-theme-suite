var fs = require("fs");



process.on('uncaughtException', function(err) {
	console.error("ERROR:", err)
    // handle the error safely
    fs.appendFile(__dirname+"/local/errorlog.txt", "~~~~~~~~~~~~~~~~~~~~~~~~\n"+(new Date)+"\n\t"+err+"\n\n", function(){});
})

var app = require("app");
var BrowserWindow = require("browser-window");
var gulp = require("gulp");
var Menu = require("menu");
var ipc = require("ipc");
var shelljs = require('shelljs');
var path = require('path');


