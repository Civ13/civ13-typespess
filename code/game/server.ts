export{};
const WebSocket = require("ws");
const EventEmitter = require("events");
const toposort = require("toposort");
const Client = require("./client.js");
const Atom = require("./atom/atom.js");
const Component = require("./atom/component.js");
const Panel = require("./panel.js");
const Sound = require("./sound.js");
const utils = require("./utils.js");
const VisibilityGroup = require("./atom/visgroup.js");
const Dimension = require("./dimension.js");

const _net_tick: any = Symbol("_net_tick");
const _is_template_processed: any = Symbol("_is_template_processed");
const _is_server_started: any = Symbol("_is_server_started");
const _construct_time: any = Symbol("_construct_time");

/**
 * @alias Typespess
 * @example
 * const Typespess = require('typespess');
 *
 * let server = new Typespess();
 */
class Typespess extends EventEmitter {
	constructor() {
		super();
		this.components = {};
		this.templates = {};
		/**
		 * An object containing all the clients by their key
		 * @type {Object<string,Client>}
		 */
		this.clients = {};
		/**
		 * An object containing all the clients by their display name
		 * @type {Object<string,Client>}
		 */
		this.clients_by_name = {};
		/**
		 * An object containing mobs with keys but no client
		 * @type {Object<string,Typespess.Atom<Mob>>}
		 */
		this.dc_mobs = {};
		this.atoms = new Map();
		/**
		 * An object containing lists of atoms for each component type
		 * @type {Object<string,Set<Typespess.Atom>>}
		 */
		this.atoms_for_components = {};
		/**
		 * A writable stream for the demo file being written to
		 * @type {WritableStream}
		 */
		this.demo_stream = null;

		// Import default modules
		this.importModule(require("./atom/mob.js"));
		this.importModule(require("./atom/lighting.js"));
		this.importModule(require("./atom/hearer.js"));

		this.net_tick_delay = 50;

		this[_is_server_started] = false;
		this[_construct_time] = process.hrtime();

		this.to_global_chat.bind(this);
	}

	/**
	 * True if the server has been started.
	 * @type {boolean}
	 */
	get is_server_started() {
		return this[_is_server_started];
	}

	/**
	 * Imports a module into the server code.
	 * @param {Object} mod
	 * @param {Object} [mod.components] An object containing the component constructors you want to import
	 * @param {Object} [mod.templates] An object containing the templates you want to import
	 * @param {Function} [mod.now] A callback which is called immediately with an instance of this server object
	 * @param {Function} [mod.server_start] A callback which is called when the server starts (or now if it already has) with an instance of this server object
	 */
	importModule(mod: any) {
		if (mod.components) {
			this.importComponents(mod);
		}
		if (mod.templates) {
			this.importTemplates(mod);
		}
		if (mod.now instanceof Function) {
			mod.now(this);
		}
		if (mod.server_start instanceof Function) {
			if (this.is_server_started) {
				mod.server_start(this);
			} else {
				this.on("server_start", mod.server_start);
			}
		}
	}

	importComponents(mod: any) {
		for (const componentName in mod.components) {
			if (Object.prototype.hasOwnProperty.call(mod.components, componentName)) {
				if (this.components[componentName]) {
					throw new Error(`Component ${componentName} already exists!`);
				}
				if (mod.components[componentName].name !== componentName) {
					throw new Error(
						`Component name mismatch! Named ${componentName} in map and constructor is named ${mod.components[componentName].name}`
					);
				}
				this.components[componentName] = mod.components[componentName];
			}
		}
	}

	importTemplates(mod: any) {
		for (const templateName in mod.templates) {
			if (!Object.prototype.hasOwnProperty.call(mod.templates, templateName)) {continue;}
			if (this.templates[templateName]) {
				throw new Error(`Template ${templateName} already exists!`);
			}
			const template = mod.templates[templateName];

			this.templates[templateName] = template;
		}
	}
	/**
	 * Starts the server.
	 * @param {Object} opts
	 * @param {Object} opts.websocket The parameters passed to the websocket server
	 * @param {Object} opts.demo_stream A stream (probably to a file) to log network updates to
	 */
	startServer({websocket = "", demo_stream = ""} = {}) {
		if (global.is_bs_editor_env) {
			throw new Error("Server should not be started in editor mode");
		}
		this.wss = new WebSocket.Server(websocket);

		this.wss.on("connection", (ws: any) => {
			ws.on("error", (err: Error) => {
				console.error(err);
			});
			this.handle_login(ws);
		});

		setTimeout(this[_net_tick].bind(this), this.net_tick_delay);

		if (demo_stream) {
			this.demo_stream = demo_stream;
		}

		this[_is_server_started] = true;
		this.emit("server_start", this);
	}

