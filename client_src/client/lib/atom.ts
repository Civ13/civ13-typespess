export{};
const IconRenderer = require("./icon_renderer.js");
const Matrix = require("./matrix.js");
const EventEmitter = require("events");

class Atom extends EventEmitter {
	constructor(client: any, instobj: Record<string, any>) {
		super();
		if (!Object.prototype.hasOwnProperty.call(instobj, "x")) {
			instobj.x = 0;
		}
		if (!Object.prototype.hasOwnProperty.call(instobj, "y")) {
			instobj.y = 0;
		}
		this.client = client;
		this.directional = instobj.directional;
		this.main_icon_renderer = new IconRenderer(this);
		this.overlays = {};
		this.overlay_renderers_list = [];
		this.overlay_renderers = {};

		for (const key in instobj) {
			if (!Object.prototype.hasOwnProperty.call(instobj, key)) {continue;}
			if (key === "overlays" || key === "components" || key === "component_vars") {continue;}
			this[key] = instobj[key];
		}
		this.is_destroyed = false;
		this.client.atoms.push(this);
		if (this.network_id) {
			this.client.atoms_by_netid[this.network_id] = this;
		}

		this.eye_id = instobj.eye_id || "";
		this.eye = client.eyes[this.eye_id];
		if (this.eye) {
			this.eye.atoms.add(this);
		}

		this.mark_dirty();

		if (instobj.overlays) {
			for (const key in instobj.overlays) {
				if (!Object.prototype.hasOwnProperty.call(instobj.overlays, key)) {continue;}
				this.set_overlay(key, instobj.overlays[key]);
			}
		}

		this.components = {};
		for (const component_name of instobj.components || []) {
			if (!Object.prototype.hasOwnProperty.call(client.components, component_name)) {
				console.warn(
					`Server passed an unknown networked component '${component_name}'! Yell at the devs of your server.`
				);
				continue;
			}
			const Ctor = client.components[component_name];
			this.components[component_name] = new Ctor(
				this,
				instobj.component_vars ? instobj.component_vars[component_name] : {}
			);
		}
	}

	del() {
		this.is_destroyed = true;
		if (this.eye) {
			this.eye.atoms.delete(this);
			const plane = this.get_plane();
			if (plane) {
				plane.atoms.delete(this);
			}
		}
		this.client.atoms.splice(this.client.atoms.indexOf(this), 1);
		delete this.client.atoms_by_netid[this.network_id];
		for (const tcomponent of Object.values(this.components)) {
			const component: any = tcomponent;
			component.destroy();
		}
	}

	get_plane_id() {
		// eslint-disable-next-line eqeqeq -- otherwise it wont work
		if (this.screen_loc_x != null || this.screen_loc_y != null) {
			return "ui";
		}
		return "";
	}

	get_plane() {
		return this.eye && this.eye.planes.get(this.get_plane_id());
	}

	mark_dirty() {
		const plane = this.get_plane();
		if (plane) {
			plane.dirty_atoms.add(this);
		}
	}

	set_overlay(key: string, value: {[x: string]: any; overlay_layer: number}) {
		let overlay_renderer;
		if (this.overlays[key] && !value) {
			delete this.overlays[key];
			overlay_renderer = this.overlay_renderers[key];
			const idx = this.overlay_renderers_list.indexOf(overlay_renderer);
			if (idx !== -1) {
				this.overlay_renderers_list.splice(idx, 1);
			}
			delete this.overlay_renderers[key];
			this.mark_dirty();
			return;
		}
		if (!this.overlays[key] && value) {
			this.overlays[key] = value;
			overlay_renderer = new IconRenderer(this);
			this.overlay_renderers_list.push(overlay_renderer);
			this.overlay_renderers[key] = overlay_renderer;
			overlay_renderer.parent = this.main_icon_renderer;
		} else if (this.overlays[key] && value) {
			overlay_renderer = this.overlay_renderers[key];
			this.overlays[key] = value;
		} else {return;}
		overlay_renderer.overlay_layer = value.overlay_layer || 0;
		for (const prop of ["icon", "icon_state", "dir", "color", "alpha", "offset_x", "offset_y"]) {
			overlay_renderer[prop] = value[prop];
		}
		this.overlay_renderers_list.sort((a: {overlay_layer: number}, b: {overlay_layer: number}) => {
			return a.overlay_layer - b.overlay_layer;
		});
	}

