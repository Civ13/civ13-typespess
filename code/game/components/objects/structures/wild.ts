
//trees, bushes, and so on
///////////////////////////
export{};
const layers = require("../../../../defines/layers.js");
const {
	Component,
	has_component,
	Atom,
	chain_func,
	to_chat,
} = require("./../../../../../code/game/server.js");

class Wild extends Component {
	constructor(atom: any, template: any) {
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
		if (this.try_decon(item, user)) {return true;}
		return prev();
	}

	try_decon(item, user) {
		if (has_component(item, "Tool")) {
			if (item.c.Tool.can_use("Axe", user)) {
				item.c.Tool.used("Axe");
				to_chat`<span class='notice'>You begin chopping down the ${this.a.name}...</span>`(user);
				user.c.MobInventory.do_after({
					delay: this.slicing_duration * item.c.Tool.toolspeed,
					target: this.a,
				}).then((success) => {
					if (!success) {return;}
					this.a.c.Destructible.deconstruct(true);
					to_chat`<span class='notice'>You chop down the ${this.a.name}!</span>`(user);
				});
				return true;
			}
		}
	}

	deconstruct(prev) {
		if (!this.a.loc) {return;}
		if (!this.a.c.Destructible.no_deconstruct) {
			const sheets = new Atom(this.a.server, this.sheet_type);
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
				slicing_duration: 8000,
				sheet_type: "wood_sheet",
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
		icon: "icons/obj/flora/bushes/",
		icon_state: "smallbush1",
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
			icon: "icons/obj/flora/bushes/",
			icon_state: "",
			density: 0,
			opacity: false,
			layer: layers.BELOW_MOB_LAYER,
			components: {
				Examine: {
					desc: "A small bush.",
				},
				Wild: {
					slicing_duration: 7000,
					sheet_type: "straw_sheet",
					sheet_amount: 1,
				},
			}
		},
		variants: [
			{
				type: "single",
				var_path: ["icon_state"],
				values: ["smallbush1",
					"smallbush2",
					"smallbush3",
					"smallbush4",
					"smallbush5",
					"smallbush6",
					"smallbush7",
					"smallbush8",
					"smallbush9",
					"smallbush10",
					"smallbush11",
					"smallbush12",
					"smallbush13",
					"smallbush14",
					"smallbush15",
					"smallbush16",
					"smallbush17",
					"smallbush18",
					"smallbush19",
					"smallbush20",
					"smallbush21",
					"smallbush22",
					"smallbush23",
					"smallbush24",
					"smallbush25",
					"smallbush26",
					"smallbush27",
					"smallbush28",
					"smallbush29",
					"smallbush30",
					"smallbush31",
					"smallbush32",
					"smallbush33",
					"smallbush34",
					"smallbush35",
					"smallbush36",
					"smallbush37",
					"smallbush38",
					"smallbush39",
					"smallbush40",
					"smallbush41",
					"smallbush42",
					"smallbush43",
					"smallbush44",
				],
			},
		],
		tree_paths: ["structures/flora/bush"],
	},
	tree: {
		components: ["Wild"],
		vars: {
			name: "tree",
			icon: "icons/obj/flora/bigtrees/",
			icon_state: "",
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
				var_path: ["icon_state"],
				values: ["tree1",
					"tree2",
					"tree3",
					"tree4",
					"tree5",],
			},
		],
		tree_paths: ["structures/flora/tree"],
	},
	grass: {
		components: ["Wild"],
		vars: {
			name: "grass",
			icon: "icons/obj/flora/wild/",
			icon_state: "",
			density: 0,
			opacity: false,
			components: {
				Examine: {
					desc: "A patch of grass.",
				},
				Wild: {
					slicing_duration: 7000,
					sheet_type: "straw_sheet",
					sheet_amount: 1,
				},
			}
		},
		variants: [
			{
				type: "single",
				var_path: ["icon_state"],
				values: ["tall_grass_1",
					"tall_grass_2",
					"tall_grass_3",
					"tall_grass_4",
					"tall_grass_5",
					"tall_grass_6",
					"tall_grass_7",
					"tall_grass_8",
					"tall_grass_9",],
			},
		],
		tree_paths: ["structures/flora/grass"],
	},
};

module.exports.components = { Wild };
