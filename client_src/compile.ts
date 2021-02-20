export{};
const browserify = require("browserify");
const fs = require("fs");

const used_bundler = browserify({
	entries: "./index.js",
	debug: false, //change to true if you want the sourcemaps
	cache: {},
	packageCache: {},
});
used_bundler.bundle(function (err: string, buf: any) {
	if (err) {
		throw new Error(err);
	}
	fs.writeFile("../resources/client.js", buf, function (err2: string) {
		if (err2) {
			throw new Error(err2);
		}
	});
});
console.info("COMPILE: done.");
