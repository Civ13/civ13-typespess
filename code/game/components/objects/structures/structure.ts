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
		if (this.moveable === true) {this.attack_movable(prev, item, user);}
		if (this.disassembleable === true) {this.attack_disassembleable(prev,item,user);}
	}

	attack_movable(prev: any, item: any, user: any) {
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
			else if (item.c.Tool.can_use("Crowbar", user)) {
				item.c.Tool.used("Crowbar");
				let verb = "into";
				const prev_state = this.a.c.Window.state;
				let new_state = "in_frame";
				if (this.a.c.Window.state === "in_floor") {verb = "out of"; new_state = "screwed_to_floor";}
				to_chat`<span class='notice'>You begin to lever the ${this.a} ${verb} the frame...</span>`(user);
				user.c.MobInventory.do_after({
					delay: this.a.c.Window.decon_speed * item.c.Tool.toolspeed,
					target: this.a,
				}).then((success: any) => {
					if ((prev_state === "screwed_to_floor" && (!success || this.a.c.Window.state !== "screwed_to_floor"))  ||
					(prev_state === "in_frame" && (!success || this.a.c.Window.state !== "in_frame")))
					{return false;}
					this.a.c.Window.state = new_state;
					to_chat`<span class='notice'>You pry the ${this.a} ${verb} the frame.</span>`(user);
				});
				return true;
			} else if (item.c.Tool.can_use("Wrench", user)) {
					item.c.Tool.used("Wrench");
					to_chat`<span class='notice'>You begin to disassemble the ${this.a}...</span>`(user);
					user.c.MobInventory.do_after({
						delay: this.decon_speed * item.c.Tool.toolspeed,
						target: this.a,
					}).then((success: any) => {
						if (!success || this.state !== "unscrewed_from_floor") {return;}
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
		return prev();
	}

	attack_disassembleable(prev: any, item: any, user: any) {
		if (has_component(item, "Tool")) {
			if (item.c.Tool.can_use("Wrench", user)) {
				item.c.Tool.used("Wrench");
				to_chat`<span class='notice'>You start disassembling the ${this.a}.</span>`(user);
				user.c.MobInventory.do_after({
					delay: 3000 * item.c.Tool.toolspeed,
					target: this.a,
				}).then((success: any) => {
					if (!success) {return;}
					this.a.c.Destructible.deconstruct(true);
				});
				return true;
			}
		} else if (has_component(item, this.frame_material)) {
			if (item.c.Stack.amount >= 1) {
				to_chat`<span class='notice'>You start adding ${item} to ${this.a}...</span>`(user);
				user.c.MobInventory.do_after({delay: 2000, target: this.a}).then((success: any) => {
					if (!success) {return;}
					const table = new Atom(this.a.server, "wood_table");
					table.loc = this.a.loc;
					item.c.Stack.use(1);
					this.a.destroy();
				});
			} else if (item.c.Stack.amount < 1) {
				to_chat`<span class='notice'>You need one sheet to do this!</span>`(user);
			}
		}
		return prev();
	}

	deconstruct(prev: any) {
		if (!this.a.loc) {return;}
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
