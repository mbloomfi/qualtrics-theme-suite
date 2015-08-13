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
var eslint = require("gulp-eslint");
var gulpif = require("gulp-if");


//ENVIRONMENT - Change to TRUE when using for production
var production = false;


// Files named with an underscore are the result of a compiled stylus or javascript task. 
// They are included into the final html view. See (src > view > index.html).


// MAIN PROCESS
gulp.task("main-process", function(){
	return gulp.src("src/main-process/*.js")
	.pipe(plumber())
	.pipe(concat("index.js"))
	.pipe(gulpif( production, uglify() ))
	.pipe(gulp.dest("./"));
});



//MAIN RENDERER
//====================
//HTML ==
gulp.task("mainView", ["mainStyles", "combineAllScripts"], function(){
	return gulp.src("src/view/main/index.html")
	.pipe(plumber())
	.pipe(include())
	.pipe(gulp.dest("./"));
});


//CSS ==
gulp.task("mainStyles", ["compile-stylus"], function(){
	return gulp.src(["src/styles/libs/*.css","src/styles/main/_.css"])
	.pipe(plumber())
	.pipe(concat("_.css"))
	.pipe( gulpif( production, minifyCss() ) )
	.pipe(gulp.dest("src/styles/main/"));
});
gulp.task("compile-stylus", function(){
	return gulp.src(["src/styles/global.styl", "src/styles/main/*.styl", "src/styles/prompt.styl"])
	.pipe(plumber())
	.pipe(concat("_.styl"))
	.pipe(stylus())
	.pipe(autoprefixer())
	.pipe(gulp.dest("src/styles/main/"));
});


//JavaScript ==
gulp.task("mainLint", ["userScripts"], function(){
	return gulp.src("src/scripts/main/_.js")
	.pipe(plumber())
	.pipe(eslint({"configFile":".eslintrc"}))
	.pipe(eslint.format())
	.pipe(rename("linted-main.js"))
	.pipe(gulp.dest("./lintedScripts"))
	.pipe(eslint.failOnError());
});

gulp.task("userScripts", function(){
	return gulp.src([
		//include
		"src/scripts/main/main.js",
		"src/scripts/main/app-ready.js",
		"src/scripts/app-core-methods.js",
		"src/scripts/main/modes/edit-preview/edit-preview.js",
		"src/scripts/main/codemirror-init.js",
		"src/scripts/main/editor.js",
		"src/scripts/main/editor-dropdown-brands.js",
		"src/scripts/main/editor-dropdown-projects.js",
		"src/scripts/main/editor-dropdown-files.js",
		"src/scripts/main/brand-search.js",
		"src/scripts/main/Quitter.js",
		"src/scripts/main/Saver.js",
		"src/scripts/main/Prompter.js"
		
		//exclude
		// "!src/scripts/main/_.js"
		])
	.pipe(plumber())
	.pipe(concat("_.js"))
	.pipe(gulpif( production, uglify() ))
	.pipe(gulp.dest("src/scripts/main"));
});

gulp.task("combineAllScripts", ["mainLint"], function(){
	return gulp.src([
		//include
		"src/scripts/libs/*.js",
		"src/scripts/libs/codemirror/codemirror.js",
		"src/scripts/libs/codemirror/modes/*",
		"src/scripts/libs/codemirror/**",
		"src/scripts/main/_.js"
		//exclude
		// "!src/scripts/main/_.js"
		])
	.pipe(plumber())
	.pipe(include())
	.pipe(concat("_.js"))
	.pipe(gulpif( production, uglify() ))
	.pipe(gulp.dest("src/scripts/main"));
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
gulp.task("prefStyles", ["prefStyles-stylus"], function(){
	return gulp.src(["src/styles/libs/*.css","src/styles/preferences/_.css"])
	.pipe(plumber())
	.pipe(concat("_.css"))
	.pipe( gulpif( production, minifyCss() ) )
	.pipe(gulp.dest("src/styles/preferences/"));
});

gulp.task("prefStyles-stylus", function(){
	return gulp.src(["src/styles/global.styl", "src/styles/preferences/*.styl", "src/styles/prompt.styl"])
	.pipe(plumber())
	.pipe(concat("_.styl"))
	.pipe(stylus())
	.pipe(autoprefixer())
	.pipe(gulpif( production, minifyCss() ))
	.pipe(gulp.dest("src/styles/preferences/"));
});


//JavaScript ==
gulp.task("prefScripts", function(){
	return gulp.src([
		//include
		"src/scripts/libs/el.min.js", 
		"src/scripts/libs/baton.min.js", 
		"src/scripts/libs/aceBlock.js", 
		"src/scripts/libs/etcetera.js", 
		"src/scripts/libs/codemirror/codemirror.js",
		"src/scripts/libs/codemirror/modes/*",
		"src/scripts/libs/codemirror/**",
		"src/scripts/preferences/main.js",
		"src/scripts/preferences/*.js",
		//exclude
		"!src/scripts/preferences/_.js"
		])
	.pipe(plumber())
	.pipe(include())
	.pipe(concat("_.js"))
	.pipe(gulpif( production, uglify() ))
	.pipe(gulp.dest("src/scripts/preferences/"));
});



//Watch ==
gulp.task("watch", function(){


		console.log("My watch begins.");
		gulp.watch([

			// include
			"src/main-process/*", 

			"src/view/**",

			"src/scripts/globalObjects/*",
			"src/scripts/libs/*",
			"src/scripts/main/*.js",
			"src/scripts/preferences/*.js",
			"src/scripts/preferences/update-temp-preferences/*.js",
			"src/scripts/app-core-methods.js",
			"src/scripts/main/modes/**",

			"src/styles/libs/*",
			"src/styles/main/*.styl",
			"src/styles/preferences/*.styl",
			"src/styles/*.styl",


			// exclude
			"!src/main-process/*", 
			"!src/styles/main/_.css", 
			"!src/styles/preferences/_.css", 
			"!src/scripts/main/_.js", 
			"!src/scripts/preferences/_.js"

		], ["mainView", "prefView"]);

		gulp.watch(["src/main-process/*"], ["main-process"]);


});

//Default ==
gulp.task("default", ["mainView", "prefView", "main-process", "watch"])