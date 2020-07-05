

const preload_list = [
	"icons/effects/parallax.png",
];

module.exports = async function preload(client: { icon_metas: { [x: string]: any; }; enqueue_icon_meta_load: (arg0: string) => any; }) {
	for (const path of preload_list) {
		if (!client.icon_metas[path]) await client.enqueue_icon_meta_load(path);
	}
};
