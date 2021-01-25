function enqueue_icon_meta_load(newIcon,newIconState = null) {
	if (newIconState && newIcon && !(newIcon.search(".png")))
		{newIcon = `${newIcon}${newIconState}.png`}
	if (this.icon_meta_load_queue[newIcon]) {
		return this.icon_meta_load_queue[newIcon];
	}
	var promise = new Promise((resolve, reject) => {
		var meta = {
			"": {
				width: 32,
				height: 32,
				},
			};

		meta.__image_object = new Image();
		meta.__image_object.src = this.resRoot + newIcon;
		meta.__image_object.addEventListener("load", () => {
			// Make an image data object.
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			canvas.width = meta.__image_object.width;
			canvas.height = meta.__image_object.height;
			ctx.drawImage(meta.__image_object, 0, 0);
			meta.__image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
			meta[""].width = meta.__image_object.width;
			meta[""].height = meta.__image_object.height;
			resolve();
			this.icon_meta_load_queue[newIcon] = undefined;
		});
		meta.__image_object.addEventListener("error", (error) => {
			reject(error || new Error(`Loading failed for ${newIcon}`));
		});
		this.icon_metas[newIcon] = meta;

	});
	this.icon_meta_load_queue[newIcon] = promise;
	return promise;
}

module.exports = enqueue_icon_meta_load;
