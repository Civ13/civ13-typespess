const { Component } = require("./../../../../../../code/game/server.js");

class HealthDoll extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		for (const zone of ["head", "torso", "l_leg", "r_leg", "l_arm", "r_arm"]) {
			this.a.overlays[zone] = { icon: "icons/ui/screen_gen/", icon_state: `${zone}6` };
		}
	}

	bind_mob(mob) {
		this.mob = mob;
		this.mob.c.LivingMob.on("health_changed", this.update_icon.bind(this));
		this.update_icon();
	}

	update_icon() {
		for (const zone of ["head", "torso", "l_leg", "r_leg", "l_arm", "r_arm"]) {
			const bp = this.mob.c.MobBodyParts.limbs[zone];
			if (!bp) {this.a.overlays[zone] = { icon: "icons/ui/screen_gen/", icon_state: `${zone}6` };}
			else
				{this.a.overlays[zone] = {
					icon_state: `${zone}${Math.ceil(
						((bp.c.BodyPart.brute_damage + bp.c.BodyPart.burn_damage) /
			bp.c.BodyPart.max_damage) *5)}`,
				};}
		}
	}
}

HealthDoll.template = {
	vars: {
		icon: "icons/ui/screen_gen/",
		icon_state: "healthdoll_OVERLAY",
		name: "health doll",
		screen_loc_x: 13.875,
		screen_loc_y: 5.40625,
		layer: 30,
	},
};

module.exports.templates = {
	human_health_doll: {
		components: ["HealthDoll"],
		tree_paths: ["effects/screen/human_health_doll"],
	},
};
module.exports.components = { HealthDoll };
