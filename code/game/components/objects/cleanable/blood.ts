export{};
const {Component, Atom, make_watched_property, has_component} = require("./../../../../../code/game/server.js");
const _ = require("underscore");

class BloodDecal extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
	}
}

BloodDecal.depends = ["CleanableDecal"];
BloodDecal.loadBefore = ["CleanableDecal"];

BloodDecal.template = {
	vars: {
		components: {
			CleanableDecal: {
				footprint_amount: 100,
				footprint_type: "blood",
				merge_group: "blood_splat",
				merge_priority: 20,
			},
		},
		name: "blood",
		icon: "icons/effects/blood/",
		icon_state: "floor1",
	},
};

class BloodDripsDecal extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		for (let i = 0; i < this.num_drips; i++) {
			this.a.overlays[`drip_${i}`] = {icon: "icons/effects/blood/", icon_state: _.sample(this.drip_icons)};
		}
		this.a.c.CleanableDecal.on("merged", this.merged.bind(this));
	}
	merged(other: Record<string, any>) {
		if (has_component(other, "BloodDripsDecal")) {
			const old_drips = this.num_drips;
			this.num_drips += other.c.BloodDripsDecal.num_drips;
			if (this.num_drips > this.max_drips) {
				const new_decal = new Atom(this.a.server, "decal_blood_splatter");
				new_decal.fine_loc = this.a.fine_loc;
				this.a.destroy();
				return;
			}
			for (let i = old_drips; i < this.num_drips; i++) {
				this.a.overlays[`drip_${i}`] = other.overlays[`drip_${i - old_drips}`];
			}
		}
	}
}

BloodDripsDecal.loadBefore = ["BloodDecal"];
BloodDripsDecal.depends = ["BloodDecal"];

BloodDripsDecal.template = {
	vars: {
		components: {
			CleanableDecal: {
				merge_priority: 0,
				footprint_amount: 0,
			},
			BloodDripsDecal: {
				drip_icons: ["drip1", "drip2", "drip3", "drip4", "drip5"],
				num_drips: 1,
				max_drips: 3,
			},
		},
		icon_state: "drip1",
	},
};

class FootprintsDecal extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.c.CleanableDecal.merge_group = "footprints_" + this.type;
		this.on("entered_dirs_changed", this.entered_dirs_changed.bind(this));
		this.on("exited_dirs_changed", this.exited_dirs_changed.bind(this));
		make_watched_property(this, "entered_dirs", "number");
		make_watched_property(this, "exited_dirs", "number");
	}

	entered_dirs_changed(from: any, to: any) {
		for (const dir of [1, 2, 4, 8]) {
			if (from & dir && !(to & dir)) {
				this.a.overlays[`entered_${dir}`] = null;
			} else if (to & dir && !(from & dir)) {
				this.a.overlays[`entered_${dir}`] = {
					icon: "icons/effects/blood/",
					icon_state: `${this.type}1`,
					dir,
					alpha: this.a.alpha,
				};
			}
		}
	}

	exited_dirs_changed(from: any, to: any) {
		for (const dir of [1, 2, 4, 8]) {
			if (from & dir && !(to & dir)) {
				this.a.overlays[`exited_${dir}`] = null;
			} else if (to & dir && !(from & dir)) {
				this.a.overlays[`exited_${dir}`] = {
					icon: "icons/effects/blood/",
					icon_state: `${this.type}2`,
					dir,
					alpha: this.a.alpha,
				};
			}
		}
	}
}

FootprintsDecal.loadBefore = ["CleanableDecal"];
FootprintsDecal.depends = ["CleanableDecal"];

FootprintsDecal.template = {
	vars: {
		components: {
			FootprintsDecal: {
				type: "blood",
				entered_dirs: 0,
				exited_dirs: 0,
			},
			Examine: {
				desc: "WHOSE FOOTPRINTS ARE THESE?",
			},
		},
		name: "footprints",
		icon: "icons/effects/blood/",
		icon_state: "drip1",
		alpha: 0.5,
	},
};

module.exports.components = {BloodDecal, BloodDripsDecal, FootprintsDecal};
