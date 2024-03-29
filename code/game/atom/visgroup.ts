export{};
const {chain_func} = require("../utils.js");
const mob_symbols = require("./mob.js")._symbols;

/**
 * @typedef {import('./atom')} Typespess.Atom
 */

/**
 * Used for making things appear differently to certain players
 * @example
 * let group = new VisibilityGroup();
 * group.atoms.add(atom);
 * group.viewers.add(user);
 * group.overrides.set("visible", true);
 * // Atom is now networked to user, even if the "visible" var is actually false.
 * @memberof Typespess
 */
class VisibilityGroup {
	atoms: Set<unknown>;
	viewers: Set<unknown>;
	overrides: Map<any, any>;
	constructor() {
		/**
		 * Which atoms are changed
		 * @type {Set<Typespess.Atom>}
		 */
		this.atoms = new Set();
		this.atoms.add = chain_func(this.atoms.add, (prev: any, item: any) => {
			const ret = prev();
			if (!item[mob_symbols._visgroups].includes(this)) {
				item[mob_symbols._visgroups].push(this);
			}
			this.override_changed(null, {atom: item});
			return ret;
		});
		this.atoms.delete = chain_func(this.atoms.delete, (prev: any, item: any) => {
			const ret = prev();
			const idx = item[mob_symbols._visgroups].indexOf(this);
			item[mob_symbols._visgroups].splice(idx, 1);
			this.override_changed(null, {atom: item});
			return ret;
		});
		/**
		 * Which eyes to show these changes to
		 * @type {Set<Typespess.Atom<Eye>>}
		 */
		this.viewers = new Set();
		this.viewers.add = chain_func(this.viewers.add, (prev: any, item: any) => {
			const ret = prev();
			item.c.Eye[mob_symbols._visgroups].add(this);
			this.override_changed(null, {viewer: item});
			return ret;
		});
		this.viewers.delete = chain_func(this.viewers.delete, (prev: any, item: any) => {
			const ret = prev();
			item.c.Eye[mob_symbols._visgroups].delete(this);
			this.override_changed(null, {viewer: item});
			return ret;
		});
		/**
		 * The property changes
		 * @type {Map<string,any>}
		 */
		this.overrides = new Map();
		this.overrides.set = chain_func(this.overrides.set, (prev: any, key: any) => {
			this.override_changed(key);
			return prev();
		});
		this.overrides.delete = chain_func(this.overrides.delete, (prev: any, key: any) => {
			this.override_changed(key);
			return prev();
		});
		this.overrides.clear = chain_func(this.overrides.clear, (prev: any) => {
			const keys = [...this.overrides.keys()];
			for (const key of keys) {
				this.override_changed(key);
			}
			return prev();
		});
	}

	override_changed(key: any, viewer: any = null, atom: any = null) {
		if (viewer === null) {
			for (viewer of this.viewers) {
				this.override_changed(key, {viewer, atom});
			}
			return;
		} else if (atom === null) {
			for (atom of this.atoms) {
				this.override_changed(key, {viewer, atom});
			}
			return;
		} else if (key === null) {
			for (key of this.overrides.keys()) {
				this.override_changed(key, {viewer, atom});
			}
			return;
		}
		const can_see = viewer.c.Eye.can_see(atom);

		if (key === "visible") {
			// Special snowflakey code for when this changes visibility...
			// which is what this class will probably be used for 99% of the time.
			if (can_see) {
				viewer.c.Eye[mob_symbols._add_viewing](atom);
			} else {
				viewer.c.Eye[mob_symbols._remove_viewing](atom);
			}
			return;
		}

		if (!can_see) {
			return;
		}

		const match = key.match(/^([^.]+)$/i);
		if (match) {
			const netid = viewer.c.Eye[mob_symbols._server_to_net][atom.object_id];
			if (netid) {
				viewer.c.Eye.enqueue_update_atom_var(netid, atom, match[1], 0);
			}
		}
	}
}

module.exports = VisibilityGroup;
