export{};
const { Component } = require("./../../../../../../code/game/server.js");

class TorsoBodyPart extends Component {}
TorsoBodyPart.depends = ["BodyPart"];
TorsoBodyPart.loadBefore = ["BodyPart"];
TorsoBodyPart.template = {
	vars: {
		components: {
			BodyPart: {
				body_zone: "torso",
				max_damage: 200,
				should_draw_gender: true,
			},
			Examine: {
				desc: "It's impolite to stare at a person's torso.",
			},
		},
		name: "torso",
		icon_state: "torso",
	},
};

class GroinBodyPart extends Component {}
GroinBodyPart.depends = ["BodyPart"];
GroinBodyPart.loadBefore = ["BodyPart"];
GroinBodyPart.template = {
	vars: {
		components: {
			BodyPart: {
				body_zone: "groin",
				max_damage: 200,
				should_draw_gender: true,
			},
			Examine: {
				desc: "It's impolite to stare at a person's groin.",
			},
		},
		name: "groin",
		icon_state: "groin",
	},
};

class LArmBodyPart extends Component {}
LArmBodyPart.depends = ["BodyPart"];
LArmBodyPart.loadBefore = ["BodyPart"];
LArmBodyPart.template = {
	vars: {
		components: {
			BodyPart: {
				body_zone: "l_arm",
				max_damage: 50,
			},
			Item: {
				attack_verb: ["slapped", "punched"],
			},
			Examine: {
				desc:
		"Did you know that the word 'sinister' stems originally from the" +
		"Latin 'sinestra' (left hand), because the left hand was supposed to" +
		"be possessed by the devil? This arm appears to be possessed by no" +
		"one though.",
			},
		},
		name: "left arm",
		icon_state: "l_arm",
	},
};

class LHandBodyPart extends Component {}
LHandBodyPart.depends = ["BodyPart"];
LHandBodyPart.loadBefore = ["BodyPart"];
LHandBodyPart.template = {
	vars: {
		components: {
			BodyPart: {
				body_zone: "l_hand",
				max_damage: 40,
			},
			Item: {
				attack_verb: ["slapped", "punched"],
			},
			Examine: {
				desc:
		"Did you know that the word 'sinister' stems originally from the" +
		"Latin 'sinestra' (left hand), because the left hand was supposed to" +
		"be possessed by the devil? This arm appears to be possessed by no" +
		"one though.",
			},
		},
		name: "left hand",
		icon_state: "l_hand",
	},
};
class RArmBodyPart extends Component {}
RArmBodyPart.depends = ["BodyPart"];
RArmBodyPart.loadBefore = ["BodyPart"];
RArmBodyPart.template = {
	vars: {
		components: {
			BodyPart: {
				body_zone: "r_arm",
				max_damage: 50,
			},
			Item: {
				attack_verb: ["slapped", "punched"],
			},
			Examine: {
				desc:
		"Over 87% of humans are right handed. That figure is much lower" +
		"among humans missing their right arm.",
			},
		},
		name: "right arm",
		icon_state: "r_arm",
	},
};

class RHandBodyPart extends Component {}
RHandBodyPart.depends = ["BodyPart"];
RHandBodyPart.loadBefore = ["BodyPart"];
RHandBodyPart.template = {
	vars: {
		components: {
			BodyPart: {
				body_zone: "r_hand",
				max_damage: 40,
			},
			Item: {
				attack_verb: ["slapped", "punched"],
			},
			Examine: {
				desc:
		"Over 87% of humans are right handed. That figure is much lower" +
		"among humans missing their right arm.",
			},
		},
		name: "right hand",
		icon_state: "r_hand",
	},
};

class LLegBodyPart extends Component {}
LLegBodyPart.depends = ["BodyPart"];
LLegBodyPart.loadBefore = ["BodyPart"];
LLegBodyPart.template = {
	vars: {
		components: {
			BodyPart: {
				body_zone: "l_leg",
				max_damage: 50,
			},
			Item: {
				attack_verb: ["kicked", "stomped"],
			},
			Examine: {
				desc:
		"Some athletes prefer to tie their left shoelaces first for good" +
		"luck. In this instance, it probably would not have helped.",
			},
		},
		name: "left leg",
		icon_state: "l_leg",
	},
};

class LFootBodyPart extends Component {}
LFootBodyPart.depends = ["BodyPart"];
LFootBodyPart.loadBefore = ["BodyPart"];
LFootBodyPart.template = {
	vars: {
		components: {
			BodyPart: {
				body_zone: "l_foot",
				max_damage: 40,
			},
			Item: {
				attack_verb: ["kicked", "stomped"],
			},
			Examine: {
				desc:
		"Some athletes prefer to tie their left shoelaces first for good" +
		"luck. In this instance, it probably would not have helped.",
			},
		},
		name: "left foot",
		icon_state: "l_foot",
	},
};

class RLegBodyPart extends Component {}
RLegBodyPart.depends = ["BodyPart"];
RLegBodyPart.loadBefore = ["BodyPart"];
RLegBodyPart.template = {
	vars: {
		components: {
			BodyPart: {
				body_zone: "r_leg",
				max_damage: 50,
			},
			Item: {
				attack_verb: ["kicked", "stomped"],
			},
			Examine: {
				desc:
		"You put your right leg in, your right leg out. In, out, in, out," +
		"shake it all about. And apparently then it detaches.",
			},
		},
		name: "right leg",
		icon_state: "r_leg",
	},
};

class RFootBodyPart extends Component {}
RFootBodyPart.depends = ["BodyPart"];
RFootBodyPart.loadBefore = ["BodyPart"];
RFootBodyPart.template = {
	vars: {
		components: {
			BodyPart: {
				body_zone: "r_foot",
				max_damage: 40,
			},
			Item: {
				attack_verb: ["kicked", "stomped"],
			},
			Examine: {
				desc:
		"You put your right leg in, your right leg out. In, out, in, out," +
		"shake it all about. And apparently then it detaches.",
			},
		},
		name: "right foot",
		icon_state: "r_foot",
	},
};
module.exports.components = {
	TorsoBodyPart,
	GroinBodyPart,
	LArmBodyPart,
	RArmBodyPart,
	LLegBodyPart,
	RLegBodyPart,
	LHandBodyPart,
	RHandBodyPart,
	LFootBodyPart,
	RFootBodyPart,
};
