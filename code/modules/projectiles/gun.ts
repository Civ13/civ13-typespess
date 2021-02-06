
const {
	Component,
	has_component,
	Sound,
	visible_message,
	to_chat,
} = require("./../../../code/game/server.ts");
const combat_defines = require("../../defines/combat_defines.ts");
const sounds = require("../../defines/sounds.ts");

class Gun extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.chambered = null;
		this.firing_burst = null;
		this.a.c.Item.after_attack = this.after_attack.bind(this);
	}

	after_attack(target, user, prox, e) {
		if (this.firing_burst || !target.loc || !target.loc.is_base_loc) {return;}
		if (prox) {
			if (!has_component(target, "LivingMob")) {return;}
			if (target === user && user.c.MobInteract.zone_sel !== "mouth")
			//so we can't shoot ourselves (unless mouth selected)
				{return;}
		}

		if (!this.can_trigger(user)) {return;}

		if (!this.can_shoot()) {
			this.shoot_with_empty_chamber({ user });
			return;
		}

		if (prox) {
			if (user.zone_selected === "mouth") {
				// TODO suicide
				return;
			}
		}

		if (this.weapon_weight === combat_defines.WEAPON_HEAVY) {
			let hands = 0;
			for (const hand of user.c.MobInventory.hand_slots()) {
				if (!hand.item || hand.item === this.a) {hands++;}
			}
			if (hands < 2) {
				to_chat`<span class='userdanger'>You need both hands free to fire the ${this.a}!</span>`(
					user
				);
				return;
			}
		}

		const bonus_spread = 0;
		// TODO dualweilding

		this.fire({ target, user, e, bonus_spread });
	}

	fire(opts) {
		this.fire_one(opts);
	}

	// fires one bullet.
	fire_one({
		target,
		user,
		message = true,
		e,
		zone_override = null,
		bonus_spread = 0,
		angle_offset = 0,
	} = {}) {
		const dx = target.x + ((e && e.x - 0.5) || 0) - user.x;
		const dy = target.y + ((e && e.y - 0.5) || 0) - user.y;
		const angle = angle_offset + (Math.atan2(dy, dx) * 180) / Math.PI;
		if (
			!this.a.c.Item.slot ||
	this.a.c.Item.slot.mob !== user ||
	!this.a.c.Item.slot.props.is_hand_slot
		) {
			return false;
		}

		if (this.chambered) {
			if (
				this.chambered.c.AmmoCasing.fire({
					target,
					user,
					angle,
					suppressed: this.suppressed,
					zone_override,
					spread: Math.sqrt(bonus_spread ** 2 + this.spread ** 2),
				})
			) {
				this.shoot_live_shot({
					user,
					message,
					point_blank:
			Math.max(target.x - user.x, target.y - user.y) <= 1.5
				? target
				: null,
				});
			} else {
				this.shoot_with_empty_chamber({ user });
				return false;
			}
		} else {
			this.shoot_with_empty_chamber({ user });
			return false;
		}
		this.process_chamber();
		this.update_icon();
		return true;
	}

	shoot_live_shot({ user, point_blank = null, message = true } = {}) {
		new Sound(this.a.server, {
			path: this.fire_sound,
			volume: this.suppressed ? 0.1 : 0.5,
			vary: true,
		}).emit_from(user);
		if (!this.suppressed && message) {
			if (point_blank)
				{visible_message`<span class='danger'>The ${user} fires the ${this.a} point blank at the ${point_blank}!</span>`
					.range(combat_defines.COMBAT_MESSAGE_RANGE)
					.emit_from(user);}
			else
				{visible_message`<span class='danger'>The ${user} fires the ${this.a}!</span>`
					.range(combat_defines.COMBAT_MESSAGE_RANGE)
					.emit_from(user);}
		}
	}

	shoot_with_empty_chamber({ user } = {}) {
		to_chat`<span class='danger'>*click*</span>`(user);
		new Sound(this.a.server, {
			path: "sound/weapons/empty.ogg",
			volume: 1,
			vary: true,
		}).emit_from(user);
	}

	// Fun fact this is an item proc on tg. On all items. For guns.
	// whether the user can trigger this gun
	can_trigger(user) {
		if (
			!has_component(user, "MobInventory") ||
	!user.c.MobInventory.can_use_guns(this.a)
		)
			{return false;}
		return true;
	}

	//called after the gun has successfully fired its chambered ammo.
	process_chamber() {
		return false;
	}

	//check if there's enough ammo/energy/whatever to shoot one time
	//i.e if clicking would make it shoot
	can_shoot() {
		return true;
	}

	update_icon() {return;}
}

Gun.loadBefore = ["Item", "BeltItem"];
Gun.depends = ["Item"];

Gun.template = {
	vars: {
		components: {
			Gun: {
				fire_sound: sounds.gunshot,
				suppressed: null,
				recoil: 0,
				clumsy_check: true,
				trigger_guard: combat_defines.TRIGGER_GUARD_NORMAL,
				weapon_weight: combat_defines.WEAPON_LIGHT,
				spread: 0, // spread induced by the gun itself use 1/4 the value from byond
			},
			Item: {
				size: 3,
				force: 5,
				inhand_icon_state: "gun",
				inhand_lhand_icon: "icons/mob/inhands/lefthand_guns/",
				inhand_rhand_icon: "icons/mob/inhands/righthand_guns/",
			},
			Tangible: {
				throw_force: 5,
				throw_speed: 3,
				throw_range: 5,
			},
			Examine: {
				desc: "It's a gun. It's pretty terrible, though.",
			},
		},
		name: "gun",
		icon: "icons/obj/guns/pistols/",
		icon_state: "revolver",
	},
};

module.exports.components = { Gun };
