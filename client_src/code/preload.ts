const preload_list = ["icons/error.png"];

module.exports = async function preload(client: {
	icon_metas: {[x: string]: any};
	enqueue_icon_meta_load: (arg0: Record<string, any>, arg1: string) => any;
}) {
	for (const path of preload_list) {
		if (!client.icon_metas[path]) {
			await client.enqueue_icon_meta_load(client, path);
		}
	}
};
