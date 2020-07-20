const { Panel } = require("./../../../../../../code/game/server.js");

class StackCraftPanel extends Panel {
	constructor(client, panel_props, mob) {
		super(client, panel_props);
		this.mob = mob;
		this.on("open", this.opened.bind(this));
		this.on("close", this.closed.bind(this));
		this.on("message", this.message_handler.bind(this));

		this.recipe_build_limit_changed = this.recipe_build_limit_changed.bind(
			this
		);
		this.amount_changed = this.amount_changed.bind(this);
	}

	recipe_build_limit_changed(e) {
		this.send_message({
			build_limit: { index: e.index, build_limit: e.recipe.build_limit },
		});
	}

	amount_changed() {
		this.send_message({ amount: this.bound_atom.c.Stack.amount });
	}

	opened() {
		this.send_message({
			recipes: this.bound_atom.c.Stack.recipes,
			amount: this.bound_atom.c.Stack.amount,
		});
		this.bound_atom.c.Stack.on("amount_changed", this.amount_changed);
		this.bound_atom.c.Stack.on(
			"recipe_build_limit_changed",
			this.recipe_build_limit_changed
		);
	}

	closed() {
		this.bound_atom.c.Stack.removeListener(
			"amount_changed",
			this.amount_changed
		);
		this.bound_atom.c.Stack.removeListener(
			"recipe_build_limit_changed",
			this.recipe_build_limit_changed
		);
	}

	message_handler(msg) {
		if (msg.build != undefined) {
			msg.build = +msg.build || 0;
			this.bound_atom.c.Stack.build_recipe(
				this.bound_atom.c.Stack.recipes[msg.build],
				msg.amount,
				this.bound_mob
			);
		}
	}
	recipe_check_tech(recipe) {
		console.log("checking...")
		if (!recipe.age1 || !recipe.age2 || !recipe.age2 || !recipe.last_age)
			{return 0}
		if (Tworld.age > recipe.last_age)
			{return 0}
		if (this.mob.c.HumanMob.civilization.name == null)
			{if (Tworld.age1>= recipe.age1 && Tworld.age2>= recipe.age2 && Tworld.age3>= recipe.age3)
				{return 1}
			else
				{return 0}
			}
		else
			{if (Tworld.civilizations[this.mob.c.HumanMob.civilization.name])
				{
					let currciv = Tworld.civilizations[this.mob.c.HumanMob.civilization.name];
					if (currciv.research_ind >= Tworld.age1 && currciv.research_mil >= Tworld.age1 && currciv.research_hlt >= Tworld.age3)
						{return 1}
					else
						{return 0}
				}
			else
				{return 0}}
	}
}

module.exports = StackCraftPanel;
