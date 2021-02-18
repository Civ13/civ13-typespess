export{};
const {Component, chain_func} = require("./../../../../../../code/game/server.js");
const layers = require("../../../../../defines/layers.js");

class Closet extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.c.LargeContainer.open = chain_func(this.a.c.LargeContainer.open, this.open.bind(this));
		this.a.c.LargeContainer.close = chain_func(this.a.c.LargeContainer.close, this.close.bind(this));
	}

	open(prev: any) {
		if (!prev()) {
			return false;
		}
		this.a.layer = layers.BELOW_OBJ_LAYER;
		this.a.overlays.door = {icon_state: "[parent]_open"};
		return true;
	}

	close(prev: any) {
		if (!prev()) {
			return false;
		}
		this.a.layer = layers.OBJ_LAYER;
		this.a.overlays.door = {
			icon_state: `${this.icon_door || "[parent]"}_door`,
		};
		return true;
	}
}

Closet.depends = ["LargeContainer"];
Closet.loadBefore = ["LargeContainer"];

Closet.template = {
	vars: {
		components: {
			Closet: {
				icon_door: null,
				welded: false,
			},
			Examine: {
				desc: "It's a basic storage unit.",
			},
		},
		name: "closet",
		icon: "icons/obj/storage/",
		icon_state: "cabinet",
	},
};

module.exports.components = {Closet};
