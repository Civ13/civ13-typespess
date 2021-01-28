const { Component } = require("./../../../../../../code/game/server.js");

class Analyzer extends Component {
	constructor(atom, template) {
		super(atom, template);
	}
}

Analyzer.loadBefore = ["Item"];
Analyzer.depends = ["Item"];

Analyzer.template = {
	vars: {
		components: {
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_lhand_icon: "icons/mob/inhands/righthand/",
				inhand_icon_state: "analyzer",
				size: 2,
				no_bludgeon: true,
			},
			Tangible: {
				throw_force: 0,
				throw_speed: 3,
				throw_range: 7,
			},
			Examine: {
				desc:
		"A hand-held environmental scanner which reports current gas levels.",
			},
		},
		name: "analyzer",
		icon: "icons/obj/device/",
		icon_state: "analyzer",
	},
};


module.exports.components = { Analyzer };
