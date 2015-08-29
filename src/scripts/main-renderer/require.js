'use strict';
// == Electron Natives ==
let remote = require('remote');
let app = remote.require('app');
let ipc = require('ipc');
let Menu = remote.require('menu');
let MenuItem = remote.require('menu-item');
let dialog = remote.require('dialog');

// == Node Natives ==
let path = require('path');
let https = require('https');
let Eve = Object.create(new (require('events').EventEmitter)());
let util = require('util')

// == Vendor ==
let fs = require('fs-extra');
let lwip = require('lwip');
let gulp = require('gulp');
let sass = require('gulp-sass');
let minifyCss = require('gulp-minify-css');
// let stylus = require('gulp-stylus');
let autoprefixer = require('gulp-autoprefixer');
let shelljs = require('shelljs');

// == Local Modules == 
let loca = require('./local/scripts/modules/loca');
let fang = require('./local/scripts/modules/fang');
let dom = require('./local/scripts/modules/dom');

// == Custom ==
let Global = remote.getGlobal('sharedObject'); //see index.js
let appRoot = Global.appRoot;
let template = etc.template;
let menu; // see core.codeMirror.activate()
