export{};
const EventEmitter = require("events");

let id_ctr = 0;

/** @typedef {import('./atom/atom')} Typespess.Atom */
/** @typedef {import('./client')} Client */

/**
 * @memberof Typespess
 * @abstract
 */
class Panel extends EventEmitter {
	/**
	 * @param {Client} client
	 * @param {Object} panel_props
	 * @param {number} [panel_props.width=400]
	 * @param {number} [panel_props.height=400]
	 * @param {string} [panel_props.title=""]
	 * @param {boolean} [panel_props.can_close=true]
	 */
	constructor(client: any, panel_props: any) {
		super();
		/**
		 * @type {Client}
		 */
		this.client = client;
		/**
		 * Used for networking
		 * @type {string}
		 */
		this.id = "panel_" + ++id_ctr;
		/**
		 * @type {boolean}
		 * @see {@link Typespess.Panel#open}
		 * @see {@link Typespess.Panel#close}
		 */
		this.is_open = false;
		/** @type {Typespess.Atom|null} */
		this.bound_atom = null;
		/** @type {Typespess.Atom|null} */
		this.bound_mob = null;
		panel_props.content_class = this.constructor.name;
		this.client.panels.set(this.id, this);
		this.panel_props = panel_props;
		this.client.emit("create_panel", this);
	}

	/**
	 * @event Typespess.Panel#message
	 * @type {Object}
	 */

	/**
	 * Can only be called once. Opens the panel.
	 */
	open() {
		if (!this.client || !this.client.panels.has(this.id) || this.is_open) {
			throw new Error("Reopening a panel is forbidden! Create a new panel instead.");
		}
		const pm = this.client.next_message.panel || (this.client.next_message.panel = {});
		if (!pm.create) {
			pm.create = {};
		}
		pm.create[this.id] = this.panel_props;
		this.is_open = true;
		this.emit("open");
	}

	/**
	 * Sends a network message to the client about this panel
	 * @param {Object} message
	 */
	send_message(message: any) {
		if (!this.is_open && this.client) {
			console.warn(new Error("Cannot send message on an unopened panel!"));
			return;
		}
		if (!this.client) {
			return;
		}
		const pm = this.client.next_message.panel || (this.client.next_message.panel = {});
		if (!pm.message) {
			pm.message = [];
		}
		pm.message.push({id: this.id, contents: message});
	}

	/**
	 * Closes the panel
	 */
	close(send_message = true) {
		if (!this.is_open) {
			return;
		}
		if (this.client && send_message) {
			const pm = this.client.next_message.panel || (this.client.next_message.panel = {});
			if (!pm.close) {
				pm.close = [];
			}
			pm.close.push(this.id);
		}
		this.client.panels.delete(this.id);
		this.is_open = false;
		this.emit("close");
		this.client = null;
	}
}

module.exports = Panel;
