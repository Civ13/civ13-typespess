const { Component } = require("./../../../../../../../code/game/server.js");

class MetalSheet extends Component {
	constructor(atom, template) {
		super(atom, template);
	}
}
MetalSheet.depends = ["Stack"];
MetalSheet.loadBefore = ["Stack"];

MetalSheet.template = {
	vars: {
		components: {
			Stack: {
				full_size: 3,
				singular_name: "metal sheet",
				merge_type: "MetalSheet",
				novariants: false,
				recipes: [],
				material: "metal",
			},
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/righthand/",
				force: 5,
				attack_verb: [
					"bashed",
					"battered",
					"bludgeoned",
					"thrashed",
					"smashed",
				],
			},
			Tangible: {
				throw_force: 10,
				throw_speed: 1,
				throw_range: 3,
			},
		},
		name: "metal",
		desc: "Sheets made out of metal.",
		icon: "icons/obj/materials/",
		icon_state: "sheet-metal",
	},
};

class WoodSheet extends Component {
	constructor(atom, template) {
		super(atom, template);
	}
}

WoodSheet.depends = ["Stack"];
WoodSheet.loadBefore = ["Stack"];

WoodSheet.template = {
	vars: {
		components: {
			Stack: {
				full_size: 3,
				singular_name: "wooden plank",
				merge_type: "WoodSheet",
				novariants: true,
				recipes: [],
				material: "wood",
			},
			Item: {
				//Wood apparently has no inhands.
				force: 5,
				attack_verb: [
					"bashed",
					"battered",
					"bludgeoned",
					"thrashed",
					"smashed",
				],
			},
			Tangible: {
				throw_force: 10,
				throw_speed: 1,
				throw_range: 3,
			},
		},
		name: "wooden plank",
		desc: "One can only guess that this is a bunch of wood.",
		icon: "icons/obj/materials/",
		icon_state: "sheet-wood",
	},
};

class StrawSheet extends Component {
	constructor(atom, template) {
		super(atom, template);
	}
}

StrawSheet.depends = ["Stack"];
StrawSheet.loadBefore = ["Stack"];

StrawSheet.template = {
	vars: {
		components: {
			Stack: {
				full_size: 3,
				singular_name: "straw bale",
				merge_type: "StrawSheet",
				novariants: true,
				recipes: [],
				material: "straw",
			},
			Item: {
				//Wood apparently has no inhands.
				force: 1,
				attack_verb: [
					"flailed",
					"battered",
				],
			},
			Tangible: {
				throw_force: 3,
				throw_speed: 3,
				throw_range: 4,
			},
		},
		name: "straw bale",
		desc: "A bale of straw.",
		icon: "icons/obj/materials/",
		icon_state: "sheet-straw",
	},
};
class ClothSheet extends Component {
	constructor(atom, template) {
		super(atom, template);
	}
}

ClothSheet.depends = ["Stack"];
ClothSheet.loadBefore = ["Stack"];

ClothSheet.template = {
	vars: {
		components: {
			Stack: {
				full_size: 3,
				singular_name: "cloth",
				merge_type: "ClothSheet",
				novariants: false,
				recipes: [],
				material: "cloth",
			},
			Item: {
				//No inhands for cloth either
				force: 0,
				attack_verb: [
					"bashed",
					"battered",
					"bludgeoned",
					"thrashed",
					"smashed",
				],
			},
			Tangible: {
				throw_force: 0,
				throw_speed: 1,
				throw_range: 3,
			},
		},
		name: "cloth",
		desc: "Is it cotton? Linen? Denim? Burlap? Canvas? You can't tell.",
		icon: "icons/obj/materials/",
		icon_state: "sheet-cloth",
	},
};

class CardboardSheet extends Component {
	constructor(atom, template) {
		super(atom, template);
	}
}

CardboardSheet.depends = ["Stack"];
CardboardSheet.loadBefore = ["Stack"];

CardboardSheet.template = {
	vars: {
		components: {
			Stack: {
				full_size: 3,
				singular_name: "cardboard",
				merge_type: "CardboardSheet",
				novariants: true,
				recipes: [],
				material: "cardboard",
			},
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/righthand/",
				force: 0,
				attack_verb: [
					"bashed",
					"battered",
					"bludgeoned",
					"thrashed",
					"smashed",
				],
			},
			Tangible: {
				throw_force: 0,
				throw_speed: 1,
				throw_range: 3,
			},
		},
		name: "cardboard",
		desc: "Large sheets of card, like boxes folded flat.",
		icon: "icons/obj/materials/",
		icon_state: "sheet-wood2",
	},
};

class BoneSheet extends Component {
	constructor(atom, template) {
		super(atom, template);
	}
}

BoneSheet.depends = ["Stack"];
BoneSheet.loadBefore = ["Stack"];

BoneSheet.template = {
	vars: {
		components: {
			Stack: {
				full_size: 3,
				singular_name: "bone",
				merge_type: "BoneSheet",
				novariants: false,
				material: "bone",
			},
			Item: {
				//No inhands for bone either
				force: 7,
				attack_verb: [
					"bashed",
					"battered",
					"bludgeoned",
					"thrashed",
					"smashed",
				],
			},
			Tangible: {
				throw_force: 5,
				throw_speed: 1,
				throw_range: 3,
			},
		},
		name: "bones",
		desc: "Someone's been drinking their milk.",
		icon: "icons/obj/materials/",
		icon_state: "sheet-bone",
	},
};

class PlasticSheet extends Component {
	constructor(atom, template) {
		super(atom, template);
	}
}

PlasticSheet.depends = ["Stack"];
PlasticSheet.loadBefore = ["Stack"];

PlasticSheet.template = {
	vars: {
		components: {
			Stack: {
				full_size: 3,
				singular_name: "plastic",
				merge_type: "PlasticSheet",
				novariants: false,
				material: "plastic",
			},
			Item: {
				//No inhands for plastic either?
				force: 5,
				attack_verb: [
					"bashed",
					"battered",
					"bludgeoned",
					"thrashed",
					"smashed",
				],
			},
			Tangible: {
				throw_force: 7,
				throw_speed: 1,
				throw_range: 3,
			},
		},
		name: "plastic",
		desc: "Compress dinosaur over millions of years, then refine, split and mold, and voila! You have plastic.",
		icon: "icons/obj/materials/",
		icon_state: "sheet-plastic",
	},
};

class PaperframeSheet extends Component {
	constructor(atom, template) {
		super(atom, template);
	}
}

PaperframeSheet.depends = ["Stack"];
PaperframeSheet.loadBefore = ["Stack"];

PaperframeSheet.template = {
	vars: {
		components: {
			Stack: {
				full_size: 3,
				singular_name: "paper frame",
				merge_type: "PaperframeSheet",
				novariants: false,
				material: "paper",
			},
			Item: {
				//No inhands for paperframes either?
				force: 3,
				attack_verb: [
					"bashed",
					"battered",
					"bludgeoned",
					"thrashed",
					"smashed",
				],
			},
			Tangible: {
				throw_force: 3,
				throw_speed: 1,
				throw_range: 3,
			},
		},
		name: "paper frames",
		desc: "A thin wooden frame with paper attached.",
		icon: "icons/obj/materials/",
		icon_state: "sheet-plasteel",
	},
};

module.exports.components = {
	MetalSheet,
	WoodSheet,
	ClothSheet,
	StrawSheet,
	CardboardSheet,
	BoneSheet,
	PlasticSheet,
	PaperframeSheet,
};
