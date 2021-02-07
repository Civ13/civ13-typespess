
const {
	Component,
	Atom,
	to_chat,
	has_component,
	chain_func,
	dir_to,
} = require("./../../../code/game/server.js");
const layers = require("../../defines/layers.js");
const _ = require("underscore");
const { display_watts } = require("./helpers.js");

const cable_colors = {
	red: "#ff0000",
	yellow: "#ffff00",
	green: "#00aa00",
	blue: "#18558c",
	pink: "#ff3cc8",
	orange: "#ff8000",
	cyan: "#00ffff",
	white: "#ffffff",
};

class Cable extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		const match = /^([0-9]+)-([0-9]+)$/.exec(this.a.icon_state);
		const d1 = +match[1];
		const d2 = +match[2];
		if (
			![0, 1, 2, 4, 5, 6, 8, 9].includes(d1) ||
	![1, 2, 4, 5, 6, 8, 9, 10].includes(d2) ||
	d1 >= d2
		) {
			console.warn(new Error(`Invalid cable icon_state ${this.a.icon_state}`));
		}
		this.d1 = d1;
		this.d2 = d2;
		this.a.color = cable_colors[this.cable_color];

		this.cables = [];
		this.nodes = [];

		this.a.on("moved", this.connect.bind(this));

		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
		this.a.c.Destructible.deconstruct = chain_func(
			this.a.c.Destructible.deconstruct,
			this.deconstruct.bind(this)
		);
	}

	attack_by(prev, item, user) {
		if (
			has_component(item, "Tool") &&
	item.c.Tool.can_use("Wirecutters", user)
		) {
			item.c.Tool.used("Wirecutters");
			this.a.c.Destructible.deconstruct(true);
			return true;
		}
		if (has_component(item, "Tool") && item.c.Tool.can_use("Multitool", user)) {
			if (this.powernet && this.powernet.avail > 0)
				{to_chat`<span class='danger'>${display_watts(
					this.powernet.view_avail
				)} in power network.`(user);}
			else
				{to_chat`<span class='danger'>This cable is not powered.</span>`(user);}
			return true;
		}
		return prev();
	}

	deconstruct(prev) {
		if (!this.a.c.Destructible.no_deconstruct && this.a.loc) {
			const amount = this.d1 === 0 ? 1 : 2;
			const newstack = new Atom(this.a.server, {
				components: ["StackCable"],
				vars: {
					components: {
						StackCable: { cable_color: this.cable_color },
						Stack: { amount },
					},
				},
			});
			newstack.loc = this.a.fine_loc;
		}
		prev();
	}

	get_end(n) {
		// where n is 1 or 2 for d1 and d2
		if (n !== 1 && n !== 2)
			{throw new Error(`Invalid n value ${n}, should be 1 or 2`);}
		const dn = n === 2 ? this.d2 : this.d1;

		let x = this.a.x;
		let y = this.a.y;
		if (dn & 1) {y += this.a.bounds_y + this.a.bounds_height - 0.5;}
		if (dn & 2) {y += this.a.bounds_y - 0.5;}
		if (dn & 4) {x += this.a.bounds_x + this.a.bounds_width - 0.5;}
		if (dn & 8) {x += this.a.bounds_x - 0.5;}

		return [x, y];
	}

	disconnect() {
		for (const cable of this.cables) {
			const idx = cable.c.Cable.cables.indexOf(this.a);
			if (idx !== -1) {cable.c.Cable.cables.splice(idx, 1);}
		}
		for (const node of this.nodes) {
			if (node.c.PowerNode.cable !== this.a) {continue;}
			if (this.powernet) {this.powernet.nodes.delete(node);}
			if (node.powernet === this.powernet) {node.powernet = null;}
			node.c.PowerNode.cable = null;
		}
		const cables_to_recalculate = [...this.cables];
		this.cables.length = 0;
		this.nodes.length = 0;
		if (this.powernet) {this.powernet.cables.delete(this.a);}
		this.powernet = null;
		if (cables_to_recalculate.length < 2) {return;} // there's nothing that could possibly have gotten disconnected.
		// Alright let's repropogate all the cables!
		while (cables_to_recalculate.length > 1) {
			const stack = [cables_to_recalculate.pop()];
			const connected = new Set();
			while (stack.length) {
				// just a basic flood fill
				const next = stack.pop();
				connected.add(next);
				for (const cable of next.c.Cable.cables) {
					if (!connected.has(cable)) {stack.push(cable);}
				}
				const idx = cables_to_recalculate.indexOf(next);
				if (idx !== -1) {
					// Ooooh there's a loop. Let's take that out of the list.
					cables_to_recalculate.splice(idx, 1);
					if (!cables_to_recalculate.length) {return;} // Nice, we're done here.
				}
			}

		}
	}

	connect() {
		this.disconnect();
		if (!this.a.loc) {return;}
		let new_powernet = null;
		for (const loc of this.a.marginal_locs()) {
			for (const cable of loc.partial_contents) {
				if (this.does_connect_to(cable)) {
					if (this.cables.includes(cable)) {continue;}
					this.cables.push(cable);
					cable.c.Cable.cables.push(this.a);
					const other_powernet = cable.c.Cable.powernet;
					if (other_powernet === new_powernet) {continue;}
					if (!new_powernet) {
						new_powernet = other_powernet;
					} else if (other_powernet.cables.size > new_powernet.cables.size) {
						other_powernet.merge(new_powernet);
						new_powernet = other_powernet;
					} else {
						new_powernet.merge(other_powernet);
					}
				}
			}
		}
		if (this.d1 === 0) {
			for (const crosser of this.a.crosses()) {
				if (!has_component(crosser, "PowerNode")) {continue;}
				if (crosser.c.PowerNode.cable) {continue;}
				this.nodes.push(crosser);
				crosser.c.PowerNode.cable = this.a;
			}
		}
	}

	does_connect_to(other) {
		if (other === this.a) {return false;}
		if (!has_component(other, "Cable")) {return false;}
		for (const n_this of [1, 2]) {
			for (const n_other of [1, 2]) {
				const end_this = this.get_end(n_this);
				const end_other = other.c.Cable.get_end(n_other);
				if (
					Math.abs(end_this[0] - end_other[0]) < 0.001 &&
		Math.abs(end_this[1] - end_other[1]) < 0.0001
				)
					{return true;}
			}
		}
		return false;
	}
}

