export{};
const {Component, to_chat} = require("./../../../../code/game/server.js");

const combat_defines = require("../../../defines/combat_defines.js");
const mob_defines = require("../../../defines/mob_defines.js");
const layers = require("../../../defines/layers.js");
const pass_flags = require("../../../defines/pass_flags.js");
const Typespess = require("./../../../../code/game/server.js");

const _ = require("underscore");
const randomDir = [1, 2, 4, 8];
class SimpleMob extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);

		this.owner = this.a.c.Mob;
		this.base_icon_state = this.a.icon_state;
		this.a.c.LivingMob.update_stat = this.update_stat.bind(this);
		this.animal_class = "wild"; //wild, tamed
		this.target = null;
		this.hunting = null;
	}
	get MobAI() {
		return this.a.c.MobAI;
	}
	set MobAI(val) {
		this.a.c.MobAI = val;
	}
	update_stat() {
		if (this.a.c.LivingMob.status_flags & combat_defines.GODMODE) {return;}
		const health = this.a.c.LivingMob.health;
		if (this.a.c.LivingMob.stat !== combat_defines.DEAD) {
			if (health <= 0) {
				this.a.c.LivingMob.stat = combat_defines.DEAD;
				if (this.base_icon_state.search("_dead") === -1) {
					this.base_icon_state = `${this.base_icon_state}_dead`;
					this.update_overlays();
				}
				return;
			}
			if (
				this.a.c.LivingMob.get_damage("oxy") > 50 ||
				health <= this.a.c.LivingMob.max_health / 3 ||
				this.a.c.LivingMob.effects.Unconscious
			) {
				this.a.c.LivingMob.stat = combat_defines.UNCONSCIOUS;
			} else {
				if (health <= this.a.c.LivingMob.max_health / 2) {
					this.a.c.LivingMob.stat = combat_defines.SOFT_CRIT;
				} else {
					this.a.c.LivingMob.stat = combat_defines.CONSCIOUS;
				}
			}
		}
	}
	move_ai(movedir: number) {
		if (this.a.c.LivingMob.stat === combat_defines.DEAD) {return;}
		if (!(movedir in [1, 2, 4, 8])) {
			movedir = _.sample([1, 2, 4, 8]);
		}
		this.a.dir = movedir;
		let newx = 0;
		let newy = 0;
		switch (movedir) {
			case 1:
				newy = 1;
				break;
			case 2:
				newy = -1;
				break;
			case 4:
				newx = 1;
				break;
			case 8:
				newx = -1;
				break;
		}
		this.update_overlays();
		this.a.move(newx, newy, "walking");
	}

	update_overlays() {
		this.a.icon_state = "";
		this.a.overlays["mob_icon"] = this.get_main_overlay();
	}

	detach() {return;}

	remove_overlays(atom: Record<string, any>) {
		atom.overlays["mob_icon"] = void 0;
	}

	get_main_overlay() {
		const icodir = Typespess.dir2ico(this.a.dir);
		return {icon: `${this.a.icon}${this.base_icon_state}/${this.base_icon_state}-dir${icodir}.png`};
	}

	attacked_by(item: Record<string, any>, user: Record<string, any>) {
		if (this.a.c.LivingMob.stat === combat_defines.DEAD) {
			to_chat`<span class='notice'>You begin butchering the ${this.a.name}...</span>`(user);
			user.c.MobInventory.do_after({
				delay: 8000 * item.c.Tool.toolspeed,
				target: this.a,
			}).then((success: any) => {
				if (!success) {return;}
				to_chat`<span class='notice'>You butcher ${this.a.name}!</span>`(user);
				this.a.destroy();
			});
			return true;
		}
	}
}

class MobAI extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.behaviour = "scared";
		this.behaviour_timeout = null;
		if (this.a.c.LivingMob.stat !== combat_defines.DEAD) {
			this.behaviour_timeout = setTimeout(this.run_behaviour.bind(this), 2000);
		}
		this.behaviour_cycle_num = 0;
	}
	run_behaviour() {
		this.behaviour_timeout = null;
		this.behaviour_cycle_num++;
		this.do_behaviour();
		if (this.a.c.LivingMob.stat !== combat_defines.DEAD && !this.behaviour_timeout) {
			this.behaviour_timeout = setTimeout(this.run_behaviour.bind(this), 1000);
		}
	}
	do_behaviour() {
		if (this.a.c.LivingMob.stat === combat_defines.DEAD) {return;}
		this.a.c.SimpleMob.update_overlays();
		if (this.behaviour === "scared") {
			if (!this.a.c.SimpleMob.target) {
				//if no target, wander
				if (Math.random() <= 0.25) {
					this.a.c.SimpleMob.move_ai(_.sample(randomDir));
				}
			} else {
				//if target, run away
				const target_dir = Typespess.dir_to(
					this.a.x - this.a.c.SimpleMob.target.x,
					this.a.y - this.a.c.SimpleMob.target.y
				);
				this.a.c.SimpleMob.move_ai(target_dir);
			}
		}
	}
}
SimpleMob.template = {
	vars: {
		components: {
			LivingMob: {
				status_flags:
					combat_defines.CANSTUN |
					combat_defines.CANWEAKEN |
					combat_defines.CANPARALYSE |
					combat_defines.CANPUSH,
				max_health: 30,
				stat: combat_defines.CONSCIOUS,
				nomove_counter: 0,
				mob_size: mob_defines.MOB_SIZE_SMALL,
			},
			Examine: {
				desc: "A simple animal. Pretty generic.",
			},
			MobAI: {
				behaviour: "scared",
			},
		},
		name: "animal",
		density: 1,
		layer: layers.MOB_LAYER,
		let_pass_flags: pass_flags.PASSMOB,
		icon: "icons/mob/animals/",
		icon_state: "pigeon_grey",
		visible: true,
		walk_delay: 700,
	},
};

SimpleMob.depends = ["MobMovement", "Hearer", "Mob", "LivingMob", "Examine", "SpeechHearer"];
SimpleMob.loadBefore = ["Mob", "LivingMob", "Examine", "SpeechHearer"];
MobAI.depends = ["LivingMob"];
MobAI.loadBefore = ["LivingMob"];
module.exports.components = {SimpleMob, MobAI};
