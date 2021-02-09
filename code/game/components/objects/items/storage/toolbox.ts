export{};
const { Component} = require("./../../../../../../code/game/server.js");


class Toolbox extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		if (this.has_latches) {
			let latches = "single_latch";
			if (Math.random() < 0.1) {
				latches = "double_latch";
				if (Math.random() < 0.01) {
					latches = "triple_latch";
				}
			}
			this.a.overlays.toolbox_latches = latches;
		}
	}
}

Toolbox.depends = ["StorageItem"];
Toolbox.loadBefore = ["StorageItem"];

Toolbox.template = {
	vars: {
		components: {
			Toolbox: {
				has_latches: true,
			},
			StorageItem: {
				rustle_jimmies: false,
			},
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/righthand/",
				inhand_icon_state: "toolbox_red",
				force: 12,
				size: 4,
				attack_verb: ["robusted"],
				hitsound: "sound/weapons/smash.ogg",
			},
			Tangible: {
				throw_force: 12,
				throw_speed: 2,
				throw_range: 7,
			},
			Examine: {
				desc: "Danger. Very robust.",
			},
		},
		icon_state: "toolbox_red",
		name: "toolbox",
	},
};

module.exports.components = { Toolbox };
