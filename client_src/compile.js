const browserify = require("browserify");
const tsify = require("tsify");
const fs = require("fs");

const used_bundler = browserify({
	entries: "./index.js",
	debug: false, //change to true if you want the sourcemaps
	cache: {},
	packageCache: {},
});
used_bundler.plugin(tsify, { noImplicitAny: false });
used_bundler.bundle(function (err, buf) {
	if (err) {return console.log(err);}
	fs.writeFile("../resources/client.js", buf, function (err) {
		if (err) {return console.log(err);}});
});
console.log("COMPILE: done.");
