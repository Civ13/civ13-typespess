export{};
const {chain_func, is_atom, to_chat, has_component} = require("../utils.js");
const _observers: any = Symbol("_observers");
const _viewers: any = Symbol("_viewers");
const _viewing: any = Symbol("_viewing");
const _key: any = Symbol("_key");
const _client: any = Symbol("_client");
const _server_to_net: any = Symbol("_server_to_net");
const _visible_tiles: any = Symbol("_visible_tiles");
const _directional: any = Symbol("_directional");
const _screen_set: any = Symbol("_screen_set");
const _update_var: any = Symbol("_update_var");
const _add_viewing: any = Symbol("_add_viewing");
const _remove_viewing: any = Symbol("_remove_viewing");
const _common_tiles_count: any = Symbol("_common_tiles_count");
const _panel_map: any = Symbol("_panel_map");
const _visgroups: any = Symbol("_visgroups");
const _eye_to_eyeid: any = Symbol("_eye_to_eyeid");
module.exports._symbols = {
	_observers,
	_client,
	_viewers,
	_viewing,
	_visible_tiles,
	_server_to_net,
	_add_viewing,
	_remove_viewing,
	_update_var,
	_common_tiles_count,
	_visgroups,
	_key,
};

const Component = require("./component.js");

let id_counter = 0;

/**
 * Represents an origin that a {@link Mob} can look from.
 * Depends on {@link Hearer}
 * @alias Eye
 * @extends Typespess.Component
 */
