/* eslint-disable max-lines */
export{};
const EventEmitter = require("events");
const mob_symbols = require("./mob.js")._symbols;
const {has_component} = require("../utils.js");
const Component = require("./component.js");

let id_counter = 0;

const _loc: any = Symbol("_loc");
const _x: any = Symbol("_x");
const _y: any = Symbol("_y");
const _z: any = Symbol("_z");
const _dim: any = Symbol("_dim");
const _bounds_x: any = Symbol("_bounds_x");
const _bounds_y: any = Symbol("_bounds_y");
const _bounds_width: any = Symbol("_bounds_width");
const _bounds_height: any = Symbol("_bounds_height");
const _crosses: any = Symbol("_crosses");

const _walking: any = Symbol("_walking");
const _walk_stepping: any = Symbol("_walk_stepping");
const _walk_step: any = Symbol("_walk_step");

const _icon: any = Symbol("_icon");
const _icon_state: any = Symbol("_icon_state");
const _dir: any = Symbol("_dir");
const _layer: any = Symbol("_layer");
const _name: any = Symbol("_name");
const _glide_size: any = Symbol("_glide_size");
const _screen_loc_x: any = Symbol("_screen_loc_x");
const _screen_loc_y: any = Symbol("_screen_loc_y");
const _mouse_opacity: any = Symbol("_mouse_opacity");
const _color: any = Symbol("_color");
const _alpha: any = Symbol("_alpha");
const _visible: any = Symbol("_visible");

const _opacity: any = Symbol("_opacity");

const _changeloc: any = Symbol("_changeloc");
const _emit_parent_move: any = Symbol("_emit_parent_move");

/** @typedef {import('../server')} Typespess */
/** @typedef {import('./component')} Typespess.Component */

/**
 * The quintessential object class, the type of every object.
 * @memberof Typespess
 */
class Atom extends EventEmitter {
	/**
	 * @constructor
	 * @param {Typespess} server The server object
	 * @param {template} template The template
	 * @param {Location|Typespess.Atom|null} location The starting location. You can also add 3 arguments x,y,z alternatively
	 */
	constructor(
		server: any,
		template: any,
		x: number,
		y: number,
		z: number,
		dim: {location: (arg0: any, arg1: any, arg2: any) => any}
	) {
		const otemp = template;
		if (typeof template === "string") {
			template = server.templates[template];
		}
		if (template && template.pick_from) {
			template = template.pick_from[Math.floor(Math.random() * template.pick_from.length)];
			if (typeof template === "string") {
				template = server.templates[template];
			}
		}
		if (
			template &&
			template.use_random_variant &&
			!template.is_variant &&
			template.variants &&
			template.variants.length
		) {
			const new_variant_leaf_path = new Array(template.variants.length);
			for (const i of template.variants.length) {
				const variant = template.variants[i];
				if (variant.type === "single") {
					new_variant_leaf_path[i] = variant.values[Math.floor(Math.random() * variant.values.length)];
				}
			}
			template = server.get_template_variant(template, new_variant_leaf_path);
		}

		if (!server) {
			throw new Error(`Invalid arguments while instantiating: server: ${server}`);
		}
		if (!template) {
			throw new Error(`Invalid arguments while instantiating template: ${otemp}, ${template}`);
		}
		super();

		this.directional = false;
		/**
		 * The template this atom was constructed with. Useful to get the initial values of variables.
		 * @type {template}
		 */
		this.template = template;

		/**
		 * @see {@link Typespess.Atom#destroy}
		 * @type {boolean}
		 * @default false
		 */
		this.destroyed = false;

		Object.defineProperty(this, "server", {
			enumerable: false,
			configurable: false,
			writable: false,
			value: server,
		});
		Object.defineProperty(this, "object_id", {
			enumerable: true,
			configurable: false,
			writable: false,
			value: `ID_${id_counter++}`,
		});
		/**
		 * A list of atoms whos loc is this atom.
		 * @type {Array<Typespess.Atom>}
		 * @member contents
		 * @memberof Typespess.Atom
		 * @instance
		 */
		Object.defineProperty(this, "contents", {
			enumerable: true,
			configurable: false,
			writable: false,
			value: [],
		});

		this[_name] = "object";
		this[_glide_size] = 10;
		this[_layer] = 0;
		this[_dir] = 2;
		/**
		 * Can be "neuter", "male", "female", or "plural".
		 * @type {string}
		 * @default "neuter"
		 */
		this.gender = "neuter";

		this[_crosses] = [];

		this.server.process_template(template);
		server.atoms.set(this.object_id, this);

		this[_bounds_x] = 0;
		this[_bounds_y] = 0;
		this[_bounds_width] = 1;
		this[_bounds_height] = 1;
		this[mob_symbols._viewers] = [];
		this[mob_symbols._visgroups] = [];

		/**
		 * Whether it's dense or not. 1 means that it can't be crossed, 0 means that it can be crossed, -1 means that it passes through everything, even with density 1.
		 * @type {number}
		 */
		this.density = 0;
		/**
		 * A bitfield for ability to pass through other objects.
		 * @type {number}
		 */
		this.pass_flags = 0;
		/**
		 * A bitfield for ability of other objects to pass through this one.
		 * @type {number}
		 */
		this.let_pass_flags = 0;
		this[_opacity] = false;
		this[_visible] = true;

		this[_walking] = false;
		this[_walk_stepping] = false;
		/**
		 * @type {number}
		 * @see {@link Typespess.Atom#walking}
		 */
		this.walk_dir = 0;
		/**
		 * @type {number}
		 * @default 1
		 * @see {@link Typespess.Atom#walking}
		 */
		this.walk_size = 1;
		/**
		 * @type {number}
		 * @default 150
		 * @see {@link Typespess.Atom#walking}
		 */
		this.walk_delay = 150;
		/**
		 * @type {number}
		 * @default "walking"
		 * @see {@link Typespess.Atom#walking}
		 */
		this.walk_reason = "walking";
		this.movement_granularity = 65536; // Keep this a power of 2 to avoid floating point errors.

		if (template.vars) {
			for (const key in template.vars) {
				if (
					!Object.prototype.hasOwnProperty.call(template.vars, key) ||
					key === "appearance" ||
					key === "components" ||
					key === "overlays"
				) {continue;}
				this[key] = template.vars[key];
			}
		}

		if (template.vars && template.vars.appearance) {
			Object.assign(this, template.vars.appearance);
		}

		/**
		 * The overlays of this object. They are named, unlike BYOND where it's just a list.
		 * @type {Object}
		 * @property {Object} <key>
		 * @property {string} [<key>.icon] {@link Typespess.Atom#icon}
		 * @property {string} [<key>.icon_state] {@link Typespess.Atom#icon_state} The string <code>[parent]</code> gets replaced with this atom's <code>icon_state</code> by the client.
		 * @property {number} [<key>.dir] {@link Typespess.Atom#dir}
		 * @property {string} [<key>.color] {@link Typespess.Atom#color}
		 * @property {string} [<key>.alpha] {@link Typespess.Atom#alpha}
		 * @property {number} [<key>.overlay_layer=0] set negative to display below the atom, and 0 or greater for above the atom. Also use to control which overlays show in front.
		 */
		this.overlays = new Proxy(
			{},
			{
				set: (target: any, key: any, value: any) => {
					if (typeof value === "undefined") {
						target[key] = void 0;
						this[mob_symbols._update_var](key, 2);
						return true;
					}
					if (typeof value === "string") {
						value = {icon_state: value, overlay_layer: 1};
					}
					if (value instanceof Atom) {
						value = value.appearance;
					}
					if (typeof value !== "object") {
						throw new TypeError(`Object or string expected for overlay. Got ${value} instead.`);
					}
					value = new Proxy(Object.assign({}, value), {
						set: (target2, key2, value2) => {
							target2[key2] = value2;
							this[mob_symbols._update_var](key, 2);
							return true;
						},
					});
					target[key] = value;
					this[mob_symbols._update_var](key, 2);
					return true;
				},
			}
		);

		/**
		 * The components for this object.
		 * @type {Object<string,Typespess.Component>}
		 * @see {@link Typespess.Component}
		 */
		this.components = {};
		if (template.components) {
			for (let i = 0; i < template.components.length; i++) {
				const componentName = template.components[i];
				if (this.components[componentName]) {
					throw new Error(`Template '${template.id}' defines component '${componentName}' multiple times`);
				}
				const componentConstructor = this.server.components[componentName];
				if (!componentConstructor) {
					throw new Error(`Template '${template.id}' references non-existent component '${componentName}'`);
				}
				const templateVars =
					template.vars && template.vars.components && template.vars.components[componentName]
						? template.vars.components[componentName]
						: {};
				this.components[componentName] = new this.server.components[componentName](this, templateVars);
			}
		}

		this[_x] = 0;
		this[_y] = 0;
		this[_z] = 0;
		this[_loc] = null;
		if (typeof x === "number") {
			x = +x;
			y = +y;
			z = +z;
			if (x !== x) {
				x = 0;
			}
			if (y !== y) {
				y = 0;
			}
			if (z !== z) {
				z = 0;
			}
			z = Math.floor(z);

			this[_changeloc](x, y, z, dim.location(x, y, z));
		} else if (typeof x === "object" && typeof x !== "undefined") {
			this.loc = x;
		}
	}

