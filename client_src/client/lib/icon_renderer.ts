
const CHANGE_LEVEL_NONE = 0;
const CHANGE_LEVEL_DIR = 1;
const CHANGE_LEVEL_ICON_STATE = 2;
const CHANGE_LEVEL_ICON = 3;

const color_canvas = document.createElement("canvas");

class IconRenderer {
	client: Record<string, any>;
	atom: Record<string, any>;
	_overlay_layer: number;
	change_level: number;
	_offset_x: number;
	_offset_y: number;
	icon_meta: Record<string, any>;
	last_icon: string;
	last_icon_state: string;
	last_dir: number;
	icon_frame: number;
	_icon: string;
	parent: any;
	_icon_state: string;
	_dir: number;
	_color: any;
	_alpha: any;
	genicon: string;
	constructor(obj: Record<string, any>) {
		if (!obj.client) {
			this.client = obj;
		} else {
			this.client = obj.client;
		}
		this.atom = obj;
		this._overlay_layer = 0;
		this.change_level = 0;
		this._offset_x = 0;
		this._offset_y = 0;
		this.icon_frame = 0;
		this.genicon = "";
		if (!this.dir) {
			this.dir = 1;
		}
	}
	// Returns a promise that is resolved when the icon is fully loaded (json and image)
	fully_load(forced_directional = false) {
		if (this.icon_meta || !this.genicon) {
			return Promise.resolve();
		}
		if (this.icon && this.icon.search(".png") !== -1) {this.genicon = this.icon;}
		else if (this.icon && this.icon_state && this.icon.search(".png") === -1) {
			if (
				this.atom.directional === true || forced_directional === true ||
				(this.icon.search("icons/mob/") !== -1 && this.icon.search("icons/mob/under/") === -1)
			) {
				this.genicon = `${this.icon}${this.icon_state}/${this.icon_state}-dir${this.dir}.png`;
			} else {
				this.genicon = `${this.icon}${this.icon_state}.png`;
			}
		}
		return this.client.enqueue_icon_meta_load(this.client, this.genicon);
	}

	get_bounds() {
		if (!this.icon_meta) {return;}
		const offset = this.get_offset();
		return {
			x: offset[0],
			y: 1 - this.icon_meta.height / 32 + offset[1],
			width: this.icon_meta.width / 32,
			height: this.icon_meta.height / 32,
		};
	}
	check_levels() {
		if (this.icon !== this.last_icon) {
			this.change_level = Math.max(this.change_level, CHANGE_LEVEL_ICON);
		} else if (this.icon_state !== this.last_icon_state) {
			this.change_level = Math.max(this.change_level, CHANGE_LEVEL_ICON_STATE);
		} else if (this.dir !== this.last_dir) {
			this.change_level = Math.max(this.change_level, CHANGE_LEVEL_DIR);
			this.last_dir = this.dir;
		}
	}
	on_render_tick() {
		this.check_levels();

		if (this.change_level >= CHANGE_LEVEL_NONE && this.atom) {
			this.atom.mark_dirty();
		}
		if (this.change_level >= CHANGE_LEVEL_DIR) {
			if (this.icon && this.icon.search(".png") !== -1) {this.genicon = this.icon;}
			this.icon_meta = null;
			if (this.atom.client.icon_metas[this.genicon]) {this.icon_meta = this.atom.client.icon_metas[this.genicon];}
			if (this.icon_meta === null || this.genicon === "" || this.icon !== this.last_icon || this.icon_state !== this.last_icon_state) {
				this.change_level = CHANGE_LEVEL_NONE;
				const enqueued_icon = this.genicon;
				const icocheck = this.get_directional();
				if (icocheck === false) {return;}
				if (!this.genicon) {this.genicon = "icons/nothing.png";}
				this.last_icon_state = this.icon_state;
				this.last_icon = this.icon;
				this.atom.client
					.enqueue_icon_meta_load(this.atom.client, this.genicon)
					.then(() => {
						if (this.atom.client.icon_metas[this.genicon]) {this.icon_meta = this.atom.client.icon_metas[this.genicon];}
						if (this.genicon === enqueued_icon) {
							this.change_level = CHANGE_LEVEL_ICON;
						}
					})
					.catch((err: Error) => {
						console.error(err);
					});
				this.change_level = CHANGE_LEVEL_NONE;
				return;
			}
		}

		this.change_level = CHANGE_LEVEL_NONE;

	}