class Eye extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this[_observers] = [];

		// Key maps. Yes we could just directly use the IDs but then clients would be able to cheat
		this[_server_to_net] = {};

		// The things we can see
		this[_viewing] = {};
		this[_visible_tiles] = new Set();
		this[_screen_set] = new Set();
		this[_common_tiles_count] = new Map();
		this[_visgroups] = new Set();

		// Event handler
		this.a.on("parent_moved", () => {
			this.recalculate_visible_tiles();
		});
		this.a.on("moved", () => {
			this.recalculate_visible_tiles();
		});

		this.recalculate_visible_tiles();

		this.screen = new Proxy(
			{},
			{
				set: (target: any, key: any, value: any) => {
					if (typeof value !== "undefined" && !is_atom(value)) {
						throw new TypeError(`${value} is not an atom`);
					}
					if (target[key] === value) {return true;}
					if (target[key]) {
						this[_screen_set].delete(target[key]);
						if (!this.can_see(target[key])) {
							this[_remove_viewing](target[key]);
						}
					}
					target[key] = value;
					if (target[key]) {
						this[_screen_set].add(target[key]);
						this[_add_viewing](target[key]);
					}
					return true;
				},
				deleteProperty: (target, key) => {
					this.screen[key] = void 0;
					delete target[key];
					return true;
				},
			}
		);

		if (this.a.c.Hearer) {
			this.a.c.Hearer.show_message = chain_func(this.a.c.Hearer.show_message, this.show_message.bind(this));
		}
	}

	[_add_viewing](item: any) {
		if (item instanceof Array || item instanceof Set) {
			item.forEach((i: any) => {
				this[_add_viewing](i);
			});
			return;
		}
		if (!is_atom(item)) {
			throw new TypeError(`${item} is not an atom!`);
		}
		if (this[_viewing][this[_server_to_net][item.object_id]]) {
			return;
		} // We already have this item.
		let netid = "NET_" + id_counter++;
		if (this[_server_to_net][item.object_id]) {
			netid = this[_server_to_net][item.object_id];
		} else {
			this[_server_to_net][item.object_id] = netid;
		}
		this[_viewing][netid] = item;
		item[_viewers].push(this.atom);

		this.enqueue_create_atom(netid, item);
	}

	[_remove_viewing](item: any) {
		if (item instanceof Array || item instanceof Set) {
			item.forEach((i: any) => {
				this[_remove_viewing](i);
			});
			return;
		}
		if (!is_atom(item)) {
			throw new TypeError(`${item} is not an atom!`);
		}
		const netid = this[_server_to_net][item.object_id];
		if (!netid) {
			return;
		} // This item is not being tracked, and even if it is there's no way to find out the network id.
		delete this[_viewing][netid];
		delete this[_server_to_net][item.object_id];
		let idx;
		if ((idx = item[_viewers].indexOf(this.atom)) !== -1) {
			item[_viewers].splice(idx, 1);
		}

		this.enqueue_delete_atom(netid);
	}
	enqueue_create_atom(netid: any, atom: any) {
		for (const observer of this[_observers]) {
			const client = observer.c.Mob.client;
			if (!client) {
				continue;
			}
			client.enqueue_create_atom(netid, atom, this.a);
		}
	}
	enqueue_update_atom_var(netid: any, atom: any, varname: any, is_appearance: any) {
		for (const observer of this[_observers]) {
			const client = observer.c.Mob.client;
			if (!client) {
				continue;
			}
			client.enqueue_update_atom_var(netid, atom, varname, is_appearance);
		}
	}
	enqueue_delete_atom(netid: any) {
		for (const observer of this[_observers]) {
			const client = observer.c.Mob.client;
			if (!client) {
				continue;
			}
			client.enqueue_delete_atom(netid);
		}
	}

	enqueue_add_tile(tile: any) {
		for (const observer of this[_observers]) {
			const client = observer.c.Mob.client;
			if (!client) {
				continue;
			}
			client.enqueue_add_tile(tile);
		}
	}

	enqueue_remove_tile(tile: any) {
		for (const observer of this[_observers]) {
			const client = observer.c.Mob.client;
			if (!client) {
				continue;
			}
			client.enqueue_remove_tile(tile);
		}
	}

	compute_visible_tiles() {
		if (this.xray === true) {
			return this.a.server.compute_inrange_tiles(this.a, this.view_range);
		} else {
			return this.a.server.compute_visible_tiles(this.a, this.view_range);
		}
	}

	recalculate_visible_tiles() {
		process.nextTick(() => {
			for (const observer of this[_observers]) {
				const client = observer.c.Mob.client;
				if (!client) {
					continue;
				}
				client.next_message.eye = client.next_message.eye || {};
				client.next_message.eye[observer.c.Mob[_eye_to_eyeid].get(this.a)] = {
					x: this.a.base_mover.x,
					y: this.a.base_mover.y,
					glide_size: this.a.base_mover.glide_size,
				};
			}
		});

		const new_visible = this.compute_visible_tiles();
		const old_visible = this[_visible_tiles];
		const added = [...new_visible].filter((item) => {
			return !old_visible.has(item);
		});
		const removed = [...old_visible].filter((item) => {
			return !new_visible.has(item);
		});
		this[_visible_tiles] = new_visible;
		for (const tile of added) {
			this.enqueue_add_tile(tile);
			if (tile && tile.viewers) {
				tile.viewers.push(this.atom);
				for (const item of tile.partial_contents) {
					this[_common_tiles_count].set(item, this[_common_tiles_count].get(item) + 1 || 1);
					if (this.can_see(item)) {
						this[_add_viewing](item);
					}
				}
			}
		}
		for (const tile of removed) {
			this.enqueue_remove_tile(tile);
			if (tile.viewers) {
				tile.viewers.splice(tile.viewers.indexOf(this.atom), 1);
			}
			if (tile.partial_contents) {
				for (const item of tile.partial_contents) {
					this[_common_tiles_count].set(item, this[_common_tiles_count].get(item) - 1);
					if (!this.can_see(item)) {
						this[_remove_viewing](item);
					}
				}
			}
		}
	}
	/**
	 * @param {Typespess.Atom} item
	 * @returns {boolean}
	 */
	can_see(item: any) {
		if (this[_screen_set].has(item)) {return true;}
		let visible_value = item.visible;
		for (const visgroup of item[_visgroups]) {
			if (this[_visgroups].has(visgroup) && visgroup.overrides.has("visible")) {
				visible_value = visgroup.overrides.get("visible");
			}
		}
		const visible = visible_value && this[_common_tiles_count].get(item) > 0;
		if (visible) {
			return !item.can_be_seen || item.can_be_seen(this.atom, this[_visible_tiles]);
		}
		return false;
	}
	/**
	 * @param {Typespess.Atom} item
	 * @returns {string}
	 */
	get_netid_for_atom(atom: any) {
		return this[_server_to_net][atom.object_id];
	}
	show_message(prev: any) {
		const to_show = prev();
		to_chat(this.a, to_show);
		return to_show;
	}

	/**
	 * Returns the mobs that are looking from this mob
	 * @generator
	 * @yields {Typespess.Atom<Mob>}
	 */
	observers() {
		return this[_observers][Symbol.iterator]();
	}
}

