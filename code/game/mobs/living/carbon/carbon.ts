export{};
const {Component, Atom, Sound, chain_func, has_component, to_chat} = require("./../../../../../code/game/server.js");
const _ = require("underscore");
const combat_defines: any = require("../../../../defines/combat_defines.js");
const mob_defines: any = require("../../../../defines/mob_defines.js");
const layers: any = require("../../../../defines/layers.js");
const sounds: any = require("../../../../defines/sounds.js");

const _lying_counter: any = Symbol("_lying_counter");

class CarbonMob extends Component.Networked {
	constructor(atom: any, template: any) {
		super(atom, template);

		this.a.on("moved", this.moved.bind(this));
		this.a.c.LivingMob.on("health_changed", this.health_changed.bind(this));
		this.a.c.LivingMob.on("damage_changed", this.damage_changed.bind(this));
		this.a.c.LivingMob.on("stat_changed", this.stat_changed.bind(this));
		this.a.c.LivingMob.update_stat = this.update_stat.bind(this);
		this.a.c.LivingMob.movement_delay = chain_func(
			this.a.c.LivingMob.movement_delay,
			this.movement_delay.bind(this)
		);
		this.a.c.LivingMob.life = chain_func(this.a.c.LivingMob.life, this.life.bind(this));
		this.a.c.LivingMob.add_splatter_floor = this.add_splatter_floor.bind(this);
		this.a.c.Examine.examine = this.examine.bind(this);

		this.add_networked_var("lying", (newval: any) => {
			if (newval) {
				this.a.density = 0;
				this.a.layer = layers.LYING_MOB_LAYER;
				if (!this.lying) {
					new Sound(this.a.server, {
						path: sounds.bodyfall,
						volume: 0.5,
						vary: true,
					}).emit_from(this.a);
				}
			} else {
				this.a.density = this.a.template.vars.density;
				this.a.layer = this.a.template.vars.layer;
			}
			return true;
		});
		this.add_networked_var("jitteriness");

		if (this.uses_blood) {
			this.a.c.ReagentHolder.add("Blood", mob_defines.BLOOD_VOLUME_NORMAL);
		}

		this.a.c.LivingMob.add_damage_type("stamina");
		this.a.c.LivingMob.damages.stamina.affects_health = false;

		this.organs = {};

		this.hunger = 100;
		this.thirst = 100;
		this.mood = 100;

		new Atom(this.a.server, "organ_lungs").c.Organ.insert(this.a);
		new Atom(this.a.server, "organ_liver").c.Organ.insert(this.a);
	}

	stat_changed(oldstat: any, newstat: any) {
		if (!oldstat && newstat) {
			this.lying_counter++;
		} else if (oldstat && !newstat) {
			this.lying_counter--;
		}
	}

	health_changed() {
		this.update_damage_hud();
	}

	damage_changed(type: string) {
		if (type === "stamina") {
			this.update_stamina();
		}
	}

	update_stamina() {
		const staminaloss = this.a.c.LivingMob.get_damage("stamina");
		if (staminaloss) {
			const total_health = this.a.c.LivingMob.health - staminaloss;
			if (total_health <= combat_defines.HEALTH_THRESHOLD_CRIT && !this.a.c.LivingMob.stat) {
				to_chat`<span class='notice'>You're too exhausted to keep going...</span>`(this.a);
				this.a.c.LivingMob.apply_effect("Knockdown", {delay: 10000});
				this.a.c.LivingMob.set_damage("stamina", this.a.c.LivingMob.health - 2);
			}
		}
	}

