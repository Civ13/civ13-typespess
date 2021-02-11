export{};
const {statSync } = require ("fs");
const {getFileExtension, relativePaths, unfold, None} = require("./../../../../code/game/importer_tools.js");
const fs = require("fs");
const CSON = require("cson");

const { Reagent } = require("../reagent.js");

module.exports.reagents = [];

const traverseDir = (dir: string) =>
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
	if(global.is_bs_editor_env) {
		const appDir = global.workspaceDir;
		for (const f of traverseDir(`${appDir}code/`)) {
			if (getFileExtension(f) === "reagents") {
				const nrea = CSON.parse(fs.readFileSync(f, "utf8"));
				for(const j in nrea) {
					const nrea_new = new Reagent();
					if (j === "subtype" && nrea[j] === "drug") {
						nrea_new.name = "Drug";
						nrea_new.metabolization_rate = 0.25;
						nrea_new.taste_description = "bitterness";
					}
					else if (j === "subtype" && nrea[j] === "toxin") {
						nrea_new.name = "Toxin";
						nrea_new.description = "A toxic chemical.";
						nrea_new.color = [0.81, 0.21, 0];
						nrea_new.taste_description = "bitterness";
						nrea_new.taste_mult = 1.2;
						nrea_new.toxpwr = 1.5;
					}
					else {
						nrea_new.taste_mult = 4; 
						nrea_new.nutriment_factor = 0.5;
					}
					for(const i in nrea_new) {
						if (nrea_new[i] && nrea[j][i]) {nrea_new[i] = nrea[j][i];}
					}
					module.exports.reagents.push(nrea_new);
				}
			}
		}
	} else {
for (const f of traverseDir("./code/")) {
	if (getFileExtension(f) === "reagents") {
		const nrea = CSON.parse(fs.readFileSync(f, "utf8"));
		for(const j in nrea) {
			const nrea_new = new Reagent();
			if (j === "subtype" && nrea[j] === "drug") {
				nrea_new.name = "Drug";
				nrea_new.metabolization_rate = 0.25;
				nrea_new.taste_description = "bitterness";
			}
			else if (j === "subtype" && nrea[j] === "toxin") {
				nrea_new.name = "Toxin";
				nrea_new.description = "A toxic chemical.";
				nrea_new.color = [0.81, 0.21, 0];
				nrea_new.taste_description = "bitterness";
				nrea_new.taste_mult = 1.2;
				nrea_new.toxpwr = 1.5;
			}
			else {
				nrea_new.taste_mult = 4; 
				nrea_new.nutriment_factor = 0.5;
			}
			for(const i in nrea_new) {
				if (nrea_new[i] && nrea[j][i]) {nrea_new[i] = nrea[j][i];}
			}
			module.exports.reagents.push(nrea_new);
		}
	}
}
}