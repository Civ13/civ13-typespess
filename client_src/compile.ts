const browserify = require("browserify");
const fs = require("fs");

const used_bundler = browserify({
	entries: "./index.js",
	debug: false, //change to true if you want the sourcemaps
	cache: {},
	packageCache: {},
});
used_bundler.bundle(function (err: Error, buf: string) {
	if (err) {return console.log(err);}
	fs.writeFile("../resources/client.js", buf, function (err: Error) {
		if (err) {return console.log(err);}});
});
console.log("done.");
