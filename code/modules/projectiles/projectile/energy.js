

module.exports.templates = {
	energy_projectile: {
		components: ["Projectile"],
		vars: {
			components: {
				Projectile: {
					damage: 0,
					damage_type: "burn",
					flag: "energy",
				},
			},
			name: "energy",
			icon_state: "laser",
		},
	},
};
