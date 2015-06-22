var gulp = require("gulp");
var concat = require("gulp-concat");
var plumber = require("gulp-plumber");
var include = require("gulp-include");
var minifyHtml = require("gulp-minify-html");
var rename = require("gulp-rename");
var minifyCss = require('gulp-minify-css');
var stylus = require("gulp-stylus");
var autoprefixer = require("gulp-autoprefixer");
var uglify = require("gulp-uglify");

// Files named with an underscore are the result of an compiled stylus or javascript. 
// They are included into the final html view.

//HTML ==
gulp.task("view", ["styles", "scripts"], function(){
	return gulp.src("src/view/index.html")
	.pipe(plumber())
	.pipe(include())
	.pipe(gulp.dest("./"));
});

//CSS ==
gulp.task("styles", function(){
	return gulp.src("src/styles/*.styl")
	.pipe(plumber())
	.pipe(concat("_.stly"))
	.pipe(stylus())
	.pipe(autoprefixer())
	.pipe(minifyCss())
	.pipe(gulp.dest("src/styles/"));
});

//JavaScript ==
gulp.task("scripts", function(){
	return gulp.src([
		//include
		"src/scripts/libs/*.js", 
		"src/scripts/*.js", 
		"src/scripts/globalObjects/*.js", 
		//exclude
		"!src/scripts/_.js"])
	.pipe(plumber())
	.pipe(concat("_.js"))
	.pipe(uglify())
	.pipe(gulp.dest("src/scripts/"));
});

//Watch ==
gulp.task("watch", function(){
	gulp.watch(["src/**", "!src/styles/_.css", "!src/scripts/_.js"], ["view"]);
});

//Default ==
gulp.task("default", ["view", "watch"])