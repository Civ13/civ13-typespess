var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var browserify = require("browserify");
var log = require("gulplog");


function bundle() {
	var used_bundler = browserify({
		entries: "./index.js",
		debug: true,
		cache: {},
		packageCache: {},
	});
	return used_bundler
		.bundle()
		.on("error", function (err) {
			log.error(err.toString());
			this.emit("end");
		})
		.pipe(source("client.js"))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(sourcemaps.write("./"))
		.pipe(gulp.dest("../res"));
}

gulp.task("default", function () {return bundle();});
