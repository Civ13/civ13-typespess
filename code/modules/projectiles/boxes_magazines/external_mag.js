

//TODO: Almost all magazines are implemented, but not all of them have their ammo_type implemented. Probably worth double-checking all the ammo_types once they're all implemented.
//TODO: /obj/item/ammo_box/magazine/recharge and procs

//TODO: On TG, most of these have snowflake update_icon() procs. Monster volunteered to deal with it.

module.exports.templates = {
	mag_m10mm: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "10mm",
					form_factor: "pistol",
					ammo_type: "casing_c10mm",
					max_ammo: 8,
					multiple_sprites: 2,
				},
				Examine: {
					desc: "A gun magazine.",
				},
			},
			name: "pistol magazine (10mm)",
			icon_state: "glock17",
		},
		tree_paths: ["items/ammo_box/magazine/m10mm"],
	},
	mag_m10mm_rifle: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "10mm",
					form_factor: "pistol",
					ammo_type: "casing_c10mm",
					max_ammo: 10,
					multiple_sprites: 2,
				},
				Examine: {
					desc: "A well-worn magazine fitted for the surplus rifle.",
				},
			},
			name: "rifle magazine (10mm)",
			icon_state: "g43",

		},
		tree_paths: ["items/ammo_box/magazine/m10mm/rifle"],
	},
	mag_m10mm_fire: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "10mm",
					form_factor: "pistol",
					ammo_type: "casing_c10mm_inc",
					max_ammo: 8,
					multiple_sprites: 2,
				},
				Examine: {
					desc: "A gun magazine. Loaded with rounds which ignite the target.",
				},
			},
			name: "pistol magazine (10mm incendiary)",
			icon_state: "glock17",

		},
		tree_paths: ["items/ammo_box/magazine/m10mm/fire"],
	},
	mag_m10mm_hp: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "10mm",
					form_factor: "pistol",
					ammo_type: "casing_c10mm_hp",
					max_ammo: 8,
					multiple_sprites: 2,
				},
				Examine: {
					desc:
			"A gun magazine. Loaded with hollow-point rounds, extremely effective against unarmored targets, but nearly useless against protective clothing.",
				},
			},
			name: "pistol magazine (10mm HP)",
			icon_state: "glock17",

		},
		tree_paths: ["items/ammo_box/magazine/m10mm/hp"],
	},
	mag_m10mm_ap: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "10mm",
					form_factor: "pistol",
					ammo_type: "casing_c10mm_ap",
					max_ammo: 8,
					multiple_sprites: 2,
				},
				Examine: {
					desc:
			"A gun magazine. Loaded with rounds which penetrate armour, but are less effective against normal targets.",
				},
			},
			name: "pistol magazine (10mm AP)",
			icon_state: "glock17",

		},
		tree_paths: ["items/ammo_box/magazine/m10mm/ap"],
	},
	mag_m45: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: ".45",
					form_factor: "pistol",
					ammo_type: "casing_c45",
					max_ammo: 8,
				},
			},
			name: "handgun magazine (.45)",
			icon_state: "m1911",
		},
		tree_paths: ["items/ammo_box/magazine/m45"],
	},
	mag_wt550m9: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "4.6x30mm",
					form_factor: "pistol",
					ammo_type: "casing_c46x30mm",
					max_ammo: 20,
					ammo_mod: 4,
					multiple_sprites: 1,
				},
			},
			name: "wt550 magazine (4.6x30mm)",
			icon_state: "m16",
		},
		tree_paths: ["items/ammo_box/magazine/wt550m9"],
	},
	mag_wt550m9_wtap: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "4.6x30mm",
					form_factor: "pistol",
					ammo_type: "casing_c46x30mm_ap",
					max_ammo: 20,
					ammo_mod: 4,
					multiple_sprites: 1,
				},
			},
			name: "wt550 magazine (Armor Piercing 4.6x30mm)",
			icon_state: "m16",
		},
		tree_paths: ["items/ammo_box/magazine/wt550m9/wtap"],
	},
	mag_wt550m9_wtic: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "4.6x30mm",
					form_factor: "pistol",
					ammo_type: "casing_c46x30mm_inc",
					max_ammo: 20,
					ammo_mod: 4,
					multiple_sprites: 1,
				},
			},
			name: "wt550 magazine (Incendiary 4.6x30mm)",
			icon_state: "m16",
		},
		tree_paths: ["items/ammo_box/magazine/wt550m9/wtic"],
	},
	mag_uzim9mm: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "9mm",
					form_factor: "uzi",
					ammo_type: "casing_c9mm",
					max_ammo: 32,
					ammo_mod: 4,
					multiple_sprites: 1,
				},
			},
			name: "uzi magazine (9mm)",
			icon_state: "greasegun",
		},
		tree_paths: ["items/ammo_box/magazine/uzim9mm"],
	},
	mag_smgm9mm: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "9mm",
					form_factor: "smg",
					ammo_type: "casing_c9mm",
					max_ammo: 21,
				},
			},
			name: "SMG magazine (9mm)",
			icon_state: "greasegun",
		},
		tree_paths: ["items/ammo_box/magazine/smgm9mm"],
	},
	mag_smgm9mm_ap: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "9mm",
					form_factor: "smg",
					ammo_type: "casing_c9mm_ap",
					max_ammo: 21,
				},
			},
			name: "SMG magazine (Armor Piercing 9mm)",
			icon_state: "greasegun",
		},
		tree_paths: ["items/ammo_box/magazine/smgm9mm/ap"],
	},
	mag_smgm9mm_fire: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "9mm",
					form_factor: "smg",
					ammo_type: "casing_c9mm_inc",
					max_ammo: 21,
				},
			},
			name: "SMG magazine (Incendiary 9mm)",
			icon_state: "greasegun",
		},
		tree_paths: ["items/ammo_box/magazine/smgm9mm/fire"],
	},
	mag_pistolm9mm: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "9mm",
					form_factor: "smg",
					ammo_type: "casing_c9mm",
					max_ammo: 15,
				},
			},
			name: "pistol magazine (9mm)",
			icon_state: "glock17",
		},
		tree_paths: ["items/ammo_box/magazine/pistolm9mm"],
	},
	mag_glock17: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "9mm",
					form_factor: "pistol",
					ammo_type: "casing_c9mm",
					max_ammo: 17,
				},
			},
			name: "glock magazine (9mm)",
			icon_state: "glock17",
		},
		tree_paths: ["items/ammo_box/magazine/glock17"],
	},
	mag_smgm45: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: ".45",
					form_factor: "smg",
					ammo_type: "casing_c45_nostamina",
					max_ammo: 24,
					ammo_mod: 2,
					multiple_sprites: 2,
				},
			},
			name: "SMG magazine (.45)",
			icon_state: "thompson",

		},
		tree_paths: ["items/ammo_box/magazine/smgm45"],
	},
	mag_tommygunm45: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: ".45",
					form_factor: "pistol",
					ammo_type: "casing_c45",
					max_ammo: 50,
				},
			},
			name: "drum magazine (.45)",
			icon_state: "ppsh",
		},
		tree_paths: ["items/ammo_box/magazine/tommygunm45"],
	},
	mag_m50: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: ".50",
					form_factor: "pistol",
					ammo_type: "casing_a50AE",
					max_ammo: 7,
					multiple_sprites: 1,
				},
			},
			name: "handgun magazine (.50ae)",
			icon_state: "m1911",

		},
		tree_paths: ["items/ammo_box/magazine/m50"],
	},
	mag_m75: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "75",
					form_factor: "pistol",
					ammo_type: "caseless_a75",
					max_ammo: 8,
					multiple_sprites: 2,
				},
			},
			name: "specialized magazine (.75)",
			icon_state: "madsen",
		},
		tree_paths: ["items/ammo_box/magazine/m75"],
	},
	mag_m556: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "a556",
					form_factor: "toploader",
					ammo_type: "casing_a556",
					max_ammo: 30,
					multiple_sprites: 2,
				},
			},
			name: "toploader magazine (5.56mm)",
			icon_state: "p90",
			//TODO origin_tech: "combat=5;syndicate=1"
		},
		tree_paths: ["items/ammo_box/magazine/m556"],
	},
	mag_m12g: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "shotgun",
					form_factor: "shotgun",
					ammo_type: "casing_shotgun_stunslug",
					max_ammo: 8,
					multiple_sprites: 2,
				},
			},
			name: "shotgun magazine (12g taser slugs)",
			icon_state: "scarh",
		},
		tree_paths: ["items/ammo_box/magazine/m12g"],
	},
	mag_m12g_buckshot: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "shotgun",
					form_factor: "shotgun",
					ammo_type: "casing_shotgun_buckshot",
					max_ammo: 8,
					multiple_sprites: 2,
				},
			},
			name: "shotgun magazine (12g buckshot slugs)",
			icon_state: "scarh",
		},
		tree_paths: ["items/ammo_box/magazine/m12g/buckshot"],
	},
	mag_m12g_slug: {
		components: ["GunMagazine"],
		vars: {
			components: {
				AmmoBox: {
					caliber: "shotgun",
					form_factor: "shotgun",
					ammo_type: "casing_shotgun",
					max_ammo: 8,
					multiple_sprites: 2,
				},
			},
			name: "shotgun magazine (12g slugs)",
			icon_state: "scarh",
		},
		tree_paths: ["items/ammo_box/magazine/m12g/slug"],
	},
}