export{};
const { Component } = require("./../../../../../../code/game/server.js");

class Multitool extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);

		this.buffer = null; // Simple machine buffer for device linkage
	}
}

Multitool.loadBefore = ["Tool"];
Multitool.depends = ["Tool"];

Multitool.template = {
	vars: {
		components: {
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/righthand/",
				force: 5,
				size: 2,
				hitsound: "sound/weapons/tap.ogg",
			},
			Examine: {
				desc:
		"Used for pulsing wires to test which to cut. Not recommended by doctors.",
			},
		},
		name: "multitool",
		icon_state: "geiger_off",
		icon: "icons/obj/device/",
	},
};


module.exports.components = { Multitool };
