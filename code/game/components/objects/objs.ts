export{};
const {Component, has_component, to_chat, sleep} = require("./../../../../code/game/server.js");

const pass_flags = require("../../../defines/pass_flags.js");

class Tangible extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.fingerprints = [];
		this.fingerprints_hidden = [];
		this.puller = null; // fuck it - one puller at a time.
		this.last_high_pressure_movement_air_cycle = 0;
	}

	experience_pressure_difference(difference: number, dx: number, dy: number, pressure_resistance_prob_delta = 0) {
		const PROBABILITY_OFFSET = 25;
		const PROBABILITY_BASE_PERCENT = 75;
		if (this.anchored) {return false;}
		if (this.last_high_pressure_movement_air_cycle < this.a.server.air_controller.ticknum) {
			let move_prob = 100;
			if (this.pressure_resistance > 0) {
				move_prob = (difference / this.pressure_resistance) * PROBABILITY_BASE_PERCENT - PROBABILITY_OFFSET;
			}
			move_prob += pressure_resistance_prob_delta;
			if (move_prob > PROBABILITY_OFFSET && Math.random() * 100 < move_prob) {
				this.a.glide_size = 2;
				this.a.move(dx, dy, "pressure_difference");
				this.last_high_pressure_movement_air_cycle = this.a.server.air_controller.ticknum;
			}
		}
	}

	async throw_at({target = null, range = this.throw_range, speed = this.throw_speed}: Record<string, any> = {}) {
		try {
			if (!target) {return;}
			this.stop_throw();

			let dist_traveled = 0;
			let last_move = this.a.server.now();
			let still_throwing = true;
			this.a.pass_flags |= pass_flags.LETPASSTHROW;

			this.stop_throw = () => {
				this.a.removeListener("bumped", throw_impact);
				this.a.removeListener("bumped_by", this.stop_throw);
				still_throwing = false;
				this.a.pass_flags &= ~pass_flags.LETPASSTHROW;
				this.stop_throw = function () {return;};
			};

			const throw_impact = (target: Record<string, any>) => {
				this.stop_throw();
				if (speed > 0.5) {
					if (has_component(target, "Tangible")) {
						target.c.Tangible.emit("throw_impacted_by", this.a);
					}
					this.emit("throw_impacted", target);
				}
			};

			this.a.on("bumped", throw_impact);
			this.a.on("bumped_by", this.stop_throw);

			let dx, dy;

			if (typeof target === "number") {
				dx = Math.cos(target);
				dy = Math.sin(target);
			} else if (target.x === +target.x && target.y === +target.y) {
				dx = target.x - this.a.x;
				dy = target.y - this.a.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				dx /= dist;
				dy /= dist;
				range = Math.min(range, dist);
			} else if (target.dx === +target.dx && target.dy === +target.dy) {
				dx = target.dx;
				dy = target.dy;
				const dist = Math.sqrt(dx * dx + dy * dy);
				dx /= dist;
				dy /= dist;
			}

			while (still_throwing) {
				const delta = this.a.server.now() - last_move;
				last_move = this.a.server.now();
				this.a.glide_size = speed * 10;
				let to_move = speed * delta * 0.01;
				if (dist_traveled < range - 0.001) {
					to_move = Math.min(to_move, range - dist_traveled);
				}
				const [oldx, oldy] = [this.a.x, this.a.y];
				this.a.move(dx * to_move, dy * to_move, "throw");
				const this_dx = this.a.x - oldx;
				const this_dy = this.a.y - oldy;
				dist_traveled += Math.sqrt(this_dx * this_dx + this_dy * this_dy);
				const dist_covered_delay = range > dist_traveled ? ((range - dist_traveled) * 100) / speed : 123456789;
				await sleep(Math.max(Math.min(dist_covered_delay, 50), 1));
				if (dist_traveled >= range - 0.001) {
					this.stop_throw();
				}
			}
		} catch (e) {
			console.error(e);
			this.stop_throw();
		}
		this.emit("throw_finished");
	}

	bullet_act(projectile: {c: {Projectile: {hit: (arg0: any, arg1: number, arg2: any) => any}}}, def_zone: any) {
		return projectile.c.Projectile.hit(this.a, def_zone, 0);
	}

	stop_throw() {return;} // This only has actual code once throw_at is called

	drop_location() {
		return this.a.loc;
	}

	ex_act() {return;}

	do_attack_animation() {
		//later
	}

	attacked_by() {
		// This is basically for legit attacks
	}

	adjacent(target: {x: number; y: number}) {
		return Math.abs(target.x - this.a.x) <= 1.5001 && Math.abs(target.y - this.a.y) <= 1.5001;
	}
	can_reach(target: any) {
		return this.adjacent(target);
	}
}

Tangible.depends = ["Examine"];
Tangible.loadBefore = ["Examine"];

Tangible.LAVA_PROOF = -2;
Tangible.FIRE_PROOF = -1;
Tangible.FLAMMABLE = 0;
Tangible.ON_FIRE = 1;

Tangible.template = {
	vars: {
		components: {
			Tangible: {
				anchored: false,
				unacidable: false,
				throw_speed: 2,
				throw_range: 7,
				throw_force: 0,
				burn_state: Tangible.FIRE_PROOF, // LAVA_PROOF, FIRE_PROOF, FLAMMABLE, or ON_FIRE
				burn_time: 10, // How long it takes to burn to ashes, in seconds
				pressure_resistance: 10,
				explosion_block: 0,
			},
		},
	},
};

class Examine extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.on("shift_clicked", this.shift_clicked.bind(this));
	}

	shift_clicked(e: {mob: any}) {
		if (e.mob) {
			this.examine(e.mob);
		}
	}

	examine(user: any) {
		to_chat`That's <b>${this.a}</b>`(user);
		if (this.desc) {
			to_chat(user, "<i>" + this.desc + "</i>");
		}
	}
}

module.exports.components = {Tangible, Examine};