	update_stat() {
		if (this.a.c.LivingMob.status_flags & combat_defines.GODMODE) {return;}
		const health = this.a.c.LivingMob.health;
		if (this.a.c.LivingMob.stat !== combat_defines.DEAD) {
			if (health <= combat_defines.HEALTH_THRESHOLD_DEAD) {
				this.a.c.LivingMob.stat = combat_defines.DEAD;
				return;
			}
			if (
				this.a.c.LivingMob.get_damage("oxy") > 50 ||
				health <= combat_defines.HEALTH_THRESHOLD_FULLCRIT ||
				this.a.c.LivingMob.effects.Unconscious
			) {
				this.a.c.LivingMob.stat = combat_defines.UNCONSCIOUS;
			} else {
				if (health <= combat_defines.HEALTH_THRESHOLD_CRIT) {
					this.a.c.LivingMob.stat = combat_defines.SOFT_CRIT;
				} else {
					this.a.c.LivingMob.stat = combat_defines.CONSCIOUS;
				}
			}
		}
	}

	update_health_hud() {
		const health_hud = this.a.c.Eye.screen.health;
		if (!health_hud) {return;}
		let variant = 0;
		if (this.a.c.LivingMob.stat !== combat_defines.DEAD) {
			if (this.a.c.CarbonMob.mood >= 85) {this.a.c.Eye.screen.health.components.Examine.desc = "Your mood is excellent!";}
			else if (this.a.c.CarbonMob.mood < 85 && this.a.c.CarbonMob.mood >= 70) {variant = 1;this.a.c.Eye.screen.health.components.Examine.desc = "Your mood is very good!";}
			else if (this.a.c.CarbonMob.mood < 70 && this.a.c.CarbonMob.mood >= 55) {variant = 2;this.a.c.Eye.screen.health.components.Examine.desc = "Your mood is good.";}
			else if (this.a.c.CarbonMob.mood < 55 && this.a.c.CarbonMob.mood >= 40) {variant = 3;this.a.c.Eye.screen.health.components.Examine.desc = "Your mood is decent.";}
			else if (this.a.c.CarbonMob.mood < 40 && this.a.c.CarbonMob.mood >= 25) {variant = 4;this.a.c.Eye.screen.health.components.Examine.desc = "Your mood is low.";}
			else if (this.a.c.CarbonMob.mood < 25 && this.a.c.CarbonMob.mood >= 12) {variant = 5;this.a.c.Eye.screen.health.components.Examine.desc = "Your mood is bad!";}
			else if (this.a.c.CarbonMob.mood < 12 && this.a.c.CarbonMob.mood >= 0) {variant = 6;this.a.c.Eye.screen.health.components.Examine.desc = "Your mood is terrible!";}
		} else {variant = 7;this.a.c.Eye.screen.health.components.Examine.desc = "You are dead.";}
		this.a.c.Eye.screen.health.icon_state = `health${variant}`;
		const nutrition_hud = this.a.c.Eye.screen.nutrition;
		if (!nutrition_hud) {return;}
		variant = 0;
		if (this.a.c.LivingMob.stat !== combat_defines.DEAD) {
			this.a.c.Eye.screen.nutrition.components.Examine.desc = `<b>Hunger:</b> ${this.a.c.CarbonMob.hunger}<br><b>Thirst:</b> ${this.a.c.CarbonMob.thirst}`;
			if (this.a.c.CarbonMob.thirst >= 75 && this.a.c.CarbonMob.hunger >= 75) {variant = 1;}
			else if ((this.a.c.CarbonMob.thirst < 75 && this.a.c.CarbonMob.thirst >= 50) || (this.a.c.CarbonMob.hunger < 75 && this.a.c.CarbonMob.hunger >= 50)) {variant = 2;}
			else if ((this.a.c.CarbonMob.thirst < 50 && this.a.c.CarbonMob.thirst >= 25) || (this.a.c.CarbonMob.hunger < 50 && this.a.c.CarbonMob.hunger >= 25)) {variant = 3;}
			else if ((this.a.c.CarbonMob.thirst < 25 && this.a.c.CarbonMob.thirst >= 0) || (this.a.c.CarbonMob.hunger < 25 && this.a.c.CarbonMob.hunger >= 0)) {variant = 4;}
		} else {this.a.c.Eye.screen.nutrition.components.Examine.desc = "You are dead.";}
		this.a.c.Eye.screen.nutrition.icon_state = `nutrition${variant}`;
	}

