export{};
const Component = require("./component.js");

const _visible_tiles: any = Symbol("_visible_tiles");

/**
 * @alias Hearer
 */
// This is used for seeing and hearing text. Relevant to
class Hearer extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this[_visible_tiles] = new Set();
		this.update_visible_tiles();
		this.is_updating_visible_tiles = false;
		this.a.on("moved", this.enqueue_update_visible_tiles.bind(this));
	}

	update_visible_tiles() {
		const new_visible = this.a.server.compute_visible_tiles(this.atom, 8, false);
		const old_visible = this[_visible_tiles];
		const added = [...new_visible].filter((item) => {
			return !old_visible.has(item);
		});
		const removed = [...old_visible].filter((item) => {
			return !new_visible.has(item);
		});
		this[_visible_tiles] = new_visible;
		for (const tile of added) {
			if (tile && tile.hearers) {
				tile.hearers.push(this.atom);
			}
		}
		for (const tile of removed) {
			if (tile && tile.hearers) {
				tile.hearers.splice(tile.hearers.indexOf(this.atom), 1);
			}
		}
		this.is_updating_visible_tiles = false;
	}

	enqueue_update_visible_tiles() {
		if (this.is_updating_visible_tiles) {
			return;
		}
		process.nextTick(this.update_visible_tiles.bind(this));
		this.is_updating_visible_tiles = true;
	}

	/**
	 * Gets the tiles visible to this atom.
	 * @generator
	 * @yields {Location}
	 */
	get visible_tiles() {
		return this[_visible_tiles][Symbol.iterator].bind(this);
	}

	/**
	 * @param {Typespess.Sound} sound
	 * @abstract
	 */
	can_hear_sound() {
		return this.can_hear();
	}

	/**
	 * @param {Typespess.Atom} [origin]
	 * @abstract
	 */
	can_hear() {return true;}

	/**
	 * @param {Typespess.Atom} origin
	 * @abstract
	 */
	can_see(atom: Record<string, any>) {
		return atom && atom.loc && atom.loc === atom.base_loc;
	}

	/**
	 * @param {Typespess.Atom} atom
	 */
	in_view(atom: Record<string, any>) {
		for (const tile of atom.partial_locs()) {
			if (tile.hearers.includes(this)) {return true;}
		}
		return false;
	}

	/**
	 * @param {Typespess.ChatMessage} message
	 * @returns {string} The message this atom will be shown
	 */
	show_message(message: Record<string, any>) {
		const can_hear = this.a.c.Hearer.can_hear(message.emitter);
		const can_see = this.a.c.Hearer.can_see(message.emitter);
		if (!can_see && !can_hear) {
			return;
		}
		if (message.type === "see" && !can_see) {
			return message.blind_message;
		}
		if (message.type === "hear" && !can_hear) {
			return message.deaf_message;
		}
		if (message.self_message && message.emitter === this.a) {
			return message.self_message;
		}
		return message.message;
	}
}

module.exports.components = {Hearer};
