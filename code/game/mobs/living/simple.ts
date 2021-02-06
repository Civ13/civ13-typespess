const {
	Component,
} = require("./../../../../code/game/server.js");

const combat_defines = require("../../../defines/combat_defines.js");
const mob_defines = require("../../../defines/mob_defines.js");
const layers = require("../../../defines/layers.js");
const pass_flags = require("../../../defines/pass_flags.js");
const Typespess = require("./../../../../code/game/server.js");

const _ = require("underscore");
const randomDir = [Typespess.NORTH, Typespess.SOUTH, Typespess.EAST, Typespess.WEST];
class SimpleMob extends Component {
	constructor(atom, template) {
		super(atom, template);

		this.owner = this.a.c.Mob;
		this.base_icon_state = this.a.icon_state;
		this.a.c.LivingMob.update_stat = this.update_stat.bind(this);
		this.animal_class = "wild"; //wild, tamed
		this.target = null;
		this.hunting = null;
		this.a.directional = true;
	}
	get mobAI() {
		return this.a.c.mobAI;
	}
	set mobAI(val) {
		this.a.c.mobAI = val;
	}
	update_stat() {
		if (this.a.c.LivingMob.status_flags & combat_defines.GODMODE) {return;}
		const health = this.a.c.LivingMob.health;
		if (this.a.c.LivingMob.stat !== combat_defines.DEAD) {
			if (health <= 0) {
				this.a.c.LivingMob.stat = combat_defines.DEAD;
				if (this.base_icon_state.search("_dead") === -1)
					{this.base_icon_state = `${this.base_icon_state}_dead`;this.update_overlays();}
				return;
			}
			if (
				this.a.c.LivingMob.get_damage("oxy") > 50 ||
		health <= (this.a.c.LivingMob.max_health/3) ||
		this.a.c.LivingMob.effects.Unconscious
			) {
				this.a.c.LivingMob.stat = combat_defines.UNCONSCIOUS;
			} else {
				if (health <= (this.a.c.LivingMob.max_health/2)) {
					this.a.c.LivingMob.stat = combat_defines.SOFT_CRIT;
				} else {
					this.a.c.LivingMob.stat = combat_defines.CONSCIOUS;
				}
			}
		}
	}
	move_ai (movedir) {
		if (this.a.c.LivingMob.stat === combat_defines.DEAD) {return;}
		if (!(movedir in [1,2,4,8])) {movedir = _.sample([1,2,4,8]);}
		this.a.dir = movedir;
		let newx = 0;
		let newy = 0;
		switch(movedir) {
			case Typespess.NORTH:
				newy = 1;
				break;
			case Typespess.SOUTH:
				newy = -1;
				break;
			case Typespess.EAST:
				newx = 1;
				break;
			case Typespess.WEST:
				newx = -1;
				break;
		}
		this.update_overlays();
		this.a.move(newx,newy,"walking");
	}

	update_overlays() {
		this.a.icon_state = "";
		this.a.overlays["mob_icon"] = this.get_main_overlay();
	}

	detach() {
		return;
	}

	remove_overlays(atom) {
		atom.overlays["mob_icon"] = void 0;
	}

	get_main_overlay() {
		let icodir = this.a.dir;
		if (icodir === 1)
			{icodir = 2;}
		else if (icodir === 2)
			{icodir = 1;}
		else if (icodir === 4)
			{icodir = 3;}
		else if (icodir === 8)
			{icodir = 4;}
		const overlay = { icon: `${this.a.icon}${this.base_icon_state}/${this.base_icon_state}-dir${icodir}.png` };

		return overlay;
	}
}

class mobAI extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.behaviour = "scared";
		this.behaviour_timeout = null;
		if (this.stat !== combat_defines.DEAD) {
			this.behaviour_timeout = setTimeout(this.run_behaviour.bind(this), 2000);
		}
		this.behaviour_cycle_num = 0;
	}
	run_behaviour() {
		this.behaviour_timeout = null;
		this.behaviour_cycle_num++;
		this.do_behaviour(this.behaviour_cycle_num);
		if (this.stat !== combat_defines.DEAD && !this.behaviour_timeout)
			{this.behaviour_timeout = setTimeout(this.run_behaviour.bind(this), 1000);}
	}
	do_behaviour() {
		if (this.a.c.LivingMob.stat === combat_defines.DEAD) {return;}
		this.a.c.SimpleMob.update_overlays();
		if (this.behaviour === "scared") {
			if (!this.a.c.SimpleMob.target) { //if no target, wander
				if (Math.random() <= 0.25) {
					this.a.c.SimpleMob.move_ai(_.sample(randomDir));
				}
			}
			else { //if target, run away
					const target_dir = Typespess.dir_to(this.a.x - this.a.c.SimpleMob.target.x, this.a.y - this.a.c.SimpleMob.target.y);
					//target_dir = Typespess.dir_reverse(target_dir); //apparently the target_dir is already the reverse dir
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
			mobAI: {
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

module.exports.components = { SimpleMob , mobAI };

module.exports.templates = {
	pigeon: {
		components: ["Mob", "LivingMob", "mobAI", "SimpleMob"],
		tree_paths: ["mobs/animals/pigeon"],
		vars: {
			components: {
				LivingMob: {
					max_health: 30,
					mob_size: mob_defines.MOB_SIZE_SMALL,
					real_name: "pigeon"
				},
				Examine: {
					desc: "A simple animal. Pretty generic.",
				},
				mobAI: {
					behaviour: "scared",
				},
				Atom: {
					directional: true,
				},
				SimpleMob: {
					base_icon_state: "pigeon_grey",
				},
			},
			name: "pigeon",
			icon: "icons/mob/animals/",
			icon_state: "pigeon_grey",
			walk_delay: 700,

		}
	}
};