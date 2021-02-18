export{};
const {Component} = require("./../../../../../../code/game/server.js");

class SuitItem extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
	}
}

SuitItem.template = {
	vars: {
		components: {
			SuitItem: {
				worn_icon: "icons/mob/worn/suit/",
				worn_icon_state: "biker", // If null, inherits from icon_state
				suit_storage_blacklist: [], // components you can or can't put in the suit storage slot
				suit_storage_whitelist: [],
				blood_overlay_type: "suit", //currently useless
				toggle_name: null, //also useless
				siemens_coefficient: 0,
			},
		},
		icon: "icons/mob/under/suits/",
		icon_state: "biker",
		name: "suit",
	},
};

SuitItem.depends = ["WearableItem"];
SuitItem.loadBefore = ["WearableItem"];

module.exports.components = {SuitItem};
