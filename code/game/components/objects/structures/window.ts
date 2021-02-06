
const {
	Component,
	Atom,
	Sound,
	has_component,
	chain_func,
	to_chat,
} = require("./../../../../../code/game/server.js");
const layers = require("../../../../defines/layers.js");
const sounds = require("../../../../defines/sounds.js");
const pass_flags = require("../../../../defines/pass_flags.js");

const _state = Symbol("_state");

class Window extends Component {
	constructor(atom, template) {
		super(atom, template);

		this.a.c.Destructible.play_attack_sound = this.play_attack_sound.bind(this);
		this.a.c.Destructible.deconstruct = this.deconstruct.bind(this);
		this.a.c.Destructible.take_damage = chain_func(
			this.a.c.Destructible.take_damage,
			this.take_damage.bind(this)
		);
		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
	}

	take_damage(prev) {
		prev();
		this.update_damage_overlay();
	}

	play_attack_sound(damage_amount, damage_type = "brute") {
		if (damage_type === "brute") {
			if (damage_amount)
				{new Sound(this.a.server, {
					path: "sound/effects/Glasshit.ogg",
					volume: 0.75,
					vary: true,
				}).emit_from(this.a);}
			else
				{new Sound(this.a.server, {
					path: "sound/weapons/tap.ogg",
					volume: 0.75,
					vary: true,
				}).emit_from(this.a);}
		} else if (damage_type === "burn") {
			new Sound(this.a.server, {
				path: "sound/items/Welder.ogg",
				vary: true,
			}).emit_from(this.a);
		}
	}

	update_damage_overlay() {
		if (this.a.destroyed) {return;}
		let ratio =
	this.a.c.Destructible.obj_integrity / this.a.c.Destructible.max_integrity;
		ratio = Math.ceil(ratio * 4) * 25;

		if (ratio > 75 || !this.enable_damage_overlay)
			{this.a.overlays.window_damage = null;}
		else
			{this.a.overlays.window_damage = {
				icon: "icons/obj/windows/",
				icon_state: `damage${ratio}`,
				overlay_layer: -1,
			};}
	}

	attack_by(prev, item, user) {
		if (has_component(item, "Tool")) {
			if (item.c.Tool.can_use("WeldingTool")) {
				if (
					this.a.c.Destructible.obj_integrity >=
		this.a.c.Destructible.max_integrity
				) {
					to_chat`<span class='warning'>The ${this.a} is already in good condition!</span>`(
						user
					);
					return true;
				}
				item.c.Tool.used("WeldingTool");
				to_chat`<span class='notice'>You begin repairing the ${this.a}</span>`(
					user
				);
				user.c.MobInventory.do_after({
					delay: 4000 * item.c.Tool.toolspeed,
					target: this.a,
				}).then((success) => {
					if (!success) {return;}
					new Sound(this.a.server, {
						path: "sound/items/Welder2.ogg",
						volume: 0.5,
						vary: true,
					}).emit_from(this.a);
					this.a.c.Destructible.obj_integrity = this.a.c.Destructible.max_integrity;
					this.update_damage_overlay();
					to_chat`<span class='notice'>You repair the ${this.a}</span>`(user);
				});
				return true;
			}
			if (this.state === "screwed_to_floor") {
				if (item.c.Tool.can_use("Screwdriver", user)) {
					item.c.Tool.used("Screwdriver");
					to_chat`<span class='notice'>You begin to unscrew the window from the floor...</span>`(
						user
					);
					user.c.MobInventory.do_after({
						delay: this.decon_speed * item.c.Tool.toolspeed,
						target: this.a,
					}).then((success) => {
						if (!success || this.state !== "screwed_to_floor") {return;}
						this.state = "unscrewed_from_floor";
						to_chat`<span class='notice'>You unfasten the window from the floor...</span>`(
							user
						);
					});
					return true;
				}
			} else if (this.state === "unscrewed_from_floor") {
				if (item.c.Tool.can_use("Screwdriver", user)) {
					item.c.Tool.used("Screwdriver");
					to_chat`<span class='notice'>You begin to screw the window to the floor...</span>`(
						user
					);
					user.c.MobInventory.do_after({
						delay: this.decon_speed * item.c.Tool.toolspeed,
						target: this.a,
					}).then((success) => {
						if (!success || this.state !== "unscrewed_from_floor") {return;}
						this.state = "screwed_to_floor";
						to_chat`<span class='notice'>You fasten the window to the floor...</span>`(
							user
						);
					});
					return true;
				} else if (item.c.Tool.can_use("Wrench", user)) {
					item.c.Tool.used("Wrench");
					to_chat`<span class='notice'>You begin to disassemble the ${this.a}...</span>`(
						user
					);
					user.c.MobInventory.do_after({
						delay: this.decon_speed * item.c.Tool.toolspeed,
						target: this.a,
					}).then((success) => {
						if (!success || this.state !== "unscrewed_from_floor") {return;}
						new Sound(this.a.server, {
							path: "sound/items/Deconstruct.ogg",
							volume: 0.5,
							vary: true,
						}).emit_from(this.a);
						to_chat`<span class='notice'>You successfully disassemble the ${this.a}.</span>`(
							user
						);
						this.a.c.Destructible.deconstruct(true);
					});
					return true;
				}
			}
		}
		return prev();
	}

