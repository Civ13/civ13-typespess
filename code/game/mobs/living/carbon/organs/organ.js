const {
	Component,
	has_component,
} = require("./../../../../../../code/game/server.js");

class Organ extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.mob = null;
	}

	do_life() {return;}

	insert(mob) {
		if (!has_component(mob, "CarbonMob")) return false;
		this.mob = mob;
		mob.c.CarbonMob.organs[this.slot] = this.a;
		this.a.loc = mob;
		this.emit("inserted", mob);
		mob.c.CarbonMob.emit("organ_inserted", this.slot, this.a);
	}
}

Organ.depends = ["Item"];
Organ.loadBefore = ["Item"];

Organ.template = {
	vars: {
		components: {
			Organ: {
				is_robotic: false,
				zone: "torso",
				slot: null,
			},
			Item: {
				size: 2,
			},
		},
		name: "organ",
		icon: "icons/obj/surgery/",
	},
};

module.exports.components = { Organ };
