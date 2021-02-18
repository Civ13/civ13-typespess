export{};
const {Component, has_component, Atom, Sound, chain_func, to_chat} = require("./../../../../../code/game/server.js");

class Structure extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);

		this.disassemblable = true;
		this.moveable = false;
		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
		this.a.c.Destructible.deconstruct = chain_func(this.a.c.Destructible.deconstruct, this.deconstruct.bind(this));
	}

	// eslint-disable-next-line complexity
	attack_by(prev: any, item: any, user: any) {
		if (this.moveable === true) {
			if (has_component(item, "Tool")) {
				if (item.c.Tool.can_use("WeldingTool")) {
					if (this.a.c.Destructible.obj_integrity >= this.a.c.Destructible.max_integrity) {
						to_chat`<span class='warning'>The ${this.a} is already in good condition!</span>`(user);
						return true;
					}
					item.c.Tool.used("WeldingTool");
					to_chat`<span class='notice'>You begin repairing the ${this.a}</span>`(user);
					user.c.MobInventory.do_after({
						delay: 4000 * item.c.Tool.toolspeed,
						target: this.a,
					}).then((success: any) => {
						if (!success) {
							return;
						}
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
						to_chat`<span class='notice'>You begin to unscrew the window from the floor...</span>`(user);
						user.c.MobInventory.do_after({
							delay: this.decon_speed * item.c.Tool.toolspeed,
							target: this.a,
						}).then((success: any) => {
							if (!success || this.state !== "screwed_to_floor") {
								return;
							}
							this.state = "unscrewed_from_floor";
							to_chat`<span class='notice'>You unfasten the window from the floor...</span>`(user);
						});
						return true;
					}
				} else if (this.state === "unscrewed_from_floor") {
					if (item.c.Tool.can_use("Screwdriver", user)) {
						item.c.Tool.used("Screwdriver");
						to_chat`<span class='notice'>You begin to screw the window to the floor...</span>`(user);
						user.c.MobInventory.do_after({
							delay: this.decon_speed * item.c.Tool.toolspeed,
							target: this.a,
						}).then((success: any) => {
							if (!success || this.state !== "unscrewed_from_floor") {
								return;
							}
							this.state = "screwed_to_floor";
							to_chat`<span class='notice'>You fasten the window to the floor...</span>`(user);
						});
						return true;
					} else if (item.c.Tool.can_use("Wrench", user)) {
						item.c.Tool.used("Wrench");
						to_chat`<span class='notice'>You begin to disassemble the ${this.a}...</span>`(user);
						user.c.MobInventory.do_after({
							delay: this.decon_speed * item.c.Tool.toolspeed,
							target: this.a,
						}).then((success: any) => {
							if (!success || this.state !== "unscrewed_from_floor") {
								return;
							}
							new Sound(this.a.server, {
								path: "sound/items/Deconstruct.ogg",
								volume: 0.5,
								vary: true,
							}).emit_from(this.a);
							to_chat`<span class='notice'>You successfully disassemble the ${this.a}.</span>`(user);
							this.a.c.Destructible.deconstruct(true);
						});
						return true;
					}
				}
			}
			return prev();
		}
		if (this.disassembleable === true) {
			if (has_component(item, "Tool")) {
				if (item.c.Tool.can_use("Wrench", user)) {
					item.c.Tool.used("Wrench");
					to_chat`<span class='notice'>You start disassembling the ${this.a}.</span>`(user);
					user.c.MobInventory.do_after({
						delay: 3000 * item.c.Tool.toolspeed,
						target: this.a,
					}).then((success: any) => {
						if (!success) {
							return;
						}
						this.a.c.Destructible.deconstruct(true);
					});
					return true;
				}
			} else if (has_component(item, "MetalSheet") && this.frame_material === "stack_rods") {
				if (item.c.Stack.amount >= 1) {
					to_chat`<span class='notice'>You start adding ${item} to ${this.a}...</span>`(user);
					user.c.MobInventory.do_after({delay: 2000, target: this.a}).then((success: any) => {
						if (!success) {
							return;
						}
						const table = new Atom(this.a.server, "table");
						table.loc = this.a.loc;
						item.c.Stack.use(1);
						this.a.destroy();
					});
				} else if (item.c.Stack.amount < 1) {
					to_chat`<span class='notice'>You need one sheet of metal to do this!</span>`(user);
				}
			} else if (has_component(item, "WoodSheet") && this.frame_material === "wood_sheet") {
				if (item.c.Stack.amount >= 1) {
					to_chat`<span class='notice'>You start adding ${item} to ${this.a}...</span>`(user);
					user.c.MobInventory.do_after({delay: 2000, target: this.a}).then((success: any) => {
						if (!success) {
							return;
						}
						const table = new Atom(this.a.server, "wood_table");
						table.loc = this.a.loc;
						item.c.Stack.use(1);
						this.a.destroy();
					});
				} else if (item.c.Stack.amount < 1) {
					to_chat`<span class='notice'>You need one sheet of wood to do this!</span>`(user);
				}
			}
			return prev();
		}
	}

	deconstruct(prev: any) {
		if (!this.a.loc) {
			return;
		}
		if (!this.a.c.Destructible.no_deconstruct) {
			const mat = new Atom(this.a.server, this.frame_material);
			mat.c.Stack.amount = this.frame_material_amount;
			mat.loc = this.a.base_mover.loc;
			this.a.destroy();
		}
		prev();
	}
}

Structure.one_per_tile = true;

Structure.depends = ["Destructible"];
Structure.loadBefore = ["Destructible"];

module.exports.components = {Structure};
