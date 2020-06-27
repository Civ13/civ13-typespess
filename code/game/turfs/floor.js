/* eslint-disable require-jsdoc */
/* eslint-disable camelcase */
/* eslint-disable max-len */

const {
	Component,
	chain_func,
	has_component,
} = require("./../../../code/game/server.js");

const layers = require("../../defines/layers.js");

class FloorCover extends Component {
	constructor(atom, template) {
		super(atom, template);

		this.a.once("moved", () => {
			if (!this.icon_group) {
				return;
			}
			if (!this.a.loc) {
				return;
			}
		});

		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
	}

	attack_by(prev, item, user) {
		if (this.try_pry(item, user)) {
			return true;
		}
		return prev();
	}

	try_pry(item, user) {
		if (has_component(item, "Tool") && item.c.Tool.can_use("Crowbar")) {
			item.c.Tool.used("Crowbar");
			this.remove_tile({ user });
		}
	}
}

FloorCover.depends = ["FloorBase"];
FloorCover.loadBefore = ["FloorBase"];

FloorCover.template = {
	vars: {
		components: {
			FloorCover: {
				floor_tile: "dirt",
				icon_group: "floor",
			},
			FloorBase: {
				broken_states: [
					"damaged1",
					"damaged2",
					"damaged3",
					"damaged4",
					"damaged5",
				],
				burnt_states: ["floorscorched1", "floorscorched2"],
			},
		},
		layer: layers.FLOOR_LAYER,
		icon: "icons/turf/floors.png",
	},
};

module.exports.components = { FloorCover };
