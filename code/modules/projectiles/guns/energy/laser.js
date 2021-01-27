

//TODO: Origin tech. We should really implement those at some point, even just as placeholders...

//TODO:
/*
/obj/item/gun/energy/laser/captain/scattershot
/obj/item/gun/energy/laser/cyborg
/obj/item/gun/energy/laser/scatter
/obj/item/gun/energy/laser/scatter/shotty
/obj/item/gun/energy/lasercannon
/obj/item/ammo_casing/energy/laser/accelerator
/obj/item/projectile/beam/laser/accelerator
/obj/item/gun/energy/xray
*/

module.exports.templates = {
	lasergun: {
		components: ["EnergyGun", "BeltItem"],
		vars: {
			components: {
				EnergyGun: {
					ammo_type: ["energy_lens_lasergun"],
					shaded_charge: true,
				},
				Item: {
					inhand_lhand_icon: "icons/mob/inhands/lefthand_guns.png",
					inhand_rhand_icon: "icons/mob/inhands/righthand_guns.png",
					inhand_icon_state: "dartgun-10",
					materials: { metal: 2000 },
				},
				Examine: {
					desc:
			"A basic energy-based laser gun that fires concentrated beams of light which pass through glass and thin metal.",
				},
			},
			name: "laser gun",
			icon_state: "medium",
		},
		tree_paths: ["items/gun/energy/laser"],
	},
	lasergun_practice: {
		parent_template: "lasergun",
		vars: {
			components: {
				EnergyGun: {
					ammo_type: ["energy_lens_lasergun_practice"],
				},
				Item: {
					needs_permit: false,
				},
				Gun: {
					clumsy_check: false,
				},
				Examine: {
					desc:
			"A modified version of the basic laser gun, this one fires less concentrated energy bolts designed for target practice.",
				},
			},
			name: "practice laser gun",
		},
		tree_paths: ["items/gun/energy/laser/practice"],
	},
	lasergun_retro: {
		parent_template: "lasergun",
		vars: {
			components: {
				Examine: {
					desc:
			"An older model of the basic lasergun, no longer used by Nanotrasen's private security or military forces. Nevertheless, it is still quite deadly and easy to maintain, making it a favorite amongst pirates and other outlaws.",
				},
			},
			name: "retro laser gun",
			icon_state: "energy",
		},
		tree_paths: ["items/gun/energy/laser/retro"],
	},
}
