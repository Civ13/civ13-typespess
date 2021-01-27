const { Component } = require("./../../../../code/game/server.js");

const pass_flags = require("../../../defines/pass_flags.js");
const lighting = require("../../../defines/lighting.js");

class BeamProjectile extends Component {}

BeamProjectile.loadBefore = ["Projectile", "LightSource"];
BeamProjectile.depends = ["Projectile", "LightSource"];

//TODO: /obj/item/projectile/beam/laser/on_hit(atom/target, blocked = FALSE) and /obj/item/projectile/beam/lasertag/on_hit(atom/target, blocked = FALSE)

BeamProjectile.template = {
	vars: {
		components: {
			Projectile: {
				hitsound: "sound/weapons/sear.ogg",
				hitsound_wall: "sound/weapons/effects/searwall.ogg",
				flag: "energy",
				damage_type: "burn",
				damage: 20,
			},
			LightSource: {
				enabled: true,
				radius: 2,
				color: lighting.LIGHT_COLOR_RED,
			},
		},
		name: "laser",
		icon_state: "energy",
		pass_flags:
	pass_flags.PASSTABLE | pass_flags.PASSGLASS,
	},
};

module.exports.templates = {
	beam_laser: {
		components: ["BeamProjectile"],
	},
	beam_laser_practice: {
		parent_template: "beam_laser",
		vars: {
			components: {
				Projectile: {
					damage: 0,
					no_damage: true,
				},
			},
			name: "practice laser",
		},
	},

	beam_disabler: {
		components: ["BeamProjectile"],
		vars: {
			components: {
				Projectile: {
					damage: 36,
					damage_type: "stamina",
					hitsound: "sound/weapons/tap.ogg",
				},
				LightSource: {
					color: lighting.LIGHT_COLOR_BLUE,
				},
			},
			name: "disabler beam",
			icon_state: "taser",
		},
	},
};

module.exports.components = { BeamProjectile };
