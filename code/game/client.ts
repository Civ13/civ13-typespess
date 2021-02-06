const { has_component } = require("./utils.ts");
const mob_symbols = require("./atom/mob.ts")._symbols;
const EventEmitter = require("events");
const Component = require("./atom/component.ts");

const _mob:any = Symbol("_mob");
const _atom_net_queue:any = Symbol("_atom_net_queue");
const _netid_to_atom:any = Symbol("_netid_to_atom");
const _netid_to_eye:any = Symbol("_netid_to_eye");
const _tiles_to_add:any = Symbol("_tiles_to_add");
const _tiles_to_remove:any = Symbol("_tiles_to_remove");

/** @typedef {import("./atom/atom")} Typespess.Atom */
/** @typedef {import("./server")} Typespess */

/**
 * @alias Client
 */
class Client extends EventEmitter {
	constructor(socket: any, username: any, server: any) {
		super();
		this.socket = socket;
		/**
	* @type {string}
	*/
		this.key = username;
		/**
	* @type {string}
	*/
		this.name = username;
		/**
	* @type {Typespess}
	*/
		this.server = server;
		this[_atom_net_queue] = {}; // It's not *really* a queue but whatever.
		this[_tiles_to_add] = new Set();
		this[_tiles_to_remove] = new Set();
		this[_netid_to_atom] = {};
		this[_netid_to_eye] = [];
		/**
	* An object containing some of the message to be sent on the next network tick. Add properties to this object to send things to the client.
	* @type {Object}
	*/
		this.next_message = {};

		/**
	* All the panels currently open
	* @type {Map<string,Typespess.Panel>}
	*/
		this.panels = new Map();

		this.socket.on("message", this.message_handler.bind(this));
		this.socket.on("close", this.disconnect_handler.bind(this));

		if (this.server.dc_mobs[this.key]) {
			if (typeof this.mob === "undefined") {this.mob = this.server.dc_mobs[this.key];}
			else {this.server.dc_mobs[this.key].c.Mob.key = void 0;}
		}

		if (this.server.demo_stream && !this.server.demo_stream.closed) {
			this.server.demo_stream.write(
				JSON.stringify({
					timestamp: this.server.now(),
					key: this.key,
					name: this.name,
					login: true,
				}) + "\n"
			);
		}

		this.address = this.socket._socket.remoteAddress;
		// for some reason ipv4 addresses are sometimes formated as ::ffff:12.34.56.78
		const found_ip4 = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.exec(
			this.address
		);
		if (found_ip4) {this.address = found_ip4[0];}

		this.server.emit("client_login", this);

		this.last_click_time = 0;
	}
	/**
  * Passed to mouse events.
  * @class
  * @name mouse_event
  * @alias mouse_event
  * @property {Typespess.Atom} atom
  * @property {Client} client
  * @property {Typespess.Atom<Mob>} mob
  * @property {number} x Where on the atom the mouse event occured
  * @property {number} y Where on the atom the mouse event occured
  */
	/**
  * @event Client#keydown
  * @type {Object}
  * @property {number} which keycode
  */
	/**
  * @event Client#keyup
  * @type {Object}
  * @property {number} which keycode
  */
	/**
  * Event name is prepended with, if applicable: ctrl_, alt_, shift_, middle_ in that order.
  * @event Client#click_on
  * @type {mouse_event}
  */
	/**
  * @event Client#mouse_dragged
  * @type {Object}
  * @property {mouse_event} from
  * @property {mouse_event} to
  */
	/**
  * @event Client#message
  * @type {Object}
  */
	/**
  * @event Client#message_pre
  * @type {Object}
  */
	message_handler(data: string) {
		try {
			const obj = JSON.parse(data);

			this.emit("message_pre", obj);
			if (this.mob) {this.mob.c.Mob.emit("message_pre", obj);}

			if (obj.ping) {
				this.socket.send(
					JSON.stringify({
						pong: obj.ping,
					})
				);
			}
			if (obj.keydown) {
				this.emit("keydown", obj.keydown);
				if (this.mob) {
					this.mob.c.Mob.emit("keydown", obj.keydown);
				}
			}
			if (obj.keyup) {
				this.emit("keyup", obj.keyup);
				if (this.mob) {
					this.mob.c.Mob.emit("keyup", obj.keyup);
				}
			}
			if (obj.click_on && this.last_click_time + 50 < this.server.now()) {this.obj_click(obj);}
			if (obj.drag && obj.drag.from && obj.drag.to) {this.obj_drag(obj);}
			if (obj.panel) {this.msg_panel(obj);}

			this.emit("message", obj);
			if (this.mob) {this.mob.c.Mob.emit("message", obj);}
		} catch (e) {
			console.error(e);
		}
	}
	obj_drag(obj: any) {
		// convert over to netids
		obj.drag.from.atom = this[_netid_to_atom][obj.drag.from.atom];
		obj.drag.to.atom = this[_netid_to_atom][obj.drag.to.atom];
		if (this.mob) {obj.drag.mob = this.mob;}
		obj.drag.client = this;
		this.emit("mouse_dragged", obj.drag);
		if (this.mob) {this.mob.c.Mob.emit("mouse_dragged", obj.drag);}
		if (obj.drag.from.atom)
			{obj.drag.from.atom.emit("mouse_dragged_to", obj.drag);}
		if (obj.drag.to.atom)
			{obj.drag.to.atom.emit("mouse_dropped_by", obj.drag);}
	}
	obj_click(obj: any) {
		this.last_click_time = this.server.now();

				let click_prefix = "";
				if (obj.click_on.ctrlKey) {click_prefix += "ctrl_";}
				if (obj.click_on.altKey) {click_prefix += "alt_";}
				if (obj.click_on.shiftKey) {click_prefix += "shift_";}
				if (obj.click_on.button === 1) {click_prefix += "middle_";}

				obj.click_on.atom = this[_netid_to_atom][obj.click_on.atom];
				if (this.mob) {obj.click_on.mob = this.mob;}
				obj.click_on.client = this;
				this.emit(click_prefix + "click_on", obj.click_on);
				if (this.mob) {
					this.mob.c.Mob.emit(click_prefix + "click_on", obj.click_on);
				}
				if (obj.click_on.atom)
					{obj.click_on.atom.emit(click_prefix + "clicked", obj.click_on);}
	}
	msg_panel(obj: { panel: any; }) {
		const pm = obj.panel;
		if (pm.message) {
			for (const message of pm.message) {
				const id = message.id;
				const panel = this.panels.get(id);
				if (panel) {
					panel.emit("message", message.contents);
				}
			}
		}
		if (pm.close) {
			for (const id of pm.close) {
				const panel = this.panels.get(id);
				if (!panel) {continue;}
				panel.close(false);
			}
		}
	}
	disconnect_handler() {
		const mob = this.mob;
		if (mob) {
			this.mob = null;
		}
		if (this.server.clients[this.key] === this)
			{delete this.server.clients[this.key];}
		if (this.server.clients_by_name[this.name] === this)
			{delete this.server.clients_by_name[this.name];}
		if (mob) {
			mob.c.Mob.key = this.key;
		}
		if (this.server.demo_stream && !this.server.demo_stream.closed) {
			this.server.demo_stream.write(
				JSON.stringify({
					timestamp: this.server.now(),
					key: this.key,
					logout: true,
				}) + "\n"
			);
		}
	}