	/**
	 * Alias for components
	 * @see {@link Typespess.Atom#components}
	 */
	get c() {
		return this.components;
	}

	/**
	 * Event name is prepended with, if applicable: ctrl_, alt_, shift_, middle_ in that order.
	 * @event Typespess.Atom#clicked
	 * @type {mouse_event}
	 */
	/**
	 * @event Typespess.Atom#mouse_dragged_to
	 * @type {Object}
	 * @property {mouse_event} from
	 * @property {mouse_event} to
	 * @property {Client} client
	 * @property {Typespess.Atom<Mob>} mob
	 */
	/**
	 * @event Typespess.Atom#mouse_dropped_by
	 * @type {Object}
	 * @property {mouse_event} from
	 * @property {mouse_event} to
	 * @property {Client} client
	 * @property {Typespess.Atom<Mob>} mob
	 */

	/**
	 * Passed to movement events.
	 * @class
	 * @property {Object} old
	 * @property {number} old.x
	 * @property {number} old.y
	 * @property {number} old.z
	 * @property {Typespess.Atom|Location|null} old.loc
	 * @property {boolean} old.is_fine_loc=true
	 * @property {Object} new
	 * @property {number} new.x
	 * @property {number} new.y
	 * @property {number} new.z
	 * @property {Typespess.Atom|Location|null} new.loc
	 * @property {boolean} new.is_fine_loc=true
	 * @name movement
	 * @alias movement
	 */

	/**
	 * Fires before any type of movement occurs. This cannot be used to prevent the movement from occuring.
	 * @type {movement}
	 * @event Typespess.Atom#before_move
	 */
	/**
	 * Fires before another atom leaves this atom's <code>contents</code> list
	 * @type {movement}
	 * @event Typespess.Atom#before_exit
	 */
	/**
	 * Fires before another atom enters this atom's <code>contents</code> list
	 * @type {movement}
	 * @event Typespess.Atom#before_enter
	 */
	/**
	 * Fires when this atom moves and begins intersecting another atom
	 * @param {Typespess.Atom} crossing
	 * @param {movement} movement
	 * @event Typespess.Atom#crossed
	 */
	/**
	 * Fires when another atom moves and begins intersecting this atom
	 * @param {Typespess.Atom} crosser
	 * @param {movement} movement
	 * @event Typespess.Atom#crossed_by
	 */
	/**
	 * Fires when this atom moves and stops intersecting another atom
	 * @param {Typespess.Atom} uncrossing
	 * @param {movement} movement
	 * @event Typespess.Atom#uncrossed
	 */
	/**
	 * Fires when another atom moves and stops intersecting this atom
	 * @param {Typespess.Atom} uncrosser
	 * @param {movement} movement
	 * @event Typespess.Atom#uncrossed_by
	 */
	/**
	 * Fires when this atom moves.
	 * @type {movement}
	 * @event Typespess.Atom#moved
	 */
	/**
	 * Fires when an atom that contains this atom moves, recursively..
	 * @type {movement}
	 * @event Typespess.Atom#parent_moved
	 */
	/**
	 * Fires when another atom leaves this atom's <code>contents</code> list
	 * @type {movement}
	 * @event Typespess.Atom#exited
	 */
	/**
	 * Fires when another atom enters this atom's <code>contents</code> list
	 * @type {movement}
	 * @event Typespess.Atom#entered
	 */

