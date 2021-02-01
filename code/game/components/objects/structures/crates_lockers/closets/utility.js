

module.exports.templates = {
	emergency_closet: {
		components: ["Closet"],
		vars: {
			components: {
				Examine: {
					desc: "It's a storage unit for emergency breath maks and O2 tanks.",
				},
			},
			name: "emergency closet",
			icon_state: "locker",
		},
		tree_paths: ["structures/closet/emergency"],
	},
	fire_closet: {
		components: ["Closet"],
		vars: {
			components: {
				Examine: {
					desc: "It's a storage unit for fire-fighting supplies.",
				},
			},
			name: "fire-safety closet",
			icon_state: "locker",
		},
		tree_paths: ["structures/closet/fire"],
	},
	tool_closet: {
		components: ["Closet"],
		vars: {
			components: {
				Closet: {
					icon_door: "eng_tool",
				},
				Examine: {
					desc: "It's a storage unit for tools.",
				},
			},
			name: "tool closet",
			icon_state: "locker",
		},
		tree_paths: ["structures/closet/tools"],
	},
	radiation_closet: {
		components: ["Closet"],
		vars: {
			components: {
				Closet: {
					icon_door: "eng_rad",
				},
				Examine: {
					desc: "It's a storage unit for rad-protective suits.",
				},
			},
			name: "radiation closet",
			icon_state: "locker",
		},
		tree_paths: ["structures/closet/radiation"],
	},

};
