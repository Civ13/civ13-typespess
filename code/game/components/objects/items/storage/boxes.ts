export{};
const { Component} = require("./../../../../../../code/game/server.js");

//TODO: Folding up boxes

class Box extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		if (this.illustration) {
			this.a.overlays.illustration = this.illustration;
		}
	}
}

Box.depends = ["StorageItem"];
Box.loadBefore = ["StorageItem"];

Box.template = {
	vars: {
		components: {
			Box: {
				illustration: "writing",
			},
			StorageItem: {
				max_size: 2,
				max_combined_size: 14,
				storage_slots: 7,
			},
			Item: {
				inhand_icon_state: "syringe_kit",
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/righthand/",
				size: 3,
			},
			Examine: {
				desc: "It's just an ordinary box.",
			},
		},
		name: "box",
		icon: "icons/obj/storage/",
		icon_state: "box",
	},
};

module.exports.templates = {
	box: {
		components: ["Box", "StorageItem"],
		tree_paths: ["items/storage/box"],
	},
	survival_box: {
		parent_template: "box",
		vars: {
			components: {
				Examine: {
					desc: "It contains essential survival equipment.",
				},
				StorageItem: {
					pop_contents: ["mask_breath"],
					pop_contents_nr: [1]
				},
			},
			name: "survival box",
		},
		tree_paths: ["items/storage/box/survival"],
	},
	beaker_box: {
		parent_template: "box",
		vars: {
			components: {
				Box: {
					illustration: "beaker",
				},
				Examine: {
					desc: "This contains beakers, apparently.",
				},
				StorageItem: {
					pop_contents: ["beaker"],
					pop_contents_nr: [7]
				},
			},
			name: "box of beakers",
		},
		tree_paths: ["items/storage/box/beakers"],
	},
	light_bulbs_box: {
		parent_template: "box",
		vars: {
			components: {
				Box: {
					illustration: "light",
				},
				Examine: {
					desc:
			"This box is shaped on the inside so that only light tubes and bulbs fit.",
				},
				StorageItem: {
					max_combined_size: 21,
					storage_slots: 21,
					can_hold: ["LightTube"],
					use_to_pickup: true,
					pop_contents: ["light_tube_small"],
					pop_contents_nr: [21]
				},
			},
			name: "box of replacement bulbs",
		},
		tree_paths: ["items/storage/box/lights/bulbs"],
	},
	light_tubes_box: {
		parent_template: "light_bulbs_box",
		vars: {
			components: {
				Box: {
					illustration: "lighttube",
				},
				StorageItem: {
					pop_contents: ["light_tube"],
					pop_contents_nr: [21]
				},
			},
			name: "box of replacement tubes",
		},
		tree_paths: ["items/storage/box/lights/tubes"],
	},
	light_mixed_box: {
		parent_template: "light_bulbs_box",
		vars: {
			components: {
				Box: {
					illustration: "lightmixed",
				},
				StorageItem: {
					pop_contents: ["light_tube","light_tube_small"],
					pop_contents_nr: [14,7]
				},
			},
			name: "box of replacement lights",
		},
		tree_paths: ["items/storage/box/lights/mixed"],
	},
};

module.exports.components = { Box };
