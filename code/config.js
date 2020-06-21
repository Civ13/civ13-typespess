const { weak_deep_assign } = require("./../typespess/index.js");
const fs = require("fs");
const path = require("path");

module.exports = function read_config(name) {
	let config = {};
	try {
		config = JSON.parse(fs.readFileSync(path.join("config", name), "utf8"));
	} catch (e) {
		/**/
	}
	weak_deep_assign(
		config,
		JSON.parse(fs.readFileSync(path.join("config/default", name), "utf8"))
	);
	return config;
};
