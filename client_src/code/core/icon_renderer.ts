/* eslint-disable @typescript-eslint/no-explicit-any */
const CHANGE_LEVEL_NONE = 0;
const CHANGE_LEVEL_DIR = 1;
const CHANGE_LEVEL_ICON_STATE = 2;
const CHANGE_LEVEL_ICON = 3;

const color_canvas = document.createElement("canvas");
global.color_canvas = color_canvas;

class IconRenderer {
	client: any;
	atom: any;
	_overlay_layer: number;
	change_level: number;
	_offset_x: number;
	_offset_y: number;
	icon_meta: any;
	dir_meta: any;
	icon_state_meta: any;
	parent: any;
	last_icon: any;
	last_icon_state: any;
	last_dir: any;
	icon_frame!: number;
	flick: any;
	_icon: any;
	_icon_state: any;
	_dir: any;
	_color: any;
	_alpha: any;
	constructor(obj: any) {
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
	}

	// Returns a promise that is resolved when the icon is fully loaded (json and image)
	fully_load() {
		if (this.icon_meta || !this.icon) return Promise.resolve();
		return this.client.enqueue_icon_meta_load(this.icon);
	}

	get_bounds() {
		if (!this.dir_meta || !this.icon_meta || !this.icon_state_meta) return;
		const offset = this.get_offset();
		return {
			x: offset[0],
			y: 1 - this.icon_state_meta.height / 32 + offset[1],
			width: this.icon_state_meta.width / 32,
			height: this.icon_state_meta.height / 32,
		};
	}

	on_render_tick(timestamp: number) {
		if (this.parent) this.parent.check_flick_validity(timestamp);
		this.check_flick_validity(timestamp);
		if (this.icon != this.last_icon) {
			this.change_level = Math.max(this.change_level, CHANGE_LEVEL_ICON);
			this.last_icon = this.icon;
		} else if (this.icon_state != this.last_icon_state) {
			this.change_level = Math.max(this.change_level, CHANGE_LEVEL_ICON_STATE);
			this.last_icon_state = this.icon_state;
		} else if (this.dir != this.last_dir) {
			this.change_level = Math.max(this.change_level, CHANGE_LEVEL_DIR);
			this.last_dir = this.dir;
		}
		if (this.change_level > CHANGE_LEVEL_NONE && this.atom)
			this.atom.mark_dirty();
		if (this.change_level >= CHANGE_LEVEL_ICON) {
			this.icon_meta = this.atom.client.icon_metas[this.icon];
			this.dir_meta = null;
			if (this.icon_meta === undefined) {
				this.change_level = CHANGE_LEVEL_NONE;
				const enqueued_icon = this.icon;
				this.atom.client
					.enqueue_icon_meta_load(this.icon)
					.then(() => {
						if (this.icon === enqueued_icon) {
							this.change_level = CHANGE_LEVEL_ICON;
						}
					})
					.catch((err: any) => {
						console.error(err);
					});
				this.change_level = CHANGE_LEVEL_NONE;
				return;
			}
		}
		if (this.change_level >= CHANGE_LEVEL_ICON_STATE) {
			this.dir_meta = null;
			if (!this.icon_meta) {
				this.change_level = CHANGE_LEVEL_NONE;
				return;
			}
			this.icon_state_meta =
		this.icon_meta[this.icon_state] ||
		this.icon_meta[" "] ||
		this.icon_meta[""];
			if (!this.icon_state_meta) {
				this.change_level = CHANGE_LEVEL_NONE;
				return;
			}
		}
		if (this.change_level >= CHANGE_LEVEL_DIR) {
			this.dir_meta = null;
			if (!this.icon_state_meta) {
				this.change_level = CHANGE_LEVEL_NONE;
				return;
			}
			const progression =
		this.icon_state_meta.dir_progression ||
		dir_progressions[this.icon_state_meta.dir_count] ||
		dir_progressions[1];

			this.dir_meta =
		this.icon_state_meta.dirs[progression[this.dir]] ||
		this.icon_state_meta.dirs[2];

			if (!this.dir_meta) {
				this.change_level = CHANGE_LEVEL_NONE;
				return;
			}
			if (this.atom) this.atom.mark_dirty();
			this.icon_frame = -1;
		}
		this.change_level = CHANGE_LEVEL_NONE;

		if (!this.dir_meta || this.dir_meta.frames.length <= 1) {
			this.icon_frame = 0;
			return;
		}
		let icon_time = timestamp % this.dir_meta.total_delay;
		if (this.flick)
			icon_time =
		timestamp - (this.flick.time_begin + this.client.server_time_to_client);
		else if (
			this.parent && this.parent.flick && ((!this._icon && this.parent.flick.icon) ||
		((!this._icon_state || this._icon_state.includes("[parent]")) && this.parent.flick.icon_state) ||
		(!this._dir && this.parent.flick.dir))
		)
			icon_time =
		timestamp -
		(this.parent.flick.time_begin + this.client.server_time_to_client);
		let accum_delay = 0;
		for (let i = 0; i < this.dir_meta.frames.length; i++) {
			accum_delay += this.dir_meta.frames[i].delay;
			if (accum_delay > icon_time) {
				if (i != this.icon_frame && this.atom) {
					this.atom.mark_dirty();
				}
				this.icon_frame = i;
				return;
			}
		}
	}

