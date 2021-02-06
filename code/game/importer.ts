const { join } = require ("path");
const {readdirSync, statSync } = require ("fs");
const fs = require("fs");
const CSON = require("cson");

function getFileExtension(filename) {
	const a = filename.split(".");
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
const templateArray = {};
let appDir = "./code/";
if(global.is_bs_editor_env) {appDir = `${global.workspaceDir}code/`;}

for (const f of traverseDir(appDir)) {
	if (getFileExtension(f) === "atom") {
		const nobj = CSON.parse(fs.readFileSync(f, "utf8"));
		Object.assign(templateArray,nobj);
	}
}


module.exports.templates = templateArray;