	[_changeloc](
		newX: any,
		newY: any,
		newZ: any,
		newLoc: Record<string, any>,
		newBounds_x: any,
		newBounds_y: any,
		newBounds_width: any,
		newBounds_height: any
	) {
		if (!newZ) {
			newZ = this[_z];
		}
		if (newLoc && !newLoc.is_base_loc && this[_loc] && !this[_loc].is_base_loc && newLoc === this[_loc]) {return;}
		let old_fine_loc = this.fine_loc;
		const new_fine_loc = {
			x: newX,
			y: newY,
			z: newZ,
			dim: newLoc && newLoc.dim,
			loc: newLoc,
			is_fine_loc: true,
		};
		const movement: Record<string, any> = {};
		movement.old = old_fine_loc;
		movement.new = new_fine_loc;
		if (old_fine_loc.loc && old_fine_loc.loc.is_base_loc && new_fine_loc.loc && new_fine_loc.loc.is_base_loc) {
			movement.offset = {};
			movement.offset.x = new_fine_loc.x - old_fine_loc.x;
			movement.offset.y = new_fine_loc.y - old_fine_loc.y;
			movement.offset.z = new_fine_loc.z - old_fine_loc.z;
		}
		movement.atom = this;
		this.emit("before_move", movement);
		if (old_fine_loc.loc && old_fine_loc.loc.emit) {
			old_fine_loc.loc.emit("before_exit", movement);
		}
		if (new_fine_loc.loc && new_fine_loc.loc.emit) {
			new_fine_loc.loc.emit("before_enter", movement);
		}
		if (newLoc && !newLoc.is_base_loc && this.loc && !this.loc.is_base_loc && newLoc === this.loc) {return;}
		old_fine_loc = this.fine_loc;
		movement.old = old_fine_loc;
		if (old_fine_loc.loc && old_fine_loc.loc.is_base_loc && new_fine_loc.loc && new_fine_loc.loc.is_base_loc) {
			movement.offset = {};
			movement.offset.x = new_fine_loc.x - old_fine_loc.x;
			movement.offset.y = new_fine_loc.y - old_fine_loc.y;
			movement.offset.z = new_fine_loc.z - old_fine_loc.z;
		}
		// Test for cycles, but don't bother if the new location is in the world
		if (newLoc && !newLoc.is_base_loc) {
			let slowPointer = newLoc;
			let fastPointer = newLoc;
			// eslint-disable-next-line eqeqeq
			while (slowPointer != null) {
				slowPointer = slowPointer[_loc];
				if (fastPointer) {
					fastPointer = fastPointer[_loc];
				}
				if (fastPointer) {
					fastPointer = fastPointer[_loc];
				}
				if ((fastPointer && fastPointer === slowPointer) || fastPointer === this || slowPointer === this) {
					throw new Error(`Cycle detected when assigning the location of ${this} to ${newLoc}`);
				}
			}
		}

		const lost_viewers: any[] = [];
		let gained_viewers: any[] = [];

		let lost_crossers: any[] = [];
		let gained_crossers: any[] = [];
		let common_crossers: any[] = [];

		if (this[_loc]) {
			if (this[_loc].contents) {
				const idx = this[_loc].contents.indexOf(this);
				if (idx !== -1) {
					this[_loc].contents.splice(idx, 1);
				}
			}
			if (this[_loc].is_base_loc) {
				for (
					let x = Math.floor(this[_x] + this[_bounds_x] + 0.001);
					x < Math.ceil(this[_x] + this[_bounds_x] + this[_bounds_width] - 0.001);
					x++
				) {
					for (
						let y = Math.floor(this[_y] + this[_bounds_y] + 0.001);
						y < Math.ceil(this[_y] + this[_bounds_y] + this[_bounds_height] - 0.001);
						y++
					) {
						const thisloc = this[_loc].dim.location(x, y, this[_z]);
						const idx = thisloc.partial_contents.indexOf(this);
						if (idx !== -1) {
							thisloc.partial_contents.splice(idx, 1);
						}
						thisloc.viewers.forEach((item: any) => {
							lost_viewers.push(item);
						});
						for (const atom of thisloc.partial_contents) {
							if (atom !== this && atom.does_cross(this) && !lost_crossers.includes(atom)) {
								lost_crossers.push(atom);
							}
						}
					}
				}
			}
		}

		this[_x] = newX;
		this[_y] = newY;
		this[_z] = newZ;
		this[_dim] = newLoc && newLoc.dim;
		this[_loc] = newLoc;
		if (typeof newBounds_x !== "undefined") {
			this[_bounds_x] = newBounds_x;
			this[_bounds_y] = newBounds_y;
			this[_bounds_width] = newBounds_width;
			this[_bounds_height] = newBounds_height;
		}

		this[_crosses].length = 0;

		if (this[_loc]) {
			if (this[_loc].contents) {
				this[_loc].contents.push(this);
			}
			if (this[_loc].is_base_loc) {
				[gained_viewers, gained_crossers, lost_crossers, common_crossers] = this.do_base_loc(
					gained_viewers,
					gained_crossers,
					lost_crossers,
					common_crossers
				);
			}
		}

		for (const gained of gained_crossers) {
			if (!gained[_crosses].includes(this)) {
				gained[_crosses].push(this);
			}
			this.emit("crossed", gained, movement);
			gained.emit("crossed_by", this, movement);
		}

		for (const lost of lost_crossers) {
			const idx = lost[_crosses].indexOf(this);
			if (idx !== -1) {
				lost[_crosses].splice(idx, 1);
			}
			this.emit("uncrossed", lost, movement);
			lost.emit("uncrossed_by", this, movement);
		}
		for (const lost of lost_viewers) {
			lost.c.Eye[mob_symbols._common_tiles_count].set(
				this,
				lost.c.Eye[mob_symbols._common_tiles_count].get(this) - 1
			);
		}
		for (const gained of gained_viewers) {
			gained.c.Eye[mob_symbols._common_tiles_count].set(
				this,
				gained.c.Eye[mob_symbols._common_tiles_count].get(this) + 1 || 1
			);
		}
		for (const lost of lost_viewers) {
			if (!lost.c.Eye.can_see(this)) {
				lost.c.Eye[mob_symbols._remove_viewing](this);
			}
		}
		for (const gained of gained_viewers) {
			if (gained.c.Eye.can_see(this)) {
				gained.c.Eye[mob_symbols._add_viewing](this);
			}
		}

		this.emit("moved", movement);
		this[_emit_parent_move](movement);
		if (old_fine_loc.loc && old_fine_loc.loc.emit) {
			old_fine_loc.loc.emit("exited", movement);
		}
		if (new_fine_loc.loc && new_fine_loc.loc.emit) {
			new_fine_loc.loc.emit("entered", movement);
		}
		this[mob_symbols._update_var]("x", 0); // Send the changes to the network.
		this[mob_symbols._update_var]("y", 0);
	}
	do_base_loc(gained_viewers: any, gained_crossers: any, lost_crossers: any, common_crossers: any) {
		for (
			let x = Math.floor(this[_x] + this[_bounds_x] + 0.0001);
			x < Math.ceil(this[_x] + this[_bounds_x] + this[_bounds_width] - 0.0001);
			x++
		) {
			for (
				let y = Math.floor(this[_y] + this[_bounds_y] + 0.0001);
				y < Math.ceil(this[_y] + this[_bounds_y] + this[_bounds_height] - 0.0001);
				y++
			) {
				const thisloc = this[_loc].dim.location(x, y, this[_z]);
				if (!thisloc.partial_contents.includes(this)) {
					thisloc.partial_contents.push(this);
				}
				thisloc.viewers.forEach((item: any) => {
					gained_viewers.push(item);
				});
				for (const atom of thisloc.partial_contents) {
					if (atom !== this && this.does_cross(atom)) {
						const idx = lost_crossers.indexOf(atom);
						if (idx === -1) {
							if (!gained_crossers.includes(atom) && !common_crossers.includes(atom)) {
								gained_crossers.push(atom);
							}
						} else {
							lost_crossers.splice(idx, 1);
							common_crossers.push(atom);
						}
						if (!this[_crosses].includes(atom)) {
							this[_crosses].push(atom);
						}
					}
				}
			}
		}
		return [gained_viewers, gained_crossers, lost_crossers, common_crossers];
	}

