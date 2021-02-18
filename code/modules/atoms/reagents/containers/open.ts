export{};
const {
	Component,
	has_component,
	chain_func,
	to_chat,
	visible_message,
	Sound,
} = require("./../../../../../code/game/server.js");

// Reagent containers where you can pour from one to another.
class OpenReagentContainer extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.c.Item.attack = this.attack.bind(this);
		this.a.c.Tangible.on("throw_finished", () => {
			this.splash();
		});
		this.a.c.Tangible.on("throw_impacted", (target: Record<string, any>) => {
			this.splash(target);
		});
	}

	attack(target: Record<string, any>, user: Record<string, any>) {
		if (!this.a.c.ReagentHolder.can_consume(target, user)) {return;}

		if (this.a.c.ReagentHolder.total_volume <= 0) {
			to_chat`<span class='warning'>The ${this.a} is empty!</span>`(user);
			return;
		}
		(async () => {
			if (target !== user) {
				visible_message`<span class='danger'>The ${user} attempts to feed something to the ${target}.</span>`
					.self`<span class='userdanger'>The ${user} attempts to feed something to you.</span>`.emit_from(
					target
				);
				if (!(await user.c.MobInventory.do_after({target, delay: 3000}))) {return;}
				if (this.a.c.ReagentHolder.total_volume <= 0) {return;}
			} else {
				to_chat`<span class='notice'>You swallow a gulp of the ${this.a}.</span>`(user);
			}
			const fraction = 5 / this.a.c.ReagentHolder.total_volume;
			this.a.c.ReagentHolder.react_atom(target, "ingest", {
				volume_modifier: fraction,
			});
			setTimeout(() => {
				this.a.c.ReagentHolder.transfer_to(target, 5);
			}, 500);
			new Sound(this.a.server, {
				path: "sound/items/drink.ogg",
				volume: 0.1 + Math.random() * 0.4,
				vary: true,
			}).emit_from(target);
		})();
	}

	splash(target: Record<string, any> = null) {
		if (this.a.c.ReagentHolder.total_volume <= 0) {return;}
		if (!target) {
			for (const crosser of this.a.crosses()) {
				if (has_component(crosser, "FloorBase") && (!target || crosser.layer > target.layer)) {
					target = crosser;
				}
			}
		}
		if (!target) {
			this.a.c.ReagentHolder.clear();
			return;
		}
		this.a.c.ReagentHolder.react_atom(target, "touch");
		visible_message`<span class='notice'>The ${this.a} spills its contents all over the ${target}.</span>`.emit_from(
			this.a
		);
		this.a.c.ReagentHolder.clear();
	}
}

OpenReagentContainer.depends = ["ReagentHolder", "Item", "ReagentReceiver"];
OpenReagentContainer.loadBefore = ["ReagentHolder", "Item", "ReagentReceiver"];

OpenReagentContainer.template = {
	vars: {
		components: {
			OpenReagentContainer: {
				transfer_amount: 10,
			},
			ReagentHolder: {
				drawable: true,
			},
		},
	},
};

class ReagentReceiver extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
	}

	attack_by(prev: any, item: any, user: any) {
		if (has_component(item, "OpenReagentContainer")) {
			if (!item.c.ReagentHolder.total_volume) {
				to_chat`<span class='warning'>The ${item} is empty!</span>`(user);
				return true;
			}

			if (this.a.c.ReagentHolder.total_volume >= this.a.c.ReagentHolder.maximum_volume) {
				to_chat`<span clas='notice'>The ${this.a} is full.</span>`(user);
				return true;
			}

			const trans = item.c.ReagentHolder.transfer_to(this.a, item.c.OpenReagentContainer.transfer_amount);
			to_chat`<span class='notice'>You transfer ${trans} unit${trans === 1 ? "" : "s"} of the solution to ${
				this.a
			}</span>`(user);
			return true;
		}
		return prev();
	}
}

ReagentReceiver.loadBefore = ["ReagentHolder"];
ReagentReceiver.depends = ["ReagentHolder"];

ReagentReceiver.template = {
	vars: {
		components: {
			ReagentHolder: {
				injectable: true,
			},
		},
	},
};

class GlassBeaker extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.c.ReagentHolder.on("added", this.update_filling.bind(this));
		this.a.c.ReagentHolder.on("removed", this.update_filling.bind(this));
		this.update_filling();
	}

	update_filling() {
		const percent = this.a.c.ReagentHolder.total_volume / this.a.c.ReagentHolder.maximum_volume;
		if (percent === 0) {
			this.a.overlays.reagent_filling = null;
			return;
		}
		if (percent < 0.1) {
			this.a.overlays.reagent_filling = {icon_state: "[parent]-10"};
		} else if (percent < 0.25) {
			this.a.overlays.reagent_filling = {icon_state: "[parent]10"};
		} else if (percent < 0.5) {
			this.a.overlays.reagent_filling = {icon_state: "[parent]25"};
		} else if (percent < 0.75) {
			this.a.overlays.reagent_filling = {icon_state: "[parent]50"};
		} else if (percent < 0.8) {
			this.a.overlays.reagent_filling = {icon_state: "[parent]75"};
		} else if (percent < 0.9) {
			this.a.overlays.reagent_filling = {icon_state: "[parent]80"};
		} else {
			this.a.overlays.reagent_filling = {icon_state: "[parent]100"};
		}
		this.a.overlays.reagent_filling.icon = "icons/obj/chemical/reagentfillings/";
		const [r, g, b, a] = this.a.c.ReagentHolder.get_reagents_color();
		this.a.overlays.reagent_filling.color = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
			b * 255
		)})`;
		this.a.overlays.reagent_filling.alpha = a;
	}
}

GlassBeaker.depends = ["OpenReagentContainer"];
GlassBeaker.loadBefore = ["OpenReagentContainer"];

GlassBeaker.template = {
	vars: {
		components: {
			ReagentHolder: {
				maximum_volume: 50,
			},
			Item: {
				inhand_icon_state: "beaker",
				size: 1,
			},
			Examine: {
				desc: "A beaker. It can hold up to 50 units.",
			},
		},
		name: "beaker",
		icon: "icons/obj/chemical/",
		icon_state: "beaker",
	},
};

module.exports.components = {
	OpenReagentContainer,
	GlassBeaker,
	ReagentReceiver,
};
