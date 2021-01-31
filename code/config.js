const { weak_deep_assign } = require("./../code/game/server.js");
const fs = require("fs");
const CSON = require("cson");

module.exports = function read_config(name) {
	let config = {};
	try {
		config = CSON.parse(fs.readFileSync(`config/${name}`, "utf8"));
	} catch (e) {
		/**/
	}
	weak_deep_assign(
		config,
		CSON.parse(fs.readFileSync(`config/${name}`, "utf8"))
	);
	return config;
};