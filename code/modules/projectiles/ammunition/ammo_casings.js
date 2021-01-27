

//TODO: Almost all casings are implemented, but not all of them have their projectile_type implemented. Probably worth double-checking all the projectile_types once they're all implemented.

//TODO (including their procs and subtypes): /obj/item/ammo_casing/shotgun/dart

module.exports.templates = {
	// .357 (Syndie Revolver)
	casing_a357: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "357",
					projectile_type: "bullet_a357",
					casing_type: "casing_a357",
				},
				Examine: {
					desc: "A .357 bullet casing.",
				},
			},
			name: ".357 bullet casing",
		},
		tree_paths: ["items/ammo_casing/a357"],
	},
	// 7.62 (Nagant Rifle)
	casing_a762: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "a762",
					projectile_type: "bullet_a762",
					casing_type: "casing_a762",
				},
				Examine: {
					desc: "A 7.62 bullet casing.",
				},
			},
			name: "7.62 bullet casing",
			icon_state: "kclip-bullet",
		},
		tree_paths: ["items/ammo_casing/a762"],
	},
	casing_a762_enchanted: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "a762",
					projectile_type: "bullet_a762_enchanted",
					casing_type: "casing_a762_enchanted",
				},
				Examine: {
					desc: "A 7.62 bullet casing.",
				},
			},
			name: "7.62 bullet casing",
			icon_state: "kclip-bullet",
		},
		tree_paths: ["items/ammo_casing/a762"],
	},
	// 7.62x38mmR (Nagant Revolver)
	casing_n762: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "n762",
					projectile_type: "bullet_n762",
					casing_type: "casing_n762",
				},
				Examine: {
					desc: "A 7.62x38mmR bullet casing.",
				},
			},
			name: "7.62x38mmR bullet casing",
		},
		tree_paths: ["items/ammo_casing/n762"],
	},
	// .50AE (Desert Eagle)
	casing_a50AE: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: ".50",
					projectile_type: "bullet_a50AE",
					casing_type: "casing_a50AE",
				},
				Examine: {
					desc: "A .50AE bullet casing.",
				},
			},
			name: ".50AE bullet casing",
		},
		tree_paths: ["items/ammo_casing/a50AE"],
	},
	// .38 (Detective's Gun)
	casing_c38: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "38",
					projectile_type: "bullet_c38",
					casing_type: "casing_c38",
				},
				Examine: {
					desc: "A .38 bullet casing.",
				},
			},
			name: ".38 bullet casing",
		},
		tree_paths: ["items/ammo_casing/c38"],
	},
	// 10mm (Stechkin)
	casing_c10mm: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "10mm",
					projectile_type: "bullet_c10mm",
					casing_type: "casing_c10mm",
				},
				Examine: {
					desc: "A 10mm bullet casing.",
				},
			},
			name: "10mm bullet casing",
		},
		tree_paths: ["items/ammo_casing/c10mm"],
	},
	casing_c10mm_ap: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "10mm",
					projectile_type: "bullet_c10mm_ap",
					casing_type: "casing_c10mm_ap",
				},
				Examine: {
					desc: "A 10mm armor-piercing bullet casing.",
				},
			},
			name: "10mm armor-piercing bullet casing",
		},
		tree_paths: ["items/ammo_casing/c10mm_ap"],
	},
	casing_c10mm_hp: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "10mm",
					projectile_type: "bullet_c10mm_hp",
					casing_type: "casing_c10mm_hp",
				},
				Examine: {
					desc: "A 10mm hollow-point bullet casing.",
				},
			},
			name: "10mm hollow point bullet casing",
		},
		tree_paths: ["items/ammo_casing/c10mm_hp"],
	},
	casing_c10mm_inc: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "10mm",
					projectile_type: "bullet_c10mm_inc",
					casing_type: "casing_c10mm_inc",
				},
				Examine: {
					desc: "A 10mm incendiary bullet casing.",
				},
			},
			name: "10mm incendiary bullet casing",
		},
		tree_paths: ["items/ammo_casing/c10mm_inc"],
	},
	// 9mm (Stechkin APS)
	casing_c9mm: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "9mm",
					projectile_type: "bullet_c9mm",
					casing_type: "casing_c9mm",
				},
				Examine: {
					desc: "A 9mm bullet casing.",
				},
			},
			name: "9mm bullet casing",
		},
		tree_paths: ["items/ammo_casing/c9mm"],
	},
	casing_c9mm_ap: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "9mm",
					projectile_type: "bullet_c9mm_ap",
					casing_type: "casing_c9mm_ap",
				},
				Examine: {
					desc: "A 9mm armor-piercing bullet casing.",
				},
			},
			name: "9mm armor-piercing bullet casing",
		},
		tree_paths: ["items/ammo_casing/c9mm_ap"],
	},
	casing_c9mm_inc: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "9mm",
					projectile_type: "bullet_c9mm_inc",
					casing_type: "casing_c9mm_inc",
				},
				Examine: {
					desc: "A 9mm incendiary bullet casing.",
				},
			},
			name: "9mm incendiary bullet casing",
		},
		tree_paths: ["items/ammo_casing/c9mm_inc"],
	},
	// 4.6x30mm (Autorifles)
	casing_c46x30mm: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "4.6x30mm",
					projectile_type: "bullet_c46x30mm",
					casing_type: "casing_c46x30mm",
				},
				Examine: {
					desc: "A 4.6x30mm bullet casing.",
				},
			},
			name: "4.6x30mm bullet casing",
		},
		tree_paths: ["items/ammo_casing/c46x30mm"],
	},
	casing_c46x30mm_ap: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "4.6x30mm",
					projectile_type: "bullet_c46x30mm_ap",
					casing_type: "casing_c46x30mm_ap",
				},
				Examine: {
					desc: "A 4.6x30mm armor-piercing bullet casing.",
				},
			},
			name: "4.6x30mm armor-piercing bullet casing",
		},
		tree_paths: ["items/ammo_casing/c46x30mm_ap"],
	},
	casing_c46x30mm_inc: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "4.6x30mm",
					projectile_type: "bullet_c46x30mm_inc",
					casing_type: "casing_c46x30mm_inc",
				},
				Examine: {
					desc: "A 4.6x30mm incendiary bullet casing.",
				},
			},
			name: "4.6x30mm incendiary bullet casing",
		},
		tree_paths: ["items/ammo_casing/c46x30mm_inc"],
	},
	// .45 (M1911 + C20r)
	casing_c45: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: ".45",
					projectile_type: "bullet_c45",
					casing_type: "casing_c45",
				},
				Examine: {
					desc: "A .45 bullet casing.",
				},
			},
			name: ".45 bullet casing",
		},
		tree_paths: ["items/ammo_casing/c45"],
	},

	// Shotgun
	casing_shotgun_slug: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "shotgun",
					projectile_type: "bullet_shotgun_slug",
					casing_type: "casing_shotgun_slug",
				},
				Item: {
					materials: { metal: 4000 },
				},
				Examine: {
					desc: "A 12 gauge lead slug.",
				},
			},
			name: "shotgun slug",
			icon_state: "slshell",
		},
		tree_paths: ["items/ammo_casing/shotgun_slug"],
	},
	casing_shotgun_beanbag: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "shotgun",
					projectile_type: "bullet_shotgun_beanbag",
					casing_type: "casing_shotgun_beanbag",
				},
				Item: {
					materials: { metal: 250 },
				},
				Examine: {
					desc: "A weak beanbag slug for riot control.",
				},
			},
			name: "beanbag slug",
			icon_state: "bshell",
		},
		tree_paths: ["items/ammo_casing/shotgun_beanbag"],
	},

	casing_shotgun_dragonsbreath: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "shotgun",
					projectile_type: "bullet_shotgun_dragonsbreath",
					casing_type: "casing_shotgun_dragonsbreath",
					pellets: 4,
					spread: 9,
				},
				Item: {
					materials: { metal: 4000 },
				},
				Examine: {
					desc: "A shotgun shell which fires a spread of incendiary pellets.",
				},
			},
			name: "dragonsbreath shell",
			icon_state: "shell-bullet",
		},
		tree_paths: ["items/ammo_casing/shotgun_dragonsbreath"],
	},

	casing_shotgun_buckshot: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "shotgun",
					projectile_type: "bullet_pellet_shotgun_buckshot",
					casing_type: "casing_shotgun_buckshot",
					pellets: 6,
					spread: 6,
				},
				Item: {
					materials: { metal: 4000 },
				},
				Examine: {
					desc: "A 12 gauge buckshot shell.",
				},
			},
			name: "buckshot shell",
			icon_state: "shell-bullet",
		},
		tree_paths: ["items/ammo_casing/shotgun_buckshot"],
	},
	casing_shotgun_rubbershot: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "shotgun",
					projectile_type: "bullet_pellet_shotgun_rubbershot",
					casing_type: "casing_shotgun_rubbershot",
					pellets: 6,
					spread: 6,
				},
				Item: {
					materials: { metal: 4000 },
				},
				Examine: {
					desc:
			"A shotgun casing filled with densely-packed rubber balls, used to incapacitate crowds from a distance.",
				},
			},
			name: "rubber shot",
			icon_state: "bshell",
		},
		tree_paths: ["items/ammo_casing/shotgun_rubbershot"],
	},
	casing_shotgun_improvised: {
		components: ["AmmoCasing"],
		vars: {
			components: {
				AmmoCasing: {
					caliber: "shotgun",
					projectile_type: "bullet_pellet_shotgun_improvised",
					casing_type: "casing_shotgun_improvised",
					pellets: 10,
					spread: 6,
				},
				Item: {
					materials: { metal: 4000 },
				},
				Examine: {
					desc:
			"An extremely weak shotgun shell with multiple small pellets made out of metal shards.",
				},
			},
			name: "improvised shell",
			icon_state: "bshell",
		},
		tree_paths: ["items/ammo_casing/shotgun_improvised"],
	},
};
