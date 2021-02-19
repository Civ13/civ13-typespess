export{};
const {Component, chain_func} = require("./../../../../../code/game/server.js");
const layers = require("../../../../defines/layers.js");

class TableFrame extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);

		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
		this.a.c.Destructible.deconstruct = chain_func(this.a.c.Destructible.deconstruct, this.deconstruct.bind(this));
	}
}

TableFrame.one_per_tile = true;

TableFrame.depends = ["Destructible", "Structure"];
TableFrame.loadBefore = ["Destructible", "Structure"];

TableFrame.template = {
	vars: {
		components: {
			TableFrame: {
				frame_material: "MetalSheet",
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
				desc: "Four metal legs with four framing rods for a table. You could easily pass through this.",
			},
		},
		name: "table frame",
		icon: "icons/obj/structures/tables/",
		icon_state: "table_frame",
		density: false,
		layer: layers.PROJECTILE_HIT_THRESHHOLD_LAYER,
	},
};

module.exports.components = {TableFrame};
