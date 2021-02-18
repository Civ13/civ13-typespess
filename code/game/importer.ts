export{};
const {getFileExtension, traverseDir} = require("./importer_tools.js");
const fs = require("fs");
const CSON = require("cson");

const templateArray = {};
let appDir = "./code/";
if (global.is_bs_editor_env) {
	appDir = `${global.workspaceDir}code/`;
}

for (const f of traverseDir(appDir)) {
	if (getFileExtension(f) === "atom") {
		const nobj = CSON.parse(fs.readFileSync(f, "utf8"));
		Object.assign(templateArray, nobj);
	}
}

module.exports.templates = templateArray;
