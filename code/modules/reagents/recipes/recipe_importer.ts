export{};
const { ReagentReaction } = require("../reagent.js");
const {statSync } = require ("fs");
const {getFileExtension, relativePaths, unfold, None} = require("./../../../../code/game/importer_tools.js");
const fs = require("fs");
const CSON = require("cson");

module.exports.reagent_reactions = [];

const traverseDir = (dir: string) =>
	unfold( (next: any, done: () => any, [ path = None, ...rest ]: any) =>
		path === None
			? done ()
			: next ( path
				, statSync (path) .isDirectory ()
					? relativePaths (path) .concat (rest)
					: rest
			),
	relativePaths (dir)
	);
	if(global.is_bs_editor_env) {
		const appDir = global.workspaceDir;
		for (const f of traverseDir(`${appDir}code/`)) {
			if (getFileExtension(f) === "recipes") {
				const nrec = CSON.parse(fs.readFileSync(f, "utf8"));
				const new_nrec = [];
				for(const i in nrec)
					{if (i) {new_nrec.push(i);}}
				const nrec_parsed = new ReagentReaction(new_nrec);
				module.exports.reagent_reactions.push(nrec_parsed);
			}
	}
} else {
for (const f of traverseDir("./code/")) {
	if (getFileExtension(f) === "recipes") {
		const nrec = CSON.parse(fs.readFileSync(f, "utf8"));
		const new_nrec = [];
		for(const i in nrec) {
			if (i) {new_nrec.push(i);}
		}
		const nrec_parsed = new ReagentReaction(new_nrec);
		module.exports.reagent_reactions.push(nrec_parsed);
	}
}
}