	update_damage_hud() {
		if (this.a.c.LivingMob.stat === combat_defines.DEAD) {
			if (this.a.c.Eye.screen.crit_vision) {
				this.a.c.Eye.screen.crit_vision.destroy();
				delete this.a.c.Eye.screen.crit_vision;
			}
			if (this.a.c.Eye.screen.crit) {
				this.a.c.Eye.screen.crit.destroy();
				delete this.a.c.Eye.screen.crit;
			}
			if (this.a.c.Eye.screen.brute) {
				this.a.c.Eye.screen.brute.destroy();
				delete this.a.c.Eye.screen.brute;
			}
			return;
		}
		const health = this.a.c.LivingMob.health;
		if (health <= combat_defines.HEALTH_THRESHOLD_CRIT) {
			let severity = Math.min(Math.max(Math.floor(-health * 0.1), 0), 10);
			if (health <= -95) {
				severity = 10;
			}
			if (!this.a.c.LivingMob.in_full_crit) {
				const visionseverity = Math.min(Math.max(Math.floor(-health / 4) + 4, 0), 10);
				if (!this.a.c.Eye.screen.crit_vision) {
					this.a.c.Eye.screen.crit_vision = new Atom(this.a.server, "screen_crit_vision");
				}
				this.a.c.Eye.screen.crit_vision.icon_state = `oxydamageoverlay${visionseverity}`;
			} else {
				if (this.a.c.Eye.screen.crit_vision) {
					this.a.c.Eye.screen.crit_vision.destroy();
					delete this.a.c.Eye.screen.crit_vision;
				}
			}
			if (!this.a.c.Eye.screen.crit) {
				this.a.c.Eye.screen.crit = new Atom(this.a.server, "screen_crit");
			}
			this.a.c.Eye.screen.crit.icon_state = `passage${severity}`;
		} else {
			if (this.a.c.Eye.screen.crit) {
				this.a.c.Eye.screen.crit.destroy();
				delete this.a.c.Eye.screen.crit;
			}
			if (this.a.c.Eye.screen.crit_vision) {
				this.a.c.Eye.screen.crit_vision.destroy();
				delete this.a.c.Eye.screen.crit_vision;
			}
		}

		const oxyloss = this.a.c.LivingMob.get_damage("oxy");
		if (oxyloss) {
			let severity = Math.max(Math.floor(oxyloss / 10), 0);
			if (oxyloss >= 45) {
				severity = 7;
			}
			if (!this.a.c.Eye.screen.oxy) {
				this.a.c.Eye.screen.oxy = new Atom(this.a.server, "screen_oxy");
			}
			this.a.c.Eye.screen.oxy.icon_state = `oxydamageoverlay${severity}`;
		} else {
			if (this.a.c.Eye.screen.oxy) {
				this.a.c.Eye.screen.oxy.destroy();
				delete this.a.c.Eye.screen.oxy;
			}
		}

		const damage = this.a.c.LivingMob.get_damage("brute") + this.a.c.LivingMob.get_damage("burn");
		if (damage >= 0) {
			let severity = 0;
			if (damage >= 5) {
				severity = Math.min(Math.floor(damage / 15) + 1, 6);
			}
			if (!this.a.c.Eye.screen.brute) {
				this.a.c.Eye.screen.brute = new Atom(this.a.server, "screen_brute");
			}
			this.a.c.Eye.screen.brute.icon_state = `/brutedamageoverlay${severity}`;
		} else {
			if (this.a.c.Eye.screen.brute) {
				this.a.c.Eye.screen.brute.destroy();
				delete this.a.c.Eye.screen.brute;
			}
		}
	}

	movement_delay(prev: any) {
		let delay = prev();
		if (this.a.c.LivingMob.stat === combat_defines.SOFT_CRIT) {
			delay += combat_defines.SOFTCRIT_ADD_SLOWDOWN;
		}
		const health_deficiency = 100 - this.a.c.LivingMob.health + this.a.c.LivingMob.get_damage("stamina");
		if (health_deficiency >= 40) {
			delay += health_deficiency * 4;
		}
		return delay;
	}

