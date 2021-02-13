export{};
const { format_html, has_component } = require("./utils.js");

/** @typedef {ChatMessage} Typespess.ChatMessage */

/**
 * @memberof Typespess
 */
class ChatMessage {
	msg_range: number;
	type: any;
	message: any;
	self_message: string;
	deaf_message: string;
	blind_message: string;
	emitter: any;
	constructor(type: any, message: any) {
		/**
	* Should be 'see' or 'hear'
	* @type {string}
	*/
		this.type = type;
		/**
	* @type {string}
	*/
		this.message = message;
		/**
	* Limited to the range of the hearers
	* @type {number}
	* @default 1000
	*/
		this.msg_range = 1000;
	}

	/**
  * Has template literal form, see {@link Typespess.format_html}
  * Sets the {@link Typespess.ChatMessage#self_message} property, with chaining.
  * @param {string} message
  * @returns {Typespess.ChatMessage} (this object)
  */
	self(a: string, ...b: any) {
		if (typeof a === "string") {
			this.self_message = a;
			return this;
		}
		return this.self(format_html(a, ...b));
	}

	/**
  * Has template literal form, see {@link Typespess.format_html}
  * Sets the {@link Typespess.ChatMessage#deaf_message} property, with chaining.
  * @param {string} message
  * @returns {Typespess.ChatMessage} (this object)
  */
	deaf(a, ...b) {
		if (typeof a === "string") {
			this.deaf_message = a;
			return this;
		}
		return this.deaf(format_html(a, ...b));
	}

	/**
  * Has template literal form, see {@link Typespess.format_html}
  * Sets the {@link Typespess.ChatMessage#blind_message} property, with chaining.
  * @param {string} message
  * @returns {Typespess.ChatMessage} (this object)
  */
	blind(a, ...b) {
		if (typeof a === "string") {
			this.blind_message = a;
			return this;
		}
		return this.blind(format_html(a, ...b));
	}

	/**
  * Sets the {@link Typespess.ChatMessage#msg_range} property, with chaining
  * @param {number} range
  * @returns {Typespess.ChatMessage} (this object)
  */
	range(num) {
		this.msg_range = num;
		return this;
	}

	/**
  * Emits this message from the atom
  * @param {Typespess.Atom} atom
  * @returns {Typespess.ChatMessage} (this object)
  */
	emit_from(atom: Record<string,any>) {
		if (!atom) {return;}
		this.emitter = atom;
		const hearers = new Set();
		for (const loc of atom.base_mover.partial_locs()) {
			for (const hearer of loc.hearers) {hearers.add(hearer);}
		}
		for (const thearer of hearers) {
			const hearer: Record<string,any> = thearer;
			if (
				Math.max(Math.abs(hearer.x - atom.x), Math.abs(hearer.y - atom.y)) <=
		this.msg_range
			)
				{hearer.c.Hearer.show_message(this);}
		}
		return this;
	}

	/**
  * Emits this message directly to the target from the source
  * @param {Typespess.Atom} target
  * @param {Typespess.Atom} source
  * @returns {Typespess.ChatMessage} (this object)
  */
	show_directly_to(target: any, source: any) {
		if (!target || !source || !has_component(target, "Hearer")) {return;}
		this.emitter = source;
		target.c.Hearer.show_message(this);
		return this;
	}
}

module.exports = ChatMessage;
