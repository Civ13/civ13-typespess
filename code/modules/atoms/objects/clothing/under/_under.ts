export{};
const {Component} = require("./../../../../../../code/game/server.js");

class UniformItem extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
	}
}
UniformItem.template = {
	vars: {
		components: {
			UniformItem: {
				worn_icon: "icons/mob/worn/uniform/",
				worn_icon_state: "adam",
				can_adjust: true, //Useless until alt styles are implemented
				alt_covers_torso: false, //Also useless until alt styles
			},
			WearableItem: {
				permeability_coefficient: 0.9,
				body_parts_covered: ["torso", "groin", "l_leg", "r_leg", "l_arm", "r_arm"],
			},
		},
		icon: "icons/mob/under/uniforms/",
		icon_state: "adam",
		name: "under",
	},
};

UniformItem.depends = ["WearableItem"];
UniformItem.loadBefore = ["WearableItem"];

module.exports.components = {UniformItem};