Eye.template = {
	vars: {
		components: {
			Eye: {
				xray: false,
				view_range: 8,
			},
		},
	},
};

Eye.loadBefore = ["Hearer"];

/**
 * @event Mob#keydown
 * @type {Object}
 * @property {number} which keycode
 */
/**
 * @event Mob#keyup
 * @type {Object}
 * @property {number} which keycode
 */
/**
 * Event name is prepended with, if applicable: ctrl_, alt_, shift_, middle_ in that order.
 * @event Mob#click_on
 * @type {mouse_event}
 */
/**
 * @event Mob#mouse_dragged
 * @type {Object}
 * @property {mouse_event} from
 * @property {mouse_event} to
 */
/**
 * @event Mob#message
 * @type {Object}
 */
/**
 * @event Mob#message_pre
 * @type {Object}
 */

/**
 * The ability to be posessed by a client
 * @alias Mob
 * @extends Typespess.Component
 */
class Mob extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);

		this[_client] = void 0;
		this[_key] = void 0;
		this[_panel_map] = new Map();
		this[_eye_to_eyeid] = new WeakMap();
		this[_directional] = true;

		/**
		 * @type {Object<string,Typespess.Atom<Mob>>}
		 * @member eyes
		 * @memberof Mob
		 * @instance
		 */
		// Eyes map
		Object.defineProperty(this, "eyes", {
			enumerable: true,
			configurable: false,
			writable: false,
			value: new Proxy(
				{},
				{
					set: (target, property, value) => {
						property = String(property);
						if (value instanceof Eye) {
							value = value.atom;
						}
						if (typeof value !== "undefined" && !has_component(value, "Eye")) {
							throw new TypeError("Expected object with Eye component");
						}
						if (value && value.c.Eye[_observers].indexOf(this) !== -1) {return false;}
						const oldEye = target[property];
						if (oldEye && this.client) {
							for (const netid in oldEye.c.Eye[_viewing]) {
								if (!Object.prototype.hasOwnProperty.call(oldEye.c.Eye[_viewing], netid)) {
									continue;
								}
								this.client.enqueue_delete_atom(netid);
							}
							for (const tile of oldEye.c.Eye[_visible_tiles]) {
								this.client.enqueue_remove_tile(tile);
							}
						}
						if (oldEye) {
							const idx = oldEye.c.Eye[_observers].indexOf(this.a);
							if (idx !== -1) {
								oldEye.c.Eye[_observers].splice(idx, 1);
							}
						}
						target[property] = value;
						this[_eye_to_eyeid].set(value, property);
						if (value) {
							value.c.Eye[_observers].push(this.a);
						}
						if (value && this.client) {
							for (const netid in value.c.Eye[_viewing]) {
								if (!Object.prototype.hasOwnProperty.call(value.c.Eye[_viewing], netid)) {
									continue;
								}
								const tatom = value.c.Eye[_viewing][netid];
								this.client.enqueue_create_atom(netid, tatom, value);
							}
							for (const tile of value.c.Eye[_visible_tiles]) {
								this.client.enqueue_add_tile(tile);
							}
							this.client.next_message.eye = this.client.next_message.eye || {};
							this.client.next_message.eye[property] = {
								x: value.base_mover.x,
								y: value.base_mover.y,
								glide_size: 0,
							};
						}
						return true;
					},
					defineProperty: () => {
						throw new Error("Cannot define property on eyes map");
					},
					deleteProperty: (target: any, property: string | number | symbol) => {
						this.eyes[property] = void 0;
						delete target[property];
						return true;
					},
				}
			),
		});

		this.eyes[""] = this.atom;
	}

	/**
	 * @see Client#key
	 * @type {string}
	 */
	get key() {
		return this[_key];
	}
	set key(val) {
		this.a.server.dc_mobs[this[_key]] = void 0;
		if (val && val !== "") {
			if (this.a.server.clients[val]) {
				this.client = this.a.server.clients[val];
			} else {
				if (this.a.server.dc_mobs[val]) {
					this.a.server.dc_mobs[val].c.Mob.key = void 0;
				}
				this.a.server.dc_mobs[val] = this.atom;
			}
		}
		this[_key] = val || void 0;
	}

	/**
	 * @type {Client}
	 */
	get client() {
		return this[_client];
	}
	set client(val) {
		if (!val) {
			this[_key] = null;
			if (this[_client]) {
				this[_client].mob = null;
				this[_client] = null;
			}
			return;
		}
		this[_key] = val.key;
		val.mob = this.atom;
	}

	/**
	 * @param {Typespess.Atom<Eye>}
	 * @returns {string}
	 */
	get_eyeid_for_eye(eye: any) {
		return this[_eye_to_eyeid].get(eye);
	}

	/**
	 * @param {Typespess.Atom} atom
	 * @param {Typespess.Panel|Constructor} panel
	 * @param {string} key=""
	 * @returns {boolean}
	 * @abstract
	 */
	can_interact_with_panel(atom:any/*, panel:any, key:any*/) {if (atom) {return true;}}

	basic_panel_read_checks(panel: any) {
		if (typeof panel === "object" && (panel.client !== this.client || (panel.bound_mob && panel.bound_mob !== this.a)))
			{return false;}
		return true;
	}

	/**
	 * @param {Typespess.Atom} atom
	 * @param {Typespess.Panel|Constructor} panel
	 * @param {string} key=""
	 * @returns {boolean}
	 * @abstract
	 */
	can_read_panel(atom: any, panel: any, key = "") {
		if (atom.can_user_read_panel && !atom.can_user_read_panel(this.a, panel, key)) {return false;}
		for (const teye of Object.values(this.eyes)) {
			const eye: any = teye;
			if (eye.c.Eye.can_see(atom)) {return true;}
		}
		return false;
	}

	/**
	 * Binds the panel to this mob and the panel.
	 * @param {Typespess.Atom} atom
	 * @param {Typespess.Panel} panel
	 * @param {string} [key=""]
	 */
	bind_panel(atom: any, panel: any, key = "") {
		if (!this.basic_panel_read_checks(panel) || !this.can_read_panel(atom, panel, key)) {
			throw new Error("Check that your panel can be opened *before* creating and trying to bind it you tit");
		}
		if (this.get_panel(atom, panel, key)) {
			throw new Error("A panel of this type has already been opened before for this atom and key");
		}

		panel.bound_atom = atom;
		const check = () => {
			if (
				panel.is_open &&
				this.basic_panel_read_checks(panel) &&
				this.can_read_panel(atom, panel, key)
			) {
				panel.visibility_indicator = this.can_interact_with_panel(atom/*,panel,key*/)
					? "can_interact"
					: "can_see";
				return;
			}
			panel.removeListener("close", check);
			panel.removeListener("message", check);
			this.a.removeListener("moved", check);
			this.a.removeListener("parent_moved", check);
			atom.removeListener("moved", check);
			atom.removeListener("parent_moved", check);
			this.removeListener("client_changed", check);
			this[_panel_map].delete(`${atom.object_id},${panel.constructor.name},${key}`);
			panel.close();
		};

		panel.on("close", check);
		panel.on("message", check);
		this.a.on("moved", check);
		this.a.on("parent_moved", check);
		atom.on("moved", check);
		atom.on("parent_moved", check);
		this.on("client_changed", check);

		panel.bound_atom = atom;
		panel.bound_key = key;
		panel.bound_mob = this.a;
		this[_panel_map].set(`${atom.object_id},${panel.constructor.name},${key}`, panel);
	}

	/**
	 * Binds the panel to this mob and the panel.
	 * @param {Typespess.Atom} atom
	 * @param {Constructor} panel
	 * @param {string} [key=""]
	 */
	get_panel(atom: any, panel: any, key = "") {
		return this[_panel_map].get(
			`${atom.object_id},${typeof panel === "function" ? panel.name : panel.constructor.name},${key}`
		);
	}
}
Mob.depends = ["Eye"];
Mob.loadBefore = ["Eye"];

module.exports.components = {Mob: Mob, Eye: Eye};
