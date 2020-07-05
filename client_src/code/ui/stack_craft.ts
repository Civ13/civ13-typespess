

class StackCraftPanel {
	panel: any;
	amount_node: Text;
	recipes_elem: HTMLDivElement;
	recipes: any;
	constructor(panel: any) {
		this.panel = panel;
		this.panel.on("message", this.handle_message.bind(this));

		const amount_elem = document.createElement("div");
		amount_elem.appendChild(document.createTextNode("amount: "));
		amount_elem.appendChild((this.amount_node = document.createTextNode("")));
		this.panel.content_obj.appendChild(amount_elem);
		this.recipes_elem = document.createElement("div");
		this.panel.content_obj.appendChild(this.recipes_elem);
	}

	handle_message(message: { recipes: any; amount: string | null; build_limit: { index: string | number; build_limit: any; }; }) {
		if (message.recipes) {
			this.recipes = message.recipes;
			this.build_recipes();
		}
		if (message.amount) {
			this.amount_node.textContent = message.amount;
		}
		if (message.build_limit) {
			this.recipes[message.build_limit.index].build_limit =
		message.build_limit.build_limit;
			this.build_recipe(Number(message.build_limit.index));
		}
	}

	build_recipes() {
		this.recipes_elem.innerHTML = "";
		for (let i = 0; i < this.recipes.length; i++) {
			const recipe = this.recipes[i];
			if (recipe == null) {
				this.recipes_elem.appendChild(document.createElement("hr"));
				continue;
			}
			const recipe_elem = document.createElement("div");
			recipe_elem.classList.add("small-vertical-margins");
			this.recipes_elem.appendChild(recipe_elem);
			this.build_recipe(i);
		}
	}
	build_recipe(i: number) {
		const elem = this.recipes_elem.childNodes[i];
		elem.innerHTML = "";
		const recipe = this.recipes[i];

		const main_button_elem = document.createElement("div");
		main_button_elem.innerText = `${
			recipe.res_amount && recipe.res_amount > 1 ? `${recipe.res_amount}x ` : ""
		}${recipe.name} (costs ${recipe.cost})`;
		main_button_elem.classList.add("button");
		if (recipe.build_limit <= 0) main_button_elem.classList.add("disabled");
		main_button_elem.dataset.message = JSON.stringify({ build: i, amount: 1 });
		elem.appendChild(main_button_elem);
	}
}

module.exports.panel_classes = { StackCraftPanel };
