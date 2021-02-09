export{};
const {
	Component,
	chain_func,
	has_component,
	sleep,
} = require("./../../../../../code/game/server.js");

const layers = require("../../../../defines/layers.js");
const pass_flags = require("../../../../defines/pass_flags.js");

const _locked:any = Symbol("_locked");

class Door extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);

		this.seconds_electrified = 0;
		this.shockedby = [];
		this.operating = false;
		this.a.layer = this.a.density > 0 ? this.closed_layer : this.open_layer;
		this.a.opacity = this.a.density > 0 && !this.glass;
		this.a.on("bumped_by", this.bumped_by.bind(this));
		this.a.c.RequiresAccess.can_access = chain_func(
			this.a.c.RequiresAccess.can_access,
			this.can_access
		);
		this.a.attack_hand = (user) => {
			this.try_to_activate_door(user);
		};
		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));

		if (this.glass) {this.a.let_pass_flags |= pass_flags.PASSGLASS;}
	}

	bumped_by(atom) {
		if (this.operating) {return;}
		this.bump_open(atom);
	}

	bump_open(atom) {
		if (this.a.density > 0 && has_component(atom, "LivingMob")) {
			if (this.a.c.RequiresAccess.can_access(atom)) {
				this.open();
			} else {
				this.deny();
			}
		}
	}

	try_to_activate_door(atom) {
		if (this.operating) {return false;}
		if (this.a.c.RequiresAccess.can_access(atom)) {
			if (this.a.density > 0) {
				this.open();
			} else {
				this.close();
			}
			return true;
		}
		if (this.a.density > 0) {this.deny();}
	}

	can_access(prev) {
		if (this.emergency) {return true;}
		return prev();
	}

	async open() {
		if (this.a.density <= 0) {return true;}
		if (this.operating) {return;}
		this.operating = true;
		this.a.opacity = false;
		await sleep(500);
		this.a.density = 0;
		await sleep(500);
		this.a.layer = this.open_layer;
		this.a.icon_state = this.open_state;
		this.a.opacity = false;
		this.operating = false;
		if (this.autoclose) {
			setTimeout(() => {
				this.close();
			}, this.autoclose_delay);
		}
		this.emit("opened");
		return true;
	}

	async close() {
		if (this.a.density > 0) {return true;}
		if (this.operating) {return;}
		if (this.safe) {
			for (const atom of this.a.crosses()) {
				if (atom.density > 0) {
					if (this.autoclose) {
						setTimeout(() => {
							this.close();
						}, 6000);
					}
					return;
				}
			}
		}
		this.operating = true;

		this.a.layer = this.closed_layer;
		await sleep(500);
		this.a.density = 1;
		await sleep(500);
		this.a.icon_state = this.closed_state;
		if (!this.glass) {this.a.opacity = true;}
		if (this.safe) {
			for (const atom of this.a.crosses()) {
				if (has_component(atom, "LivingMob")) {
					setTimeout(() => {
						this.open();
					}, 100);
					break;
				}
			}
		} else {
			this.crush();
		}
		this.operating = false;
		this.emit("closed");
		return true;
	}

	crush() {return;}

	deny() {return;}

	try_to_crowbar(/*tool, user*/) {return;}

	try_to_weld(/*tool, user*/) {return;}

	attack_by(prev, item, user) {
		if (has_component(item, "Tool") && item.c.Tool.can_use("Crowbar")) {
			this.try_to_crowbar(item, user);
			return true;
		}
		if (has_component(item, "Tool") && item.c.Tool.can_use("Welder")) {
			this.try_to_weld(item, user);
			return true;
		}
		return prev();
	}

	get locked() {
		return !!this[_locked];
	}

	set locked(val) {
		val = !!val;
		if (val === this[_locked]) {return;}
		this[_locked] = val;
		if (val) {this.emit("locked");}
		else {this.emit("unlocked");}
	}
}

Door.template = {
	vars: {
		components: {
			Door: {
				glass: false,
				welded: false,
				normalspeed: true,
				heat_proof: false, // For rglass-windowed airlocks and firedoors
				emergency: false, // Emergency access override
				sub_door: false, // true if it's meant to go under another door.
				closed_layer: layers.CLOSED_DOOR_LAYER,
				open_layer: layers.OPEN_DOOR_LAYER,
				autoclose: false, // does it automatically close after some time
				autoclose_delay: 6000,
				safe: true, // whether the door detects things and mobs in its way and reopen, or crushes them.
				locked: false, // whether the door is bolted or not
				damage_deflection: 10,
				open_state: "door1",
				closed_state: "door0",
				opening_state: "doorc0",
				closing_state: "doorc1",
			},
			Tangible: {
				anchored: true,
			},
			Examine: {
				desc: "It opens and closes.",
			},
		},
		density: true,
		layer: layers.CLOSED_DOOR_LAYER,
	},
};

Door.depends = ["Destructible", "RequiresAccess"];
Door.loadBefore = ["Destructible", "RequiresAccess"];

module.exports.components = { Door };
