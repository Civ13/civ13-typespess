export{};
const {Panel} = require("./../../../../../../code/game/server.js");

class StackCraftPanel extends Panel {
	constructor(client: Record<string, any>, panel_props: any, civilization: string) {
		super(client, panel_props);
		this.civilization = civilization;
		this.on("open", this.opened.bind(this));
		this.on("close", this.closed.bind(this));
		this.on("message", this.message_handler.bind(this));

		this.recipe_build_limit_changed = this.recipe_build_limit_changed.bind(this);
		this.amount_changed = this.amount_changed.bind(this);
	}

	recipe_build_limit_changed(e: Record<string, any>) {
		this.send_message({
			build_limit: {index: e.index, build_limit: e.recipe.build_limit},
		});
	}

	amount_changed() {
		this.send_message({amount: this.bound_atom.c.Stack.amount});
	}

	opened() {
		this.send_message({
			civilization: this.civilization,
			recipes: this.bound_atom.c.Stack.recipes,
			amount: this.bound_atom.c.Stack.amount,
		});
		this.bound_atom.c.Stack.on("amount_changed", this.amount_changed);
		this.bound_atom.c.Stack.on("recipe_build_limit_changed", this.recipe_build_limit_changed);
	}

	closed() {
		this.bound_atom.c.Stack.removeListener("amount_changed", this.amount_changed);
		this.bound_atom.c.Stack.removeListener("recipe_build_limit_changed", this.recipe_build_limit_changed);
	}

	message_handler(msg: Record<string, any>) {
		if (typeof msg.build !== "undefined") {
			msg.build = +msg.build || 0;
			this.bound_atom.c.Stack.build_recipe(
				this.bound_atom.c.Stack.recipes[msg.build],
				msg.amount,
				this.bound_mob
			);
		}
	}
}

module.exports = StackCraftPanel;
