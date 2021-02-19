export{};
const {to_chat, has_component} = require("./../../../../code/game/server.js");

const {random_zone} = require("./carbon/body_parts/helpers.js");

module.exports = {
	//Args were rearranged from TG's to be in the same order as the code
	run_armor_check(
		def_zone: any = null,
		attack_flag = "melee",
		{armour_penetration = 0, penetrated_text = null, absorb_text = null, soften_text = null} = {}
	) {
		let armor = this.get_armor(def_zone, attack_flag);

		if (armor && armour_penetration) {
			armor = Math.max(0, armor - armour_penetration);
			if (penetrated_text) {
				to_chat`<span class='userdanger'>${penetrated_text}.</span>`(this.a);
			} else {
				to_chat`<span class='userdanger'>Your armor was penetrated!</span>`(this.a);
			}
		} else if (armor >= 100) {
			if (absorb_text) {
				to_chat`<span class='userdanger'>${absorb_text}.</span>`(this.a);
			} else {
				to_chat`<span class='userdanger'>Your armor absorbs the blow!</span>`(this.a);
			}
		} else if (armor > 0) {
			if (soften_text) {
				to_chat`<span class='userdanger'>${soften_text}.</span>`(this.a);
			} else {
				to_chat`<span class='userdanger'>Your armor softens the blow!</span>`(this.a);
			}
		}
		return armor;
	},

	get_armor(def_zone: any, type: any) {
		let armorval = 0;
		let organnum = 0;

		if (def_zone) {
			if (has_component(def_zone, "BodyPart")) {
				return this.check_armor(def_zone, type);
			}
			const affecting = random_zone(def_zone);
			//If a specific bodypart is targetted, check how that bodypart is protected and return the value.
			return this.check_armor(affecting, type);
		}
		//If you don't specify a bodypart, it checks ALL your bodyparts for protection, and averages out the values
		for (const bp of this.a.c.MobBodyParts.limbs_set) {
			armorval += this.check_armor(bp, type);
			organnum++;
		}
		return armorval / Math.max(organnum, 1);
	},

	check_armor(def_zone: any, d_type: string | number) {
		if (!d_type || !has_component(this.a, "MobInventory")) {
			return 0;
		}
		let protection = 0;
		for (const tslot of Object.values(this.a.c.MobInventory.slots)) {
			const slot: Record<string, any> = tslot;
			if (slot.props.is_hand_slot) {continue;}
			const item = slot.item;
			if (has_component(item, "WearableItem") && item.c.WearableItem.body_parts_covered.includes(def_zone)) {
				protection += item.c.WearableItem.clothing_armor[d_type];
			}
		}
		return protection;
	},

	bullet_act(
		projectile: {
			c: {
				Projectile: {
					flag: any;
					armour_penetration: any;
					no_damage: any;
					damage: any;
					damage_type: any;
					hit: (arg0: any, arg1: any, arg2: any) => any;
				};
			};
		},
		def_zone: any
	) {
		const armor = this.run_armor_check(def_zone, projectile.c.Projectile.flag, {
			armour_penetration: projectile.c.Projectile.armour_penetration,
		});
		if (!projectile.c.Projectile.no_damage) {
			this.apply_damage(projectile.c.Projectile.damage, projectile.c.Projectile.damage_type, def_zone, armor);
			// TODO dismemberment
		}
		return projectile.c.Projectile.hit(this.a, def_zone, armor);
	},
};