	get_displacement(timestamp: any) {
		let dispx = 0;
		let dispy = 0;
		// eslint-disable-next-line eqeqeq
		if (this.screen_loc_x != null) {
			dispx = this.screen_loc_x;
			dispy = this.screen_loc_y;
		} else {
			let glidex = 0;
			let glidey = 0;
			this.update_glide(timestamp);
			if (this.glide) {
				glidex = this.glide.x;
				glidey = this.glide.y;
			}
			dispx = this.x + glidex;
			dispy = this.y + glidey;
		}
		return {dispx, dispy};
	}

	get_transform() {
		return Matrix.identity;
	}

	update_glide(timestamp: any) {
		if (!this.glide) {return;}
		this.glide.update(timestamp);
	}

	is_mouse_over(x: any, y: any) {
		for (const overlay of this.overlay_renderers_list) {
			if (overlay.is_mouse_over(x, y)) {return true;}
		}
		return this.main_icon_renderer.is_mouse_over(x, y);
	}

	on_render_tick(timestamp: any) {
		for (const overlay of this.overlay_renderers_list) {
			overlay.on_render_tick(timestamp);
		}
		return this.main_icon_renderer.on_render_tick(timestamp);
	}

	draw(ctx: any, timestamp: any) {
		for (const overlay of this.overlay_renderers_list) {
			overlay.draw(ctx, timestamp);
		}
		let i;
		for (i = 0; i < this.overlay_renderers_list.length; i++) {
			const overlay = this.overlay_renderers_list[i];
			if (overlay.overlay_layer >= 0) {break;}
			overlay.draw(ctx, timestamp);
		}
		this.main_icon_renderer.draw(ctx, timestamp);
		for (; i < this.overlay_renderers_list.length; i++) {
			const overlay = this.overlay_renderers_list[i];
			overlay.draw(ctx, timestamp);
		}
	}

	get_bounds() {
		let bounds = this.main_icon_renderer.get_bounds();
		for (const overlay of this.overlay_renderers_list) {
			const overlay_bounds = overlay.get_bounds();
			if (!overlay_bounds) {continue;}
			if (!bounds) {
				bounds = overlay_bounds;
				continue;
			}
			if (overlay_bounds.x < bounds.x) {
				bounds.width += bounds.x - overlay_bounds.x;
				bounds.x = overlay_bounds.x;
			}
			if (overlay_bounds.y < bounds.y) {
				bounds.height += bounds.y - overlay_bounds.y;
				bounds.y = overlay_bounds.y;
			}
			bounds.width = Math.max(bounds.width, overlay_bounds.x - bounds.x + overlay_bounds.width);
			bounds.height = Math.max(bounds.height, overlay_bounds.y - bounds.y + overlay_bounds.height);
		}
		return bounds;
	}

	get_transformed_bounds() {
		const transform = this.get_transform();
		const bounds = this.get_bounds();
		if (!bounds) {
			return bounds;
		}
		const corners = [
			[bounds.x, bounds.y],
			[bounds.x + bounds.width, bounds.y],
			[bounds.x, bounds.y + bounds.height],
			[bounds.x + bounds.width, bounds.y + bounds.height],
		];
		let [left, right, top, bottom] = [Infinity, -Infinity, -Infinity, Infinity];
		for (const corner of corners) {
			const transformed_corner = transform.multiply_array([corner[0] - 0.5, corner[1] - 0.5]);
			transformed_corner[0] += 0.5;
			transformed_corner[1] += 0.5;
			left = Math.min(left, transformed_corner[0]);
			right = Math.max(right, transformed_corner[0]);
			top = Math.max(top, transformed_corner[1]);
			bottom = Math.min(bottom, transformed_corner[1]);
		}
		return {
			x: left,
			y: bottom,
			width: right - left,
			height: top - bottom,
		};
	}

