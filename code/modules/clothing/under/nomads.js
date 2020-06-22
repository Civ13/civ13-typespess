module.exports.templates = {
	loincloth: {
		components: ["UniformItem"],
		vars: {
			components: {
				UniformItem: {
					worn_icon: "icons/mob/under/loincloth_worn.png",
					worn_icon_state: "leatherloincloth1",
					can_adjust: false,
				},
				Examine: {
					desc: "A wrap of leather cloth, worn around the waist.",
				},
			},
			name: "leather loincloth",
			icon: "icons/mob/under/loincloth.png",
			icon_state: "leatherloincloth1",
		},
		tree_paths: ["items/clothing/under/loincloth"],
	}
};