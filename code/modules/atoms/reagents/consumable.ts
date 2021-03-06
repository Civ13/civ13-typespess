export{};
const {Component, visible_message, to_chat} = require("./../../../../code/game/server.js");

class Consumable extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.apply_type = "ingest";
		this.apply_method = "swallow";
		this.self_delay = 0;
		this.raw = true; //food with the raw tag toggled has to be cooked before ingesting.
		this.a.c.Item.attack = this.attack.bind(this);
	}

	attack(target: Record<string, any>, user: Record<string, any>) {
		if (!this.a.c.ReagentHolder.can_consume(target, user)) {return true;}

		(async () => {
			if (target === user) {
				visible_message`<span class='notice'>The ${user} attempts to ${this.apply_method} the ${this.a}</span>`.emit_from(
					target
				);
				if (this.self_delay && !(await user.c.MobInventory.do_after({target, delay: this.self_delay}))) {return false;}
				to_chat`<span class='notice'>You ${this.apply_method} the ${this.a}.</span>`(user);
			} else {
				visible_message`<span class='danger'>The ${user} attempts to force the ${target} to ${this.apply_method} the ${this.a}.</span>`
					.self`<span class='userdanger'>The ${user} attempts to force you to ${this.apply_method} the ${this.a}.</span>`.emit_from(
					target
				);
				if (!(await user.c.MobInventory.do_after({target, delay: 3000}))) {return false;}
				visible_message`<span class='danger'>The ${user} forces the ${target} to ${this.apply_method} the ${this.a}.</span>`
					.self`<span class='userdanger'>The ${user} forces you to ${this.apply_method} the ${this.a}.</span>`.emit_from(
					target
				);
			}

			this.a.c.ReagentHolder.react_atom(target, "ingest");
			this.a.c.ReagentHolder.transfer_percent_to(target, 1);
			this.a.destroy();
		})();
		return true;
	}
}

Consumable.loadBefore = ["Item", "ReagentHolder"];
Consumable.depends = ["Item", "ReagentHolder"];

Consumable.template = {
	vars: {
		components: {
			ReagentHolder: {
				maximum_volume: 50,
			},
			Item: {
				inhand_lhand_icon: "icons/mob/inhands/lefthand/",
				inhand_rhand_icon: "icons/mob/inhands/righthand/",
				inhand_icon_state: "pill",
			},
			Examine: {
				desc: "A tablet or capsule.",
			},
		},
		name: "pill",
		icon: "icons/obj/chemical/",
		icon_state: "pill",
	},
};

module.exports.components = {Consumable};
