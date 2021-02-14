export{};
const {
	Component,
	has_component,
	chain_func,
	to_chat,
	Atom,
} = require("./../../../../../code/game/server.js");
const pass_flags = require("../../../../defines/pass_flags.js");
const layers = require("../../../../defines/layers.js");

class Rack extends Component {
	//TODO: attack_hand() and by extension play_attack_sound. Basically, you can't kick racks yet.
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
		this.a.c.Examine.examine = chain_func(
			this.a.c.Examine.examine,
			this.examine.bind(this)
		);
		this.a.c.Destructible.deconstruct = chain_func(
			this.a.c.Destructible.deconstruct,
			this.deconstruct.bind(this)
		);
	}

	examine(prev: any, user: any) {
		prev();
		to_chat`<span class='notice'>It's held together by a couple of <b>bolts</b>.</span>`(
			user
		);
	}

	attack_by(prev: any, item: Record<string,any>, user: Record<string,any>, e: Record<string,any>) {
		if (has_component(item, "Tool") && item.c.Tool.can_use("Wrench", user)) {
			item.c.Tool.used("Wrench");
			this.a.c.Destructible.deconstruct();
			return true;
		} else if (item.c.Item.slot && item.c.Item.slot.can_unequip()) {
			//Yes this is from table code. Because I like it more than how racks in DM handle placing items. Sue me.
			item.glide_size = 0;
			item.loc = this.a.base_mover.fine_loc;
			const dx = Math.min(Math.max(e.x - 0.5, -0.5), 0.5);
			const dy = Math.min(Math.max(e.y - 0.5, -0.5), 0.5);
			item.move(dx, dy, "placement");
			return true;
		}
	}

	deconstruct() {
		if (!this.a.loc) {return;}
		if (!this.a.c.Destructible.no_deconstruct) {
			this.a.density = 0;
			// eslint-disable-next-line no-new
			new Atom(this.a.server, "rack_parts", this.a.loc);
			//TODO: fingerprints
			this.a.destroy();
		}
	}
}

class RackParts extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
		this.a.c.Item.attack_self = this.attack_self.bind(this);
	}

	attack_by(prev: any, item: any, user: any) {
		if (has_component(item, "Tool")) {
			if (item.c.Tool.can_use("Wrench", user)) {
				item.c.Tool.used("Wrench");
				const sheets = new Atom(this.a.server, "metal_sheet");
				sheets.c.Stack.amount = 2;
				sheets.loc = user.loc;
				this.a.destroy();
				return true;
			}
		}
	}

	attack_self(user: Record<string,any>) {
		to_chat`<span class='notice'>You start constructing a rack...</span>`(user);
		user.c.MobInventory.do_after({ delay: 5000, target: this.a }).then(
			(success: any) => {
				if (!success) {return;}
				// eslint-disable-next-line no-new
				new Atom(this.a.server, "rack", user.loc);
				this.a.destroy();
			}
		);
	}
}

Rack.one_per_tile = true;

Rack.depends = ["Destructible"];
Rack.loadBefore = ["Destructible"];

Rack.template = {
	vars: {
		components: {
			Destructible: {
				max_integrity: 20,
			},
			Tangible: {
				anchored: true,
			},
			Examine: {
				desc: "Different from the Middle Ages version.",
			},
		},
		name: "rack",
		icon: "icons/obj/misc/",
		icon_state: "rack",
		let_pass_flags: pass_flags.LETPASSTHROW,
		layer: layers.TABLE_LAYER,
		density: 1,
	},
};

RackParts.depends = ["Item"];
RackParts.loadBefore = ["Item"];

RackParts.template = {
	vars: {
		components: {
			Examine: {
				desc: "Parts of a rack.",
			},
			Item: {
				materials: { metal: 2000 },
			},
		},
		name: "rack parts",
		icon: "icons/obj/misc/",
		icon_state: "rack_parts",
		//TODO: flags_1 = CONDUCT_1
	},
};

module.exports.components = { Rack, RackParts };
