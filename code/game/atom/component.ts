const EventEmitter = require("events");
const mob_symbols = require("./mob.js")._symbols;
const _networked_vars:any = Symbol("_networked_vars");

/**
 * @typedef {import("./atom")} Typespess.Atom
 */

/**
 * Should never be instanced directly.
 * @memberof Typespess
 * @abstract
 */export{};
class Component extends EventEmitter {
	/**
  * @param {Typespess.Atom} atom
  * @param {template} template
  */
	constructor(atom: any, template: any) {
		super();
		Object.defineProperty(this, "atom", {
			enumerable: false,
			configurable: false,
			writable: false,
			value: atom,
		});
		/**
	* The atom this component belongs to
	* @type {Typespess.Atom}
	*/
		this.atom;
		if (!this.a.server.atoms_for_components[this.constructor.name]) {
			this.a.server.atoms_for_components[this.constructor.name] = new Set();
		}
		this.a.server.atoms_for_components[this.constructor.name].add(atom);
		atom.components[this.constructor.name] = this;
		if (template) {
			Object.assign(this, template);
		}
	}

	/**
  * Alias for {@link Typespess.Component#atom}
  * @type {Typespess.Atom}
  * @instance
  */
	get a() {
		return this.atom;
	}

	/**
  * Called when the atom this component belongs to is destroyed.
  * @abstract
  */
	destroy() {
		this.a.server.atoms_for_components[this.constructor.name].delete(this.atom);
	}
}

/**
 * Set this to specify default values on your component
 * @type {template}
 * @member template
 * @memberof Typespess.Component
 * @static
 * @abstract
 */

/**
 * Indicates that the given components should always be loaded before this one.
 * @type {Array<string>}
 * @member loadBefore
 * @memberof Typespess.Component
 * @static
 * @abstract
 */

/**
 * Indicates that the given components should always be loaded after this one.
 * @type {Array<string>}
 * @member loadAfter
 * @memberof Typespess.Component
 * @static
 * @abstract
 */

/**
 * Indicates that this component requires the given components to also be loaded. This does not fix the order, use {@link Typespess.Component#loadBefore} and {@link Typespess.Component.#loadAfter} for that.
 * @type {Array<string>}
 * @member depends
 * @memberof Typespess.Component
 * @static
 * @abstract
 */

/**
 * Used for components that are sent to the client.
 * @memberof Typespess.Component
 * @alias Typespess.Component.Networked
 */
class NetworkedComponent extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this[_networked_vars] = {};
	}

	/**
  * Makes the property with the specified name networked.
  * @param {string} name
  * @param {Function} on_set A function that is called when this property gets changed. If it returns falsish, the property does not get set.
  */
	add_networked_var(name: string, on_set: any) {
		if (Object.prototype.hasOwnProperty.call(this[_networked_vars],name)) {return;}
		this[_networked_vars][name] = this[name];
		Object.defineProperty(this, name, {
			configurable: false,
			enumerable: true,
			get: () => {
				return this[_networked_vars][name];
			},
			set: (val) => {
				if (val === this[_networked_vars][name]) {return;}
				if (on_set && !on_set(val)) {return;}
				const old = this[_networked_vars][name];
				this[_networked_vars][name] = val;
				this.atom[mob_symbols._update_var](name, this.constructor.name);
				this.emit("networked_var_changed", name, old, val);
			},
		});
	}

	/**
  * Returns an object with all the networked vars on this component
  * @returns {Object}
  */
	get_networked_vars() {
		// This isn't as slow as you think it is.
		return Object.assign({}, this[_networked_vars]);
	}
}

Component.Networked = NetworkedComponent;

module.exports = Component;
