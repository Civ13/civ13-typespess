const preload_list = require("./preloadlist.js");
let tpreload_list = ["icons/error.png"];
if (Array.isArray(preload_list) == true)
	{tpreload_list = preload_list;}
module.exports = async function preload(client) {
	for (let path of tpreload_list) {
		if (!client.icon_metas[path]) await client.enqueue_icon_meta_load(path);
	}
};