Cable.loadBefore = ["Destructible"];
Cable.depends = ["Destructible"];

Cable.template = {
	vars: {
		components: {
			Cable: {
				cable_color: "red",
			},
			Destructible: {
				max_integrity: 300,
			},
			Tangible: {
				anchored: true,
			},
			Examine: {
				desc:
		"A flexible, superconducting insulated cable for heavy-duty power transfer.",
			},
		},
		name: "power cable",
		icon: "icons/obj/power/cables/",
		icon_state: "0-1",
		layer: layers.WIRE_LAYER,
	},
};

Cable.update_map_instance = function (instobj) {
	instobj.client_atom.color =
	cable_colors[instobj.computed_vars.components.Cable.cable_color];
};

class StackCable extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.c.Stack.on("amount_changed", this.amount_changed.bind(this));
		this.amount_changed();
		if (this.cable_color === "random")
			{this.cable_color = _.sample([...Object.keys(cable_colors)]);}
		this.a.color = cable_colors[this.cable_color];
		this.a.c.Item.pre_attack = chain_func(
			this.a.c.Item.pre_attack,
			this.pre_attack.bind(this)
		);
		this.a.c.Item.inhand_icon_state = `coil_${this.cable_color}`;
	}

	pre_attack(prev, target, user) {
		if (this.a.c.Stack.amount < 1) {return true;}
		// The cable we will be merging with
		let target_cable = null;
		// Get the dir from turf to user, but if that's 0 (they're the same location) just use the user's dir
		let target_dir = dir_to(user.x - target.x, user.y - target.y);
		if (!target_dir) {
			target_dir = user.dir;
		}
		if (has_component(target, "Cable")) {target_cable = target;}

		if (
			target_cable &&
	target_cable.c.Cable.d1 === 0 &&
	target_dir !== target_cable.c.Cable.d2
		) {
			const orig_dir = target_cable.c.Cable.d2;
			const target_cable_loc = target_cable.fine_loc;
			target_cable.destroy();
			const new_cable = new Atom(this.a.server, {
				components: ["Cable"],
				vars: {
					components: {
						Cable: {
							cable_color: this.cable_color,
						},
					},
					icon_state: `${Math.min(orig_dir, target_dir)}-${Math.max(
						orig_dir,
						target_dir
					)}`,
				},
			});
			new_cable.loc = target_cable_loc;
			this.a.c.Stack.use(1);
			return true;
		}
	}

	amount_changed() {
		this.a.icon_state = `${this.a.template.vars.icon_state}${
			this.a.c.Stack.amount < 3 ? this.a.c.Stack.amount : ""
		}`;
		this.a.name = `cable ${this.a.c.Stack.amount < 3 ? "piece" : "coil"}`;
	}
}