	draw(ctx: any) {
		if (!this.icon_meta || !this.icon_meta.__image_object) {return;}
		let image = this.icon_meta.__image_object;
		let tcolor = null;
		let nindex_x = 0;
		const nindex_y = 0;
		if (this.color) {
			tcolor = this.color;
		} else if (this.icon_meta.color) {
			tcolor = this.icon_meta.color;
		}

		if (this.icon_meta.animated) {
			nindex_x = this.icon_meta.__image_object.height*Math.floor(this.icon_frame);
			this.icon_frame+=0.1;
			if(this.icon_frame >= this.icon_meta.animated_nr) {this.icon_frame = 0;}
		}
		if (tcolor) {
			color_canvas.width = Math.max(color_canvas.width, this.icon_meta.width);
			color_canvas.height = Math.max(color_canvas.height, this.icon_meta.height);
			const cctx = color_canvas.getContext("2d");
			cctx.clearRect(0, 0, this.icon_meta.width + 1, this.icon_meta.height + 1);
			cctx.fillStyle = this.color;
			cctx.globalCompositeOperation = "source-over";
			cctx.drawImage(
				image,
				nindex_x,
				nindex_y,
				this.icon_meta.width,
				this.icon_meta.height,
				0,
				0,
				this.icon_meta.width,
				this.icon_meta.height
			);
			cctx.globalCompositeOperation = "multiply";
			cctx.fillRect(0, 0, this.icon_meta.width, this.icon_meta.height);
			cctx.globalCompositeOperation = "destination-in";
			cctx.drawImage(
				image,
				nindex_x,
				nindex_y,
				this.icon_meta.width,
				this.icon_meta.height,
				0,
				0,
				this.icon_meta.width,
				this.icon_meta.height
			);
			cctx.globalCompositeOperation = "source-over";
			image = color_canvas;
		}
		const offset = this.get_offset();

		ctx.drawImage(
			image,
			nindex_x,
			nindex_y,
			this.icon_meta.width,
			this.icon_meta.height,
			Math.round(offset[0] * 32),
			Math.round(-offset[1] * 32),
			this.icon_meta.width,
			this.icon_meta.height
		);
	}

	get_directional() {
		if (this.icon && this.icon_state && this.icon.search(".png") === -1) {
			if (
				this.atom.directional === true ||
				(this.icon.search("icons/mob/") !== -1 && this.icon.search("icons/mob/under/") === -1)
			) {
				this.genicon = `${this.icon}${this.icon_state}/${this.icon_state}-dir${this.dir}.png`;
			} else {
				this.genicon = `${this.icon}${this.icon_state}.png`;
			}
		} else if (this.icon_state === "" && this.icon === "") {return false;} //if theres no icon state - don't draw.
		return true;
	}

	is_mouse_over(x: number, y: number) {
		if (!this.icon_meta || !this.icon_meta.__image_data) {return false;}
		const offset = this.get_offset();
		x -= offset[0];
		y -= offset[1];
		const pxx = Math.floor(x * 32);
		const pxy = Math.floor(32 - y * 32);

		if (pxx < 0 || pxy < 0 || pxx > this.icon_meta.width || pxy > this.icon_meta.height) {return false;}
		const idx = 3 + 4 * (pxx + pxy * this.icon_meta.__image_data.width);
		return this.icon_meta.__image_data.data[idx] > 0;
	}

	get icon() {
		if (this._icon === null && this.parent) {
			return this.parent.icon;
		}
		return this._icon;
	}
	set icon(val) {
		this._icon = val;
	}

	get icon_state() {
		if (this._icon_state === null && this.parent) {
			return this.parent.icon_state;
		}
		let icon_state = this._icon_state;
		if (this.parent) {
			icon_state = ("" + icon_state).replace(/\[parent\]/g, this.parent.icon_state);
		}
		return icon_state;
	}
	set icon_state(val) {
		this._icon_state = val;
	}

	get dir() {
		if (this._dir === null && this.parent) {
			return this.parent.dir;
		}
		return this._dir;
	}
	set dir(val) {
		this._dir = val;
	}

	get overlay_layer() {
		return this._overlay_layer;
	}
	set overlay_layer(val) {
		if (val === this._overlay_layer) {return;}
		this._overlay_layer = val;
		if (this.atom) {
			this.atom.mark_dirty();
		}
	}

	get offset_x() {
		return this._offset_x;
	}
	set offset_x(val) {
		if (val === this._offset_x) {return;}
		this._offset_x = +val || 0;
		if (this.atom) {
			this.atom.mark_dirty();
		}
	}
	get offset_y() {
		return this._offset_y;
	}
	set offset_y(val) {
		if (val === this._offset_y) {return;}
		this._offset_y = +val || 0;
		if (this.atom) {
			this.atom.mark_dirty();
		}
	}

	get_offset() {
		let dx = this.offset_x;
		let dy = this.offset_y;
		if (this.icon_meta && this.icon_meta.directional_offset) {
			const world_amt = this.icon_meta.directional_offset / 32;
			if (this.dir & 1) {
				dy += world_amt;
			}
			if (this.dir & 2) {
				dy -= world_amt;
			}
			if (this.dir & 4) {
				dx += world_amt;
			}
			if (this.dir & 8) {
				dx -= world_amt;
			}
		}
		return [dx, dy];
	}

	get color() {
		if (this._color === null && this.parent) {
			return this.parent.color;
		}
		return this._color;
	}
	set color(val) {
		if (val === this._color) {return;}
		this._color = "" + val;
		if (this.atom) {
			this.atom.mark_dirty();
		}
	}

	get alpha() {
		return this._alpha;
	}
	set alpha(val) {
		if (val === this._alpha) {return;}
		this._alpha = "" + val;
		if (this.atom) {
			this.atom.mark_dirty();
		}
	}
}

module.exports = IconRenderer;
