export{};
const {
	Component,
	chain_func,
	make_watched_property,
	to_chat,
} = require("./../../../code/game/server.js");

class PowerCell extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		if (!this.start_empty) {this.charge = this.max_charge;}
		this.on("charge_changed", this.charge_changed.bind(this));
		this.a.c.Examine.examine = chain_func(
			this.a.c.Examine.examine,
			this.examine.bind(this)
		);

		make_watched_property(this, "charge", "number");
	}

	charge_changed(from, to) {
		if (to > this.max_charge) {this.charge = this.max_charge;}
		if (to < 0) {this.charge = 0;}

		if (to < 0.01) {this.a.overlays.charge_overlay = null;}
		else if (to / this.max_charge >= 0.995)
			{this.a.overlays.charge_overlay = { icon_state: "cell-o2" };}
		else {this.a.overlays.charge_overlay = { icon_state: "cell-o1" };}
	}

	use(amount) {
		const to_use = Math.min(this.charge, amount);
		this.charge = Math.max(this.charge - amount, 0);
		return to_use;
	}

	give(amount) {
		const to_give = Math.min(this.max_charge - this.charge, amount);
		this.charge = Math.min(this.charge + amount, this.max_charge);
		return to_give;
	}

	get percent() {
		return (100 * this.charge) / this.max_charge;
	}
	set percent(val) {
		this.charge = (val * this.max_charge) / 100;
	}

	examine(prev, user) {
		prev();
		// TODO rigged
		to_chat`The charge meter reads ${Math.round(this.percent)}%.`(user);
	}
}

PowerCell.loadBefore = ["Item"];
PowerCell.depends = ["Item"];

PowerCell.template = {
	vars: {
		components: {
			PowerCell: {
				charge: 0,
				max_charge: 1000,
				charge_rate: 50, // this is per-second. BYOND ss13 is per tick. Divide byond values by 2.
				start_empty: false,
			},
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/righthand/",
				force: 5,
				size: 2,
				inhand_icon_state: "cell",
			},
			Tangible: {
				throw_force: 5,
				throw_speed: 2,
				throw_range: 5,
			},
			Examine: {
				desc: "A rechargeable electrochemical power cell.",
			},
		},
		name: "power cell",
		icon: "icons/obj/power/",
		icon_state: "cell",
	},
};

module.exports.templates = {
	cell: {
		components: ["PowerCell"],
		tree_paths: ["items/stock_parts/cell"],
	},
	cell_empty: {
		components: ["PowerCell"],
		vars: {
			components: {
				PowerCell: {
					start_empty: true,
				},
			},
		},
		tree_paths: ["items/stock_parts/cell"],
	},
	cell_upgraded: {
		components: ["PowerCell"],
		vars: {
			components: {
				PowerCell: {
					max_charge: 2500,
					charge_rate: 500,
				},
				Examine: {
					desc: "A power cell with a slightly higher capacity than normal!",
				},
			},
			name: "high-capacity power cell",
			icon_state: "icell",
		},
		tree_paths: ["items/stock_parts/cell/upgraded"],
	},
};

module.exports.components = { PowerCell };
