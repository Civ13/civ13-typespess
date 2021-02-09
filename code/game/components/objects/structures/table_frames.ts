export{};
const {
	Component,
	has_component,
	Atom,
	chain_func,
	to_chat,
} = require("./../../../../../code/game/server.js");
const layers = require("../../../../defines/layers.js");

class TableFrame extends Component {
	constructor(atom:any, template:any) {
		super(atom, template);

		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
		this.a.c.Destructible.deconstruct = chain_func(
			this.a.c.Destructible.deconstruct,
			this.deconstruct.bind(this)
		);
	}

}

TableFrame.one_per_tile = true;

TableFrame.depends = ["Destructible", "Structure"];
TableFrame.loadBefore = ["Destructible", "Structure"];

TableFrame.template = {
	vars: {
		components: {
			TableFrame: {
				frame_material: "stack_rods",
				frame_material_amount: 2,
			},
			Destructible: {
				max_integrity: 100,
			},
			Structure: {
				disassemblable: true,
				moveable: true,
			},
			Tangible: {
				anchored: true,
			},
			Examine: {
				desc:
		"Four metal legs with four framing rods for a table. You could easily pass through this.",
			},
		},
		name: "table frame",
		icon: "icons/obj/structures/tables/",
		icon_state: "table_frame",
		density: false,
		layer: layers.PROJECTILE_HIT_THRESHHOLD_LAYER,
	},
};

module.exports.templates = {
	table_frame: {
		components: ["TableFrame"],
		tree_paths: ["structures/table_frame"],
	},
	wood_table_frame: {
		components: ["TableFrame"],
		vars: {
			components: {
				TableFrame: {
					frame_material: "wood_sheet",
				},
				Examine: {
					desc:
			"Four wooden legs with four framing wooden rods for a wooden table. You could easily pass through this.",
				},
			},
			name: "wooden table frame",
			icon: "icons/obj/structures/tables/",
			icon_state: "wood_frame",
		},
		tree_paths: ["structures/table_frame/wood"],
	},
};

module.exports.components = { TableFrame };
