export{};
const browserify = require("browserify");
const fs = require("fs");

let destination = "../resources/";
//overrides the destination of the generated client.js file, if provided
const args = process.argv;
if (typeof args[2] === "string" && args[2] !== "") {
	destination = args[2];
}

const used_bundler = browserify({
	entries: "./index.js",
	debug: false, //change to true if you want the sourcemaps
	cache: {},
	packageCache: {},
});
used_bundler.transform("uglifyify", {global: true}).bundle(function (err: string, buf: any) {
	if (err) {
		throw new Error(err);
	}
	fs.writeFile(destination+"client.js", buf, function (err2: string) {
		console.info("COMPILE: compiled into "+destination);
		if (err2) {
			throw new Error(err2);
		}
	});
});
console.info("COMPILE: done.");
