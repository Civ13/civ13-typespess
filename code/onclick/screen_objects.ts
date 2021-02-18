export{};
const {Component} = require("./../../code/game/server.js");

class ZoneSel extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.on("clicked", this.clicked.bind(this));
	}

	clicked(e: Record<string, any>) {
		if (!this.mob) {
			return;
		}
		const px = e.x * 32;
		const py = e.y * 32;
		let choice;
		if (py >= 1 && py < 10) {
			// legs
			if (px >= 10 && px < 16) {
				choice = "r_leg";
			} else if (px >= 17 && px < 23) {
				choice = "l_leg";
			} else {
				return;
			}
		} else if (py >= 10 && py < 14) {
			//Hands and groin
			if (px >= 8 && px < 12) {
				choice = "r_arm";
			} else if (px >= 12 && px < 21) {
				choice = "groin";
			} else if (px >= 21 && px < 25) {
				choice = "l_arm";
			} else {
				return;
			}
		} else if (py >= 14 && py < 23) {
			//Torso and arms to shoulders
			if (px >= 8 && px < 12) {
				choice = "r_arm";
			} else if (px >= 12 && px < 21) {
				choice = "torso";
			} else if (px >= 21 && px < 25) {
				choice = "l_arm";
			} else {
				return;
			}
		} else if (py >= 23 && py < 31) {
			//Head but we need to check for eye and mout;
			if (px >= 12 && px < 21) {
				choice = "head";
				if (py >= 23 && py < 25 && px >= 15 && px < 18) {
					choice = "mouth";
				} else if (py >= 26 && py < 27 && px >= 14 && px < 19) {
					choice = "eyes";
				} else if (py >= 25 && py < 28 && px >= 15 && px < 18) {
					choice = "eyes";
				}
			} else {
				return;
			}
		} else {
			return;
		}
		this.mob.c.MobInteract.zone_sel = choice;
		this.update_selected();
	}

	set_mob(mob: any) {
		this.mob = mob;
		this.update_selected();
	}

	update_selected() {
		this.a.overlays.selecting = {
			icon: "icons/ui/screen_gen/",
			icon_state: `${this.mob.c.MobInteract.zone_sel}`,
		};
	}
}

ZoneSel.template = {
	vars: {
		components: {
			ZoneSel: {
				overlay_icon: "icons/ui/screen_gen/",
				icon_state: "torso",
			},
		},
		icon: "icons/ui/screen_civ13/",
		icon_state: "zone_sel",
		name: "damage zone",
		screen_loc_x: 13.875,
		screen_loc_y: 0.15625,
		layer: 30,
	},
};

module.exports.templates = {
	human_zone_sel: {
		components: ["ZoneSel"],
		hidden: true,
	},
};

module.exports.components = {ZoneSel};
