export{};
const {
	Component,
	has_component,
} = require("./../../../../../../code/game/server.js");

class Belt extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.on("entered", this.entered.bind(this));
		this.a.on("exited", this.exited.bind(this));
	}

	entered(movement: Record<string,any>) {
		const item = movement.atom;
		if (has_component(item, "Item") && this.content_overlays)
			{item.c.Item.apply_belt_overlay(this.a);}
	}
	exited(movement: Record<string,any>) {
		const item = movement.atom;
		if (has_component(item, "Item") && this.content_overlays)
			{item.c.Item.unapply_belt_overlay(this.a);}
	}
}

Belt.loadBefore = ["StorageItem", "BeltItem"];
Belt.depends = ["StorageItem", "BeltItem"];

Belt.template = {
	vars: {
		components: {
			Belt: {
				content_overlays: false, //If this is true, the belt will gain overlays based on what it's holding
			},
			Item: {
				inhand_icon_state: "utility",
				attack_verb: ["whipped", "lashed", "disciplined"],
			},
			Destructible: {
				max_integrity: 300,
			},
			Examine: {
				desc: "Can hold various things.",
			},
		},
		name: "belt",
		icon: "icons/mob/under/belts/",
		icon_state: "utilitybelt",
	},
};

module.exports.components = { Belt };
