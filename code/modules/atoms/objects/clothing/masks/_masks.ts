const { Component } = require("./../../../../../../code/game/server.js");

class MaskItem extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
	}
}

MaskItem.template = {
	vars: {
		components: {
			MaskItem: {
				worn_icon: "icons/mob/worn/mask/",
				worn_icon_state: "balaclava", // If null, inherits from icon_state
				hide_face: false,
				internals_mask: true,
				adjusted: false,
			},
		},
		icon: "icons/mob/under/masks/",
		icon_state: "balaclava"
	},
};

MaskItem.depends = ["WearableItem"];
MaskItem.loadBefore = ["WearableItem"];

module.exports.components = { MaskItem };
