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
	icon_meta: Record<string,any>;
	directional: boolean;
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
	constructor(obj: Record<string,any>) {
		if (!obj.client) {
			this.client = obj;
		} else {
			this.atom = obj;
			this.client = obj.client;
		}
		this._overlay_layer = 0;
		this.change_level = 0;
		this._offset_x = 0;
		this._offset_y = 0;
		if (!this.dir) {this.dir = 1;}
	}

	// Returns a promise that is resolved when the icon is fully loaded (json and image)
	fully_load() {
		if (this.icon_meta || !this.icon) {return Promise.resolve();}
		if (this.icon && this.icon_state && (this.icon.search(".png") === -1))
			{
				if (this.atom.directional === true || this.directional === true || (this.icon.search("icons/mob/") !== -1 && (this.icon.search("icons/mob/under/") === -1))) {
					this.icon = `${this.icon}${this.icon_state}/${this.icon_state}-dir${this.dir}.png`;
				}
				else {this.icon = `${this.icon}${this.icon_state}.png`;}
			}
		return this.client.enqueue_icon_meta_load(this.client,this.icon);
	}

	get_bounds() {
		if (!this.icon_meta || !this.icon_meta) {return;}
		const offset = this.get_offset();
		return {
			x: offset[0],
			y: 1 - this.icon_meta.height / 32 + offset[1],
			width: this.icon_meta.width / 32,
			height: this.icon_meta.height / 32,
		};
	}

	on_render_tick() {
		if (this.icon !== this.last_icon) {
			this.change_level = Math.max(this.change_level, CHANGE_LEVEL_ICON);
			this.last_icon = this.icon;
		} else if (this.icon_state !== this.last_icon_state) {
			this.change_level = Math.max(this.change_level, CHANGE_LEVEL_ICON_STATE);
			this.last_icon_state = this.icon_state;
		} else if (this.dir !== this.last_dir) {
			this.change_level = Math.max(this.change_level, CHANGE_LEVEL_DIR);
			this.last_dir = this.dir;
		}
		if (this.change_level >= CHANGE_LEVEL_NONE && this.atom)
			{this.atom.mark_dirty();}
		if (this.change_level >= CHANGE_LEVEL_DIR) {
			this.icon_meta = this.atom.client.icon_metas[this.icon];
			if (typeof this.icon_meta === "undefined") {
				this.change_level = CHANGE_LEVEL_NONE;
				const enqueued_icon = this.icon;
				if (this.icon && this.icon_state && (this.icon.search(".png") === -1)) {
						if (this.directional === true || this.atom.directional === true || (this.icon.search("icons/mob/") !== -1 && (this.icon.search("icons/mob/under/") === -1))) {
							this.icon = `${this.icon}${this.icon_state}/${this.icon_state}-dir${this.dir}.png`;
						}
						else {
							this.icon = `${this.icon}${this.icon_state}.png`;
							}
						}
				else if (this.icon_state === "") {return;} //if theres no icon state - don't draw.
				if (!this.icon) {this.icon = "icons/nothing.png";}
				this.atom.client
					.enqueue_icon_meta_load(this.atom.client,this.icon)	
					.then(() => {	
						if (this.icon === enqueued_icon) {	
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

		this.icon_frame = 0;
	}

	draw(ctx: any) {
		if (!this.icon_meta || !this.icon_meta.__image_object)
			{return;}

		let image = this.icon_meta.__image_object;
		let tcolor = null;
		if (this.color) {tcolor = this.color;}
		else if (this.icon_meta.color) {tcolor = this.icon_meta.color;}
		if (tcolor) {
			color_canvas.width = Math.max(
				color_canvas.width,
				this.icon_meta.width
			);
			color_canvas.height = Math.max(
				color_canvas.height,
				this.icon_meta.height
			);
			const cctx = color_canvas.getContext("2d");
			cctx.clearRect(
				0,
				0,
				this.icon_meta.width + 1,
				this.icon_meta.height + 1
			);
			cctx.fillStyle = this.color;
			cctx.globalCompositeOperation = "source-over";
			cctx.drawImage(
				image,
				0,
				0,
				this.icon_meta.width,
				this.icon_meta.height,
				0,
				0,
				this.icon_meta.width,
				this.icon_meta.height
			);
			cctx.globalCompositeOperation = "multiply";
			cctx.fillRect(
				0,
				0,
				this.icon_meta.width,
				this.icon_meta.height
			);
			cctx.globalCompositeOperation = "destination-in";
			cctx.drawImage(
				image,
				0,
				0,
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
			0,
			0,
			this.icon_meta.width,
			this.icon_meta.height,
			Math.round(offset[0] * 32),
			Math.round(-offset[1] * 32),
			this.icon_meta.width,
			this.icon_meta.height
		);
	}

	is_mouse_over(x: number, y: number) {
		if (!this.icon_meta || !this.icon_meta.__image_data)
			{return false;}
		const offset = this.get_offset();
		x -= offset[0];
		y -= offset[1];
		const pxx = Math.floor(x * 32);
		const pxy = Math.floor(32 - y * 32);

		if (
			pxx < 0 || pxy < 0 || pxx > this.icon_meta.width || pxy > this.icon_meta.height
		)
			{return false;}
		const idx = 3 + 4 *
		(pxx + (pxy) * this.icon_meta.__image_data.width);
		return this.icon_meta.__image_data.data[idx] > 0;
	}

	get icon() {
		if (this._icon === null && this.parent) {return this.parent.icon;}
		const icon = this._icon;
		return icon;
	}
	set icon(val) {
		this._icon = val;
	}

	get icon_state() {
		if (this._icon_state === null && this.parent) {return this.parent.icon_state;}
		let icon_state = this._icon_state;
		if (this.parent) {
			icon_state = ("" + icon_state).replace(
				/\[parent\]/g,
				this.parent.icon_state
			);
		}
		return icon_state;
	}
	set icon_state(val) {
		this._icon_state = val;
	}

	get dir() {
		if (this._dir === null && this.parent) {return this.parent.dir;}
		const dir = this._dir;
		return dir;
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
		if (this.atom) {this.atom.mark_dirty();}
	}

	get offset_x() {
		return this._offset_x;
	}
	set offset_x(val) {
		if (val === this._offset_x) {return;}
		this._offset_x = +val || 0;
		if (this.atom) {this.atom.mark_dirty();}
	}
	get offset_y() {
		return this._offset_y;
	}
	set offset_y(val) {
		if (val === this._offset_y) {return;}
		this._offset_y = +val || 0;
		if (this.atom) {this.atom.mark_dirty();}
	}

	get_offset() {
		let dx = this.offset_x;
		let dy = this.offset_y;
		if (this.icon_meta && this.icon_meta.directional_offset) {
			const world_amt = this.icon_meta.directional_offset / 32;
			if (this.dir & 1) {dy += world_amt;}
			if (this.dir & 2) {dy -= world_amt;}
			if (this.dir & 4) {dx += world_amt;}
			if (this.dir & 8) {dx -= world_amt;}
		}
		return [dx, dy];
	}

	get color() {
		if (this._color === null && this.parent) {return this.parent.color;}
		return this._color;
	}
	set color(val) {
		if (val === this._color) {return;}
		this._color = "" + val;
		if (this.atom) {this.atom.mark_dirty();}
	}

	get alpha() {
		return this._alpha;
	}
	set alpha(val) {
		if (val === this._alpha) {return;}
		this._alpha = "" + val;
		if (this.atom) {this.atom.mark_dirty();}
	}
}

module.exports = IconRenderer;