	get lying_counter() {
		return this[_lying_counter];
	}
	set lying_counter(val) {
		const old = this[_lying_counter];
		if (old === val) {return;}
		this[_lying_counter] = val;
		this.update_lying(/*old, val*/);
	}

	moved(/*e: Record<string,any>*/) {
		this.update_lying();
	}

	update_lying() {
		const old = this.lying;
		this.lying = !!this[_lying_counter] && this.a.loc && this.a.loc.is_base_loc;
		if (has_component(this.a, "MobInventory")) {
			if (this.lying && !old) {
				this.a.c.MobInventory.nohold_counter++;
			} else if (old && !this.lying) {
				this.a.c.MobInventory.nohold_counter--;
			}
		}
		if (has_component(this.a, "MobInteract")) {
			if (this.lying && !old) {
				this.a.c.MobInteract.nointeract_counter++;
			} else if (old && !this.lying) {
				this.a.c.MobInteract.nointeract_counter--;
			}
		}
	}

	life(prev: any) {
		prev();

		this.handle_organs();
		this.handle_blood();
		this.handle_liver();

		this.handle_hunger_thirst();
		this.handle_mood();
		this.update_health_hud();
		this.a.c.LivingMob.adjust_damage("stamina", -3);
	}

	handle_mood() {
		if (this.hunger <= 30)
			{this.mood -= 0.1;}
		if (this.thirst <= 30)
			{this.mood -= 0.12;}
		this.mood = Number(Math.min(Math.max(this.mood, 0), 100).toFixed(2));
	}
	handle_hunger_thirst() {
		if (this.hunger <= 100 && this.hunger > 0)
			{this.hunger -= 0.05;}
		if (this.hunger <= 0)
			{
				this.a.c.LivingMob.health -= 0.25;
				if (Math.random() < 0.05)
					{to_chat`<span class='warning'>You feel very hungry!</span>`(this.a);}
			}
		this.hunger = Number(Math.min(Math.max(this.hunger, 0), 100).toFixed(2));

		if (this.thirst <= 100 && this.thirst > 0)
			{this.thirst -= 0.08;}
		if (this.thirst <= 0)
			{
				this.a.c.LivingMob.health -= 0.3;
				if (Math.random() < 0.05)
					{to_chat`<span class='warning'>You feel very thirsty!</span>`(this.a);}
			}
		this.thirst = Number(Math.min(Math.max(this.thirst, 0), 100).toFixed(2));
	}
	handle_organs() {
		if (this.organs) {
			for (const torgan of Object.values(this.organs)) {
				const organ: Record<string, any> = torgan;
				organ.c.Organ.do_life();
			}
		}
	}

