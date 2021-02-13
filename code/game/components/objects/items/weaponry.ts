export{};
const { Component } = require("./../../../../../code/game/server.js");

class BaseballBat extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
	}
}

BaseballBat.depends = ["Item"];
BaseballBat.loadBefore = ["Item"];

BaseballBat.template = {
	vars: {
		components: {
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand_weapons/",
				inhand_rhand_icon: "icons/mob/inhands/righthand_weapons/",
				inhand_icon_state: "baseball_bat",
				size: 5,
				force: 10,
				attack_verb: ["beat", "smacked"],
			},
			Tangible: {
				throw_force: 12,
			},
			Examine: {
				desc: "There ain't a skull in the league that can withstand a swatter.",
			},
		},
		icon: "icons/obj/misc/",
		icon_state: "baseball_bat",
		name: "baseball bat",
	},
};


module.exports.components = { BaseballBat };