	/**
  * The mob currently being controlled by the client
  * @type {Typespess.Atom<Mob>|null}
  */
	get mob() {
		return this[_mob];
	}
	set mob(val) {
		if (val === this[_mob]) {return;}
		if (val && !has_component(val, "Mob"))
			{throw new TypeError("Expected object with Mob component");}
		if (this[_mob]) {
			this[_mob].c.Mob[mob_symbols._client] = void 0;
			this[_mob].c.Mob[mob_symbols._key] = void 0;
			this.next_message.eye = this.next_message.eye || {};
			for (const eyeId in this[_mob].c.Mob.eyes) {
				if (!Object.prototype.hasOwnProperty.call(this[_mob].c.Mob.eyes,eyeId)) {continue;}
				const eye = this[_mob].c.Mob.eyes[eyeId];
				for (const netid in eye.c.Eye[mob_symbols._viewing]) {
					if (!Object.prototype.hasOwnProperty.call(eye.c.Eye[mob_symbols._viewing],netid)) {continue;}
					this.enqueue_delete_atom(netid);
				}
				for (const tile of eye.c.Eye[mob_symbols._visible_tiles]) {
					this.enqueue_remove_tile(tile);
				}
			}
			this[_mob].c.Mob.emit("client_changed", this, null);
		}
		if (val) {
			delete this.server.dc_mobs[val.c.Mob.key];
		}
		this[_mob] = val;
		if (this[_mob]) {
			const old_client = this[_mob].c.Mob.client;
			if (old_client) {old_client.mob = null;}
			for (const eyeId in this[_mob].c.Mob.eyes) {
				if (!Object.prototype.hasOwnProperty.call(this[_mob].c.Mob.eyes,eyeId)) {continue;}
				const eye = this[_mob].c.Mob.eyes[eyeId];
				for (const netid in eye.c.Eye[mob_symbols._viewing]) {
					if (!Object.prototype.hasOwnProperty.call(eye.c.Eye[mob_symbols._viewing],netid)) {continue;}
					this.enqueue_create_atom(
						netid,
						eye.c.Eye[mob_symbols._viewing][netid],
						eye
					);
				}
				for (const tile of eye.c.Eye[mob_symbols._visible_tiles]) {
					this.enqueue_add_tile(tile);
				}
				this.next_message.eye = this.next_message.eye || {};
				this.next_message.eye[eyeId] = {
					x: eye.base_mover.x,
					y: eye.base_mover.y,
					glide_size: 0,
				};
			}
			this[_mob].c.Mob[mob_symbols._client] = this;
			this[_mob].c.Mob[mob_symbols._key] = this.key;
			this[_mob].c.Mob.emit("client_changed", old_client, this);
		}
	}
	enqueue_create_atom(netid: string, atom: any, eye: any) {
		this[_atom_net_queue][netid] = { create: atom };
		this[_netid_to_atom][netid] = atom;
		this[_netid_to_eye][netid] = eye;
	}

