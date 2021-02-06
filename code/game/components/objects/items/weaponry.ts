const { Component } = require("./../../../../../code/game/server.ts");

class BaseballBat extends Component {
	constructor(atom, template) {
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

module.exports.templates = {
	baseball_bat: {
		components: ["BaseballBat"],
		tree_paths: ["items/melee/baseball_bat"],
	},
};

module.exports.components = { BaseballBat };
