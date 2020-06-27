
//trees, bushes, and so on
///////////////////////////

const layers = require("../../../../defines/layers.js");
const {
	Component,
	Sound,
	has_component,
	Atom,
	chain_func,
	to_chat,
} = require("./../../../../../typespess/index.js");

class Wild extends Component {
	constructor(atom, template) {
		super(atom, template);

		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
		this.a.c.Destructible.deconstruct = chain_func(
			this.a.c.Destructible.deconstruct,
			this.deconstruct.bind(this)
		);
		this.a.c.Examine.examine = chain_func(
			this.a.c.Examine.examine,
			this.examine.bind(this)
		);
		this.a.c.Tangible.ex_act = chain_func(
			this.a.c.Tangible.ex_act,
			this.ex_act.bind(this)
		);
	}

	examine(prev) {
		prev();
	}

	attack_by(prev, item, user) {
		if (this.try_decon(item, user)) return true;
		return prev();
	}

	try_decon(item, user) {
		if (has_component(item, "Tool")) {
			if (item.c.Tool.can_use("Axe", user)) {
				item.c.Tool.used("Axe");
				to_chat`<span class='notice'>You begin chopping down the ${this.name}...</span>`(
					user
				);
				user.c.MobInventory.do_after({
					delay: this.slicing_duration * item.c.Tool.toolspeed,
					target: this.a,
				}).then((success) => {
					if (!success) return;
					new Sound(this.a.server, {
						path: "sound/items/welder.ogg",
						volume: 1,
						vary: true,
					}).emit_from(this.a);
					this.a.c.Destructible.deconstruct(true);
					to_chat`<span class='notice'>You chop down the ${this.name}!</span>`(
						user
					);
				});
				return true;
			}
		}
	}

	deconstruct(prev) {
		if (!this.a.loc) return;
		if (!this.a.c.Destructible.no_deconstruct) {
			let sheets = new Atom(this.a.server, this.sheet_type);
			sheets.c.Stack.amount = this.sheet_amount;
			sheets.loc = this.a.fine_loc;
			this.a.destroy();
		}
		prev();
	}

	ex_act(prev, severity) {
		if (severity >= 1) {
			if (Math.random() < this.hardness) {
				this.a.c.Destructible.deconstruct(false);
			}
		} else {
			prev();
		}
	}
}

Wild.one_per_tile = true;

Wild.depends = ["Destructible"];
Wild.loadBefore = ["Destructible"];

Wild.template = {
	vars: {
		components: {
			Wild: {
				slicing_duration: 10000,
				sheet_type: "wood",
				sheet_amount: 7,
			},
			Tangible: {
				anchored: true,
				explosion_block: 0,
			},
			Examine: {
				desc: "A piece of vegetation.",
			},
		},
		icon: "icons/obj/flora/bushes/smallbush1.png",
		icon_state: null,
		layer: layers.ABOVE_ALL_MOB_LAYER,
		density: 0,
		opacity: false,
	},
};

