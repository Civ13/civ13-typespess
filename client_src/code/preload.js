const preload_list = require("./preloadlist.js");

module.exports = async function preload(client) {
	for (let path of preload_list) {
		if (!client.icon_metas[path]) await client.enqueue_icon_meta_load(path);
	}
};
