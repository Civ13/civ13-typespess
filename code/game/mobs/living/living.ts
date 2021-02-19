export{};
const {Component, Sound, Atom, chain_func, format_html, visible_message, has_component} = require("./../../../../code/game/server.js");
const _: any = require("underscore");
const Mind: any = require("../mind/mind.js");
const combat_defines: any = require("../../../defines/combat_defines.js");
const mob_defines: any = require("../../../defines/mob_defines.js");
const {random_zone}: any = require("./carbon/body_parts/helpers.js");
const layers: any = require("../../../defines/layers.js");
const pass_flags: any = require("../../../defines/pass_flags.js");

const _stat: any = Symbol("_stat");

const status_effects: Record<string, any> = {};

class LivingMob extends Component {
	// eslint-disable-next-line max-statements
	constructor(atom: any, template: any) {
		super(atom, template);

		this.damages = {};
		this.effects = {};

		this.add_damage_type("brute");
		this.add_damage_type("burn");
		this.add_damage_type("oxy");
		this.add_damage_type("tox");
		this.add_damage_type("clone");

		this.mind = null;

		this.a.c.Mob.on("client_changed", this.client_changed.bind(this));
		this.a.c.Mob.can_interact_with_panel = this.can_interact_with_panel.bind(this);

		this.a.c.Tangible.attacked_by = this.attacked_by.bind(this);
		this.a.c.Tangible.bullet_act = this.bullet_act.bind(this);
		this.a.c.Tangible.on("throw_finished", this.throw_finished.bind(this));
		this.a.c.Tangible.on("throw_impacted_by", this.throw_impacted_by.bind(this));
		this.a.c.SpeechEmitter.build_message = chain_func(
			this.a.c.SpeechEmitter.build_message,
			this.build_message.bind(this)
		);
		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
		this.a.can_be_crossed = chain_func(this.a.can_be_crossed, this.can_be_crossed.bind(this));
		this.a.move = chain_func(this.a.move, this.move.bind(this));
		this.a.on("bumped", this.bumped.bind(this));
		this.on("health_changed", this.health_changed.bind(this));
		this.life_timeout = null;
		if (this.stat !== combat_defines.DEAD) {
			this.life_timeout = setTimeout(this.run_life.bind(this), 2000);
		}
		this.life_cycle_num = 0;
		this.update_name();
	}

	add_damage_type(name: string) {
		const damage_obj = {
			val: 0,
			affects_health: true,
			get: () => {
				return damage_obj.val;
			},
			set: (newval: number, {health_event = true, force = false} = {}) => {
				if (this.status_flags & combat_defines.GODMODE && !force) {return false;}
				newval = Math.max(0, newval);
				if (newval === damage_obj.val) {return;}
				damage_obj.val = newval;
				this.emit("damage_changed", name);
				if (health_event) {
					this.emit("health_changed");
				}
			},
			adjust: (amount: number, props: {health_event: true; force: false}) => {
				if (props) {
					damage_obj.set(damage_obj.get() + amount, props);
				} else {
					damage_obj.set(damage_obj.get() + amount, {health_event: true, force: false});
				}
			},
		};
		this.damages[name] = damage_obj;
	}

	get_damage(name: string) {
		const damage = this.damages[name];
		if (damage) {
			return damage.get();
		}
		return 0;
	}

	set_damage(name: string, val: any, props: any) {
		const damage = this.damages[name];
		if (damage) {
			damage.set(val, props);
			return true;
		}
		return false;
	}

	adjust_damage(name: string, val: number, props: undefined = null) {
		const damage = this.damages[name];
		if (damage) {
			damage.adjust(val, props);
			return true;
		}
		return false;
	}

	get health() {
		let h = this.max_health;
		for (const tdamage_obj of Object.values(this.damages)) {
			const damage_obj: Record<string, any> = tdamage_obj;
			if (damage_obj && damage_obj.get && damage_obj.affects_health) {
				h -= damage_obj.get();
			}
		}
		return h;
	}

	get stat() {
		return this[_stat] || 0;
	}

	set stat(val) {
		const oldstat = this.stat;
		// eslint-disable-next-line no-setter-return
		if (val === oldstat) {return;}
		this[_stat] = val;
		this.emit("stat_changed", oldstat, val);
		if (val >= combat_defines.UNCONSCIOUS && oldstat < combat_defines.UNCONSCIOUS) {
			this.nomove_counter++;
			this.a.c.MobInteract.nointeract_counter++;
		} else if (val < combat_defines.UNCONSCIOUS && oldstat >= combat_defines.UNCONSCIOUS) {
			this.nomove_counter--;
			this.a.c.MobInteract.nointeract_counter--;
		}
		if (val === combat_defines.DEAD && this.life_timeout) {
			clearTimeout(this.life_timeout);
			this.life_timeout = null;
		} else if (val !== combat_defines.DEAD && !this.life_timeout) {
			this.life_timeout = setTimeout(this.run_life.bind(this), 2000);
		}
	}

