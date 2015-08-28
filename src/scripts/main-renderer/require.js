// == Electron Natives ==
var remote = require("remote");
var app = remote.require("app");
var ipc = require("ipc");
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var dialog = remote.require('dialog');

// == Node Natives ==
var path = require("path");
var https = require('https');
var Eve = Object.create(new (require('events').EventEmitter)());

// == Vendor ==
var fs = require("fs-extra");
var lwip = require("lwip");
var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCss = require('gulp-minify-css');
// var stylus = require("gulp-stylus");
var autoprefixer = require("gulp-autoprefixer");
var shelljs = require("shelljs");

// == Local Modules == 
var loca = require("./local/scripts/modules/loca");
var fang = require("./local/scripts/modules/fang");

// == Custom ==
var Global = remote.getGlobal("sharedObject"); //see index.js
var appRoot = Global.appRoot;
var template = etc.template;
var menu; // see core.codeMirror.activate()
