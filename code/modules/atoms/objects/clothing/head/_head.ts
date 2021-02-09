export{};
const { Component } = require("./../../../../../../code/game/server.js");

class HeadItem extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
	}
}
//TODO: Handle that dynamic_hair_suffix crap
//TODO: Toggling
//TODO: Possibly handle block_tracking? Dunno how that one works
//TODO: /obj/item/clothing/head/Initialize()
//TODO: /obj/item/clothing/head/worn_overlays(isinhands = FALSE)
//TODO: /obj/item/clothing/head/update_clothes_damaged_state(damaging = TRUE)

HeadItem.template = {
	vars: {
		components: {
			HeadItem: {
				worn_icon: "icons/mob/worn/head/",
				worn_icon_state: "orange_bandana", // If null, inherits from icon_state
				block_tracking: false, //for AI tracking
				can_toggle: false,
				dynamic_hair_suffix: "+generic",
				hide_face: false,
			},
			WearableItem: {
				body_parts_covered: ["head"],
			},
			Item: {
				inhand_icon_state: "that",
			},
		},
		icon: "icons/mob/under/hats/",
		icon_state: "orange_bandana",
		name: "head",
	},
};

HeadItem.depends = ["WearableItem"];
HeadItem.loadBefore = ["WearableItem"];

module.exports.components = { HeadItem };