	enqueue_update_atom_var(netid: string | number, atom: any, varname: any, type: number) {
		let entry = this[_atom_net_queue][netid];
		if (!entry) {entry = {};}
		if (entry.create) {
			// The create packet has not been sent yet. This means there's no point in updating.
			return;
		}
		this[_atom_net_queue][netid] = entry;
		if (!entry.update) {
			entry.update = {};
			entry.update.atom = atom;
		}
		if (typeof type === "string") {
			if (!entry.update.components) {entry.update.components = {};}
			if (!entry.update.components[type])
				{entry.update.components[type] = new Set();}
			entry.update.components[type].add(varname);
		} else {
			const subentry = entry.update;
			const setname =
		type === 1 ? "appearance_items" : type === 2 ? "overlays" : "items";
			if (!subentry[setname]) {subentry[setname] = new Set();}
			subentry[setname].add(varname);
		}
	}
	enqueue_delete_atom(netid: string) {
		this[_netid_to_atom][netid] = void 0;
		this[_netid_to_eye][netid] = void 0;
		this[_atom_net_queue][netid] = { delete: true };
	}

	enqueue_add_tile(tile: { x: any; y: any; z: any; }) {
		const strtile = JSON.stringify([tile.x, tile.y, tile.z]);
		if (!this[_tiles_to_remove].delete(strtile))
			{this[_tiles_to_add].add(strtile);}
	}

	enqueue_remove_tile(tile: { x: any; y: any; z: any; }) {
		const strtile = JSON.stringify([tile.x, tile.y, tile.z]);
		if (!this[_tiles_to_add].delete(strtile))
			{this[_tiles_to_remove].add(strtile);}
	}

