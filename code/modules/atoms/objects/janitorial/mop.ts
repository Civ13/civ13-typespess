export{};
const {
	Component,
	Sound,
	to_chat,
	visible_message,
	has_component,
	chain_func,
} = require("./../../../../../code/game/server.js");

class Mop extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.c.Item.after_attack = chain_func(
			this.a.c.Item.after_attack,
			this.after_attack.bind(this)
		);
	}

	after_attack(prev: any, target: Record<string,any>, user: Record<string,any>, prox: any) {
		if (!prox) {return prev();}

		if (has_component(target, "OpenReagentContainer")) {
			if (target.c.ReagentHolder.total_volume < 1)
				{to_chat`<span class='warning'>The ${target} is out of water!</span>`(
					user
				);}
			else {
				target.c.ReagentHolder.transfer_to(this.a, 5);
				to_chat`<span class='warning'>You wet the ${this.a} in the ${target}</span>`(
					user
				);
				new Sound(this.a.server, {
					path: "sound/effects/slosh.ogg",
					volume: 0.25,
					vary: true,
				}).emit_from(target);
			}
			return true;
		}

		if (this.a.c.ReagentHolder.total_volume < 1) {
			to_chat`<span class='warning'>Your mop is dry!</span>`(user);
			return;
		}

		const turf = (target.base_loc && target.base_loc.turf) || target;

		if (turf) {
			visible_message`The ${user} begins to clean the ${turf} with the ${this.a}.`
				.self`<span class='notice'>You begin to clean the ${turf} with the ${this.a}...</span>`.emit_from(
				user
			);
			user.c.MobInventory.do_after({
				delay: this.mop_speed,
				target: turf,
			}).then((success: Record<string,any>) => {
				if (!success) {return;}
				to_chat`<span class='notice'>You finish mopping.</span>`(user);
				if (this.a.c.ReagentHolder.volume_of("Water") >= 1) {
					for (const crosser of [...turf.crosses()]) {
						if (has_component(crosser, "CleanableDecal")) {
							crosser.destroy();
						}
					}
				}
				this.a.c.ReagentHolder.react_atom(turf, "touch", {
					volume_modifier: 10 / this.a.c.ReagentHolder.total_volume,
				});
				this.a.c.ReagentHolder.remove_any(1);
			});
		}
	}
}

Mop.depends = ["Item", "ReagentHolder"];
Mop.loadBefore = ["Item", "ReagentHolder"];

Mop.template = {
	vars: {
		components: {
			Mop: {
				mop_speed: 3000,
			},
			ReagentHolder: {
				maximum_volume: 5,
				init_reagents: { Water: 5 },
			},
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/righthand/",
				force: 3,
				size: 3,
				attack_verb: ["mopped", "bashed", "bludgeoned", "whacked"],
			},
			Tangible: {
				throw_force: 5,
				throw_speed: 3,
				throw_range: 7,
			},
			Examine: {
				desc: "The world of janitalia wouldn't be complete without a mop.",
			},
		},
		name: "mop",
		icon: "icons/obj/tools/",
		icon_state: "mop",
	},
};

module.exports.components = { Mop };
