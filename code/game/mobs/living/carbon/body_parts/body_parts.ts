export{};
const {
	Component,
	Atom,
	has_component,
	chain_func,
	to_chat,
	format_html,
} = require("./../../../../../../code/game/server.js");
const layers = require("../../../../../defines/layers.js");
const combat_defines = require("../../../../../defines/combat_defines.js");
const {random_zone, parse_zone} = require("./helpers.js");

class MobBodyParts extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.limbs = Object.create({
			get eyes() {
				return;
			},
			get mouth() {
				return;
			},
		});
		this.limbs_set = new Set();

		this.a.c.LivingMob.apply_damage = chain_func(this.a.c.LivingMob.apply_damage, this.apply_damage.bind(this));

		for (const init of this.init_parts) {
			const new_limb = new Atom(this.a.server, init);
			new_limb.c.BodyPart.attach(this.a);
		}
		this.damage_set();

		this.a.c.Eye.screen.health_doll = new Atom(this.a.server, "human_health_doll");
		this.a.c.Eye.screen.health_doll.c.HealthDoll.bind_mob(this.a);
		if (has_component(this.a, "MobInventory")) {
			this.a.c.MobInventory.check_can_handcuff = chain_func(
				this.a.c.MobInventory.check_can_handcuff,
				this.check_can_handcuff.bind(this)
			);
		}
	}

	damage_set() {
		for (const type of ["brute", "burn"]) {
			const obj = {
				get: () => {
					let dam = 0;
					for (const bp of this.limbs_set) {
						if (bp) {
							dam += bp.c.BodyPart[`${type}_damage`];
						}
					}
					return dam;
				},
				affects_health: true,
				set: (val: number, props: any) => {
					obj.adjust(val - obj.get(), props);
				},
				adjust: (
					amt: number,
					{health_event = true, force = false, only_robotic = false, only_organic = false} = {}
				) => {
					if (amt === 0) {return;}
					if (this.status_flags & combat_defines.GODMODE && !force) {return false;}

					let abs_amt = Math.abs(amt);
					const sign_amt = Math.sign(amt);

					const limbs = [...this.limbs_set];
					while (limbs.length && abs_amt > 0) {
						const idx = Math.floor(Math.random() * limbs.length);
						const limb = limbs[idx];
						limbs.splice(idx, 1);

						const prev_damage = limb.c.BodyPart[`${type}_damage`];
						if (sign_amt > 0) {
							limb.c.BodyPart.receive_damage(type, abs_amt, {
								health_event: false,
							});
						} else {
							limb.c.BodyPart.heal_damage(type, abs_amt, {
								health_event: false,
								only_robotic,
								only_organic,
							});
						}
						const damage_diff = limb.c.BodyPart[`${type}_damage`] - prev_damage;
						abs_amt -= damage_diff * sign_amt;
					}

					if (health_event) {
						this.a.c.LivingMob.emit("health_changed");
					}
				},
			};
			this.a.c.LivingMob.damages[type] = obj;
		}
	}

	examine_limbs(user: Record<string, any>) {
		const t_He = this.a.p_they(true);
		const t_His = this.a.p_their(true);
		const t_his = this.a.p_their();
		const t_has = this.a.p_have();
		let msg = "<span class='warning'>";
		const missing = new Set([
			"head",
			"torso",
			"l_arm",
			"r_arm",
			"l_leg",
			"r_leg",
			"l_foot",
			"r_foot",
			"l_hand",
			"r_hand",
			"groin",
		]);
		for (const bp of this.limbs_set) {
			missing.delete(bp.c.BodyPart.body_zone);
			for (const item of bp.c.BodyPart.embedded_objects) {
				msg += format_html`<b>${t_He} ${t_has} a ${item} embedded in ${t_his} ${bp}!</b><br>`;
			}
		}
		let l_limbs_missing = 0;
		let r_limbs_missing = 0;
		for (const t of missing) {
			if (t === "head") {
				msg += format_html`<span class='deadsay'><b>${t_His} ${parse_zone(t)} is missing!</b></span><br>`;
				continue;
			}
			if (t === "l_arm" || t === "l_leg") {
				l_limbs_missing++;
			} else if (t === "r_arm" || t === "r_leg") {
				r_limbs_missing++;
			}
			msg += format_html`<b>${t_His} ${parse_zone(t)} is missing!</b><br>`;
		}
		if (l_limbs_missing >= 2 && r_limbs_missing === 0) {
			msg += format_html`${t_He} look${this.a.p_s()} all right now.<br>`;
		} else if (l_limbs_missing === 0 && r_limbs_missing >= 2) {
			msg += format_html`${t_He} really keeps to the left.<br>`;
		} else if (l_limbs_missing >= 2 && r_limbs_missing >= 2) {
			msg += format_html`${t_He} ${this.a.p_do()}n't seem all there.<br>`;
		}
		msg += "</span>";
		to_chat(user, msg);
	}

	apply_damage(
		prev: any,
		damage: number,
		damage_type = "brute",
		def_zone: any = null,
		blocked = this.run_armor_check(def_zone, "melee")
	) {
		if (damage_type !== "brute" && damage_type !== "burn") {
			return prev();
		}
		const hit_percent = (100 - blocked) / 100;
		if (!damage || hit_percent < 0) {return false;}
		if (!has_component(def_zone, "BodyPart")) {
			let bp = null;
			if (!def_zone) {
				def_zone = random_zone(def_zone);
			}
			bp = this.limbs[def_zone];
			if (!bp) {
				bp = this.limbs.torso;
			}
			if (!bp) {
				return;
			}
		}
		def_zone.c.BodyPart.receive_damage(damage_type, damage * hit_percent);
	}

	get_bodypart(zone: string) {
		if (!zone) {
			zone = "torso";
		}
		for (const bp of this.limbs_set) {
			if (bp.body_zone === zone) {
				return bp;
			}
		}
	}

	check_can_handcuff(prev: any, user: any) {
		if (!prev()) {return false;}
		if (!this.limbs.l_arm || !this.limbs.r_arm) {
			if (user) {
				to_chat`<span class='warning'>The ${this.a} doesn't have two hands...</span>`(user);
			}
			return false;
		}
		return true;
	}
}

