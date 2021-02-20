function enqueue_icon_meta_load(client: Record<string, any>, newIcon: string) {
	if (!newIcon) {
		newIcon = "icons/error.png";
		console.info("MISSING ICON: Icon not defined!");
	}
	if (client.icon_meta_load_queue[newIcon]) {
		return client.icon_meta_load_queue[newIcon];
	}
	const promise = new Promise<void>((resolve, reject) => {
		const meta: Record<string, any> = {};
		meta.width = 32;
		meta.height = 32;
		meta.__image_object = new Image();
		const fullpath: string = client.resRoot + newIcon;
		meta.__image_object.src = fullpath;

		meta.__image_object.addEventListener("load", () => {
			meta.__image_object.canvas = document.createElement("canvas");
			meta.__image_object.ctx = meta.__image_object.canvas.getContext("2d");
			meta.__image_object.canvas.width = meta.__image_object.width;
			meta.__image_object.canvas.height = meta.__image_object.height;
			meta.__image_object.ctx.drawImage(meta.__image_object, 0, 0);
			meta.__image_data = meta.__image_object.ctx.getImageData(0, 0, meta.width, meta.height);
			meta.width = meta.__image_object.width;
			meta.height = meta.__image_object.height;
			resolve();
			client.icon_meta_load_queue[newIcon] = void 0;
		});
		meta.__image_object.addEventListener("error", (error: Error) => {
			reject(error || new Error(`Loading failed for ${newIcon}`));
		});
		client.icon_metas[newIcon] = meta;
	});
	client.icon_meta_load_queue[newIcon] = promise;
	return promise;
}

module.exports = enqueue_icon_meta_load;
