
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

	attack_by(prev: any, item: any, user: any) {
		if (this.try_decon(item, user)) {return true;}
		return prev();
	}

	try_decon(item: any, user: any) {
		if (has_component(item, "Tool")) {
			if (item.c.Tool.can_use("Axe", user)) {
				item.c.Tool.used("Axe");
				to_chat`<span class='notice'>You begin chopping down the ${this.a.name}...</span>`(user);
				user.c.MobInventory.do_after({
					delay: this.slicing_duration * item.c.Tool.toolspeed,
					target: this.a,
				}).then((success: any) => {
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

	ex_act(prev: any, severity: number) {
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

module.exports.components = { Wild };
