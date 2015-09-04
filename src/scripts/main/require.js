console.log("*INIT INCLUDES*");
// == Electron Natives ==
var remote = require("remote");
var app = remote.require("app");
var ipc = require("ipc");
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var dialog = remote.require('dialog');
console.log("Loaded: Electron Native Modules");

// == Node Natives ==
var path = require("path");
var https = require('https');
var Eve = Object.create(new (require("events").EventEmitter)());
console.log("Loaded: Node Native Modules");
// == Vendor ==
var fs = require("fs-extra");
var lwip = require("lwip");
var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCss = require('gulp-minify-css');
// var stylus = require("gulp-stylus");
var autoprefixer = require("gulp-autoprefixer");
var shelljs = require("shelljs");
console.log("Loaded: Vendor Modules");

// == Local Modules == 
var loca = require("./local/modules/loca");
var fang = require("./local/modules/fang");
// var etc = require("./local/modules/etc");
console.log("Loaded: Local Modules");

// == Custom ==
var Global = remote.getGlobal("sharedObject"); //see index.js
var appRoot = Global.appRoot;
var template = etc.template;
var menu; // see core.codeMirror.activate()
console.log("Loaded: Custom Electron Global Object");

console.log("*FINISHED INCLUDES*");
console.log("-----------------");