	get in_crit() {
		return (
			this.health <= combat_defines.HEALTH_THRESHOLD_CRIT &&
			(this.stat === combat_defines.SOFT_CRIT || this.stat === combat_defines.UNCONSCIOUS)
		);
	}

	get in_full_crit() {
		return this.health <= combat_defines.HEALTH_THRESHOLD_FULLCRIT && this.stat === combat_defines.UNCONSCIOUS;
	}

	health_changed() {
		this.update_stat();
	}

	update_stat() {return;}

	//DAMAGE
	apply_damage(
		damage = 0,
		damagetype = "brute",
		def_zone: any = null,
		blocked = this.run_armor_check(def_zone, "melee")
	) {
		const hit_percent = (100 - blocked) / 100;
		if (!damage || hit_percent <= 0) {return false;}
		this.adjust_damage(damagetype, damage * hit_percent);
		return true;
	}

	apply_damages(damages: {[x: string]: number}, def_zone: any, blocked: number) {
		if (blocked >= 100) {return false;}
		for (const key in damages) {
			if (!Object.prototype.hasOwnProperty.call(damages, key)) {
				continue;
			}
			this.apply_damage(damages[key], key, def_zone, blocked);
		}
		return true;
	}

	run_life() {
		this.life_timeout = null;
		this.life_cycle_num++;
		this.life(/*this.life_cycle_num*/);
		if (this.stat !== combat_defines.DEAD && !this.life_timeout) {
			this.life_timeout = setTimeout(this.run_life.bind(this), 2000);
		}
	}

	life() {return;}

	movement_delay() {
		if (this.a.c.MobInteract.move_mode === mob_defines.MOVE_INTENT_WALK) {
			return 400;
		} else {
			return 150;
		}
	}

	client_changed(new_client: {key: any}) {
		if (new_client && !this.mind) {
			const mind = new Mind(new_client.key);
			mind.transfer_to(this.a);
		}
	}

	ghostize(can_reenter_corpse = true) {
		const ghost = new Atom(this.a.server, {components: ["Ghost"]});
		ghost.loc = this.a.base_mover.fine_loc;
		ghost.c.Ghost.mind = this.mind;
		ghost.c.Mob.key = this.a.c.Mob.key;
		ghost.c.Ghost.can_reenter_corpse = can_reenter_corpse;
	}

	move(prev: () => any, dx: any, dy: any, reason: string) {
		if (reason !== "walking") {
			return prev();
		}

		if (this.stat === combat_defines.DEAD) {
			this.ghostize(true);
			return;
		}

		if (this.incapacitated()) {return;}

		this.a.walk_delay = this.movement_delay();

		if (has_component(this.a.loc, "MovementProxy")) {
			this.a.loc.c.MovementProxy.emit("child_moved", this.a, dx, dy);
			return;
		}
		return prev();
	}

	build_message(prev: () => any) {
		const msg = prev();
		if (msg.message.startsWith(";")) {
			msg.mode = "radio";
			msg.range = 1;
			msg.message = msg.message.substring(1);
		}

		if (this.stat >= combat_defines.UNCONSCIOUS) {
			return null;
		}

		if (!msg.message || !msg.message.length) {
			return null;
		}
		return msg;
	}

	incapacitated() {
		if (this.nomove_counter) {return true;}
		return false;
	}

	can_interact_with_panel(target: {dim: any; x: number; y: number, z: number;}) {
		return (
			target.z === this.a.z &&
			target.dim === this.a.dim &&
			Math.max(Math.abs(target.x - this.a.x), Math.abs(target.y - this.a.y)) < 1
		);
	}

	can_be_crossed(prev: () => any, mover: {density: number}, reason: string) {
		if ((mover.density < 1 || this.a.density < 1) && reason !== "throw" && reason !== "projectile") {return true;}
		return prev();
	}

	throw_finished() {
		this.a.x = Math.round(this.a.x);
		this.a.y = Math.round(this.a.y);
	}

