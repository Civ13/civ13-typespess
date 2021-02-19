export{};
const {is_atom, has_component} = require("./utils.js");

let idctr = 0;

const _playing = Symbol("_playing");
const _clients = Symbol("_clients");

/**
 * @memberof Typespess
 */
class Sound {
	vary: any;
	playback_rate: any;
	path: ArrayConstructor | string;
	emitter: any;
	[_playing]: any;
	[_clients]: any;

	constructor(server: any, sndobj: {path: string; playback_rate: number; vary: boolean}) {
		Object.assign(this, sndobj);
		Object.defineProperty(this, "id", {
			enumerable: true,
			configurable: false,
			writable: false,
			value: "ID_" + idctr++,
		});
		Object.defineProperty(this, "server", {
			enumerable: false,
			configurable: false,
			writable: false,
			value: server,
		});
		this[_playing] = null;

		if (this.vary) {
			if (!this.playback_rate) {
				this.playback_rate = 1;
			}
			this.playback_rate *= Math.random() * 0.5 + 0.75;
		}

		if (this.path instanceof Array) {
			this.path = this.path[Math.floor(Math.random() * this.path.length)];
		}
		if (typeof this.path === "string") {
			const npath: string = this.path;
			this.path = npath.replace(/{([0-9]+)-([0-9]+)}/g, (match: any, from: any, to: any) => {
				const result = "" + (Math.floor(Math.random() * (1 + +to - +from)) + +from);
				// Hey idiots making libraries on NPM
				// Left padding is a native part of javascript! No need to include left-pad.
				if (from.length === to.length) {
					return result.padStart(from.length, "0");
				} else {
					return result;
				}
			});
		}
	}

	play_to(mobs: any) {
		if (!(mobs instanceof Array)) {
			mobs = [mobs];
		}
		if (this.playing !== null) {
			throw new Error("Cannot play sound more than once. Create new sound instead.");
		}
		this[_playing] = true;
		const clients = new Set();
		for (const tmob of mobs) {
			const mob: Record<string, any> = tmob;
			if (!is_atom(mob) && mob && mob.mob) {
				clients.add(mob);
			}
			if (!has_component(mob, "Eye")) {continue;}
			for (const observer of mob.c.Eye.observers()) {
				if (observer.c.Hearer.can_hear_sound(this) && observer.c.Mob.client) {
					clients.add(observer.c.Mob.client);
				}
			}
			if (has_component(mob, "Mob") && mob.c.Hearer.can_hear_sound(this) && mob.c.Mob.client) {
				clients.add(mob.c.Mob.client);
			}
		}
		this.check_clients(clients);
	}

	check_clients(clients: any) {
		for (const tclient of clients) {
			const client: Record<string, any> = tclient;
			if (!client.next_message.sound) {
				client.next_message.sound = {};
			}
			if (!client.next_message.sound.play) {
				client.next_message.sound.play = [];
			}
			client.next_message.sound.play.push(this);
		}
		this[_clients] = clients;
	}
	/**
	 * Emits the sound from the given atom
	 * @param {Typespess.Atom} emitter
	 */
	emit_from(atom: Record<string, any>) {
		if (!this.emitter) {
			this.emitter = {x: atom.x, y: atom.y};
		}
		const hearers = new Set();
		for (const loc of atom.base_mover.partial_locs()) {
			for (const hearer of loc.hearers) {
				hearers.add(hearer);
			}
		}
		const clients = [];
		for (const thearer of hearers) {
			const hearer: Record<string, any> = thearer;
			if (has_component(hearer, "Mob") && hearer.c.Hearer.can_hear_sound(this)) {
				clients.push(hearer.c.Mob.client);
			}
		}
		this.play_to(clients);
	}

	/**
	 * Makes the sound stop playing.
	 */
	stop() {
		if (!this.playing) {return;}
		this[_playing] = false;
		for (const client of this[_clients]) {
			if (!client.next_message.sound) {
				client.next_message.sound = {};
			}
			if (!client.next_message.sound.stop) {
				client.next_message.sound.stop = [];
			}
			client.next_message.sound.stop.push(this.id);
		}
	}
	id(/*id: any*/) {
		throw new Error("Method not implemented.");
	}

	/**
	 * @type {boolean}
	 */
	get playing() {
		return this[_playing];
	}
}

module.exports = Sound;
