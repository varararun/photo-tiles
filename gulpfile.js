var pkg = require("./package.json");
var gulp = require("gulp");
var sass = require("gulp-sass");
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var beautify = require("gulp-jsbeautifier");
var cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var browserSync = require("browser-sync").create();
var autoprefixer = require("gulp-autoprefixer");
var header = require("gulp-header");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require('gulp-sourcemaps');

var banner = ["/*\n",
    " * <%= pkg.title %> (<%= pkg.homepage %>)\n",
    " * Copyright 2016-" + (new Date()).getFullYear(), " <%= pkg.author %>\n",
    " */\n",
    ""
].join("");

gulp.task("default", ["serve"]);

gulp.task("minify", ["scss", "format", "minify-css", "typescript", "minify-js"]);

gulp.task("typescript", function () {
    tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("assets/js"));
});

gulp.task("scss", function () {
    gulp.src("assets/css/**/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["last 2 versions", "> 5%", "Firefox ESR"]
        }))
        .pipe(gulp.dest("assets/css"));
});

gulp.task("jshint", function () {
    gulp.src([
            "assets/js/photo-tiles.js",
            "*.js"
        ])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter("fail"));
});

gulp.task("format", function () {
    gulp.src([
            "assets/css/photo-tiles.css",
            "client/js/photo-tiles.js",
            "index.html",
            "*.{js,json}"
        ], {
            base: "./"
        })
        .pipe(beautify())
        .pipe(gulp.dest("./"));
});

gulp.task("minify-css", ["scss"], function () {
    gulp.src([
            "assets/css/photo-tiles.css"
        ])
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({
            compatibility: "ie8"
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(sourcemaps.write())
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest("assets/css"));
});

gulp.task("minify-js", function () {
    gulp.src([
            "assets/js/photo-tiles.js"
        ])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(sourcemaps.write())
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest("assets/js"));
});

gulp.task("browserSync", function () {
    browserSync.init({
        server: {
            baseDir: ""
        },
    });
});

gulp.task("package", ["scss", "minify-css", "typescript", "minify-js"], function () {
    gulp.src([
            "assets/js/*.{js,map}",
            "!assets/js/*.spec.js"
        ])
        .pipe(gulp.dest("dist/js"));
    gulp.src([
            "assets/css/*.{css,map}"
        ])
        .pipe(gulp.dest("dist/css"));
});

gulp.task("serve", ["browserSync", "scss", "minify-css", "typescript", "minify-js"], function () {
    gulp.watch("assets/css/**/*.scss", ["scss"]);
    gulp.watch("assets/css/photo-tiles.css", ["minify-css"]);
    gulp.watch("assets/js/photo-tiles.ts", ["typescript"]);
    gulp.watch("assets/js/photo-tiles.js", ["minify-js"]);
    gulp.watch("index.html", browserSync.reload);
    gulp.watch("assets/**/*.{js,css}", browserSync.reload);
});

module.exports = gulp;