	force_move(x: any, y: any, z: any, dim: any, bounds_x: any, bounds_y: any, bounds_width: any, bounds_height: any) {
		this[_changeloc](x, y, z, dim.location(x, y, z), bounds_x, bounds_y, bounds_width, bounds_height);
	}
	resize(bounds_x: any, bounds_y: any, bounds_width: any, bounds_height: any) {
		this[_changeloc](this[_x], this[_y], this[_z], this[_loc], bounds_x, bounds_y, bounds_width, bounds_height);
	}

	[_emit_parent_move](movement: any) {
		for (const child of this.contents) {
			child.emit("parent_moved", movement);
			child[_emit_parent_move](movement);
		}
	}

	/**
	 * @param {number} newX
	 * @param {number} newY
	 * @returns {Object}
	 * @property {Array<Typespess.Atom>} gained_crossers
	 * @property {Array<Typespess.Atom>} lost_crossers
	 * @property {Array<Typespess.Atom>} common_crossers
	 */
	test_move(newX: number, newY: number) {
		let lost_crossers: any[] = [];
		let gained_crossers: any[] = [];
		let common_crossers: any[] = [];

		if (this[_loc] && this[_loc].is_base_loc && this[_loc].is_base_loc) {
			for (
				let x = Math.floor(this[_x] + this[_bounds_x] + 0.001);
				x < Math.ceil(this[_x] + this[_bounds_x] + this[_bounds_width] - 0.001);
				x++
			) {
				for (
					let y = Math.floor(this[_y] + this[_bounds_y] + 0.001);
					y < Math.ceil(this[_y] + this[_bounds_y] + this[_bounds_height] - 0.001);
					y++
				) {
					const thisloc = this[_loc].dim.location(x, y, this[_z]);
					for (const atom of thisloc.partial_contents) {
						if (atom !== this && atom.does_cross(this) && !lost_crossers.includes(atom)) {
							lost_crossers.push(atom);
						}
					}
				}
			}
		}

		if (this[_loc].is_base_loc)
			{[gained_crossers, lost_crossers, common_crossers] = this.test_move_base_loc(gained_crossers, lost_crossers, common_crossers, newX, newY);}
		return {gained_crossers, lost_crossers, common_crossers};
	}
	test_move_base_loc(gained_crossers: any, lost_crossers: any, common_crossers: any, newX: number, newY: number) {
		for (
			let x = Math.floor(newX + this[_bounds_x] + 0.0001);
			x < Math.ceil(newX + this[_bounds_x] + this[_bounds_width] - 0.0001);
			x++
		) {
			for (
				let y = Math.floor(newY + this[_bounds_y] + 0.0001);
				y < Math.ceil(newY + this[_bounds_y] + this[_bounds_height] - 0.0001);
				y++
			) {
				const thisloc = this[_loc].dim.location(x, y, this[_z]);
				for (const atom of thisloc.partial_contents) {
					if (atom !== this && this.does_cross(atom, {x: newX, y: newY})) {
						const idx = lost_crossers.indexOf(atom);

						if (idx === -1) {
							if (!gained_crossers.includes(atom) && !common_crossers.includes(atom)) {
								gained_crossers.push(atom);
							}
						} else {
							lost_crossers.splice(idx, 1);
							common_crossers.push(atom);
						}
					}
				}
			}
		}
		return [gained_crossers, lost_crossers, common_crossers];
	}
	/** @type {number} */
	get x() {
		if (this[_loc] && !this[_loc].is_base_loc) {
			return this[_loc].x;
		}
		return this[_x];
	}
	set x(newX) {
		newX = +newX; // cast to number
		if (newX === this[_x] && this[_loc] && this[_loc].is_base_loc) {return;}
		if (newX !== newX) {
			// NaN check, NaN != NaN
			throw new TypeError(`New X value ${newX} is not a number!`);
		}
		this[_changeloc](newX, this[_y], this[_z], this.dim.location(newX, this[_y], this[_z]));
	}

	/** @type {number} */
	get y() {
		if (this[_loc] && !this[_loc].is_base_loc) {
			return this[_loc].y;
		}
		return this[_y];
	}
	set y(newY) {
		newY = +newY; // cast to number
		if (newY === this[_y] && this[_loc] && this[_loc].is_base_loc) {return;}
		if (newY !== newY) {
			// NaN check, NaN != NaN
			throw new TypeError(`New Y value ${newY} is not a number!`);
		}
		this[_changeloc](this[_x], newY, this[_z], this.dim.location(this[_x], newY, this[_z]));
	}

	/** @type {number} */
	get z() {
		if (this[_loc] && !this[_loc].is_base_loc) {
			return this[_loc].z;
		}
		return this[_z];
	}
	set z(newZ) {
		newZ = +newZ; // ast to number
		if (newZ === this[_z] && this[_loc] && this[_loc].is_base_loc) {return;}
		if (newZ !== newZ) {
			// NaN check, NaN != NaN
			throw new TypeError(`New Z value ${newZ} is not a number!`);
		}
		this[_changeloc](this[_x], this[_y], newZ, this.dim.location(this[_x], this[_y], newZ));
	}

	/** @type {Typespess.Dimension} */
	get dim() {
		if (this[_loc] && !this[_loc].is_base_loc) {
			return this[_loc].dim;
		}
		return this[_dim];
	}
	set dim(newDim) {
		if (newDim === this[_dim]) {return;}
		this[_changeloc](this[_x], this[_y], this[_z], newDim.location(this[_x], this[_y], this[_z]));
	}

