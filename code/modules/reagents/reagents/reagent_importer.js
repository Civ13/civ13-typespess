const { join } = require ("path");
const {readdirSync, statSync } = require ("fs");
const fs = require("fs");
const CSON = require("cson");

const { Consumable } = require("./other.js");
const { Reagent } = require("../reagent.js");

module.exports.reagents = [];

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
	if (getFileExtension(f) == "reagents") {
		const nrea = CSON.parse(fs.readFileSync(f, "utf8"));
		var nrea_parsed = [];
		for(var i in nrea)
			nrea_parsed.push(i);
		var nrea_new;
		if (nrea_parsed.subtype == "drug" || nrea_parsed.subtype == "flammable" || nrea_parsed.subtype == "flash" || nrea_parsed.subtype == "smoke" || nrea_parsed.subtype == "explosive")
		{nrea_new = new Reagent;}
		else
		{nrea_new = new Consumable;}
		Object.assign(nrea_new,nrea_parsed);
		module.exports.reagents.push(nrea_new);
	}
}