	/**
	 * Handles login.
	 * @param {WebSocket} ws The websocket
	 * @abstract
	 */
	handle_login(ws: any) {
		const handle_message = (data: any) => {
			const obj = JSON.parse(data);

			if (obj.login) {
				const username = obj.login + "";
				ws.removeListener("message", handle_message);
				this.login(ws, username);
			}
		};
		ws.on("message", handle_message);
		ws.send(JSON.stringify({login_type: "debug"}));
	}

	/**
	 * Creates a client with the given parameters
	 * @param {WebSocket} socket The websocket
	 * @param {String|number} key The unique key string identifying the client.
	 * @param {String} name The name to display for the client
	 * @returns {Client}
	 */
	// eslint-disable-next-line max-statements
	login(socket: any, username: any) {
		if (this.clients[username] && this.clients[username].socket) {
			const mob = this.clients[username].mob;
			this.clients[username].mob = null;
			this.clients[username].socket.close();
			delete this.clients[username];
			if (mob) {
				mob.c.Mob.key = username;
			}
		}
		const client = new Client(socket, username, this);
		this.clients[username] = client;
		this.clients_by_name[client.name] = client;
		return client;
	}

	[_net_tick]() {
		for (const key in this.clients) {
			if (!Object.prototype.hasOwnProperty.call(this.clients, key)) {continue;}
			const client = this.clients[key];
			client.send_network_updates();
		}
		this.emit("post_net_tick");
		setTimeout(this[_net_tick].bind(this), this.net_tick_delay);
	}

	/**
	 * @param {Typespess.Atom|Location} origin The origin
	 * @param {number} dist The radius to go out
	 * @returns {Set<Location>} A set of tiles a given distance away from the origin
	 */
	compute_inrange_tiles(atom: any, dist: any) {
		const inrange_tiles = new Set();
		if (typeof atom.base_loc === "undefined") {
			return inrange_tiles;
		}
		for (let x = Math.floor(atom.x + 0.001 - dist); x <= Math.ceil(atom.x - 0.001 + dist); x++) {
			for (let y = Math.floor(atom.y + 0.001 - dist); y <= Math.ceil(atom.y - 0.001 + dist); y++) {
				inrange_tiles.add(atom.dim.location(x, y, atom.z));
			}
		}
		return inrange_tiles;
	}