	send_network_updates() {
		if (!this.socket || this.socket.readyState !== this.socket.OPEN) {return;}
		const message: any = {};
		for (const netid in this[_atom_net_queue]) {
			if (this[_atom_net_queue][netid]) {
			const entry = this[_atom_net_queue][netid];
			if (entry.create) {this.network_updates_create(message,entry,netid);}
			else if (entry.update) {this.network_updates_update(message,entry,netid);}
			
			else if (entry.delete) {
				if (!message.delete_atoms) {message.delete_atoms = [];}
				message.delete_atoms.push(netid);
			}
			delete this[_atom_net_queue][netid];
		}
		}
		if (this[_tiles_to_add].size) {
			message.add_tiles = [...this[_tiles_to_add]];
			this[_tiles_to_add].clear();
		}
		if (this[_tiles_to_remove].size) {
			message.remove_tiles = [...this[_tiles_to_remove]];
			this[_tiles_to_remove].clear();
		}
		for (const key in this.next_message) {
			if (!Object.prototype.hasOwnProperty.call(this.next_message,key)) {continue;}
			message[key] = this.next_message[key];
			delete this.next_message[key];
		}
		if (JSON.stringify(message) === "{}") {return;}
		message.timestamp = this.server.now();
		if (this.server.demo_stream && !this.server.demo_stream.closed) {
			this.server.demo_stream.write(
				JSON.stringify({
					timestamp: message.timestamp,
					key: this.key,
					server_message: message,
				}) + "\n"
			);
		}
		this.socket.send(JSON.stringify(message));
	}
	network_updates_create(message: any,entry: any,netid: string) {
	if (!message.create_atoms) {message.create_atoms = [];}
	const atom = entry.create;
	const common_visgroups = [];
	for (const visgroup of atom[mob_symbols._visgroups]) {
		if (
			this[_netid_to_eye][netid].c.Eye[mob_symbols._visgroups].has(
				visgroup
			)
		)
			{common_visgroups.push(visgroup);}
	}
	const submessage = {
		network_id: netid,
		component_vars: {},
		components: [],
		eye_id: this.mob.c.Mob.get_eyeid_for_eye(this[_netid_to_eye][netid]),
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
		submessage[key] = atom[key];
		for (const visgroup of common_visgroups) {
			if (visgroup.overrides.has(key))
				{submessage[key] = visgroup.overrides.get(key);}
		}
	}
	if (atom.template && atom.template.components) {
		for (const component_name of atom.template.components) {
			const component = atom.components[component_name];
			if (!(component instanceof Component.Networked)) {continue;}
			submessage.components.push(component_name);
			submessage.component_vars[component_name] = component.get_networked_vars();
		}
	}
	message.create_atoms.push(submessage);
	}
	network_updates_update(message: { update_atoms: any[]; },entry: { update: { atom: any; items: any; overlays: any; components: { [x: string]: any; }; }; },netid: string) {
		if (!message.update_atoms) {message.update_atoms = [];}
		const atom = entry.update.atom;
		const common_visgroups = [];
		for (const visgroup of atom[mob_symbols._visgroups]) {
			if (
				this[_netid_to_eye][netid].c.Eye[mob_symbols._visgroups].has(
					visgroup
				)
			)
				{common_visgroups.push(visgroup);}
		}
		const submessage: any = {};
		if (entry.update.items) {
			for (const item of entry.update.items) {
				submessage[item] = atom[item];
				for (const visgroup of common_visgroups) {
					if (visgroup.overrides.has(item))
						{submessage[item] = visgroup.overrides.get(item);}
				}
				if (typeof submessage[item] === "undefined") {submessage[item] = null;}
			}
		}
		if (entry.update.overlays) {
			submessage.overlays = {};
			for (const item of entry.update.overlays) {
				submessage.overlays[item] =
	typeof atom.overlays[item] === "undefined" ? null : atom.overlays[item];
			}
		}
		if (entry.update.components) {
			submessage.components = {};
			for (const component_name in entry.update.components) {
				if (!Object.prototype.hasOwnProperty.call(entry.update.components,component_name))
					{continue;}
				submessage.components[component_name] = {};
				for (const item of entry.update.components[component_name]) {
					submessage.components[component_name][item] =
		atom.components[component_name][item];
				}
			}
		}
		message.update_atoms.push(submessage);
	}
}

module.exports = Client;