	handle_blood() {
		// In BYOND ss13, blood is stored in a special snowflakey var.
		// I say down with that bullshit. Make mobs a 2000-volume reagent container and toss
		// blood in there as another reagent type. Makes more sense, and your syringes will actually
		// pull out the other reagents in your blood. And you'll actually be able to get drunk
		// by drinking a drunk person's blood. (please don't try this at home)
		if (!this.uses_blood) {return;} // fuck off we have no blood here
		const blood_volume = this.a.c.ReagentHolder.volume_of("Blood");
		if (blood_volume < mob_defines.BLOOD_VOLUME_SAFE) {
			const word = _.sample(["dizzy", "woozy", "faint"]);
			if (blood_volume >= mob_defines.BLOOD_VOLUME_OKAY) {
				if (Math.random() < 0.05) {
					to_chat`<span class='warning'>You feel ${word}.</span>`(this.a);
				}
				this.a.c.LivingMob.adjust_damage(
					"oxy",
					Math.round((mob_defines.BLOOD_VOLUME_NORMAL - blood_volume) * 0.01)
				);
			} else if (blood_volume >= mob_defines.BLOOD_VOLUME_BAD) {
				if (Math.random() < 0.05) {
					to_chat`<span class='warning'>You feel very ${word}.</span>`(this.a);
				}
				this.a.c.LivingMob.adjust_damage(
					"oxy",
					Math.round((mob_defines.BLOOD_VOLUME_NORMAL - blood_volume) * 0.02)
				);
			} else if (blood_volume >= mob_defines.BLOOD_VOLUME_SURVIVE) {
				this.a.c.LivingMob.adjust_damage("oxy", 5);
				if (Math.random() < 0.15) {
					this.a.c.LivingMob.apply_effect("Unconscious", {
						delay: Math.random() * 4000 + 2000,
					});
					to_chat`<span class='warning'>You feel very ${word}.</span>`(this.a);
				}
			} else {
				this.a.c.LivingMob.stat = mob_defines.DEAD;
			}
		}

		let new_bleed_rate = 0;
		if (has_component(this.a, "MobBodyParts")) {
			for (const limb of this.a.c.MobBodyParts.limbs_set) {
				if (limb.c.BodyPart.brute_damage > 20) {
					new_bleed_rate += limb.c.BodyPart.brute_damage * 0.013;
				}
			}
		} else {
			if (this.a.c.LivingMob.get_damage("brute") > 20) {
				new_bleed_rate += this.a.c.LivingMob.get_damage("brute") * 0.013;
			}
		}
		this.bleed_rate = Math.max(this.bleed_rate - 0.5, new_bleed_rate);
		if (this.bleed_rate > 0) {
			this.bleed(this.bleed_rate);
		}
	}

	bleed(amt: number) {
		amt = this.a.c.ReagentHolder.remove("Blood", amt);
		if (this.a.loc && this.a.loc.is_base_loc) {
			this.a.c.LivingMob.add_splatter_floor({small_drip: amt < 10});
		}
	}

	handle_liver() {
		if (!this.organs || !this.organs.liver) {return;}
		const liver = this.organs.liver;
		if (!liver || liver.c.OrganLiver.failing) {
			// liver failure
			if (this.a.c.ReagentHolder.volume_of("Corazone")) {
				//corazone is processed here an not in the liver because a failing liver can't metabolize reagents
				this.a.c.ReagentHolder.remove("Corazone", 0.4); //corazone slowly deletes itself.
				return;
			}
			this.a.c.LivingMob.adjust_damage("tox", 8);
			if (Math.random() < 0.3) {
				to_chat`<span class='notice'>You feel confused and nauseous...</span>`(this.a); //actual symptoms of liver failure
			}
		}
	}

	get_blood_id() {
		return this.uses_blood ? "blood" : null;
	}

	add_splatter_floor({ref = this.a, small_drip = false} = {}) {
		if (this.get_blood_id() !== "blood") {return;}
		if (!ref || !ref.base_mover || !ref.base_mover.loc) {return;}

		let splatter;
		if (small_drip) {
			splatter = new Atom(this.a.server, "decal_blood_drips");
		} else {
			splatter = new Atom(this.a.server, "decal_blood_splatter");
		}
		splatter.fine_loc = ref.base_mover.fine_loc;
	}

	slip(obj: Record<string, any>) {
		this.a.c.LivingMob.apply_effect("Knockdown", {
			delay: obj.c.Slippery.knockdown_amount,
		});
	}