module.exports.templates = {
	bush: {
		components: ["Wild"],
		vars: {
			name: "small bush",
			icon: "icons/obj/flora/bushes/smallbush1.png",
			density: 0,
			opacity: false,
			layer: layers.BELOW_MOB_LAYER,
			components: {
				Examine: {
					desc: "A small bush.",
				},
				Wild: {
					slicing_duration: 7000,
					sheet_type: "straw",
					sheet_amount: 1,
				},
			}
		},
		variants: [
			{
				type: "single",
				var_path: ["icon"],
				values: ["icons/obj/flora/bushes/smallbush1.png",
					"icons/obj/flora/bushes/smallbush2.png",
					"icons/obj/flora/bushes/smallbush3.png",
					"icons/obj/flora/bushes/smallbush4.png",
					"icons/obj/flora/bushes/smallbush5.png",
					"icons/obj/flora/bushes/smallbush6.png",
					"icons/obj/flora/bushes/smallbush7.png",
					"icons/obj/flora/bushes/smallbush8.png",
					"icons/obj/flora/bushes/smallbush9.png",
					"icons/obj/flora/bushes/smallbush10.png",
					"icons/obj/flora/bushes/smallbush11.png",
					"icons/obj/flora/bushes/smallbush12.png",
					"icons/obj/flora/bushes/smallbush13.png",
					"icons/obj/flora/bushes/smallbush14.png",
					"icons/obj/flora/bushes/smallbush15.png",
					"icons/obj/flora/bushes/smallbush16.png",
					"icons/obj/flora/bushes/smallbush17.png",
					"icons/obj/flora/bushes/smallbush18.png",
					"icons/obj/flora/bushes/smallbush19.png",
					"icons/obj/flora/bushes/smallbush20.png",
					"icons/obj/flora/bushes/smallbush21.png",
					"icons/obj/flora/bushes/smallbush22.png",
					"icons/obj/flora/bushes/smallbush23.png",
					"icons/obj/flora/bushes/smallbush24.png",
					"icons/obj/flora/bushes/smallbush25.png",
					"icons/obj/flora/bushes/smallbush26.png",
					"icons/obj/flora/bushes/smallbush27.png",
					"icons/obj/flora/bushes/smallbush28.png",
					"icons/obj/flora/bushes/smallbush29.png",
					"icons/obj/flora/bushes/smallbush30.png",
					"icons/obj/flora/bushes/smallbush31.png",
					"icons/obj/flora/bushes/smallbush32.png",
					"icons/obj/flora/bushes/smallbush33.png",
					"icons/obj/flora/bushes/smallbush34.png",
					"icons/obj/flora/bushes/smallbush35.png",
					"icons/obj/flora/bushes/smallbush36.png",
					"icons/obj/flora/bushes/smallbush37.png",
					"icons/obj/flora/bushes/smallbush38.png",
					"icons/obj/flora/bushes/smallbush39.png",
					"icons/obj/flora/bushes/smallbush40.png",
					"icons/obj/flora/bushes/smallbush41.png",
					"icons/obj/flora/bushes/smallbush42.png",
					"icons/obj/flora/bushes/smallbush43.png",
					"icons/obj/flora/bushes/smallbush44.png",
				],
			},
		],
		tree_paths: ["basic_structures/flora/bush"],
	},
	tree: {
		components: ["Wild"],
		vars: {
			name: "tree",
			icon: "icons/obj/flora/bigtrees/tree1.png",
			density: 1,
			components: {
				Examine: {
					desc: "A large temperate tree.",
				},
			}
		},
		variants: [
			{
				type: "single",
				var_path: ["icon"],
				values: ["icons/obj/flora/bigtrees/tree1.png",
					"icons/obj/flora/bigtrees/tree2.png",
					"icons/obj/flora/bigtrees/tree3.png",
					"icons/obj/flora/bigtrees/tree4.png",
					"icons/obj/flora/bigtrees/tree5.png",],
			},
		],
		tree_paths: ["basic_structures/flora/tree"],
	},
	grass: {
		components: ["Wild"],
		vars: {
			name: "grass",
			icon: "icons/obj/flora/wild/tall_grass_1.gif",
			density: 0,
			opacity: false,
			components: {
				Examine: {
					desc: "A patch of grass.",
				},
				Wild: {
					slicing_duration: 7000,
					sheet_type: "straw",
					sheet_amount: 1,
				},
			}
		},
		variants: [
			{
				type: "single",
				var_path: ["icon"],
				values: ["icons/obj/flora/wild/tall_grass_1.gif",
					"icons/obj/flora/wild/tall_grass_2.gif",
					"icons/obj/flora/wild/tall_grass_3.gif",
					"icons/obj/flora/wild/tall_grass_4.gif",
					"icons/obj/flora/wild/tall_grass_5.gif",
					"icons/obj/flora/wild/tall_grass_6.gif",
					"icons/obj/flora/wild/tall_grass_7.gif",
					"icons/obj/flora/wild/tall_grass_8.gif",
					"icons/obj/flora/wild/tall_grass_9.gif",],
			},
		],
		tree_paths: ["basic_structures/flora/grass"],
	},
};

module.exports.components = { Wild };