	/** @type {Typespess.Atom|Location|null} */
	get loc() {
		return this[_loc];
	}
	set loc(newLoc) {
		if (newLoc === this[_loc]) {return;}
		if (
			newLoc !== null &&
			(typeof newLoc !== "object" || (!(newLoc.contents instanceof Array) && !newLoc.is_fine_loc))
		) {
			throw new TypeError(
				`New loc '${newLoc}' is not a valid location (null, object with contents list, or fine loc)`
			);
		}
		if (newLoc !== null && newLoc.is_fine_loc) {
			if (
				!Object.prototype.hasOwnProperty.call(newLoc, "x") ||
				!Object.prototype.hasOwnProperty.call(newLoc, "y")
			) {
				this.loc = newLoc.loc;
				return;
			}
			if (typeof newLoc.loc === "undefined") {this.loc = null; return;}
			if (newLoc.loc !== null && !newLoc.loc.is_base_loc) {this.loc = newLoc.loc; return;}
			if (
				(Object.prototype.hasOwnProperty.call(newLoc, "z") && newLoc.z !== +newLoc.z) ||
				newLoc.x !== +newLoc.x ||
				newLoc.y !== +newLoc.y ||
				!newLoc.dim
			) {
				throw new TypeError("new fine loc is invalid");
			}
			const newz = newLoc.z !== null ? newLoc.z : this.z;
			this[_changeloc](newLoc.x, newLoc.y, newz, newLoc.dim.location(newLoc.x, newLoc.y, newz));
			return;
		}
		if (newLoc !== null && newLoc.is_base_loc) {
			this[_changeloc](newLoc.x, newLoc.y, newLoc.z, newLoc);
		} else {
			this[_changeloc](0, 0, 0, newLoc);
		}
	}

	/**
	 * The Location object up the tree.
	 * @type {Location|Null}
	 */
	get base_loc() {
		// gets the Location object this belongs to
		if (this && !this.is_base_loc) {
			return this.loc;
		}
		return this;
	}

	/**
	 * The Atom up the tree whos loc is a Location.
	 * @type {Typespess.Atom|Null}
	 */
	get base_mover() {
		// gets the lowest atom
		if (this.loc && !this.loc.is_base_loc) {
			return this.loc;
		}
		return this;
	}

	/**
	 * @type {Object}
	 * @property {number} x
	 * @property {number} y
	 * @property {number} z
	 * @property {Typespess.Atom|Location|null} loc
	 * @property {boolean} is_fine_loc=true
	 */
	get fine_loc() {
		return {
			x: this.x,
			y: this.y,
			z: this.z,
			loc: this.loc,
			dim: this.dim,
			is_fine_loc: true,
		};
	}
	set fine_loc(val) {
		this.loc = val;
	}

	/**
	 * @type {number}
	 * @default 0
	 */
	get bounds_x() {
		return this[_bounds_x];
	}
	set bounds_x(newval) {
		newval = +newval;
		if (newval === this[_bounds_x]) {return;}
		if (newval !== newval) {
			throw new TypeError(`New boundary ${newval} is not a number`);
		}
		this[_changeloc](
			this[_x],
			this[_y],
			this[_z],
			this[_loc],
			newval,
			this[_bounds_y],
			this[_bounds_width],
			this[_bounds_height]
		);
	}

	/**
	 * @type {number}
	 * @default 0
	 */
	get bounds_y() {
		return this[_bounds_y];
	}
	set bounds_y(newval) {
		newval = +newval;
		if (newval === this[_bounds_y]) {return;}
		if (newval !== newval) {
			throw new TypeError(`New boundary ${newval} is not a number`);
		}
		this[_changeloc](
			this[_x],
			this[_y],
			this[_z],
			this[_loc],
			this[_bounds_x],
			newval,
			this[_bounds_width],
			this[_bounds_height]
		);
	}

	/**
	 * @type {number}
	 * @default 1
	 */
	get bounds_width() {
		return this[_bounds_width];
	}
	set bounds_width(newval) {
		newval = +newval;
		if (newval === this[_bounds_width]) {return;}
		if (newval !== newval) {
			throw new TypeError(`New boundary ${newval} is not a number`);
		}
		this[_changeloc](
			this[_x],
			this[_y],
			this[_z],
			this[_loc],
			this[_bounds_x],
			this[_bounds_y],
			newval,
			this[_bounds_height]
		);
	}

	/**
	 * @type {number}
	 * @default 1
	 */
	get bounds_height() {
		return this[_bounds_height];
	}
	set bounds_height(newval) {
		newval = +newval;
		if (newval === this[_bounds_height]) {return;}
		if (newval !== newval) {
			throw new TypeError(`New boundary ${newval} is not a number`);
		}
		this[_changeloc](
			this[_x],
			this[_y],
			this[_z],
			this[_loc],
			this[_bounds_x],
			this[_bounds_y],
			this[_bounds_width],
			newval
		);
	}

	/**
	 * Fired when this atom collides with another atom while doing {@link Typespess.Atom#move}
	 * @event bumped
	 * @param {Typespess.Atom} bumping
	 * @param {number} remaining_x
	 * @param {number} remaining_y
	 * @param {string} reason
	 */
	/**
	 * Fired when another atom collides with this atom while doing {@link Typespess.Atom#move}
	 * @event bumped_by
	 * @param {Typespess.Atom} bumper
	 * @param {number} remaining_x
	 * @param {number} remaining_y
	 * @param {string} reason
	 */

	/**
	 * Moves this atom the given amount
	 * @param {number} offsetx
	 * @param {number} offsety
	 * @param {string} reason
	 */
	move(offsetx: number, offsety: number, reason: any) {
		if (!this.loc || !this.loc.is_base_loc) {return false;}
		if (!this.can_move()) {return false;}
		let remaining_x = offsetx;
		let remaining_y = offsety;
		const move_splits = Math.ceil(
			Math.max(Math.abs(offsetx) / this[_bounds_width], Math.abs(offsety) / this[_bounds_height])
		);
		const step_x = offsetx / move_splits;
		const step_y = offsety / move_splits;
		let clang = false;
		let cx = this.x;
		let cy = this.y;
		for (let i = 0; i < move_splits; i++) {
			const newx = Math.round((cx + step_x) * this.movement_granularity) / this.movement_granularity;
			const newy = Math.round((cy + step_y) * this.movement_granularity) / this.movement_granularity;
			const result = this.test_move(newx, newy);
			for (const gained of result.gained_crossers) {
				if (!this.can_cross(gained, remaining_x, remaining_y, reason)) {
					clang = true;
				}
			}
			if (clang) {break;}
			for (const lost of result.lost_crossers) {
				if (!this.can_uncross(lost, remaining_x, remaining_y, reason)) {
					clang = true;
				}
			}
			if (clang) {break;}
			for (const common of result.common_crossers) {
				if (!this.can_move_within(common, remaining_x, remaining_y, reason)) {
					clang = true;
				}
			}
			if (clang) {break;}
			cx += step_x;
			cy += step_y;
			this[_changeloc](newx, newy, this[_z], this.dim.location(newx, newy, this[_z]));
			remaining_x -= step_x;
			remaining_y -= step_y;
		}
		if (!clang) {return true;}
		let first_bump = null;
		let first_bump_layer = -Infinity;
		for (let i = 1; i * Math.max(Math.abs(step_x), Math.abs(step_y)) >= 1 / this.movement_granularity / 2; i /= 2) {
			first_bump_layer = -Infinity;
			const newx = Math.round((cx + step_x * i) * this.movement_granularity) / this.movement_granularity;
			const newy = Math.round((cy + step_y * i) * this.movement_granularity) / this.movement_granularity;
			if (newx === this.x && newy === this.y) {break;}
			const result = this.test_move(newx, newy);
			clang = false;

			for (const lost of result.lost_crossers) {
				if (!this.can_uncross(lost, remaining_x, remaining_y, reason)) {
					clang = true;
					if (lost.layer > first_bump_layer) {
						first_bump = lost;
						first_bump_layer = lost.layer;
					}
				}
			}
			if (clang) {continue;}
			for (const common of result.common_crossers) {
				if (!this.can_move_within(common, remaining_x, remaining_y, reason)) {
					clang = true;
					if (common.layer > first_bump_layer) {
						first_bump = common;
						first_bump_layer = common.layer;
					}
				}
			}
			if (clang) {continue;}
			for (const gained of result.gained_crossers) {
				if (!this.can_cross(gained, remaining_x, remaining_y, reason)) {
					clang = true;
					if (gained.layer > first_bump_layer) {
						first_bump_layer = gained.layer;
						first_bump = gained;
					}
				}
			}
			if (clang) {continue;}

			cx += step_x * i;
			cy += step_y * i;
			this[_changeloc](newx, newy, this[_z], this.dim.location(newx, newy, this[_z]));
			remaining_x -= step_x * i;
			remaining_y -= step_y * i;
		}
		if (first_bump) {
			this.emit("bumped", first_bump, remaining_x, remaining_y, reason);
			first_bump.emit("bumped_by", this, remaining_x, remaining_y, reason);
		}
		return false;
	}

