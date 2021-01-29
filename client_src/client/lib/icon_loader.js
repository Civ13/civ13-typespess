function enqueue_icon_meta_load(newIcon) {
	if (!newIcon)
		{newIcon = "icons/error.png";console.log("MISSING ICON: Icon not defined!");}
	if (this.icon_meta_load_queue[newIcon]) {
		return this.icon_meta_load_queue[newIcon];
	}
	var promise = new Promise((resolve, reject) => {	
		var meta = {}
		meta.width = 32;
		meta.height = 32;
		meta.__image_object = new Image();
		let fullpath = this.resRoot + newIcon;
		fetch(fullpath, { method: 'HEAD' })
		.then(res => {
			if (res.ok) {
				meta.__image_object.src = fullpath;
			} else {
				console.log(`MISSING ICON: ${fullpath}`)
				if (fullpath.search("inhands") != -1)
					{meta.__image_object.src = this.resRoot + "icons/nothing.png";}
				else
					{meta.__image_object.src = this.resRoot + "icons/error.png";}
			}
		}).catch(err => console.log('Error:', err));
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
