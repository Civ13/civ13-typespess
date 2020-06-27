
const { ReagentReaction } = require("../reagent.js");
const { join } = require ("path");
const {readdirSync, statSync } = require ("fs");
const fs = require("fs");
const CSON = require("cson");

module.exports.reagent_reactions = [];

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

for (const f of traverseDir("./code/")) {
	if (getFileExtension(f) == "recipes") {
		const nrec = CSON.parse(fs.readFileSync(f, "utf8"));
		var new_nrec = [];
		for(var i in nrec)
			new_nrec.push(i);
		const nrec_parsed = new ReagentReaction(new_nrec);
		module.exports.reagent_reactions.push(nrec_parsed);
	}
}