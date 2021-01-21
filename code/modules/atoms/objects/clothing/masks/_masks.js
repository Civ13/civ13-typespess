const { Component } = require("./../../../../../../code/game/server.js");

class MaskItem extends Component {
	constructor(atom, template) {
		super(atom, template);
	}
}

MaskItem.template = {
	vars: {
		components: {
			MaskItem: {
				worn_icon: "icons/mob/worn/masks.png",
				worn_icon_state: null, // If null, inherits from icon_state
				hide_face: false,
				internals_mask: true,
				adjusted: false,
			},
		},
		icon: "icons/mob/under/masks.png",
	},
};

MaskItem.depends = ["WearableItem"];
MaskItem.loadBefore = ["WearableItem"];

module.exports.components = { MaskItem };