	/**
	 * Whether this atom can move the given amount
	 * @param {number} offsetx
	 * @param {number} offsety
	 * @param {string} reason
	 * @abstract
	 */
	can_move() {return true;}

	/**
	 * Whether this atom can cross the given atom. Calls {@link Typespess.Atom.can_be_crossed} crosser by default
	 * @param {Typespess.Atom} crossing
	 * @param {number} offsetx
	 * @param {number} offsety
	 * @param {string} reason
	 * @abstract
	 */
	can_cross(crossing: Record<string, any>, offsetx: any, offsety: any, reason: any) {
		return crossing.can_be_crossed(this, offsetx, offsety, reason);
	}

	/**
	 * Whether this atom can cross the given atom. Calls {@link Typespess.Atom.can_be_uncrossed} on the uncrosser by default
	 * @param {Typespess.Atom} uncrossing
	 * @param {number} offsetx
	 * @param {number} offsety
	 * @param {string} reason
	 * @abstract
	 */
	can_uncross(uncrossing: Record<string, any>, offsetx: any, offsety: any, reason: any) {
		return uncrossing.can_be_uncrossed(this, offsetx, offsety, reason);
	}

	/**
	 * Whether this atom can move while crossing the given atom. Calls {@link Typespess.Atom.can_crosser_move_within} on the atom moving within by default
	 * @param {Typespess.Atom} atom
	 * @param {number} offsetx
	 * @param {number} offsety
	 * @param {string} reason
	 */
	can_move_within(
		atom: {can_crosser_move_within: (arg0: any, arg1: any, arg2: any, arg3: any) => any},
		offsetx: any,
		offsety: any,
		reason: any
	) {
		return atom.can_crosser_move_within(atom, offsetx, offsety, reason);
	}

	/**
	 * Whether this atom can be crossed by the given atom. By default performs checks using the densities and the pass flags
	 * @param {Typespess.Atom} crosser
	 * @param {number} offsetx
	 * @param {number} offsety
	 * @param {string} reason
	 * @abstract
	 */
	can_be_crossed(crosser: {pass_flags: number; density: number}) {
		if (this.let_pass_flags & crosser.pass_flags) {return true;}
		return crosser.density < 0 || this.density <= 0;
	}

	/**
	 * Whether this atom can be uncrossed by the given atom.
	 * @param {Typespess.Atom} uncrosser
	 * @param {number} offsetx
	 * @param {number} offsety
	 * @param {string} reason
	 * @abstract
	 */
	can_be_uncrossed() {return true;}

	/**
	 * Whether this atom allows the given atom to move while crossing this one.
	 * @param {Typespess.Atom} atom
	 * @param {number} offsetx
	 * @param {number} offsety
	 * @param {string} reason
	 * @abstract
	 */
	can_crosser_move_within() {return true;}

	/**
	 * Checks if this atom encloses the given location.
	 * @param {Location} tile
	 * @returns {boolean}
	 */
	does_enclose_tile(tile: {is_base_loc: any; z: any; x: number; y: number}) {
		if (!tile.is_base_loc || !this[_loc] || !this[_loc].is_base_loc || this[_z] !== tile.z) {return false;}
		return (
			this[_x] + this[_bounds_x] - 0.001 <= tile.x &&
			this[_y] + this[_bounds_y] - 0.001 <= tile.y &&
			this[_x] + this[_bounds_x] + this[_bounds_width] + 0.001 >= tile.x + 1 &&
			this[_y] + this[_bounds_y] + this[_bounds_height] + 0.001 >= tile.y + 1
		);
	}

	/**
	 * Checks if this atom crosses the target atom
	 * @param {Typespess.Atom} atom
	 * @param {Object} overrides Overrides for the location and bounding box parameters to use for this atom
	 */
	does_cross(
		atom: {[x: string]: any},
		{
			x = this[_x],
			y = this[_y],
			z = this[_z],
			bounds_x = this[_bounds_x],
			bounds_y = this[_bounds_y],
			bounds_width = this[_bounds_width],
			bounds_height = this[_bounds_height],
		} = {}
	) {
		if (
			atom[_x] === +atom[_x] &&
			atom[_y] === +atom[_y] &&
			atom[_z] === z &&
			this[_loc] &&
			atom[_loc] &&
			this[_loc].is_base_loc &&
			atom[_loc].is_base_loc
		) {
			return (
				x + bounds_x + bounds_width - 0.001 > atom[_x] + atom[_bounds_x] &&
				x + bounds_x + 0.001 < atom[_x] + atom[_bounds_x] + atom[_bounds_width] &&
				y + bounds_y + bounds_height - 0.001 > atom[_y] + atom[_bounds_y] &&
				y + bounds_y + 0.001 < atom[_y] + atom[_bounds_y] + atom[_bounds_height]
			);
		}
	}

	// WALKING

	/**
	 * Whether this atom should walk.
	 * This calls {@link Typespess.Atom.move}. It automatically sets {@link Typespess.Atom.glide_size} to the correct value
	 * to ensure that the movement does not appear jerky. The {@link Typespess.Atom.walk_delay} property can be updated
	 * in an overrided {@link Typespess.Atom.move} and it will still look correct.
	 * @type {boolean}
	 */
	get walking() {
		return this[_walking];
	}
	set walking(val) {
		this[_walking] = val;
		this[_walk_step]();
	}

