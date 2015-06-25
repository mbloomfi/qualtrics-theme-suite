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
var replace = require("gulp-replace");

// Files named with an underscore are the result of a compiled stylus or javascript task. 
// They are included into the final html view. See (src > view > index.html).


//MAIN RENDERER
//====================
//HTML ==
gulp.task("mainView", ["mainStyles", "mainScripts"], function(){
	return gulp.src("src/view/main/index.html")
	.pipe(plumber())
	.pipe(include())
	.pipe(gulp.dest("./"));
});


//CSS ==
gulp.task("mainStyles", function(){
	return gulp.src(["src/styles/main/*.styl", "src/styles/prompt.styl"])
	.pipe(plumber())
	.pipe(concat("_.styl"))
	.pipe(stylus())
	.pipe(autoprefixer())
	.pipe(minifyCss())
	.pipe(gulp.dest("src/styles/main/"));
});


//JavaScript ==
gulp.task("mainScripts", function(){
	return gulp.src([
		//include
		"src/scripts/libs/*.js", 
		"src/scripts/main/*.js", 
		"src/scripts/globalObjects/*.js", 
		//exclude
		"!src/scripts/main/_.js"])
	.pipe(plumber())
	.pipe(concat("_.js"))
	.pipe(uglify())
	.pipe(gulp.dest("src/scripts/main/"));
});




//PREFERENCES RENDERER
//====================
//HTML ==
gulp.task("prefView", ["prefStyles", "prefScripts"], function(){
	return gulp.src("src/view/preferences/index.html")
	.pipe(plumber())
	.pipe(replace("/*//= include ../../styles/preferences/_.css*/", "//= include ../../styles/preferences/_.css"))
	.pipe(include())
	.pipe(rename("preferences.html"))
	.pipe(gulp.dest("./"));
});


//CSS ==
gulp.task("prefStyles", function(){
	return gulp.src(["src/styles/preferences/*.styl", "src/styles/prompt.styl"])
	.pipe(plumber())
	.pipe(concat("_.styl"))
	.pipe(stylus())
	.pipe(autoprefixer())
	.pipe(minifyCss())
	.pipe(gulp.dest("src/styles/preferences/"));
});


//JavaScript ==
gulp.task("prefScripts", function(){
	return gulp.src([
		//include
		"src/scripts/libs/*.js", 
		"src/scripts/preferences/*.js", 
		// "src/scripts/globalObjects/*.js", 
		//exclude
		"!src/scripts/preferences/_.js"])
	.pipe(plumber())
	.pipe(concat("_.js"))
	.pipe(uglify())
	.pipe(gulp.dest("src/scripts/preferences/"));
});



//Watch ==
gulp.task("watch", function(){
	setTimeout(function(){
		gulp.watch(["src/**", "!src/styles/_.css", "!src/scripts/_.js"], ["mainView", "prefView"]);
	}, 1000);
	

	// gulp.watch(["src/**", "!src/styles/_.css", "!src/scripts/_.js"], ["prefView"]);
});

//Default ==
gulp.task("default", ["mainView", "prefView", "watch"])