	/**
	 * @param {Typespess.Atom|Location} origin The origin
	 * @param {number} dist The radius to go out
	 * @returns {Set<Location>} A set of tiles a given distance away from the origin that are visible to the origin (not blocked by opaque atoms)
	 */
	// eslint-disable-next-line max-statements
	compute_visible_tiles(atom: any, dist: any) {
		if (typeof atom.base_loc === "undefined") {
			return new Set();
		}
		const ring_tiles: any[] = [];
		const base_x = Math.round(atom.x);
		const base_y = Math.round(atom.y);
		const base_z = Math.floor(atom.z);

		this.pushRingTiles(atom, dist, ring_tiles, base_x, base_y, base_z);

		const visible_tiles = new Set(ring_tiles);
		visible_tiles.add(atom.base_loc);
		const used_tiles = new Set();
		for (const tile of ring_tiles) {
			if (used_tiles.has(tile)) {continue;}
			const dx = tile.x - base_x;
			const dy = tile.y - base_y;
			if (!tile.opacity) {continue;}
			if (tile.y !== base_y) {
				let left = base_x;
				let right = base_x;
				let iter_tile = tile;
				while (iter_tile.opacity && iter_tile.x >= base_x - dist) {
					left = iter_tile.x;
					iter_tile = iter_tile.get_step(8);
				}
				iter_tile = tile;
				while (iter_tile.opacity && iter_tile.x <= base_x + dist) {
					right = iter_tile.x;
					iter_tile = iter_tile.get_step(4);
				}
				const vdir = tile.y > base_y ? 1 : -1;
				const left_dx = (left - base_x) / Math.abs(dy);
				const right_dx = (right - base_x) / Math.abs(dy);
				for (let y = tile.y; Math.abs(y - base_y) <= dist; y += vdir) {
					if (y !== tile.y) {
						for (let x = Math.ceil(left); x <= Math.floor(right); x++) {
							visible_tiles.delete(atom.dim.location(x, y, base_z));
						}
					}
					left += left_dx;
					right += right_dx;
				}
			}

			if (tile.x !== base_x) {
				let down = base_y;
				let up = base_y;
				let iter_tile = tile;
				while (iter_tile.opacity && iter_tile.y >= base_y - dist) {
					down = iter_tile.y;
					used_tiles.add(iter_tile);
					iter_tile = iter_tile.get_step(2);
				}
				iter_tile = tile;
				while (iter_tile.opacity && iter_tile.y <= base_y + dist) {
					up = iter_tile.y;
					used_tiles.add(iter_tile);
					iter_tile = iter_tile.get_step(1);
				}
				const hdir = tile.x > base_x ? 1 : -1;
				const down_dy = (down - base_y) / Math.abs(dx);
				const up_dy = (up - base_y) / Math.abs(dx);
				for (let x = tile.x; Math.abs(x - base_x) <= dist; x += hdir) {
					if (x !== tile.x) {
						for (let y = Math.ceil(down); y <= Math.floor(up); y++) {
							visible_tiles.delete(atom.dim.location(x, y, base_z));
						}
					}
					down += down_dy;
					up += up_dy;
				}
			}
		}
		return visible_tiles;
	}
	pushRingTiles(atom: any, dist: any, ring_tiles: any, base_x: number, base_y: number, base_z: number) {
		if (!atom || !atom.dim) {return;}
		for (let i = 1; i <= dist * 2; i++) {
			for (let j = Math.max(i - dist, 0); j < i - Math.max(i - dist - 1, 0); j++) {
				ring_tiles.push(atom.dim.location(base_x + i - j, base_y + j, base_z));
				ring_tiles.push(atom.dim.location(base_x - j, base_y + i - j, base_z));
				ring_tiles.push(atom.dim.location(base_x - i + j, base_y - j, base_z));
				ring_tiles.push(atom.dim.location(base_x + j, base_y - i + j, base_z));
			}
		}
	}
	/**
	 * Returns a precise timestamp, in milliseconds, since the server was constructed.
	 * This timestamp is sent to clients periodically.
	 * @returns {number} The timestamp
	 */
	now() {
		const hr = process.hrtime(this[_construct_time]);
		return hr[0] * 1000 + hr[1] * 0.000001;
	}

	/**
	 * Processes a template, sorting out all the dependencies and applying default values.
	 * Usually called internally.
	 * @param {template} template
	 */
	process_template(template: any) {
		if (template[_is_template_processed]) {return;}
		if (template.parent_template) {
			if (typeof template.parent_template === "string") {
				const ptemplate = this.templates[template.parent_template];
				this.process_template(ptemplate);
				utils.weak_deep_assign(template, ptemplate);
			} else if (template.parent_template instanceof Array) {
				for (let i = template.parent_template.length - 1; i >= 0; i--) {
					const ptemplate = this.templates[template.parent_template[i]];
					this.process_template(ptemplate);
					utils.weak_deep_assign(template, ptemplate);
				}
			}
		}
		if (template.components) {
			// Ensure all the component dependencies are added.
			let hasAddedDependencies = true;
			while (hasAddedDependencies) {
				hasAddedDependencies = false;
				for (const componentName of template.components) {
					const component = this.components[componentName];
					if (typeof component === "undefined") {
						throw new Error(`Component ${componentName} does not exist!`);
					}
					if (component.depends) {
						for (const depends of component.depends) {
							if (!template.components.includes(depends)) {
								template.components.push(depends);
								hasAddedDependencies = true;
							}
						}
					}
				}
			}
			// Sort the dependencies.
			const edges = [];
			for (const componentName of template.components) {
				const component = this.components[componentName];
				if (component.loadAfter) {
					for (const after of component.loadAfter) {
						if (template.components.includes(after)) {
							edges.push([componentName, after]);
						}
					}
				}
				if (component.loadBefore) {
					for (const before of component.loadBefore) {
						if (template.components.includes(before)) {
							edges.push([before, componentName]);
						}
					}
				}
			}
			template.components = toposort.array(template.components, edges);

			// Iterate backwards over the list so that the last loaded component gets priority over the default values.
			// Apply the default values in those components behind this template.
			for (let i = template.components.length - 1; i >= 0; i--) {
				const componentName = template.components[i];
				const component = this.components[componentName];
				if (component.template) {
					utils.weak_deep_assign(template, component.template);
				}
			}
		}

		template.vars = template.vars || {};
		template.vars.layer = template.vars.layer || 0;

		if (!template.is_variant && template.variants && template.variants.length) {
			for (let i = 0; i < template.variants.length; i++) {
				const variant = template.variants[i];
				if (variant.type === "single") {
					let curr_obj = template.vars;
					for (let j = 0; j < variant.var_path.length - 1; j++) {
						let next_obj = curr_obj[variant.var_path[j]];
						if (typeof next_obj !== "object" || next_obj instanceof Array) {
							next_obj = {};
							curr_obj[variant.var_path[j]] = next_obj;
						}
						curr_obj = next_obj;
					}
					if (curr_obj) {
						curr_obj[variant.var_path[variant.var_path.length - 1]] = variant.values[0];
					}
				}
			}
		}

		template[_is_template_processed] = true;
	}

