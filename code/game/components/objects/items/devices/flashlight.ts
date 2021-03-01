export{};
const {Component} = require("./../../../../../../code/game/server.js");
const lighting = require("../../../../../defines/lighting.js");

class Flashlight extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.c.ItemActions.add_action({name: "Toggle Flashlight"});
		this.a.c.LightSource.on("enabled_changed", this.enabled_changed.bind(this));
		this.a.c.Item.attack_self = this.attack_self.bind(this);
		this.enabled_changed();
	}

	enabled_changed() {
		if (this.a.c.LightSource.enabled) {
			this.a.icon_state = this.a.template.vars.icon_state + "-on";
		} else {
			this.a.icon_state = this.a.template.vars.icon_state;
		}
	}

	attack_self() {
		this.a.c.LightSource.enabled = !this.a.c.LightSource.enabled;
	}
}

Flashlight.depends = ["LightSource", "Item", "ItemActions"];
Flashlight.loadBefore = ["LightSource", "Item", "ItemActions"];

Flashlight.template = {
	vars: {
		components: {
			LightSource: {
				enabled: false,
				radius: 4,
				color: "#ffffff",
			},
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/misc/righthand/",
				size: 2,
			},
		},
		icon: "icons/obj/lighting/",
		icon_state: "flashlight",
	},
};

class DeskLamp extends Component {}

DeskLamp.depends = ["Flashlight", "BeltItem"];
DeskLamp.loadBefore = ["Flashlight", "BeltItem"];

DeskLamp.template = {
	vars: {
		components: {
			LightSource: {
				radius: 5,
				enabled: true,
				color: "#ffeedd",
			},
			Item: {
				inhand_icon_state: "lamp",
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/lefthand/",
				force: 10,
				size: 4,
			},
			Examine: {
				desc: "A desk lamp with an adjustable mount.",
			},
		},
		name: "desk lamp",
		icon_state: "lamp",
	},
};

class Sun extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.running = true;
		this.sun_timeout = null;
		this.run_sun();
	}

	run_sun() {
		this.sun_timeout = null;
		if (this.running && this.a.x !== null && this.a.y !== null) {
			this.a.move(-1, 0, "sun");
			if (this.a.x && this.a.y)
				{console.info("WORLD: Sun moved 1 tile west: "+this.a.x+","+this.a.y);}
			this.sun_timeout = setTimeout(this.run_sun.bind(this), 60000);
		}
	}
}
Sun.depends = ["Flashlight"];
Sun.loadBefore = ["Flashlight"];

Sun.template = {
	vars: {
		components: {
			LightSource: {
				radius: 75,
				enabled: true,
				color: lighting.LIGHT_COLOR_HALOGEN,
			},
			Tangible: {
				anchored: true,
			},
		},
		name: "sun",
		icon: null,
		icon_state: null,
	},
};

module.exports.components = {Flashlight, DeskLamp, Sun};