StackCable.template = {
	vars: {
		components: {
			StackCable: {
				cable_color: "red",
			},
			Item: {
				materials: { metal: 10, glass: 5 },
				attack_verb: ["whipped", "lashed", "disciplined", "flogged"],
				conduct: true,
				size: 2,
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/righthand/",
				inhand_icon_state: "coil",
			},
			Stack: {
				novariants: true,
				max_amount: 30,
				merge_type: "StackCable",
				singular_name: "cable piece",
			},
			Tangible: {
				throw_force: 0,
				throw_speed: 3,
				throw_range: 5,
			},
			Examine: {
				desc: "A coil of insulated power cable",
			},
		},
		name: "cable coil",
		gender: "neuter",
		icon_state: "coil",
		icon: "icons/obj/misc/",
	},
};

StackCable.depends = ["Stack", "BeltItem"];
StackCable.loadBefore = ["Stack", "BeltItem"];

StackCable.update_map_instance = function (instobj) {
	const cc = instobj.computed_vars.components.StackCable.cable_color;
	if (cc !== "random") {instobj.client_atom.color = cable_colors[cc];}
	else {
		instobj.client_atom.color = "#000000";
	}
};

module.exports.templates = {
	cable: {
		components: ["Cable"],
		variants: [
			{
				type: "single",
				var_path: ["components", "Cable", "cable_color"],
				values: [...Object.keys(cable_colors), "random"],
				orientation: "vertical",
			},
			{
				type: "single",
				var_path: ["icon_state"],
				values: [
					"0-1",
					"0-2",
					"0-4",
					"0-8",
					"1-2",
					"4-8",
					"1-4",
					"2-4",
					"1-8",
					"2-8",
					"0-5",
					"0-6",
					"0-9",
					"0-10",
					"1-5",
					"1-6",
					"1-9",
					"1-10",
					"2-5",
					"2-6",
					"2-9",
					"2-10",
					"4-5",
					"4-6",
					"4-9",
					"4-10",
					"5-6",
					"5-8",
					"5-9",
					"5-10",
					"6-8",
					"6-9",
					"6-10",
					"8-9",
					"8-10",
					"9-10",
				],
				label: true,
				orientation: "horizontal",
				wrap: 4,
			},
		],
		tree_paths: ["structures/cable"],
	},
	stack_cable: {
		components: ["StackCable"],
		variants: [
			{
				type: "single",
				var_path: ["components", "StackCable", "cable_color"],
				values: [...Object.keys(cable_colors), "random"],
				orientation: "vertical",
			},
			{
				type: "single",
				var_path: ["components", "Stack", "amount"],
				values: [1, 2, 5, 10, 20, 30],
				label: true,
				orientation: "horizontal",
				wrap: 4,
			},
		],
		tree_paths: ["items/stack/rods"],
	},
};

module.exports.components = { Cable, StackCable };
module.exports.cable_colors = cable_colors;