	draw(ctx: { drawImage: (arg0: any, arg1: any, arg2: any, arg3: any, arg4: any, arg5: number, arg6: number, arg7: any, arg8: any) => void; }) {
		if (!this.dir_meta || !this.icon_meta || !this.icon_meta.__image_object)
			return;
		let frame_meta = this.dir_meta.frames[
			this.icon_frame >= 0 && this.icon_frame < this.dir_meta.frames.length
				? this.icon_frame
				: 0
		];

		let image = this.icon_meta.__image_object;
		if (this.color) {
			color_canvas.width = Math.max(
				color_canvas.width,
				this.icon_state_meta.width
			);
			color_canvas.height = Math.max(
				color_canvas.height,
				this.icon_state_meta.height
			);
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const cctx: CanvasRenderingContext2D = color_canvas.getContext("2d")!;
			cctx.clearRect(
				0,
				0,
				this.icon_state_meta.width + 1,
				this.icon_state_meta.height + 1
			);
			cctx.fillStyle = this.color;
			cctx.globalCompositeOperation = "source-over";
			cctx.drawImage(
				image,
				frame_meta.x,
				frame_meta.y,
				this.icon_state_meta.width,
				this.icon_state_meta.height,
				0,
				0,
				this.icon_state_meta.width,
				this.icon_state_meta.height
			);
			cctx.globalCompositeOperation = "multiply";
			cctx.fillRect(
				0,
				0,
				this.icon_state_meta.width,
				this.icon_state_meta.height
			);
			cctx.globalCompositeOperation = "destination-in";
			cctx.drawImage(
				image,
				frame_meta.x,
				frame_meta.y,
				this.icon_state_meta.width,
				this.icon_state_meta.height,
				0,
				0,
				this.icon_state_meta.width,
				this.icon_state_meta.height
			);
			cctx.globalCompositeOperation = "source-over";
			image = color_canvas;
			frame_meta = { x: 0, y: 0 };
		}
		const offset = this.get_offset();

		ctx.drawImage(
			image,
			frame_meta.x,
			frame_meta.y,
			this.icon_state_meta.width,
			this.icon_state_meta.height,
			Math.round(offset[0] * 32),
			Math.round(-offset[1] * 32),
			this.icon_state_meta.width,
			this.icon_state_meta.height
		);
	}