	attack_by(
		prev: () => any,
		item: {c: {Item: {attack: (arg0: any, arg1: any) => any}}},
		user: {c: {MobInteract: {change_next_move: (arg0: any) => void}}}
	) {
		user.c.MobInteract.change_next_move(combat_defines.CLICK_CD_MELEE);
		return prev() || item.c.Item.attack(this.a, user);
	}

	throw_impacted_by(item: {
		c: {
			Tangible: {throw_force: number; throwhitsound: any};
			Item: {size: number; hitsound: any; damage_type: string};
		};
	}) {
		if (!has_component(item, "Item")) {
			new Sound(this.a.server, {
				path: "sound/weapons/genhit.ogg",
				volume: 0.5,
				vary: true,
			}).emit_from(this.a);
			return;
		}
		const zone = random_zone("torso", 65);
		let volume = 0;
		if (item.c.Tangible.throw_force && item.c.Item.size) {
			volume = Math.min(Math.max((item.c.Tangible.throw_force + item.c.Item.size) * 0.05, 0.3), 1);
		} else if (item.c.Item.size) {
			volume = Math.min(Math.max(item.c.Item.size * 0.08, 0.2), 1);
		} else {return;}
		if (item.c.Tangible.throw_force > 0) {
			let sound = item.c.Tangible.throwhitsound || item.c.Item.hitsound || "sound/weapons/genhit.ogg";
			if (!item.c.Tangible.throw_force) {
				sound = "sound/weapons/throwtap.ogg";
			}
			new Sound(this.a.server, {path: sound, volume, vary: true}).emit_from(this.a);
		}
		visible_message`<span class='danger'>The ${this.a} has been hit by the ${item}.</span class='danger'>`
			.self`<span class='userdanger'>The ${this.a} been hit by the ${item}.</span>`.emit_from(this.a);
		this.apply_damage(item.c.Tangible.throw_force, item.c.Item.damage_type, zone);
	}

	add_splatter_floor(/*{turf, small_drip = false} = {}*/) {return;}

	attacked_by(item: Record<string, any>, user: Record<string, any>) {
		const zone = random_zone(user.c.MobInteract.zone_sel);
		const bp = has_component(this.a, "MobBodyParts") && (this.a.c.MobBodyParts.limbs[zone] || this.a.c.MobBodyParts.limbs.torso);
		this.send_item_attack_message(item, user, bp && bp.name);
		if (has_component(this.a, "SimpleMob")) {this.a.c.SimpleMob.target = user;}
		if (has_component(item, "Tool") && item.c.Tool.bladed && has_component(this.a, "SimpleMob") && this.a.c.LivingMob.stat === combat_defines.DEAD)
				{this.a.c.SimpleMob.attacked_by(item, user); return true;}
		if (item.c.Item.force) {
			this.apply_damage(item.c.Item.force, item.c.Item.damage_type, zone);
			if (item.c.Item.damage_type === "brute" && Math.random() < 0.33) {
				this.add_splatter_floor();
			}
			return true; // successful attack
		}
	}

	send_item_attack_message(item: Record<string, any>, user: any, hit_area: any) {
		let message_verb = "attacked";
		if (item.c.Item.attack_verb && item.c.Item.attack_verb.length) {
			message_verb = format_html`${_.sample(item.c.Item.attack_verb)}`;
		} else if (!item.c.Item.force) {return;}
		let message_hit_area = "";
		if (hit_area) {
			message_hit_area = format_html` in the ${hit_area}`;
		}
		let attack_message = `${format_html`The ${this.a}`} has been ${message_verb}${message_hit_area} with ${format_html`the ${item}`}.`;
		if (this.a.c.Hearer.in_view(user)) {
			attack_message = `${format_html`The ${user}`} has ${message_verb} ${format_html`the ${this.a}`}${message_hit_area} with ${format_html`the ${item}`}!`;
		}
		visible_message(`<span class='danger'>${attack_message}</span class='danger'>`)
			.self(`<span class='userdanger'>${attack_message}</span>`)
			.range(combat_defines.COMBAT_MESSAGE_RANGE)
			.emit_from(this.a);
		return true;
	}

	apply_effect(name: string, props = {}) {
		if (props && typeof props !== "object") {
			// I fucked this up once, so I'm not letting it get fucked up again.
			throw new Error(
				`Expected an object for second argument, instead got a ${typeof props}. You meant to wrap it in a {delay: *number*}, right?`
			);
		}
		new status_effects[name]().apply_to(this.a, props);
	}

