export{};
const {Component, Atom, has_component, chain_func} = require("./../../../../../../../code/game/server.js");

const _ = require("underscore");
const combat_defines = require("../../../../../../defines/combat_defines.js");

class GlassSheet extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
	}

	attack_by(prev: any, item: any, user: any) {
		if (has_component(item, "StackRod")) {
			const rglass = new Atom(this.a.server, "rglass_sheet");
			rglass.loc = user.base_mover.fine_loc;
			this.a.c.Stack.use(1);
			item.c.Stack.use(1);
		}
	}
}

GlassSheet.depends = ["Stack"];
GlassSheet.loadBefore = ["Stack"];

GlassSheet.template = {
	vars: {
		components: {
			Stack: {
				full_size: 3,
				singular_name: "glass sheet",
				merge_type: "GlassSheet",
				novariants: false,
				recipes: [
					{
						name: "fulltile window",
						template_name: "window_construct",
						cost: 2,
						time: 200,
						cant_cross: ["Window"],
						on_floor: true,
					},
				],
			},
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/righthand/",
				force: 5,
				attack_verb: ["bashed", "battered", "bludgeoned", "thrashed", "smashed"],
				inhand_icon_state: "sheet-glass",
			},
			Tangible: {
				throw_force: 5,
				throw_speed: 1,
				throw_range: 3,
			},
		},
		name: "glass",
		desc: "HOLY SHEET! That is a lot of glass.",
		icon_state: "sheet-glass",
	},
};

class RGlassSheet extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
	}
}

RGlassSheet.depends = ["Stack"];
RGlassSheet.loadBefore = ["Stack"];

RGlassSheet.template = {
	vars: {
		components: {
			Stack: {
				full_size: 3,
				singular_name: "reinforced glass sheet",
				merge_type: "RGlassSheet",
				novariants: false,
				recipes: [
					{
						name: "fulltile reinforced window",
						template_name: "r_window_construct",
						cost: 2,
						time: 2000,
						cant_cross: ["Window"],
						on_floor: true,
					},
				],
			},
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/righthand/",
				force: 5,
				attack_verb: ["bashed", "battered", "bludgeoned", "thrashed", "smashed"],
				inhand_icon_state: "sheet-rglass",
			},
			Tangible: {
				throw_force: 5,
				throw_speed: 1,
				throw_range: 3,
			},
		},
		name: "reinforced glass",
		desc: "Glass which seems to have rods or something stuck in them.",
		icon_state: "sheet-rglass",
	},
};

class GlassShard extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);

		this.a.icon_state = _.sample(["small", "medium", "large"]);
		this.a.once("moved", () => {
			const bxo = Math.random() - 0.5;
			const byo = Math.random() - 0.5;
			if (this.a.icon_state === "small") {
				this.a.move(bxo * 0.75, byo * 0.75, "placement");
			}
			if (this.a.icon_state === "medium") {
				this.a.move(bxo * 0.5, byo * 0.5, "placement");
			}
			if (this.a.icon_state === "large") {
				this.a.move(bxo * 0.3125, byo * 0.3125, "placement");
			}
		});
	}
}

GlassShard.depends = ["Item"];
GlassShard.loadBefore = ["Item"];

GlassShard.template = {
	vars: {
		components: {
			Item: {
				size: 1,
				force: 5,
				inhand_icon_state: "shard-glass",
				inhand_lhand_icon: "icons/mob/inhands/lefthand_weapons/",
				inhand_rhand_icon: "icons/mob/inhands/righthand_weapons/",
				attack_verb: ["stabbed", "slashed", "sliced", "cut"],
				hitsound: "sound/weapons/bladeslice.ogg",
				sharpness: combat_defines.IS_SHARP,
			},
			Destructible: {
				max_integrity: 40,
				armor: {
					melee: 100,
					bullet: 0,
					laser: 0,
					energy: 100,
					bomb: 0,
					bio: 0,
					rad: 0,
					fire: 50,
					acid: 100,
				},
			},
			Tangible: {
				throw_force: 10,
			},
			Examine: {
				desc: "A nasty looking shard of glass.",
			},
		},
		name: "shard",
		icon: "icons/obj/shards/",
		icon_state: "large",
	},
};

module.exports.components = {GlassShard, GlassSheet, RGlassSheet};
