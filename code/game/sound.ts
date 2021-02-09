export{};
const { is_atom, has_component } = require("./utils.js");

let idctr = 0;

const _playing:any = Symbol("_playing");
const _clients:any = Symbol("_clients");

/**
 * @memberof Typespess
 */
class Sound {
	/**
  * @param {Typespess} server
  * @param {Object} sndobj
  * @param {string} sndobj.path
  * @param {number} sndobj.playback_rate How fast to play it, also affects pitch
  * @param {boolean} sndobj.vary Multiplies playback_rate by a number between 0.75 and 1.25
  */
	constructor(server, sndobj) {
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
			if (!this.playback_rate) {this.playback_rate = 1;}
			this.playback_rate *= Math.random() * 0.5 + 0.75;
		}

		if (this.path instanceof Array) {
			this.path = this.path[Math.floor(Math.random() * this.path.length)];
		}
		if (typeof this.path === "string") {
			this.path = this.path.replace(
				/{([0-9]+)-([0-9]+)}/g,
				(match, from, to) => {
					const result =
			"" + (Math.floor(Math.random() * (1 + +to - +from)) + +from);
					// Hey idiots making libraries on NPM
					// Left padding is a native part of javascript! No need to include left-pad.
					if (from.length === to.length)
						{return result.padStart(from.length, "0");}
					else {return result;}
				}
			);
		}
	}

	/**
  * @param {Array<Typespess.Atom<Mob>|Client>|Typespess.Atom<Mob>|Client} mobs
  */
	play_to(mobs) {
		if (!(mobs instanceof Array)) {mobs = [mobs];}
		if (this.playing !== null)
			{throw new Error(
				"Cannot play sound more than once. Create new sound instead."
			);}
		this[_playing] = true;
		const clients = new Set();
		for (const mob of mobs) {
			if (!is_atom(mob) && mob && mob.mob) {clients.add(mob);}
			if (!has_component(mob, "Eye")) {continue;}
			for (const observer of mob.c.Eye.observers()) {
				if (observer.c.Hearer.can_hear_sound(this) && observer.c.Mob.client)
					{clients.add(observer.c.Mob.client);}
			}
			if (has_component(mob, "Mob"))
				{if (mob.c.Hearer.can_hear_sound(this) && mob.c.Mob.client)
					{clients.add(mob.c.Mob.client);}}
		}
		for (const client of clients) {
			if (!client.next_message.sound) {client.next_message.sound = {};}
			if (!client.next_message.sound.play) {client.next_message.sound.play = [];}
			client.next_message.sound.play.push(this);
		}
		this[_clients] = clients;
	}

	/**
  * Emits the sound from the given atom
  * @param {Typespess.Atom} emitter
  */
	emit_from(atom) {
		if (!this.emitter) {this.emitter = { x: atom.x, y: atom.y };}
		const hearers = new Set();
		for (const loc of atom.base_mover.partial_locs()) {
			for (const hearer of loc.hearers) {
				hearers.add(hearer);
			}
		}
		const clients = [];
		for (const hearer of hearers) {
			if (
				has_component(hearer, "Mob") &&
		hearer.c.Hearer.can_hear_sound(this)
			) {
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
			if (!client.next_message.sound) {client.next_message.sound = {};}
			if (!client.next_message.sound.stop) {client.next_message.sound.stop = [];}
			client.next_message.sound.stop.push(this.id);
		}
	}

	/**
  * @type {boolean}
  */
	get playing() {
		return this[_playing];
	}
}

module.exports = Sound;