Object.assign(MobBodyParts.prototype, require("../../living_defense.js"));

MobBodyParts.template = {
	vars: {
		components: {
			MobBodyParts: {
				init_parts: [
					"human_torso",
					"human_groin",
					"human_l_arm",
					"human_r_arm",
					"human_l_hand",
					"human_r_hand",
					"human_l_leg",
					"human_r_leg",
					"human_l_foot",
					"human_r_foot",
					"human_head",
				],
			},
		},
	},
};

MobBodyParts.depends = ["LivingMob"];
MobBodyParts.loadBefore = ["LivingMob", "CarbonMob", "MobInventory"];

class BodyPart extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.owner = null;
		this.embedded_objects = new Set();
	}

	attach(mob: Record<string, any>) {
		if (!has_component(mob, "MobBodyParts")) {return false;}
		if (mob.c.MobBodyParts.limbs[this.body_zone]) {return false;}
		mob.c.MobBodyParts.limbs[this.body_zone] = this.a;
		mob.c.MobBodyParts.limbs_set.add(this.a);
		this.a.loc = mob;
		this.owner = mob;
		this.apply_overlays(mob);

		mob.c.LivingMob.emit("damage_changed", "brute");
		mob.c.LivingMob.emit("damage_changed", "burn");
		mob.c.LivingMob.emit("health_changed");
		this.emit("attached");
		mob.c.MobBodyParts.emit("limb_attached", this.a);
	}

	apply_overlays(atom: Record<string, any>) {
		if (atom === this.a) {
			this.a.icon_state = "";
		}
		atom.overlays[`limb_${this.body_zone}`] = this.get_main_overlay();
		this.apply_damage_overlays(atom);
	}

	update_overlays() {
		this.apply_overlays(this.a);
		if (this.owner) {
			this.apply_overlays(this.owner);
		}
	}

	apply_damage_overlays(atom: Record<string, any>) {
		const brutestate = Math.ceil((this.brute_damage / this.max_damage) * 3);
		const burnstate = Math.ceil((this.burn_damage / this.max_damage) * 3);
		atom.overlays[`limb_${this.body_zone}_brute`] = brutestate
			? {
					icon: "icons/mob/dam_mob/",
					icon_state: `${this.dmg_overlay_type}_${this.body_zone}_${brutestate}0`,
					overlay_layer: 0.2,
			  }
			: null;
		atom.overlays[`limb_${this.body_zone}_burn`] = burnstate
			? {
					icon: "icons/mob/dam_mob/",
					icon_state: `${this.dmg_overlay_type}_${this.body_zone}_0${burnstate}`,
					overlay_layer: 0.2,
			  }
			: null;
	}

	detach() {
		if (!this.owner) {
			return;
		}
		const mob = this.owner;
		this.a.loc = mob.fine_loc;
		this.owner = null;
		this.remove_overlays(mob);
		mob.c.MobBodyParts.limbs[this.body_zone] = null;
		mob.c.MobBodyParts.limbs_set.delete(this.a);

		this.apply_overlays(this.a);
		mob.c.LivingMob.emit("damage_changed", "brute");
		mob.c.LivingMob.emit("damage_changed", "burn");
		mob.c.LivingMob.emit("health_changed");
		this.emit("detached");
		mob.c.MobBodyParts.emit("limb_detached", this.a);
	}

	remove_overlays(atom: Record<string, any>) {
		atom.overlays[`limb_${this.body_zone}`] = void 0;
		atom.overlays[`limb_${this.body_zone}_brute`] = void 0;
		atom.overlays[`limb_${this.body_zone}_burn`] = void 0;
	}

	get_main_overlay() {
		if (!this.owner) {
			return;
		}
		const mob = this.owner;
		let icodir = mob.dir;
		if (icodir === 1) {
			icodir = 2;
		} else if (icodir === 2) {
			icodir = 1;
		} else if (icodir === 4) {
			icodir = 3;
		} else if (icodir === 8) {
			icodir = 4;
		}
		const overlay = {
			icon: `icons/mob/human_body/${this.body_zone}_m/${this.body_zone}_m-dir${icodir}.png`,
			icon_state: "",
			color: "",
		};
		overlay.icon_state = this.body_zone;
		if (this.species_id) {
			overlay.icon_state = `${this.species_id}_${overlay.icon_state}`;
		}
		if (this.should_draw_gender) {
			overlay.icon_state += `_${this.body_gender === "female" ? "f" : "m"}`;
		}
		overlay.icon = `icons/mob/human_body/${overlay.icon_state}/${overlay.icon_state}-dir${icodir}.png`;
		overlay.color = this.get_color();
		return overlay;
	}

	get_color() {
		return "#ffffff";
	}

	apply_prefs(/*prefs*/) {return;}

	multiply_damage(type: string, amount: number) {
		return amount;
	}

	receive_damage(type: string, amount: number, {health_event = true} = {}) {
		amount = this.multiply_damage(type, amount);

		const can_inflict = this.max_damage - this.brute_damage - this.burn_damage;
		if (can_inflict <= 0) {return false;}

		if (type === "brute") {
			this.brute_damage += Math.min(can_inflict, amount);
		} else if (type === "burn") {
			this.burn_damage += Math.min(can_inflict, amount);
		}

		if (this.owner) {
			this.owner.c.LivingMob.emit("damage_changed", type);
			if (health_event) {
				this.owner.c.LivingMob.emit("health_changed", type);
			}
		}
		this.apply_damage_overlays(this.a);
		if (this.owner) {
			this.apply_damage_overlays(this.owner);
		}
	}

	heal_damage(type: string, amount: number, {only_robotic = false, only_organic = true, health_event = true} = {}) {
		if (only_robotic && this.is_organic) {
			return;
		}
		if (only_organic && !this.is_organic) {
			return;
		}
		if (type === "brute") {
			this.brute_damage = Math.max(this.brute_damage - amount, 0);
		}
		if (type === "burn") {
			this.burn_damage = Math.max(this.burn_damage - amount, 0);
		}
		if (this.owner) {
			this.owner.c.LivingMob.emit("damage_changed", type);
			if (health_event) {
				this.owner.c.LivingMob.emit("health_changed", type);
			}
		}
		this.apply_damage_overlays(this.a);
		if (this.owner) {
			this.apply_damage_overlays(this.owner);
		}
	}
}

BodyPart.template = {
	vars: {
		components: {
			BodyPart: {
				is_organic: true,
				body_zone: null,
				dismemberable: true,
				should_draw_gender: true,
				dmg_overlay_type: "human",
				body_gender: "male",
				species_id: null, //null is for human
				brute_damage: 0,
				burn_damage: 0,
			},
			Item: {
				force: 3,
			},
			Tangible: {
				throwforce: 3,
			},
			Examine: {
				desc: "Why is it detached...",
			},
		},
		name: "limb",
		icon: "icons/mob/human_body/groin_m/groin_m-dir2.png",
		layer: layers.BELOW_MOB_LAYER,
	},
};

BodyPart.depends = ["Item"];
BodyPart.loadBefore = ["Item"];

module.exports.components = {MobBodyParts, BodyPart};