	examine(user: any) {
		to_chat`<span class='info'>*---------*<br>This is <em>${this.a.name}</em>!</span>`(user);
		const t_He = this.a.p_they(true);
		const t_his = this.a.p_their();
		const t_him = this.a.p_them();
		const t_has = this.a.p_have();
		const t_is = this.a.p_are();
		if (has_component(this.a, "MobInventory")) {
			this.a.c.MobInventory.examine_slots(user);
		}
		let appears_dead = false;
		if (this.a.c.LivingMob.stat === combat_defines.DEAD) {
			appears_dead = true;
			if (this.a.c.LivingMob.suiciding) {
				to_chat`<span class='warning'>${t_He} appear${this.a.p_s()} to have commited suicide... there is no hope of recovery.</span>`(
					user
				);
			}
			let departed = "";
			if (!this.a.c.Mob.key) {
				let foundghost = false;
				if (this.a.c.LivingMob.mind) {
					for (const ghost of this.a.server.atoms_for_components.Ghost) {
						if (ghost.c.Ghost.mind === this.a.c.LivingMob.mind) {
							foundghost = true;
							break;
						}
					}
				}
				if (!foundghost) {
					departed = ` and ${t_his} soul has departed`;
				}
			}
			to_chat`<span class='deadsay'>${t_He} ${t_is} limp and unresponsive; there are no signs of life${departed}...</span>`(
				user
			);
		}
		if (has_component(this.a, "MobBodyParts")) {
			this.a.c.MobBodyParts.examine_limbs(user);
		}
		const bruteloss = this.a.c.LivingMob.get_damage("brute");
		const burnloss = this.a.c.LivingMob.get_damage("burn");
		const cloneloss = this.a.c.LivingMob.get_damage("clone");
		if (bruteloss) {
			if (bruteloss < 30) {
				to_chat`<span class='warning'>${t_He} ${t_has} minor bruising.</span>`(user);
			} else {
				to_chat`<span class='warning'><b>${t_He} ${t_has} severe bruising!</b></span>`(user);
			}
		}
		if (burnloss) {
			if (burnloss < 30) {
				to_chat`<span class='warning'>${t_He} ${t_has} minor burns.</span>`(user);
			} else {
				to_chat`<span class='warning'><b>${t_He} ${t_has} severe burns!</b></span>`(user);
			}
		}
		if (cloneloss) {
			if (cloneloss < 30) {
				to_chat`<span class='warning'>${t_He} ${t_has} minor cellular damage.</span>`(user);
			} else {
				to_chat`<span class='warning'><b>${t_He} ${t_has} severe cellular damage!</b></span>`(user);
			}
		}

		if (this.uses_blood && this.a.c.ReagentHolder.volume_of("Blood") < mob_defines.BLOOD_VOLUME_SAFE) {
			to_chat`<span class='warning'>${t_He} ${t_has} pale skin.</span>`(user);
		}

		if (!appears_dead) {
			if (this.a.c.LivingMob.stat === combat_defines.UNCONSCIOUS) {
				to_chat`<span class='info'>${t_He} ${t_is}n't responding to anything around ${t_him} and seem${this.a.p_s()} to be asleep.</span>`(
					user
				);
			} else {
				if (this.a.c.LivingMob.in_crit) {
					to_chat`<span class='info'>${t_He} ${t_is} barely conscious.</span>`(user);
				}
			}
			if (!this.a.c.Mob.key) {
				to_chat`<span class='deadsay'>${t_He} ${t_is} totally catatonic. The stresses of life in deep space must have been too much for ${t_him}. Any recovery is unlikely.</span>`(
					user
				);
			} else if (!this.a.c.Mob.client) {
				to_chat`<span class='info'>${t_He} ${t_has} a blank, absent-minded stare and appears completely unresponsive to anything. ${t_He} may snap out of it soon.</span>`(
					user
				);
			}
		}
		to_chat`<span class='info'>*---------*</span>`(user);
	}
}
CarbonMob.depends = ["LivingMob", "Puller", "ReagentHolder"];
CarbonMob.loadBefore = ["LivingMob", "ReagentHolder"];

CarbonMob.template = {
	vars: {
		components: {
			CarbonMob: {
				lying_counter: 0,
				losebreath: 0,
				//None of these vars are fully implemented
				bodytemperature: 310.055, //Kelvin. aka 98.7F
				radiation: 0,
				drowsiness: 0, //This is misspelled as drowsyness in TG code
				dizziness: 0,
				jitteriness: 0,
				druggy: 0,
				hallucination: 0,
				uses_blood: true,
				bleed_rate: 0,
			},
			ReagentHolder: {
				maximum_volume: 2000, // enough space to hold 4 times more blood than you'll ever have.
			},
		},
	},
};

module.exports.components = {CarbonMob};
