class StackCraftPanel {
	panel: any;
	civilization: any;
	amount_node: Text;
	recipes_elem: HTMLDivElement;
	recipes: any;
	constructor(panel: Record<string, any>) {
		this.panel = panel;
		this.civilization = null;
		this.panel.on("message", this.handle_message.bind(this));
		const amount_elem = document.createElement("div");
		amount_elem.appendChild(document.createTextNode("amount: "));
		amount_elem.appendChild((this.amount_node = document.createTextNode("")));
		this.panel.content_obj.appendChild(amount_elem);
		this.recipes_elem = document.createElement("div");
		this.panel.content_obj.appendChild(this.recipes_elem);
	}

	handle_message(message: Record<string, any>) {
		if (message.civilization) {
			this.civilization = message.civilization;
		}
		if (message.recipes) {
			this.recipes = message.recipes;
			this.build_recipes();
		}
		if (message.amount) {
			this.amount_node.textContent = message.amount;
		}
		if (message.build_limit) {
			this.recipes[message.build_limit.index].build_limit = message.build_limit.build_limit;
			this.build_recipe(message.build_limit.index);
		}
	}

	build_recipes() {
		this.recipes_elem.innerHTML = "";
		for (let i = 0; i < this.recipes.length; i++) {
			const recipe = this.recipes[i];
			if (typeof recipe === "undefined") {
				this.recipes_elem.appendChild(document.createElement("hr"));
			}
			//else if (this.recipe_check_tech(recipe) === 1) {
			else {
				const recipe_elem = document.createElement("div");
				recipe_elem.classList.add("small-vertical-margins");
				this.recipes_elem.appendChild(recipe_elem);
				this.build_recipe(i);
			}
		}
	}
	build_recipe(i: any) {
		const elem = this.recipes_elem.childNodes[i];
		if (elem.innerHTML) {
			elem.innerHTML = "";
		}
		const recipe = this.recipes[i];

		const main_button_elem = document.createElement("div");
		main_button_elem.innerText = `${recipe.res_amount && recipe.res_amount > 1 ? `${recipe.res_amount}x ` : ""}${
			recipe.name
		} (costs ${recipe.cost})`;
		main_button_elem.classList.add("button");
		if (recipe.build_limit <= 0) {
			main_button_elem.classList.add("disabled");
		}
		main_button_elem.dataset.message = JSON.stringify({build: i, amount: 1});
		elem.appendChild(main_button_elem);
	}
	recipe_check_tech(recipe: Record<string, any>) {
		if (!recipe.age1 || !recipe.age2 || !recipe.age2 || !recipe.last_age) {
			return 0;
		}
		if (global.Tworld.age > recipe.last_age) {
			return 0;
		}
		if (typeof this.civilization === "undefined" || this.civilization === "") {
			console.log("No civ");
			if (
				global.Tworld.age1 >= recipe.age1 &&
				global.Tworld.age2 >= recipe.age2 &&
				global.Tworld.age3 >= recipe.age3
			) {
				return 1;
			} else {
				return 0;
			}
		} else {
			console.log("Yes civ");
			if (global.Tworld.civilizations[this.civilization]) {
				const currciv = global.Tworld.civilizations[this.civilization];
				if (
					currciv.research_ind >= global.Tworld.age1 &&
					currciv.research_mil >= global.Tworld.age1 &&
					currciv.research_hlt >= global.Tworld.age3
				) {
					return 1;
				} else {
					return 0;
				}
			} else {
				return 0;
			}
		}
	}
}

module.exports.panel_classes = {StackCraftPanel};
