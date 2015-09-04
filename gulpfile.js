"use strict";

let gulp = require("gulp");
let concat = require("gulp-concat");
let plumber = require("gulp-plumber");
let minifyCss = require('gulp-minify-css');
let stylus = require("gulp-stylus");
let autoprefixer = require("gulp-autoprefixer");
let uglify = require("gulp-uglify");
let eslint = require("gulp-eslint");


function scriptLinter(filesSrc) {
	return gulp.src(filesSrc)
	.pipe(plumber())
	.pipe(eslint({"configFile":".eslintrc"}))
	.pipe(eslint.format())
	.pipe(eslint.failOnError());
}

function scriptUglifier(filesSrc, concatFileName, fileDest) {
	return gulp.src(filesSrc)
	.pipe(plumber())
	.pipe(concat(concatFileName))
	.pipe(gulp.dest(fileDest));
}

function compileStylus(filesSrc, outputFileName, fileDest) {
	return gulp.src(filesSrc)
	.pipe(plumber())
	.pipe(concat("_.styl"))
	.pipe(stylus()).on("error", console.log)
	.pipe(autoprefixer())
	.pipe(minifyCss())
	.pipe(concat(outputFileName))
	.pipe(gulp.dest(fileDest));
}





// MAIN PROCESS
gulp.task("init-main-process", ["main-process-scripts"]);

gulp.task("main-process-scripts", function(){
	let filesSrc = "src/scripts/main-process/*.js";
	let concatFileName = "index.js";
	let fileDest = "./";
	return scriptUglifier(filesSrc, concatFileName, fileDest);
});




//MAIN RENDERER
gulp.task("init-main-renderer", [
	"main-renderer-stylus",
	"main-renderer-scripts"
]);


gulp.task("main-renderer-stylus", function(){
	let filesSrc = [
		"src/styles/global.styl", 
		"src/styles/main-renderer/*.styl", 
		"src/styles/prompt.styl"
	];
	let outputFileName = "main-renderer.css";
	let fileDest = "local/styles";
	return compileStylus(filesSrc, outputFileName, fileDest);
});



gulp.task("main-renderer-scripts", ["main-renderer-lint"], function(){
	let mainRendererScripts = [
		"src/scripts/main-renderer/require.js",
		"src/scripts/main-renderer/QTS.js",
		"src/scripts/main-renderer/app-ready.js",
		"src/scripts/app-core-methods.js",
		"src/scripts/main-renderer/editor.js",
		"src/scripts/main-renderer/*.js"
		];
	let concatFileName = "main-renderer.js";
	let fileDest = "local/scripts";
	return scriptUglifier(mainRendererScripts, concatFileName, fileDest);
});

gulp.task("main-renderer-lint", function(){
	let mainRendererScripts = [
		"src/scripts/main-renderer/require.js",
		"src/scripts/main-renderer/QTS.js",
		"src/scripts/main-renderer/app-ready.js",
		"src/scripts/app-core-methods.js",
		"src/scripts/main-renderer/*.js"
		];
	return scriptLinter(mainRendererScripts);
});






// PREFERENCES RENDERER
gulp.task("init-preferences-renderer", [
	// "preferences-renderer-view",
	"preferences-renderer-stylus",
	"preferences-renderer-scripts"
]);


gulp.task("preferences-renderer-stylus", function(){
	let filesSrc = [
		"src/styles/global.styl", 
		"src/styles/preferences-renderer/*.styl",
		"src/styles/prompt.styl"
	];
	let outputFileName = "preferences-renderer.css";
	let fileDest = "local/styles";
	return compileStylus(filesSrc, outputFileName, fileDest);
});


//JavaScript ==
gulp.task("preferences-renderer-scripts", function(){
	let filesSrc = [
		"src/scripts/preferences-renderer/main.js",
		"src/scripts/preferences-renderer/*.js"
		];
	let concatFileName = "preferences-renderer.js";
	let fileDest = "local/scripts";
	return scriptUglifier(filesSrc, concatFileName, fileDest);
});


// VENDOR
gulp.task("init-vendor", ["vendor-scripts", "vendor-styles"]);

gulp.task("vendor-scripts", function(){
	let filesSrc = [
		"src/scripts/vendor/*.js",
		"src/scripts/vendor/codemirror/codemirror.js",
		"src/scripts/vendor/codemirror/modes/*",
		"src/scripts/vendor/codemirror/**"
		];
	let concatFileName = "vendor.js";
	let fileDest = "local/scripts";
	return scriptUglifier(filesSrc, concatFileName, fileDest);
});

gulp.task("vendor-styles", function(){
	let filesSrc = "src/styles/vendor/*.css";
	let concatFileName = "vendor.css";
	let fileDest = "local/styles";
	return gulp.src(filesSrc)
	.pipe(plumber())
	.pipe(concat(concatFileName))
	.pipe(minifyCss())
	.pipe(gulp.dest(fileDest));
});




// WATCH
gulp.task("watch", function(){
		gulp.watch([
			"src/scripts/main-renderer/*.js",
			"src/scripts/*.js",
			"src/styles/main-renderer/*.styl",
			"src/styles/*.styl",
		], ["init-main-renderer"]);

		gulp.watch([
			"src/scripts/preferences-renderer/*.js",
			"src/scripts/*.js",
			"src/styles/preferences-renderer/*.styl",
			"src/styles/*.styl",
		], ["init-preferences-renderer"]);

		// gulp.watch(["src/main-process/*"], ["main-process"]);

});





gulp.task("default", [
	"init-main-process", 
	"init-main-renderer", 
	"init-preferences-renderer", 
	"init-vendor", 
	"watch"
]);