	[_walk_step]() {
		if (this[_walk_stepping] || !this[_walking]) {return;}
		this[_walk_stepping] = true;
		let offsetx = 0;
		let offsety = 0;
		if (this.walk_dir & 1) {
			offsety += this.walk_size;
		}
		if (this.walk_dir & 2) {
			offsety -= this.walk_size;
		}
		if (this.walk_dir & 4) {
			offsetx += this.walk_size;
		}
		if (this.walk_dir & 8) {
			offsetx -= this.walk_size;
		}
		this.glide_size = (this.walk_size / this.walk_delay) * 1000;
		this.move(offsetx, offsety, this.walk_reason);
		// in case the move proc cause it to change
		this.glide_size = (this.walk_size / this.walk_delay) * 1000;
		setTimeout(() => {
			this[_walk_stepping] = false;
			this[_walk_step]();
		}, this.walk_delay);
	}

	// main appearance

	/**
	 * The path to the icon file of this atom
	 * @type {string}
	 */
	get icon() {
		return this[_icon];
	}
	set icon(val) {
		this[_icon] = val;
		this[mob_symbols._update_var]("icon", 0);
	}

	/**
	 * The icon to pick from the icon file
	 * @type {string}
	 */
	get icon_state() {
		return this[_icon_state];
	}
	set icon_state(val) {
		this[_icon_state] = val;
		this[mob_symbols._update_var]("icon_state", 0);
	}

	/**
	 * The direction this atom points
	 * @type {number}
	 */
	get dir() {
		return this[_dir];
	}
	set dir(val) {
		const old = this[_dir];
		if (old === val) {return;}
		this[_dir] = val;
		this[mob_symbols._update_var]("dir", 0);
		this.emit("dir_changed", old, val);
	}

	/**
	 * The layer this atom is on. Used to control which atoms show up above which other atoms.
	 * @type {number}
	 */
	get layer() {
		return this[_layer];
	}
	set layer(val) {
		this[_layer] = val;
		this[mob_symbols._update_var]("layer", 0);
	}

	/**
	 * @type {string}
	 */
	get name() {
		return this[_name];
	}
	set name(val) {
		if (typeof val === "undefined") {
			val = null;
		}
		this[_name] = val;
		this[mob_symbols._update_var]("name", 0);
	}

	/**
	 * How fast this atom's position is interpolated on the client, in tiles per second
	 * @type {number}
	 */
	get glide_size() {
		return this[_glide_size];
	}
	set glide_size(val) {
		this[_glide_size] = val;
		this[mob_symbols._update_var]("glide_size", 0);
	}

	/**
	 * Overrides the x position on the screen of this atom. Used for hud elements.
	 * @type {number|null}
	 */
	get screen_loc_x() {
		return this[_screen_loc_x];
	}
	set screen_loc_x(val) {
		if (typeof val === "undefined") {
			val = null;
		}
		this[_screen_loc_x] = val;
		this[mob_symbols._update_var]("screen_loc_x", 0);
	}

	/**
	 * Overrides the y position on the screen of this atom. Used for hud elements.
	 * @type {number|null}
	 */
	get screen_loc_y() {
		return this[_screen_loc_y];
	}
	set screen_loc_y(val) {
		if (typeof val === "undefined") {
			val = null;
		}
		this[_screen_loc_y] = val;
		this[mob_symbols._update_var]("screen_loc_y", 0);
	}

	/**
	 * Controls how this atom responds to mouse events. 2 means use the whole bounding box, 1 means where the icon has a nonzero alpha, and 0 means never receive mouse events.
	 * @type {number}
	 */
	get mouse_opacity() {
		return this[_mouse_opacity];
	}
	set mouse_opacity(val) {
		if (typeof val === "undefined") {
			val = null;
		}
		this[_mouse_opacity] = val;
		this[mob_symbols._update_var]("mouse_opacity", 0);
	}

	/**
	 * The color of this, in CSS color format.
	 * @type {string|null}
	 */
	get color() {
		return this[_color];
	}
	set color(val) {
		if (typeof val === "undefined") {
			val = null;
		}
		this[_color] = val;
		this[mob_symbols._update_var]("color", 0);
	}

	/**
	 * The transparency of this atom.
	 * @type {number|null}
	 */
	get alpha() {
		return this[_alpha];
	}
	set alpha(val) {
		if (typeof val === "undefined") {
			val = null;
		}
		this[_alpha] = val;
		this[mob_symbols._update_var]("alpha", 0);
	}

	/**
	 * Whether this atom gets sent to clients or not.
	 * @type {boolean}
	 */
	get visible() {
		return this[_visible];
	}
	set visible(val) {
		val = !!val; // cast to boolean
		this[_visible] = val;
		if (this[_loc] && this[_loc].is_base_loc && this[_loc].is_base_loc) {
			for (
				let x = Math.floor(this[_x] + this[_bounds_x] + 0.0001);
				x < Math.ceil(this[_x] + this[_bounds_x] + this[_bounds_width] - 0.0001);
				x++
			) {
				for (
					let y = Math.floor(this[_y] + this[_bounds_y] + 0.0001);
					y < Math.ceil(this[_y] + this[_bounds_y] + this[_bounds_height] - 0.0001);
					y++
				) {
					const thisloc = this.dim.location(x, y, this[_z]);
					for (const atom of thisloc.viewers) {
						if (atom.c.Eye.can_see(this)) {
							atom.c.Eye[mob_symbols._add_viewing](this);
						} else {
							atom.c.Eye[mob_symbols._remove_viewing](this);
						}
					}
				}
			}
		}
	}

	/**
	 * A temporary animation that is shown on this atom.
	 * @type {Object}
	 * @property {string} [icon] {@link Typespess.Atom#icon}
	 * @property {string} [icon_state] {@link Typespess.Atom#icon_state}
	 * @property {number} [dir] {@link Typespess.Atom#dir}
	 * @property {Object} [overlays] {@link Typespess.Atom#overlays}
	 * @property {number} [time_begin]
	 */

	/**
	 * Whether this atom blocks visibility.
	 * @type {boolean}
	 */
	get opacity() {
		return this[_opacity];
	}
	set opacity(val) {
		if (this[_opacity] === val) {return;}
		this[_opacity] = val;
		this[mob_symbols._update_var]("opacity", 0);
		for (const viewer of this[mob_symbols._viewers]) {
			viewer.c.Eye.recalculate_visible_tiles();
		}
		for (const crosser of this[_crosses]) {
			if (has_component(crosser, "LightingObject")) {
				crosser.c.LightingObject.update_shadow(this);
			}
		}
		for (const loc of this.partial_locs()) {
			if (!loc.is_base_loc) {continue;}
			for (const hearer of loc.hearers) {
				hearer.c.Hearer.enqueue_update_visible_tiles();
			}
		}
	}

