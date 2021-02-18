// eslint-disable-next-line node/no-unpublished-require
const preload_list = require("./preloadlist.js");
let tpreload_list = ["icons/error.png"];
if (Array.isArray(preload_list) === true) {
	tpreload_list = preload_list;
}
module.exports = async function preload(client: {
	icon_metas: {[x: string]: any};
	enqueue_icon_meta_load: (arg0: Record<string, any>, arg1: string) => any;
}) {
	for (const path of tpreload_list) {
		if (!client.icon_metas[path]) {
			await client.enqueue_icon_meta_load(client, path);
		}
	}
};
