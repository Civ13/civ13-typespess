const { join } = require ("path");
const {readdirSync, statSync } = require ("fs");
const fs = require("fs");

function getFileExtension(filename) {
	var a = filename.split(".");
	if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
		return "";
	}
	return a.pop().toLowerCase();
}

const unfold = (f, initState) =>
	f ( (value, nextState) => [ value, ...unfold (f, nextState) ]
		, () => []
		, initState
	);

const None = Symbol ();

const relativePaths = (path = ".") =>
	readdirSync (path) .map (p => join (path, p));

const traverseDir = (dir) =>
	unfold( (next, done, [ path = None, ...rest ]) =>
		path === None
			? done ()
			: next ( path
				, statSync (path) .isDirectory ()
					? relativePaths (path) .concat (rest)
					: rest
			),
	relativePaths (dir)
	);
var templateArray = [];

for (const f of traverseDir("./code/")) {
	if (getFileExtension(f) == "objlist") {
		console.log("loading "+f);
		const nobj = JSON.parse(fs.readFileSync(f, "utf8"));
		templateArray.push(nobj);
	}
}

for (var i of templateArray) {
	module.exports.templates = {i};
}