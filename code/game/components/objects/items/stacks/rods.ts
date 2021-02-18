export{};
const {Component} = require("./../../../../../../code/game/server.js");

class StackRod extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.c.Stack.on("amount_changed", this.amount_changed.bind(this));
		this.amount_changed();
	}

	amount_changed() {
		if (this.a.c.Stack.amount <= 5) {
			this.a.icon_state = `rods-${this.a.c.Stack.amount}`;
		} else {
			this.a.icon_state = "rods";
		}
	}
}

StackRod.template = {
	vars: {
		components: {
			Item: {
				force: 9,
				materials: {metal: 1000},
				attack_verb: ["hit", "bludgeoned", "whacked"],
				inhand_icon_state: "rods",
				hitsound: "sound/weapons/grenadelaunch.ogg",
			},
			Stack: {
				novariants: true,
				max_amount: 50,
				merge_type: "StackRod",
				singular_name: "rod",
				recipes: [
					{
						name: "table frame",
						template_name: "table_frame",
						cost: 2,
						time: 10000,
						cant_cross: ["TableFrame"],
						on_floor: true,
					},
				],
			},
			Tangible: {
				throw_force: 10,
				throw_speed: 3,
				throw_range: 7,
			},
			Examine: {
				desc: "Some rods. Can be used for building, or something.",
			},
		},
		name: "metal rod",
		icon_state: "rods",
	},
};

StackRod.depends = ["Stack"];
StackRod.loadBefore = ["Stack"];

module.exports.components = {StackRod};