	make_debris() {
		for (let i = 0; i < this.glass_amount; i++) {
			new Atom(this.a.server, this.shard_type, this.a.base_loc);
		}
	}

	deconstruct(disassembled = true) {
		if (this.a.destroyed) {return;}
		if (disassembled) {
			const glass = new Atom(this.a.server, this.glass_type);
			glass.c.Stack.amount = this.glass_amount;
			glass.loc = this.a.base_mover.fine_loc;
		} else {
			new Sound(this.a.server, {
				path: sounds.shatter,
				volume: 0.7,
				vary: true,
			}).emit_from(this.a);
			if (!this.a.c.Destructible.no_deconstruct && this.a.base_loc) {
				this.make_debris();
			}
		}
		this.a.destroy();
	}

	get state() {
		return this[_state];
	}
	set state(val) {
		if (val === this[_state]) {return;}
		this[_state] = val;
		if (val === "unscrewed_from_floor") {
			this.a.c.Tangible.anchored = false;
			if (has_component(this.a, "Smooth")) {
				this.a.c.Smooth.enabled = false;
				this.a.c.SmoothGroup.enabled = false;
			}
		} else {
			this.a.c.Tangible.anchored = true;
			if (has_component(this.a, "Smooth")) {
				this.a.c.Smooth.enabled = true;
				this.a.c.SmoothGroup.enabled = true;
			}
		}
	}
}

Window.one_per_tile = true;

Window.depends = ["Destructible"];
Window.loadBefore = ["Destructible"];

Window.template = {
	vars: {
		components: {
			Window: {
				state: "screwed_to_floor",
				heat_resistance: 800,
				glass_amount: 2,
				shard_type: "glass_shard",
				decon_speed: 3000,
				glass_type: "glass_sheet",
				enable_damage_overlay: false,
			},
			Destructible: {
				max_integrity: 25,
				armor: {
					melee: 0,
					bullet: 0,
					laser: 0,
					energy: 0,
					bomb: 0,
					bio: 0,
					rad: 0,
					fire: 80,
					acid: 100,
				},
			},
			Tangible: {
				anchored: true,
				pressure_resistance: 410,
			},
			Examine: {
				desc: "A window.",
			},
		},
		name: "window",
		icon: "icons/obj/windows/",
		icon_state: "windownew",
		density: true,
		let_pass_flags: pass_flags.PASSGLASS,
		layer: layers.ABOVE_OBJ_LAYER,
	},
};

class ReinforcedWindow extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
		this.a.c.Window.make_debris = chain_func(
			this.a.c.Window.make_debris,
			this.make_debris.bind(this)
		);
	}

	attack_by(prev, item, user) {
		if (has_component(item, "Tool")) {
			if (this.a.c.Window.state === "screwed_to_floor") {
				if (item.c.Tool.can_use("Crowbar", user)) {
					item.c.Tool.used("Crowbar");
					to_chat`<span class='notice'>You begin to lever the window into the frame...</span>`(
						user
					);
					user.c.MobInventory.do_after({
						delay: this.a.c.Window.decon_speed * item.c.Tool.toolspeed,
						target: this.a,
					}).then((success) => {
						if (!success || this.a.c.Window.state !== "screwed_to_floor") {return;}
						this.a.c.Window.state = "in_frame";
						to_chat`<span class='notice'>You pry the window into the frame.</span>`(
							user
						);
					});
					return true;
				}
			} else if (this.a.c.Window.state === "in_frame") {
				if (item.c.Tool.can_use("Crowbar", user)) {
					item.c.Tool.used("Crowbar");
					to_chat`<span class='notice'>You begin to lever the window out of the frame...</span>`(
						user
					);
					user.c.MobInventory.do_after({
						delay: this.a.c.Window.decon_speed * item.c.Tool.toolspeed,
						target: this.a,
					}).then((success) => {
						if (!success || this.a.c.Window.state !== "in_frame") {return;}
						this.a.c.Window.state = "screwed_to_floor";
						to_chat`<span class='notice'>You pry the window out of the frame.</span>`(
							user
						);
					});
					return true;
				} else if (item.c.Tool.can_use("Screwdriver", user)) {
					item.c.Tool.used("Screwdriver");
					to_chat`<span class='notice'>You begin to screw the window to the frame...</span>`(
						user
					);
					user.c.MobInventory.do_after({
						delay: this.a.c.Window.decon_speed * item.c.Tool.toolspeed,
						target: this.a,
					}).then((success) => {
						if (!success || this.a.c.Window.state !== "in_frame") {return;}
						this.a.c.Window.state = "screwed_to_frame";
						to_chat`<span class='notice'>You fasten the window to the frame.</span>`(
							user
						);
					});
					return true;
				}
			} else if (this.a.c.Window.state === "screwed_to_frame") {
				if (item.c.Tool.can_use("Screwdriver", user)) {
					item.c.Tool.used("Screwdriver");
					to_chat`<span class='notice'>You begin to unscrew the window from the frame...</span>`(
						user
					);
					user.c.MobInventory.do_after({
						delay: this.a.c.Window.decon_speed * item.c.Tool.toolspeed,
						target: this.a,
					}).then((success) => {
						if (!success || this.a.c.Window.state !== "screwed_to_frame") {return;}
						this.a.c.Window.state = "in_frame";
						to_chat`<span class='notice'>You unfasten the window from the frame.</span>`(
							user
						);
					});
					return true;
				}
			}
		}
		return prev();
	}

	make_debris(prev) {
		prev();
		const rod = new Atom(this.a.server, "stack_rods");
		rod.c.Stack.amount = this.a.c.Window.glass_amount;
		rod.loc = this.a.base_mover.fine_loc;
	}
}