	/**
	 * Extends the template with the given variant.
	 * @param {template} template
	 * @param {Array} variant_leaf_path
	 */
	get_template_variant(template: any, variant_leaf_path: any, instance_vars: any) {
		if (!instance_vars && (!variant_leaf_path || variant_leaf_path.length === 0)) {
			return template;
		}
		template = utils.weak_deep_assign({}, template);
		instance_vars = instance_vars ? JSON.parse(JSON.stringify(instance_vars)) : null;
		this.process_template(template);
		template.is_variant = true;
		if (template.variants && template.variants.length) {
			if (!variant_leaf_path) {
				variant_leaf_path = [];
			}
			variant_leaf_path.length = template.variants.length;
			for (const i of template.variants.length) {
				const variant = template.variants[i];
				if (variant.type === "single") {
					let idx = variant.values.indexOf(variant_leaf_path[i]);
					if (idx === -1 || variant_leaf_path.length <= i) {
						idx = 0;
					}
					let curr_obj = template.vars;
					for (let j = 0; j < variant.var_path.length - 1; j++) {
						let next_obj = curr_obj[variant.var_path[j]];
						if (typeof next_obj !== "object" || next_obj instanceof Array) {
							next_obj = {};
							curr_obj[variant.var_path[j]] = next_obj;
						}
						curr_obj = next_obj;
					}
					if (curr_obj) {
						curr_obj[variant.var_path[variant.var_path.length - 1]] = variant.values[idx];
					}
				}
			}
		}
		if (instance_vars) {
			utils.weak_deep_assign(instance_vars, template.vars);
			template.vars = instance_vars;
		}
		return template;
	}
	/**
	 * Sends the given chat message to ALL clients. There's a tagged template literal form of this function that uses format_html that is demonstrated in the example
	 * @example
	 * to_global_chat("<span class='warning'>The action failed</span>");
	 *
	 * // This is the correct format:
	 * to_global_chat(format_html`<span class='warning'>The ${this.a} explodes!</span>`);
	 *
	 * // Be careful, if you do this, the HTML will not be escaped! Use one of the above format to ensure that your HTML is escaped to prevent XSS exploits.
	 * to_global_chat(`<span class='warning'>The ${this.a} explodes!</span>`);
	 * @memberof Typespess
	 * @see {@link Typespess#format_html}
	 * @param {Typespess.Atom|Client|Array<Typespess.Atom|Client>} target
	 * @param {string} message
	 */

	to_global_chat(...b: any) {
		for (const key in this.clients) {
			if (!Object.prototype.hasOwnProperty.call(this.clients, key)) {continue;}
			const client = this.clients[key];
			let cl;
			if (client instanceof Client) {
				cl = client;
			} else {
				cl = client.a.c.Mob.client;
			}
			if (!cl) {return;}
			if (!cl.next_message.to_chat) {
				cl.next_message.to_chat = [];
			}
			cl.next_message.to_chat.push(b.join(""));
		}
	}

