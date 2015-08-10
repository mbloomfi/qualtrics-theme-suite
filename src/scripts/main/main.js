// == Electron Natives ==
var remote = require("remote");
var app = remote.require("app");
var ipc = require("ipc");
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

// == Node Natives ==
var path = require("path");
var https = require('https');

// == Vendor ==
var fs = require("fs-extra");
var lwip = require("lwip");
var gulp = require("gulp");
var sass = require("gulp-sass");
var minifyCss = require('gulp-minify-css');
// var stylus = require("gulp-stylus");
var autoprefixer = require("gulp-autoprefixer");
var shelljs = require("shelljs");

// == Custom ==
var Global = remote.getGlobal("sharedObject"); //see index.js
var appRoot = Global.appRoot;
var template = etc.template;
var menu; // see core.codeMirror.activate()




//= include ../app-core-methods.js
//= include ./local-files-interface.js
//= include ./modes/edit-preview/edit-preview.js
//= include ./codemirror-init.js
//= include ./editor.js
//= include ./brand-search.js
//= include ./Quitter.js
//= include ./Saver.js
//= include ./Prompter.js
//= include ./app-ready.js