ReinforcedWindow.depends = ["Window"];
ReinforcedWindow.loadBefore = ["Window"];

ReinforcedWindow.template = {
	vars: {
		components: {
			Window: {
				state: "screwed_to_frame",
				heat_resistance: 1600,
				glass_type: "rglass_sheet",
			},
			Destructible: {
				armor: {
					melee: 50,
					bullet: 0,
					laser: 0,
					energy: 0,
					bomb: 25,
					bio: 100,
					rad: 100,
					fire: 80,
					acid: 100,
				},
				max_integrity: 50,
			},
			Examine: {
				desc: "A window that is reinforced with metal rods.",
			},
		},
		name: "reinforced window",
		icon_state: "windowmetal",
		layer: layers.ABOVE_OBJ_LAYER,
	},
};

class DirectionalWindow extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.a.can_crosser_move_within = chain_func(
			this.a.can_crosser_move_within,
			this.can_crosser_move_within.bind(this)
		);
		this.a.can_be_uncrossed = chain_func(
			this.a.can_be_uncrossed,
			this.can_crosser_move_within.bind(this)
		);
		this.a.can_be_crossed = chain_func(
			this.a.can_be_crossed,
			this.can_be_crossed.bind(this)
		);
	}

	can_be_crossed(prev, crosser, dx, dy) {
		if (dx < 0 && this.a.dir & 4) {return prev();}
		if (dx > 0 && this.a.dir & 8) {return prev();}
		if (dy < 0 && this.a.dir & 1) {return prev();}
		if (dy > 0 && this.a.dir & 2) {return prev();}
		return true;
	}

	can_crosser_move_within(prev, atom, dx, dy) {
		if (this.a.let_pass_flags & atom.pass_flags) {return prev();}
		if (atom.density < 0 || this.a.density <= 0) {return prev();}
		if (dx > 0 && this.a.dir & 4) {
			const this_right = this.a.x + this.a.bounds_x + this.a.bounds_width;
			const other_right = atom.x + atom.bounds_x + atom.bounds_width;
			if (other_right <= this_right && other_right + dx > this_right)
				{return false;}
		}
		if (dx < 0 && this.a.dir & 8) {
			const this_left = this.a.x + this.a.bounds_x;
			const other_left = atom.x + atom.bounds_x;
			if (other_left >= this_left && other_left + dx < this_left) {return false;}
		}
		if (dy > 0 && this.a.dir & 1) {
			const this_top = this.a.y + this.a.bounds_y + this.a.bounds_height;
			const other_top = atom.y + atom.bounds_y + atom.bounds_height;
			if (other_top <= this_top && other_top + dy > this_top) {return false;}
		}
		if (dy < 0 && this.a.dir & 2) {
			const this_bottom = this.a.y + this.a.bounds_y;
			const other_bottom = atom.y + atom.bounds_y;
			if (other_bottom >= this_bottom && other_bottom + dy < this_bottom)
				{return false;}
		}
		return prev();
	}
}

DirectionalWindow.loadBefore = ["Window"];
DirectionalWindow.depends = ["Window"];

DirectionalWindow.template = {
	vars: {
		icon: "icons/obj/windows/",
	},
};

module.exports.components = { Window, ReinforcedWindow, DirectionalWindow };
