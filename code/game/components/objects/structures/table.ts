export{};
const {Component, has_component, chain_func, to_chat, Atom} = require("./../../../../../code/game/server.js");
const pass_flags = require("../../../../defines/pass_flags.js");
const layers = require("../../../../defines/layers.js");

class Table extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.can_be_crossed = chain_func(this.a.can_be_crossed, this.can_be_crossed.bind(this));
		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
		this.a.c.Destructible.deconstruct = chain_func(this.a.c.Destructible.deconstruct, this.deconstruct.bind(this));
	}

	can_be_crossed(prev: any, mover: any) {
		for (const crosser of mover.crosses()) {
			if (has_component(crosser, "Table")) {return true;}
		}
		return prev();
	}

	attack_by(prev: any, item: any, user: any, e: any) {
		if (has_component(item, "Tool")) {
			if (item.c.Tool.can_use("Wrench", user) && this.deconstruction_ready) {
				item.c.Tool.used("Wrench");
				to_chat`<span class='notice'>You start deconstructing ${this.a}...</span>`(user);
				user.c.MobInventory.do_after({
					delay: 4000 * item.c.Tool.toolspeed,
					target: this.a,
				}).then((success: any) => {
					if (!success) {return;}
					this.a.c.Destructible.deconstruct(true, true);
				});
				return true;
			} else if (item.c.Tool.can_use("Screwdriver", user) && this.deconstruction_ready) {
				item.c.Tool.used("Screwdriver");
				to_chat`<span class='notice'>You start disassembling ${this.a}...</span>`(user);
				user.c.MobInventory.do_after({
					delay: 2000 * item.c.Tool.toolspeed,
					target: this.a,
				}).then((success: any) => {
					if (!success) {return;}
					this.a.c.Destructible.deconstruct(true, false);
				});
				return true;
			} else if (item.c.Tool.can_use("WeldingTool", user) && this.reinforced) {
				item.c.Tool.used("WeldingTool");
				if (this.deconstruction_ready) {
					to_chat`<span class='notice'>You start strengthening the ${this.a}...</span>`(user);
					user.c.MobInventory.do_after({
						delay: 5000 * item.c.Tool.toolspeed,
						target: this.a,
					}).then((success: any) => {
						if (!success) {return;}
						to_chat`<span class='notice'>You strengthen the ${this.a}.</span>`(user);
						this.deconstruction_ready = false;
					});
				} else {
					to_chat`<span class='notice'>You start weakening the ${this.a}...</span>`(user);
					user.c.MobInventory.do_after({
						delay: 5000 * item.c.Tool.toolspeed,
						target: this.a,
					}).then((success: any) => {
						if (!success) {return;}
						to_chat`<span class='notice'>You weaken the ${this.a}.</span>`(user);
						this.deconstruction_ready = true;
					});
				}
				return true;
			}
		} else if (item.c.Item.slot && item.c.Item.slot.can_unequip()) {
			item.glide_size = 0;
			item.loc = this.a.base_mover.fine_loc;
			const dx = Math.min(Math.max(e.x - 0.5, -0.5), 0.5);
			const dy = Math.min(Math.max(e.y - 0.5, -0.5), 0.5);
			item.move(dx, dy, "placement");
			return true;
		}
	}

	deconstruct(prev: any, disassembled: any, wrench_disassembly = false) {
		if (!this.a.loc) {return;}
		if (!this.a.c.Destructible.no_deconstruct) {
			if (wrench_disassembly) {
				const frame_template = this.a.server.templates[this.frame];
				this.a.server.process_template(frame_template);
				const frame_mat = new Atom(this.a.server, frame_template.vars.components.TableFrame.frame_material);
				frame_mat.c.Stack.amount = 2;
				frame_mat.loc = this.a.base_mover.loc;
			} else {
				const new_frame = new Atom(this.a.server, this.frame);
				new_frame.loc = this.a.base_mover.loc;
			}
			const table_mat = new Atom(this.a.server, this.table_material);
			table_mat.c.Stack.amount = 1;
			table_mat.loc = this.a.base_mover.loc;
			this.a.destroy();
		}
		prev();
	}
}

Table.one_per_tile = true;

Table.depends = ["Destructible", "Climbable"];
Table.loadBefore = ["Destructible", "TGSmooth", "Climbable"];

Table.template = {
	vars: {
		components: {
			Table: {
				deconstruction_ready: true,
				reinforced: false,
				frame: "table_frame",
				table_material: "metal_sheet",
			},
			Smooth: {
				smooth_with: "table",
			},
			SmoothGroup: {
				groups: ["table"],
			},
			Destructible: {
				max_integrity: 100,
				integrity_failure: 30,
			},
			Tangible: {
				anchored: true,
			},
			Examine: {
				desc: "A square piece of metal standing on four metal legs. It can not move.",
			},
		},
		name: "table",
		icon: "icons/obj/structures/tables/",
		icon_state: "table",
		let_pass_flags: pass_flags.LETPASSTHROW | pass_flags.PASSTABLE,
		layer: layers.TABLE_LAYER,
		density: 1,
	},
};

module.exports.components = {Table};