	is_mouse_over(x: number, y: number) {
		if (!this.icon_meta || !this.dir_meta || !this.icon_meta.__image_data)
			return false;
		const offset = this.get_offset();
		x -= offset[0];
		y -= offset[1];
		const pxx = Math.floor(x * 32);
		const pxy = Math.floor(32 - y * 32);
		const frame_meta = this.dir_meta.frames[
			this.icon_frame >= 0 && this.icon_frame < this.dir_meta.frames.length
				? this.icon_frame
				: 0
		];
		if (
			pxx < 0 || pxy < 0 || pxx > this.icon_state_meta.width || pxy > this.icon_state_meta.height
		)
			return false;
		const idx = 3 + 4 *
		(pxx + frame_meta.x + (pxy + frame_meta.y) * this.icon_meta.__image_data.width);
		return this.icon_meta.__image_data.data[idx] > 0;
	}

	get icon() {
		if (this._icon === null && this.parent) return this.parent.icon;
		let icon = this._icon;
		if (this.flick && this.flick.icon) {
			icon = this.flick.icon;
		}
		return icon;
	}
	set icon(val) {
		this._icon = val;
	}

	get icon_state() {
		if (this._icon_state === null && this.parent) return this.parent.icon_state;
		let icon_state = this._icon_state;
		if (this.flick && this.flick.icon_state) {
			icon_state = this.flick.icon_state;
		}
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
		if (this._dir === null && this.parent) return this.parent.dir;
		let dir = this._dir;
		if (this.flick && this.flick.dir) {
			dir = this.flick.dir;
		}
		return dir;
	}
	set dir(val) {
		this._dir = val;
	}

	check_flick_validity(timestamp: number) {
		if (!this.flick) return;
		const icon_meta = this.client.icon_metas[this.icon];
		if (!icon_meta) return;
		const icon_state_meta = icon_meta[this.icon_state] || icon_meta[" "] || icon_meta[""];
		if (!icon_state_meta) {
			this.flick = null;
			return;
		}
		const progression = icon_state_meta.dir_progression || dir_progressions[icon_state_meta.dir_count] || dir_progressions[1];
		const dir_meta = icon_state_meta.dirs[progression[this.dir]] || icon_state_meta.dirs[2];
		if (!dir_meta) {
			this.flick = null;
			return;
		}
		const flick_time = timestamp - (this.flick.time_begin + this.client.server_time_to_client);
		if (flick_time > dir_meta.total_delay) this.flick = null;
	}

	get overlay_layer() {
		return this._overlay_layer;
	}
	set overlay_layer(val) {
		if (val === this._overlay_layer) return;
		this._overlay_layer = val;
		if (this.atom) this.atom.mark_dirty();
	}

	get offset_x() {
		return this._offset_x;
	}
	set offset_x(val) {
		if (val === this._offset_x) return;
		this._offset_x = +val || 0;
		if (this.atom) this.atom.mark_dirty();
	}
	get offset_y() {
		return this._offset_y;
	}
	set offset_y(val) {
		if (val === this._offset_y) return;
		this._offset_y = +val || 0;
		if (this.atom) this.atom.mark_dirty();
	}

	get_offset() {
		let dx = this.offset_x;
		let dy = this.offset_y;
		if (this.icon_state_meta && this.icon_state_meta.directional_offset) {
			const world_amt = this.icon_state_meta.directional_offset / 32;
			if (this.dir & 1) dy += world_amt;
			if (this.dir & 2) dy -= world_amt;
			if (this.dir & 4) dx += world_amt;
			if (this.dir & 8) dx -= world_amt;
		}
		return [dx, dy];
	}

	get color() {
		if (this._color === null && this.parent) return this.parent.color;
		return this._color;
	}
	set color(val) {
		if (val === this._color) return;
		this._color = "" + val;
		if (this.atom) this.atom.mark_dirty();
	}

	get alpha() {
		return this._alpha;
	}
	set alpha(val) {
		if (val === this._alpha) return;
		this._alpha = "" + val;
		if (this.atom) this.atom.mark_dirty();
	}
}

module.exports = IconRenderer;