	fully_load(forced_directional = false) {
		const promises = [];
		promises.push(this.main_icon_renderer.fully_load(forced_directional));
		for (const overlay of this.overlay_renderers_list) {
			promises.push(overlay.fully_load(forced_directional));
		}
		return Promise.all(promises);
	}

	get icon() {
		return this.main_icon_renderer.icon;
	}
	set icon(val) {
		this.main_icon_renderer.icon = val;
	}

	get icon_state() {
		return this.main_icon_renderer.icon_state;
	}
	set icon_state(val) {
		this.main_icon_renderer.icon_state = val;
	}

	get dir() {
		return this.main_icon_renderer.dir;
	}
	set dir(val) {
		this.main_icon_renderer.dir = val;
	}

	get color() {
		return this.main_icon_renderer.color;
	}
	set color(val) {
		this.main_icon_renderer.color = val;
	}

	get alpha() {
		return this.main_icon_renderer.alpha;
	}
	set alpha(val) {
		this.main_icon_renderer.alpha = val;
	}

	get c() {
		return this.components;
	}
}

class Glide {
	object: any;
	lasttime: any;
	x: number;
	y: number;
	constructor(object: any, params: any) {
		this.object = object;
		this.lasttime = params.lasttime || performance.now();
		this.x = 0;
		this.y = 0;
		if (
			params.oldx === +params.oldx &&
			params.oldy === +params.oldy &&
			(params.oldx !== object.x || params.oldy !== object.y) &&
			Math.abs(Math.max(object.x - params.oldx, object.y - params.oldy)) <= 1.5001
		) {
			let pgx = (object.glide && object.glide.x) || 0;
			if (Math.sign(pgx) === params.oldx - object.x) {
				pgx = 0;
			}
			let pgy = (object.glide && object.glide.y) || 0;
			if (Math.sign(pgy) === params.oldy - object.y) {
				pgy = 0;
			}
			Object.assign(this, {
				x: params.oldx - object.x + pgx,
				y: params.oldy - object.y + pgy,
			});
			return this;
		}
		return object.glide;
	}
	update(timestamp: number) {
		let glidex = this.x;
		let glidey = this.y;
		let glide_size = +this.object.glide_size;
		if (glide_size !== glide_size) {
			glide_size = this.object.client.glide_size;
		}
		if (glide_size !== glide_size || glide_size === 0) {
			this.object.glide = null;
			return;
		}
		const dist = Math.max((glide_size * (timestamp - this.lasttime)) / 1000, 0);
		this.lasttime = timestamp;
		if (Math.abs(glidex) < dist) {
			glidex = 0;
		} else {
			glidex -= Math.sign(glidex) * dist;
		}
		if (Math.abs(glidey) < dist) {
			glidey = 0;
		} else {
			glidey -= Math.sign(glidey) * dist;
		}
		this.x = glidex;
		this.y = glidey;
		if (glidex === 0 && glidey === 0) {
			this.object.glide = void 0;
		}
	}
}

Atom.Glide = Glide;

Atom.atom_comparator = function (
	a: {layer: number; y: number; network_id: number},
	b: {layer: number; y: number; network_id: number}
) {
	if (!a && !b) {
		return 0;
	}
	if (!a) {
		return 1;
	}
	if (!b) {
		return -1;
	}
	let comparison = a.layer - b.layer;
	if (comparison === 0) {
		comparison = b.y - a.y;
	}
	if (comparison === 0) {
		if (a.network_id > b.network_id) {
			comparison = 1;
		} else if (a.network_id < b.network_id) {
			comparison = -1;
		}
	}
	return comparison;
};

module.exports = Atom;
