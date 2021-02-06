export{};
const browserify = require("browserify");
const tsify = require("tsify");
const fs = require("fs");

const used_bundler = browserify({
	entries: "./index.ts",
	debug: false, //change to true if you want the sourcemaps
	cache: {},
	packageCache: {},
});
used_bundler.plugin(tsify, { noImplicitAny: false, skipLibCheck: true });
used_bundler.bundle(function (err: any, buf: any) {
	if (err) {return console.log(err);}
	fs.writeFile("../resources/client.js", buf, function (err: any) {
		if (err) {return console.log(err);}});
});
console.log("COMPILE: done.");
