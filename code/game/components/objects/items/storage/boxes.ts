export{};
const { Component} = require("./../../../../../../code/game/server.js");

class Box extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		if (this.illustration) {
			this.a.overlays.illustration = this.illustration;
		}
	}
}

Box.depends = ["StorageItem"];
Box.loadBefore = ["StorageItem"];

Box.template = {
	vars: {
		components: {
			Box: {
				illustration: "writing",
			},
			StorageItem: {
				max_size: 2,
				max_combined_size: 14,
				storage_slots: 7,
			},
			Item: {
				inhand_icon_state: "syringe_kit",
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/righthand/",
				size: 3,
			},
			Examine: {
				desc: "It's just an ordinary box.",
			},
		},
		name: "box",
		icon: "icons/obj/storage/",
		icon_state: "box",
	},
};

module.exports.components = { Box };
