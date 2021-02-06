const { Component } = require("./../../../../../../code/game/server.js");

class HeadBodyPart extends Component {
	constructor(atom, template) {
		super(atom, template);
	}
}

HeadBodyPart.depends = ["BodyPart"];
HeadBodyPart.loadBefore = ["BodyPart"];

HeadBodyPart.template = {
	vars: {
		components: {
			BodyPart: {
				body_zone: "head",
				max_damage: 200,
				should_draw_gender: true,
			},
			Item: {
				size: 4, // Quite a heft load
			},
			Tangible: {
				throw_range: 2, // No head bowling
			},
			Examine: {
				desc:
		"Didn't make sense not to live for fun, your brain gets smart but your head gets dumb.",
			},
		},
		name: "head",
		icon_state: "head",
	},
};

module.exports.components = { HeadBodyPart };
