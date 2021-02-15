export{};
const _slot:any = Symbol("_slot");
const {
	Component,
	Sound,
	chain_func,
	has_component,
	to_chat,
} = require("./../../../../code/game/server.js");
const combat_defines = require("../../../defines/combat_defines.js");
const pass_flags = require("../../../defines/pass_flags.js");

class Item extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.attack_hand = chain_func(
			this.a.attack_hand,
			this._attack_hand.bind(this)
		);
		this.a.on("before_move", this.before_move.bind(this));
		this.a.c.Examine.examine = chain_func(
			this.a.c.Examine.examine,
			this.examine.bind(this)
		);
	}

	attack_self() {return;}

	_attack_hand(prev: any, user: any) {
		if (has_component(user, "MobInventory")) {
			const slot = user.c.MobInventory.slots[user.c.MobInventory.active_hand];
			if (typeof slot.item !== "undefined" || !slot.can_accept_item(this.a)) {return prev();}
			slot.item = this.atom;
			return;
		}
		return prev();
	}

	get slot() {
		return this[_slot];
	}

	before_move() {
		if (this.slot) {
			this.slot.item = null;
		}
	}

	examine(prev: any, user: any) {
		prev();
		to_chat`${
			this.a.gender === "plural" ? "They are" : "It is"
		} a ${this.get_size_text()} item.`(user);
	}

	get_size_text() {
		switch (this.size) {
		case 1:
			return "tiny";
		case 2:
			return "small";
		case 3:
			return "normal-sized";
		case 4:
			return "bulky";
		case 5:
			return "huge";
		case 6:
			return "gigantic";
		}
	}

	get_attack_volume() {
		if (this.size) {
			if (this.force)
				{return Math.min(Math.max((this.force + this.w_class) * 0.04, 0.3), 1);}
			else {return Math.min(Math.max(this.w_class * 0.06, 0.1), 1);}
		}
	}

	pre_attack() {return false;}

	after_attack() {return true;}

	attack_space() {return true;}

	melee_attack_chain(user: Record<string,any>, target: any, e: any) {
		if (!this.pre_attack(/*target, user, e*/)) {
			const resolved = target.attack_by(this.a, user, e);
			if (!resolved && !target.destroyed && !this.a.destroyed) {
				this.after_attack(/*target, user, true, e*/);
			}
		}
	}

	attack(target: any, user: Record<string,any>) {
		if (this.no_bludgeon) {return;}
		if (!this.force)
			{new Sound(this.a.server, {
				path: "sound/weapons/tap.ogg",
				volume: this.get_attack_volume(),
				vary: true,
			}).emit_from(this.a);}
		else
			{new Sound(this.a.server, {
				path: this.hitsound,
				volume: this.get_attack_volume(),
				vary: true,
			}).emit_from(this.a);}

		target.c.Mob.last_attacker_key = user.c.Mob.key;

		user.c.Tangible.do_attack_animation(target);
		target.c.Tangible.attacked_by(this.a, user);

		// TODO logs and fingerprints
	}

	attack_obj(target: Record<string,any>, user: Record<string,any>) {
		if (this.no_bludgeon) {return;}
		user.c.MobInteract.change_next_move(combat_defines.CLICK_CD_MELEE);
		user.c.Tangible.do_attack_animation(target);
		target.c.Destructible.attacked_by(this.a, user);
	}

	apply_belt_overlay(item: Record<string,any>) {
		item.overlays[`belt_${this.a.object_id}`] = {
			icon: "icons/mob/worn/belt_overlays/",
			icon_state: this.a.icon_state,
		};
	}
	unapply_belt_overlay(item: Record<string,any>) {
		item.overlays[`belt_${this.a.object_id}`] = null;
	}
}
Item.depends = ["Tangible"];
Item.loadBefore = ["Tangible"];

Item.IS_BLUNT = 0;
Item.IS_SHARP = 1;
Item.IS_SHARP_ACCURATE = 2;

Item.template = {
	vars: {
		components: {
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/lefthand/",
				inhand_icon_state: "nothing",
				size: 3,
				sharpness: Item.IS_BLUNT,
				force: 0,
				damage_type: "brute",
				attack_verb: null,
				needs_permit: false, //TODO: currently just a placeholder
				strip_delay: 4000,
				equip_delay_other: 2000,
			},
		},
		icon: "icons/obj/misc/",
		layer: 3,
		bounds_x: 0.375,
		bounds_y: 0.375,
		bounds_width: 0.125,
		bounds_height: 0.125,
		pass_flags: pass_flags.PASSTABLE,
	},
};

module.exports.symbols = { _slot };
module.exports.components = { Item };
