const { join } = require ("path");
const {readdirSync, statSync } = require ("fs");
const fs = require("fs");
const CSON = require("cson");

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
	readdirSync (path) .map (p => (join (path, p)));

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
var templateArray = {};

for (const f of traverseDir("./code/")) {
	if (getFileExtension(f) == "atom") {
		const nobj = CSON.parse(fs.readFileSync(f, "utf8"));
		Object.assign(templateArray,nobj);
	}
}

module.exports.templates = templateArray;