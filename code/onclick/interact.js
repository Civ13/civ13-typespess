
const {
	Component,
	Atom,
	has_component,
	make_watched_property,
} = require("./../../typespess/index.js");
const combat_defines = require("../defines/combat_defines.js");
const mob_defines = require("../defines/mob_defines.js");

class MobInteract extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.a.c.Mob.on("click_on", this.click_on.bind(this));
		this.next_move = 0;
		make_watched_property(this, "nointeract_counter", "number");
		if (this.zone_sel_template) {
			let zone_sel = new Atom(this.a.server, this.zone_sel_template);
			process.nextTick(() => {
				zone_sel.c.ZoneSel.set_mob(this.a);
			});
			this.a.c.Eye.screen.zone_sel = zone_sel;
		}

		this.move_mode = mob_defines.MOVE_INTENT_RUN;
		this.a.c.Eye.screen.move_intent = new Atom(this.a.server, {
			vars: {
				icon: "icons/ui/screen_civ13/running.png",
				screen_loc_x: 12.8125,
				screen_loc_y: 0.15625,
				layer: 30,
			},
		});

		this.a.c.Eye.screen.move_intent.on("clicked", () => {
			this.move_intent();
		});
		this.on("nointeract_counter_changed", (from, to) => {
			if ((from && !to) || (to && !from)) this.a.c.MobHud.update_buttons();
		});
	}

	click_on(e) {
		if (e.ctrlKey || e.altKey || e.shiftKey) return;
		let isliving = has_component(this.a, "LivingMob");
		let hasinv = has_component(this.a, "MobInventory");

		if (this.next_move > this.a.server.now()) return;

		if (isliving && !this.can_interact()) return;

		if (hasinv && this.a.c.MobInventory.handcuffed) {
			return;
		}

		if (
			hasinv &&
      this.a.c.MobInventory.throw_mode &&
      (!e.atom || (e.atom.loc && e.atom.loc.is_base_loc)) &&
      this.a.loc &&
      this.a.loc.is_base_loc
		) {
			this.a.c.MobInventory.throw_item({
				x: e.world_x - 0.5,
				y: e.world_y - 0.5,
			});
			return;
		}

		var active_item = hasinv
			? this.a.c.MobInventory.slots[this.a.c.MobInventory.active_hand].item
			: null;

		if (e.atom) {
			if (active_item == e.atom) {
				active_item.c.Item.attack_self(this.a);
				return;
			}

			if (
				Math.abs(e.atom.x - this.a.x) <= 1.50001 &&
        Math.abs(e.atom.y - this.a.y) <= 1.50001
			) {
				if (active_item) {
					active_item.c.Item.melee_attack_chain(this.a, e.atom, e);
				} else {
					if (has_component(e.atom, "Mob"))
						this.change_next_move(combat_defines.CLICK_CD_MELEE);
					this.unarmed_attack(e.atom, e);
				}
				return;
			} else {
				if (active_item) {
					active_item.c.Item.after_attack(e.atom, this.a, false, e);
				} else {
					this.ranged_attack(e.atom, e);
				}
			}
		} else {
			let flag =
        Math.abs(Math.floor(e.world_x) - this.a.x) <= 1.50001 &&
        Math.abs(Math.floor(e.world_y) - this.a.y) <= 1.50001;
			let target = {
				x: e.world_x - 0.5,
				y: e.world_y - 0.5,
				z: this.a.z,
				is_fine_loc: true,
				loc: this.a.dim.location(
					Math.floor(e.world_x),
					Math.floor(e.world_y),
					this.a.z
				),
			};
			if (active_item) active_item.c.Item.attack_space(target, this.a, flag, e);
		}
	}

	can_interact() {
		if (this.nointeract_counter) return false;
		return true;
	}

	move_intent() {
		if (this.move_mode == mob_defines.MOVE_INTENT_RUN) {
			this.move_mode = mob_defines.MOVE_INTENT_WALK;
			this.a.c.Eye.screen.move_intent.icon_state = "walking";
		} else {
			this.move_mode = mob_defines.MOVE_INTENT_RUN;
			this.a.c.Eye.screen.move_intent.icon_state = "running";
		}
	}

	change_next_move(num) {
		this.next_move =
      this.a.server.now() +
      (num + this.next_move_adjust) * this.next_move_modifier;
	}

	unarmed_attack(target, e) {
		target.attack_hand(this.a, e);
	}

	resist() {
		if (this.next_move > this.a.server.now() || !this.can_interact()) return;
		this.change_next_move(mob_defines.CLICK_CD_RESIST);
		this.resist_act();
	}

	resist_act() {return;}

	ranged_attack() {return;}
}

MobInteract.template = {
	vars: {
		components: {
			MobInteract: {
				next_move_adjust: 0,
				next_move_modifier: 1,
				zone_sel: "chest",
				zone_sel_template: null,
				act_intents: ["help", "harm"],
				act_intent: "help",
				nointeract_counter: 0,
				advanced_tool_user: false, // Fun fact on tg this is a proc for no reason. A proc that just returns true/false. As in that's the only thing it does.
			},
		},
	},
};

MobInteract.depends = ["Mob", "MobHud"];
MobInteract.loadBefore = ["Mob", "MobHud"];

module.exports.components = { MobInteract };
