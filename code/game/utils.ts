export{};
let Atom: any, Client: any, ChatMessage: new (arg0: string, arg1: string) => any;

const _chain_parent = Symbol("_chain_parent");
const _chain_spliced = Symbol("_chain_spliced");

/**
 * @typedef {import('./atom/atom')} Typespess.Atom
 * @typedef {import('./client')} Client
 * @typedef {import('./chat_message')} Typespess.ChatMessage
 */

module.exports = {
	/**
	 * Sort of like Object.assign(), but it assigns *behind* the other object, and it's also recursive.
	 * @memberof Typespess
	 * @param {Object} a
	 * @param {Object} b
	 */
	weak_deep_assign(a: any, b: any) {
		for (const key in b) {
			if (!Object.prototype.hasOwnProperty.call(b, key)) {continue;}
			if (
				typeof b[key] === "object" &&
				b[key] !== null &&
				!(b[key] instanceof Array) &&
				(!Object.prototype.hasOwnProperty.call(a, key) ||
					typeof a[key] !== "object" ||
					typeof a[key] === "undefined" ||
					a[key] instanceof Array)
			) {
				a[key] = {};
			}
			if (Object.prototype.hasOwnProperty.call(a, key)) {
				if (
					typeof a[key] === "object" &&
					a[key] !== null &&
					!(a[key] instanceof Array) &&
					typeof b[key] === "object" &&
					b[key] !== null &&
					!(b[key] instanceof Array)
				) {
					module.exports.weak_deep_assign(a[key], b[key]);
				}
			} else {
				a[key] = b[key];
			}
		}
		return a;
	},

	// Recursive version of Object.create()
	deep_create(obj: Record<string, any>) {
		const newobj = Object.create(obj);
		for (const key in obj) {
			if (!Object.prototype.hasOwnProperty.call(obj, key)) {continue;}
			if (typeof obj[key] === "object" && !(obj[key] instanceof Array)) {
				newobj[key] = module.exports.deep_create(obj[key]);
			}
		}
		return newobj;
	},

	/**
	 * Used for overriding functions. Similar to underscore's <code>wrap</code> function.
	 * @example
	 * function foo(a) {
	 * 	return a;
	 * }
	 * console.log(foo("bar")); // logs "bar"
	 * foo = chain_func(foo, function(prev) {
	 * 	return prev() + "baz";
	 * });
	 * let splice = foo.splice;
	 * console.log(foo("bar")); // logs "barbaz"
	 * splice();
	 * console.log(foo("bar")); // logs "bar"
	 * @memberof! Typespess
	 * @static
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	chain_func(func1: any, func2: any) {
		if (typeof func2 === "undefined") {
			throw new Error("Chaining undefined function!");
		}
		function chained_func(this: any, ...args: any[]) {
			while (chained_func[_chain_parent] && chained_func[_chain_parent][_chain_spliced]) {
				chained_func[_chain_parent] = chained_func[_chain_parent][_chain_parent];
			}
			const prev = (...override_args: undefined[]) => {
				if (!chained_func[_chain_parent]) {return;}
				if (override_args.length) {
					return chained_func[_chain_parent].call(this, ...override_args);
				} else {
					return chained_func[_chain_parent].call(this, ...args);
				}
			};
			if (chained_func[_chain_spliced]) {
				return prev();
			}
			return func2.call(this, prev, ...args);
		}
		chained_func.splice = function () {
			chained_func[_chain_spliced] = true;
		};
		chained_func[_chain_spliced] = false;
		chained_func[_chain_parent] = func1;
		return chained_func;
	},

	/**
	 *
	 * @param {any} obj
	 * @param {string} name
	 * @param {string|((val) => boolean)} check
	 */
	make_watched_property(obj: any, name: string, check: {(arg0: any): any; (val: any): boolean}) {
		const init_value = obj[name];
		let value: any = null;
		const event_name = `${name}_changed`;
		if (typeof check === "string") {
			const type = check;
			check = function (val: any) {
				if (typeof val !== type) {return true;}
			};
		}
		if (check && typeof init_value !== "undefined" && check(init_value)) {
			throw new Error(`Initial value ${init_value} for ${name} failed type check!`);
		}
		Object.defineProperty(obj, name, {
			get() {
				return value;
			},
			set(val) {
				if (check && check(val)) {
					throw new Error(`Setting ${name} to ${val} failed type check!`);
				}
				if (val === value) {return;}
				const old = value;
				value = val;
				obj.emit(event_name, old, val);
			},
			enumerable: true,
		});
		if (typeof init_value !== "undefined") {
			obj[name] = init_value;
		}
	},

	/**
	 * Checks if a given object is an atom and has the given component
	 * @memberof Typespess
	 * @param {Typespess.Atom} atom The object to check
	 * @param {string} name The name of the component
	 * @returns {boolean}
	 */
	has_component(atom: Record<string,any>, name: string) {
		return atom && atom instanceof Atom && !!atom.components[name];
	},

	/**
	 * Checks if a given object is an atom
	 * @memberof Typespess
	 * @param {Typespess.Atom} atom The object to check
	 * @returns {boolean}
	 */
	is_atom(atom: any) {
		return atom && atom instanceof Atom;
	},

	/**
	 * Rotates the given direction by the given angle clockwise
	 * @memberof Typespess
	 * @param {number} dir The direction to turn
	 * @param {number} angle The angle to turn it by
	 * @returns {number} The resulting direction
	 */
	turn_dir(dir: number, angle: number) {
		dir = dir & 15;
		angle = ((angle % 360) + 360) % 360;
		return [
			// woo lookup table time
			[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
			[0, 5, 10, 15, 6, 4, 2, 15, 9, 1, 8, 15, 15, 15, 15, 15],
			[0, 4, 8, 12, 2, 6, 10, 14, 1, 5, 9, 13, 3, 7, 11, 15],
			[0, 6, 9, 15, 10, 2, 8, 15, 5, 4, 1, 15, 15, 15, 15, 15],
			[0, 2, 1, 3, 8, 10, 9, 11, 4, 6, 5, 7, 12, 14, 13, 15],
			[0, 10, 5, 15, 9, 8, 1, 15, 6, 2, 4, 15, 15, 15, 15, 15],
			[0, 8, 4, 12, 1, 9, 5, 13, 2, 10, 6, 14, 3, 11, 7, 15],
			[0, 9, 6, 15, 5, 1, 4, 15, 10, 8, 2, 15, 15, 15, 15, 15],
		][Math.floor(angle / 90) * 2 + (angle % 90 === 0 ? 0 : 1)][dir];
	},

	dir_dx(dir: number) {
		let dx = 0;
		if (dir & 4) {
			dx++;
		}
		if (dir & 8) {
			dx--;
		}
		return dx;
	},

	dir_dy(dir: number) {
		let dy = 0;
		if (dir & 1) {
			dy++;
		}
		if (dir & 2) {
			dy--;
		}
		return dy;
	},

	dir_to(dx: number, dy: number) {
		let dir = 0;
		if (dy > 0) {
			dir |= 1;
		}
		if (dy < 0) {
			dir |= 2;
		}
		if (dx > 0) {
			dir |= 4;
		}
		if (dx < 0) {
			dir |= 8;
		}
		return dir;
	},

	dir_reverse(dir: number) {
		switch (dir) {
			case 1: //North
				dir = 2;
				break;
			case 2: //South
				dir = 1;
				break;
			case 4: //East
				dir = 8;
				break;
			case 8: //West
				dir = 4;
				break;
			case 5: //Northeast
				dir = 10;
				break;
			case 6: //Southeast
				dir = 9;
				break;
			case 9: //Northwest
				dir = 6;
				break;
			case 10: //Southwest
				dir = 5;
				break;
			default:
				dir = 1;
		}
		return dir;
	},
	//converts the ingame dirs to 1,2,3,4 to use with icons.
	dir2ico(icodir: number): number {
		if (icodir === 1 || icodir === 5) { //north, northeast
			icodir = 2;
		} else if (icodir === 2 || icodir === 10) { //south, southeast
			icodir = 1;
		} else if (icodir === 4 || icodir === 6) { //east, southeast
			icodir = 3;
		} else if (icodir === 8 || icodir === 9) { //west, northwest
			icodir = 4;
		} else {
			icodir = 1;
		}
		return icodir;
	},
	/**
	 * Returns a promise that resolves on setImmediate(). Useful for doing expensive things without blocking the node.js event loop.
	 * @memberof Typespess
	 * @async
	 */
	stoplag() {
		return new Promise((resolve) => {
			setImmediate(resolve);
		});
	},

	/**
	 * Returns a promise that resolves in the given amount of time.
	 * @memberof Typespess
	 * @param {number} time The amount of time before resolving the promise, in milliseconds.
	 * @async
	 */
	sleep(time = 0) {
		return new Promise((resolve) => {
			setTimeout(resolve, time);
		});
	},

	/**
	 * Has template literal form, see {@link Typespess.format_html}
	 * Builds a visible chat message object
	 * @param {string} message
	 * @returns {Typespess.ChatMessage} (this object)
	 * @memberof Typespess
	 */
	visible_message(a: any, ...b: any[]) {
		if (typeof a === "string") {
			return new ChatMessage("see", a);
		}
		return module.exports.visible_message(module.exports.format_html(a, ...b));
	},

	/**
	 * Has template literal form, see {@link Typespess.format_html}
	 * Builds an audible chat message object
	 * @param {string} message
	 * @returns {Typespess.ChatMessage} (this object)
	 * @memberof Typespess
	 */
	audible_message(a: any, ...b: any[]) {
		if (typeof a === "string") {
			return new ChatMessage("hear", a);
		}
		return module.exports.audible_message(module.exports.format_html(a, ...b));
	},

	/**
	 * Sends the given chat message to the given clients. There's a tagged template literal form of this function that uses format_html that is demonstrated in the example
	 * @example
	 * to_chat(user, "<span class='warning'>The action failed</span>");
	 *
	 * // If you use this in tagged template literal form:
	 * to_chat`<span class='warning'>The ${this.a} explodes!</span>`(user);
	 * // It's the equivalent to:
	 * to_chat(user, format_html`<span class='warning'>The ${this.a} explodes!</span>`);
	 *
	 * // Be careful, if you do this, the HTML will not be escaped! Use one of the above 2 formats to ensure that your HTML is escaped to prevent XSS exploits.
	 * to_chat(user, `<span class='warning'>The ${this.a} explodes!</span>`);
	 * @memberof Typespess
	 * @see {@link Typespess#format_html}
	 * @param {Typespess.Atom|Client|Array<Typespess.Atom|Client>} target
	 * @param {string} message
	 */
	to_chat(a: any, ...b: any) {
		if (a instanceof Atom || a instanceof Client) {
			let cl: any;
			if (a instanceof Client) {
				cl = a;
			} else {
				cl = a.c.Mob.client;
			}
			if (!cl) {return;}
			if (!cl.next_message.to_chat) {
				cl.next_message.to_chat = [];
			}
			cl.next_message.to_chat.push(b.join(""));
		} else if (
			a instanceof Array &&
			a.length &&
			(a[0] instanceof Atom || a[0] instanceof Client || a[0] instanceof Array)
		) {
			for (const item of a) {
				module.exports.to_chat(item, ...b);
			}
		} else {
			const formatted = module.exports.format_html(a, ...b);
			return (...items: any) => {
				module.exports.to_chat(items, formatted);
			};
		}
	},
	/**
	 * A tagged template literal function.
	 * Anything in the <code>${}</code> is escaped.
	 * @example
	 * // obj gets html-escaped.
	 * let obj = "<b>hah</b>";
	 * let formatted = format_html`<span class='warning'>The ${str} explodes!</span>`;
	 * console.info(formatted);
	 * // <span class='warning'>The &lt;b&gt;hah&lt;/b&gt; explodes!</span>
	 * @param {TemplateStringsArray} strs
	 * @param {...(string|Typespess.Atom)} tags
	 * @returns {string}
	 * @memberof Typespess
	 */
	format_html(strs: string | any[], ...tags: any[]) {
		let out_str = "";
		for (let i = 0; i < strs.length; i++) {
			let pre_tag = strs[i];
			if (i === strs.length - 1) {
				out_str += pre_tag;
				continue;
			}
			const str_tag = "" + tags[i];
			let is_proper = str_tag.length && str_tag[0] === str_tag[0].toUpperCase();
			let gender = "neuter";
			if (tags[i] instanceof Atom) {
				if (tags[i].force_improper) {
					is_proper = false;
				}
				if (tags[i].force_proper) {
					is_proper = true;
				}
				gender = tags[i].gender;
			}
			if (is_proper) {
				pre_tag = pre_tag.replace(/(^|[ \t.,>])(?:the|a) (?=(?:[ \t]|(?:<[^>]+>))*$)/i, "$1");
			} else if (gender === "plural") {
				pre_tag = pre_tag.replace(/((?:^|[ \t.,>]))a(?= (?:[ \t]|(?:<[^>]+>))*$)/i, "$1some");
			} else if (str_tag.match(/^[aeiou]/i)) {
				pre_tag = pre_tag.replace(/((?:^|[ \t.,>])a)(?= (?:[ \t]|(?:<[^>]+>))*$)/i, "$1n");
			}
			tags[i] = "" + tags[i];
			out_str += pre_tag;
			out_str += module.exports.escape_html(tags[i]);
		}
		return out_str;
	},

	/**
	 * Escapes the characters &, <, >, ", and ' using their HTML encodings.
	 * @memberof Typespess
	 * @param {string} str
	 * @returns {string}
	 */
	escape_html(str: string) {
		return str.replace(/[&<>"']/gi, (chr: string) => {
			if (chr === "&") {
				return "&amp;";
			}
			if (chr === "<") {
				return "&lt;";
			}
			if (chr === ">") {
				return "&gt;";
			}
			if (chr === '"') {
				return "&quot;";
			}
			if (chr === "'") {
				return "&#039;";
			}
		});
	},

	do_require() {
		Atom = require("./atom/atom.js");
		Client = require("./client.js");
		ChatMessage = require("./chat_message.js");
	},

	/**
	 * @memberof Typespess
	 * @default 1
	 * @constant
	 */
	NORTH: 1,
	/**
	 * @memberof Typespess
	 * @default 2
	 * @constant
	 */
	SOUTH: 2,
	/**
	 * @memberof Typespess
	 * @default 4
	 * @constant
	 */
	EAST: 4,
	/**
	 * @memberof Typespess
	 * @default 8
	 * @constant
	 */
	WEST: 8,
	/**
	 * @memberof Typespess
	 * @default 5
	 * @constant
	 */
	NORTHEAST: 5,
	/**
	 * @memberof Typespess
	 * @default 6
	 * @constant
	 */
	SOUTHEAST: 6,
	/**
	 * @memberof Typespess
	 * @default 9
	 * @constant
	 */
	NORTHWEST: 9,
	/**
	 * @memberof Typespess
	 * @default 10
	 * @constant
	 */
	SOUTHWEST: 10,

	readonly_traps: {
		set: () => {return;},
		deleteProperty: () => {return;},
		defineProperty: () => {return;},
		setPrototypeOf: () => {return;},
		isExtensible: () => {return false;},
	},
};