	adjust_effect(name: string, amount: any) {
		let effect = this.effects[name];
		if (!effect) {
			new status_effects[name]().apply_to(this.a, {});
			effect = this.effects[name];
		}
		if (!effect) {return;}
		effect.adjust(amount);
	}

	identifiable() {
		// whether the face can be seen
		return true;
	}

	update_name() {
		this.a.name = this.get_visible_name();
	}

	get_visible_name() {
		const face_name = this.get_face_name("");
		const id_name = this.get_id_name("");
		if (face_name) {
			if (id_name && id_name !== face_name) {
				return `${face_name} (as ${id_name})`;
			}
			return face_name;
		}
		if (id_name) {
			return id_name;
		}
		return "Unknown";
	}

	get_face_name(if_no_face = "Unknown") {
		if (!this.identifiable()) {
			return if_no_face;
		}
		return this.real_name;
	}
	get_id_name(if_no_id = "Unknown") {
		return if_no_id;
	}

	bumped(atom: Record<string, any>, offsetx: any, offsety: any) {
		if (this.buckled || this.now_pushing) {return;}
		if (has_component(atom, "Tangible")) {
			if (has_component(atom, "LivingMob") && this.mob_collide(atom)) {return;}
			if (!atom.c.Tangible.anchored) {
				this.set_anchored(atom, offsetx, offsety);
			}
		}
	}
	set_anchored(atom: Record<string, any>, offsetx: number, offsety: number) {
		this.a.glide_size = atom.glide_size;
		this.now_pushing = true;
		atom.move(Math.sign(offsetx), Math.sign(offsety), "bumped");
		this.a.move(offsetx, offsety, "pushing");
		this.now_pushing = false;
	}
	mob_collide(atom: Record<string, any>) {
		if (this.now_pushing) {return true;}
		if (!atom.c.LivingMob.buckled) {
			let mob_swap = false;
			const this_intent = has_component(this.a, "MobInteract") ? this.a.c.MobInteract.act_intent : "harm";
			const other_intent = has_component(atom, "MobInteract") ? atom.c.MobInteract.act_intent : "harm";
			if (
				(has_component(this.a, "Puller") && this.a.c.Puller.pulling === atom && this_intent === "grab") ||
				this_intent === "help" ||
				other_intent === "help"
			) {
				mob_swap = true;
			}
			if (mob_swap) {
				if (!this.a.c.Tangible.adjacent(atom)) {return;}
				this.now_pushing = true;
				const oldloc = this.a.fine_loc;
				const oldloc_other = atom.fine_loc;
				const dx = atom.x - this.a.x;
				const dy = atom.y - this.a.y;
				let move_failed = false;

				this.a.pass_flags |= pass_flags.PASSMOB;
				atom.pass_flags |= pass_flags.PASSMOB;

				this.now_pushing = true;

				atom.glide_size = this.a.glide_size;
				if (!atom.move(-dx, -dy, "push_swap") || !this.a.move(dx, dy, "push_swap")) {
					this.a.loc = oldloc;
					atom.loc = oldloc_other;
					move_failed = true;
				}

				this.now_pushing = false;

				atom.pass_flags &= ~pass_flags.PASSMOB;
				this.a.pass_flags &= ~pass_flags.PASSMOB;

				if (!move_failed) {return true;}
			}
		}
	}
}

Object.assign(LivingMob.prototype, require("./living_defense.js"));

LivingMob.depends = ["Mob", "Tangible", "MobInteract", "MobHud", "SpeechHearer", "SpeechEmitter"];
LivingMob.loadBefore = ["Mob", "Tangible", "MobInteract", "MobHud", "SpeechHearer", "SpeechEmitter"];

LivingMob.template = {
	vars: {
		components: {
			Atom: {directional: true},
			LivingMob: {
				status_flags:
					combat_defines.CANSTUN |
					combat_defines.CANWEAKEN |
					combat_defines.CANPARALYSE |
					combat_defines.CANPUSH,
				max_health: 100,
				stat: combat_defines.CONSCIOUS,
				nomove_counter: 0,
				mob_size: mob_defines.MOB_SIZE_HUMAN,
			},
			Tangible: {
				throw_force: 10,
			},
		},
		name: "",
		density: 1,
		layer: layers.MOB_LAYER,
		let_pass_flags: pass_flags.PASSMOB,
	},
};

class MovementProxy extends Component {}

function add_effects(mod: Record<string, any> = {}) {
	if (mod.status_effects) {
		Object.assign(status_effects, mod.status_effects);
	}
}

add_effects(require("./effects/incapacitating.js"));

module.exports.components = {LivingMob, MovementProxy};