	[Symbol.iterator]() {
		return this.contents[Symbol.iterator]();
	}
	[mob_symbols._update_var](varname: any, type: any) {
		for (const viewer of this[mob_symbols._viewers]) {
			viewer.c.Eye.enqueue_update_atom_var(
				viewer.c.Eye[mob_symbols._server_to_net][this.object_id],
				this,
				varname,
				type
			);
		}
	}

	/**
	 * Returns an iterator with the atoms this atom is intersecting.
	 * @generator
	 * @yields {Typespess.Atom}
	 */
	crosses() {
		return this[_crosses][Symbol.iterator]();
	}

	/**
	 * Returns an iterator with all the Locations this intersects
	 * @generator
	 * @yields {Location}
	 */
	partial_locs(base_only = true) {
		if (!this.loc || !this.loc.is_base_loc) {
			return base_only ? [] : [this.loc];
		}
		const locs = [];
		for (
			let x = Math.floor(this[_x] + this[_bounds_x] + 0.0001);
			x < Math.ceil(this[_x] + this[_bounds_x] + this[_bounds_width] - 0.0001);
			x++
		) {
			for (
				let y = Math.floor(this[_y] + this[_bounds_y] + 0.0001);
				y < Math.ceil(this[_y] + this[_bounds_y] + this[_bounds_height] - 0.0001);
				y++
			) {
				locs.push(this.dim.location(x, y, this[_z]));
			}
		}
		return locs;
	}

	/**
	 * Returns an iterator with all the Locations this intersects, even by an edge.
	 * @generator
	 * @yields {Location}
	 */
	marginal_locs(base_only = true) {
		if (!this.loc || !this.loc.is_base_loc) {
			return base_only ? [] : [this.loc];
		}
		const locs = [];
		for (
			let x = Math.floor(this[_x] + this[_bounds_x] - 0.0001);
			x < Math.ceil(this[_x] + this[_bounds_x] + this[_bounds_width] + 0.0001);
			x++
		) {
			for (
				let y = Math.floor(this[_y] + this[_bounds_y] - 0.0001);
				y < Math.ceil(this[_y] + this[_bounds_y] + this[_bounds_height] + 0.0001);
				y++
			) {
				locs.push(this.dim.location(x, y, this[_z]));
			}
		}
		return locs;
	}

	/**
	 * @generator
	 * @yields {Typespess.Atom}
	 */
	*recursive_contents() {
		for (const item of this.contents) {
			yield item;
			yield* item.recursive_contents();
		}
	}

	network_encode(eye: any) {
		const common_visgroups = [];
		if (eye) {
			let visgroups;
			if (eye instanceof Array) {
				visgroups = new Set(eye);
			} else {
				visgroups = eye.c.Eye[mob_symbols._visgroups];
			}
			for (const visgroup of this[mob_symbols._visgroups]) {
				if (visgroups.has(visgroup)) {
					common_visgroups.push(visgroup);
				}
			}
		}
		const submessage: Record<string, any> = {
			component_vars: {},
			components: [],
			toString() {
				return JSON.stringify(this);
			},
		};
		for (const key of [
			"icon",
			"icon_state",
			"dir",
			"layer",
			"name",
			"glide_size",
			"screen_loc_x",
			"screen_loc_y",
			"mouse_opacity",
			"overlays",
			"x",
			"y",
			"opacity",
			"color",
			"alpha",
		]) {
			submessage[key] = this[key];
			for (const visgroup of common_visgroups) {
				if (visgroup.overrides.has(key)) {
					submessage[key] = visgroup.overrides.get(key);
				}
			}
		}
		if (this.template && this.template.components) {
			for (const component_name of this.template.components) {
				const component = this.components[component_name];
				if (!(component instanceof Component.Networked)) {continue;}
				submessage.components.push(component_name);
				submessage.component_vars[component_name] = component.get_networked_vars();
			}
		}
		return submessage;
	}

	toString() {
		return this.name;
	}

	/**
	 * Deletes this object from the world.
	 */
	destroy() {
		this.destroyed = true;
		for (const tcomponent of Object.values(this.c)) {
			const component: Record<string, any> = tcomponent;
			if (component.destroy) {
				component.destroy();
			}
		}
		this.loc = null;
		this.server.atoms.delete(this.object_id);
		this.emit("destroyed");
	}

	p_they(capitalized: any, gender = this.gender) {
		let out = "it";
		if (gender === "male") {
			out = "he";
		} else if (gender === "female") {
			out = "she";
		} else if (gender === "plural") {
			out = "they";
		}
		if (capitalized) {
			out = out[0].toUpperCase() + out.substr(1);
		}
		return out;
	}
	p_their(capitalized: any, gender = this.gender) {
		let out = "its";
		if (gender === "male") {
			out = "his";
		} else if (gender === "female") {
			out = "her";
		} else if (gender === "plural") {
			out = "their";
		}
		if (capitalized) {
			out = out[0].toUpperCase() + out.substr(1);
		}
		return out;
	}
	p_them(capitalized: any, gender = this.gender) {
		let out = "it";
		if (gender === "male") {
			out = "him";
		} else if (gender === "female") {
			out = "her";
		} else if (gender === "plural") {
			out = "them";
		}
		if (capitalized) {
			out = out[0].toUpperCase() + out.substr(1);
		}
		return out;
	}
	p_have(capitalized: any, gender = this.gender) {
		let out = "has";
		if (gender === "plural") {
			out = "have";
		}
		if (capitalized) {
			out = out[0].toUpperCase() + out.substr(1);
		}
		return out;
	}
	p_are(capitalized: any, gender = this.gender) {
		let out = "is";
		if (gender === "plural") {
			out = "are";
		}
		if (capitalized) {
			out = out[0].toUpperCase() + out.substr(1);
		}
		return out;
	}
	p_were(capitalized: any, gender = this.gender) {
		let out = "was";
		if (gender === "plural") {
			out = "were";
		}
		if (capitalized) {
			out = out[0].toUpperCase() + out.substr(1);
		}
		return out;
	}
	p_do(capitalized: any, gender = this.gender) {
		let out = "does";
		if (gender === "plural") {
			out = "do";
		}
		if (capitalized) {
			out = out[0].toUpperCase() + out.substr(1);
		}
		return out;
	}
	p_s(capitalized: any, gender = this.gender) {
		let out = "";
		if (gender !== "plural") {
			out = "s";
		}
		if (capitalized) {
			out = out[0].toUpperCase() + out.substr(1);
		}
		return out;
	}
}

module.exports = Atom;