	/**
	 * Instances a map, like {@link instance_map}, but synchronous, and no callback for percentage.
	 * @param {Object} obj Parsed JSON object representing the map
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 */
	instance_map_sync(obj: any, x: number, y: number, z: number, dim: any) {
		const inst_list = [];
		for (const loc in obj.locs) {
			if (!Object.prototype.hasOwnProperty.call(obj.locs, loc)) {continue;}
			for (const instobj of obj.locs[loc]) {
				const base_template = this.templates[instobj.template_name];
				if (!base_template) {
					console.warn(`Map references unknown template "${instobj.template_name}"`);
					continue;
				}
				const template = this.get_template_variant(
					base_template,
					instobj.variant_leaf_path,
					instobj.instance_vars
				);
				utils.weak_deep_assign(template, base_template);
				const atom = new Atom(this, template, x + instobj.x, y + instobj.y, z, dim);
				atom.emit("map_instanced", obj);
				inst_list.push(atom);
			}
		}
		for (let i = 0; i < inst_list.length; i++) {
			inst_list[i].emit("map_instance_done", obj);
		}
	}

	/**
	 * Instances a map
	 * @param {Object} obj Parsed JSON object representing the map
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 * @param {Function} [percentage_callback] A callback that is called periodically with a number 0 to 1 denoting how far along the instancing process is done.
	 */
	// eslint-disable-next-line max-params
	async instance_map(obj: any, x: number, y: number, z: number, dim: any, percentage_callback: any) {
		const locs = [...Object.values(obj.locs)];
		const inst_list = [];
		let idx = 0;
		for (const loc of locs) {
			idx++;
			const nLoc: any = loc;
			for (const instobj of nLoc) {
				const base_template = this.templates[instobj.template_name];
				if (!base_template) {
					console.warn(`Map references unknown template "${instobj.template_name}"`);
					continue;
				}
				const template = this.get_template_variant(
					base_template,
					instobj.variant_leaf_path,
					instobj.instance_vars
				);
				utils.weak_deep_assign(template, base_template);
				const atom = new Atom(this, template, x + instobj.x, y + instobj.y, z, dim);
				atom.emit("map_instanced", obj);
				inst_list.push(atom);
			}
			if (percentage_callback) {
				percentage_callback(idx / locs.length);
			}
			await utils.stoplag();
		}
		for (let i = 0; i < inst_list.length; i++) {
			inst_list[i].emit("map_instance_done", obj);
		}
	}
}

EventEmitter.defaultMaxListeners = Math.max(EventEmitter.defaultMaxListeners, 50);

Typespess.Atom = Atom;
Typespess.Component = Component;

utils.do_require();

Typespess.weak_deep_assign = utils.weak_deep_assign;
Typespess.deep_create = utils.deep_create;
Typespess.chain_func = utils.chain_func;
Typespess.make_watched_property = utils.make_watched_property;
Typespess.has_component = utils.has_component;
Typespess.is_atom = utils.is_atom;
Typespess.turn_dir = utils.turn_dir;
Typespess.dir_dx = utils.dir_dx;
Typespess.dir_dy = utils.dir_dy;
Typespess.dir_to = utils.dir_to;
Typespess.dir_reverse = utils.dir_reverse;
Typespess.stoplag = utils.stoplag;
Typespess.sleep = utils.sleep;
Typespess.visible_message = utils.visible_message;
Typespess.audible_message = utils.audible_message;
Typespess.to_chat = utils.to_chat;
Typespess.format_html = utils.format_html;
Typespess.escape_html = utils.escape_html;
Typespess.NORTH = utils.NORTH;
Typespess.SOUTH = utils.SOUTH;
Typespess.EAST = utils.EAST;
Typespess.WEST = utils.WEST;
Typespess.NORTHWEST = utils.NORTHWEST;
Typespess.SOUTHWEST = utils.SOUTHWEST;
Typespess.NORTHEAST = utils.NORTHEAST;
Typespess.SOUTHEAST = utils.SOUTHEAST;
Typespess.readonly_traps = utils.readonly_traps;

Typespess.Panel = Panel;
Typespess.Sound = Sound;
Typespess.VisibilityGroup = VisibilityGroup;
Typespess.Dimension = Dimension;

module.exports = Typespess;
