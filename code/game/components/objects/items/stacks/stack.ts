
export{};
const {
	Component,
	Atom,
	chain_func,
	has_component,
	to_chat,
} = require("./../../../../../../code/game/server.js");
const StackCraftPanel = require("./stack_craft_panel.js");

const _amount:any = Symbol("_amount");
const { join } = require ("path");
const {readdirSync, statSync } = require ("fs");
const fs = require("fs");
const CSON = require("cson");

function getFileExtension(filename: string) {
	const a = filename.split(".");
	if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
		return "";
	}
	return a.pop().toLowerCase();
}

const unfold = (f, initState) =>
	f ( (value, nextState) => [ value, ...unfold (f, nextState) ]
		, () => []
		, initState
	);

const None = Symbol ();

const relativePaths = (path = ".") =>
	readdirSync (path) .map (p => join (path, p));

const traverseDir = (dir) =>
	unfold( (next, done, [ path = None, ...rest ]) =>
		path === None
			? done ()
			: next ( path
				, statSync (path) .isDirectory ()
					? relativePaths (path) .concat (rest)
					: rest
			),
	relativePaths (dir)
	);

class Stack extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.on("amount_changed", this.amount_changed.bind(this));
		this.user = null;
		this.amount_changed();
		this.a.on("crossed_by", this.crossed_by.bind(this));
		this.a.c.Examine.examine = chain_func(
			this.a.c.Examine.examine,
			this.examine.bind(this)
		);
		this.a.attack_by = chain_func(this.a.attack_by, this.attack_by.bind(this));
		this.a.attack_hand = chain_func(
			this.a.attack_hand,
			this.attack_hand.bind(this)
		);
		this.a.c.Item.attack_self = chain_func(
			this.a.c.Item.attack_self,
			this.attack_self.bind(this)
		);
		this.a.on("moved", this.update_recipes.bind(this));
		this.a.on("parent_moved", this.update_recipes.bind(this));

		this.a.can_user_read_panel = this.can_user_read_panel.bind(this);

		this.recipes = JSON.parse(JSON.stringify(this.recipes));
		this.update_recipes();
	}

	get amount() {
		return this[_amount];
	}
	set amount(val) {
		if (this[_amount] === val) {return;}
		this[_amount] = val;
		this.emit("amount_changed");
	}

	amount_changed() {
		if (this.amount <= 0) {
			this.a.destroy();
		}

		if (this.amount === 1) {this.a.gender = "neuter";}
		else {this.a.gender = "plural";}

		if (!this.novariants) {
			const base_state = this.a.template.vars.icon_state;
			if (this.amount <= this.max_amount * (1 / 3))
				{this.a.icon_state = base_state;}
			else if (this.amount <= this.max_amount * (2 / 3))
				{this.a.icon_state = `${base_state}_2`;}
			else {this.a.icon_state = `${base_state}_3`;}
		}

		const base_size = this.a.template.vars.components.Item.size;
		if (this.amount <= this.max_amount * (1 / 3))
			{this.a.c.Item.size = Math.max(base_size - 2, 1);}
		else if (this.amount <= this.max_amount * (2 / 3))
			{this.a.c.Item.size = Math.max(base_size - 1, 1);}
		else {this.a.c.Item.size = base_size;}
		this.update_recipes();
	}

	use(used) {
		if (this.amount < used) {return false;}
		this.amount -= used;
		return true;
	}

	merge(S) {
		// merge into S, as much as possible
		if (
			!has_component(S, "Stack") ||
	S.destroyed ||
	this.a.destroyed ||
	S === this.a
		)
			{return;}
		const transfer = Math.min(
			this.amount,
			S.c.Stack.max_amount - S.c.Stack.amount
		);
		this.use(transfer);
		S.c.Stack.amount += transfer;
		return transfer;
	}

	examine(prev, user) {
		prev();
		to_chat`There ${this.amount === 1 ? "is" : "are"} ${this.amount} ${
			this.singular_name || ""
		}s in the stack.`(user);
	}

	attack_by(prev, item, user) {
		if (this.merge_type && has_component(item, this.merge_type)) {
			this.user = user;
			if (this.merge(item))
				{to_chat`<span class='notice'>Your ${item.name} stack now contains ${item.c.Stack.amount} ${item.c.Stack.singular_name}s.</span>`(
					user
				);}
		} else {
			return prev();
		}
	}

	attack_hand(prev, user) {
		this.user = user;
		const slot = this.a.c.Item.slot;
		if (
			slot &&
	slot.mob === user &&
	slot.props.is_hand_slot &&
	user.c.MobInventory.active_hand !== slot
		) {
			return this.split(user, 1);
		} else {
			return prev();
		}
	}

	attack_self(prev, user) {
		this.user = user;
		if (
			!this.recipes ||
	!this.recipes.length ||
	user.c.Mob.get_panel(this.a, StackCraftPanel) ||
	!user.c.Mob.can_read_panel(this.a, StackCraftPanel)
		) {
			return prev();
		}
		let civ = null;
		if (user.c && user.c.HumanMob) {civ = user.c.HumanMob.Civilization;}
		const panel = new StackCraftPanel(user.c.Mob.client, {
			title: `${this.a.name} construction`,
		}, civ);
		user.c.Mob.bind_panel(this.a, panel);
		panel.open();
	}

	split(user, amount) {
		if (amount <= 0) {return;}
		this.user = user;
		if (amount >= this.amount) {
			if (has_component(user, "MobInventory"))
				{user.c.MobInventory.put_in_hands(this.a);}
			return this.a;
		}
		const new_stack = new Atom(this.a.server, this.a.template);
		new_stack.c.Stack.amount = amount;
		this.use(amount, true);
		if (has_component(user, "MobInventory")) {
			user.c.MobInventory.put_in_hands(new_stack);
		}
		// TODO evidence
	}

	crossed_by(target) {
		if (
			this.merge_type &&
	has_component(target, this.merge_type) &&
	!target.c.Tangible.throwing
		) {
			process.nextTick(() => this.merge(target));
		}
	}

	can_user_read_panel(user) {
		return this.a.c.Item.slot && this.a.c.Item.slot.mob === user;
	}
	import_recipes(material) {
		const recList = [];
		for (const f of traverseDir("./code/modules/crafting/")) {
			if (getFileExtension(f) === "crafting" && f.search(material) !== -1) {
				const nrec = CSON.parse(fs.readFileSync(f, "utf8"));
				for(const i in nrec) {recList.push(nrec[i]);}}
		}
		this.recipes = recList;

	}
	update_recipes() {
		this.import_recipes(this.material);

		for (let i = 0; i < this.recipes.length; i++) {
			const recipe = this.recipes[i];
			let build_limit = recipe.cost <= this.amount ? 1 : 0;
			if (build_limit > 0 && this.max_batch) {
				build_limit = Math.min(
					this.max_batch,
					Math.floor(this.amount / recipe.cost)
				);
			}
			if (recipe.cant_cross && this.a.base_mover && build_limit > 0) {
				for (const crosser of this.a.base_mover.crosses()) {
					let did_break = false;
					for (const forbidden of recipe.cant_cross) {
						if (has_component(crosser, forbidden)) {
							did_break = true;
							build_limit = 0;
							break;
						}
					}
					if (did_break) {break;}
				}
			}
			if (build_limit !== recipe.build_limit) {
				recipe.build_limit = build_limit;
				this.emit("recipe_build_limit_changed", { recipe, index: i });
			}
		}
	}

	async build_recipe(recipe, amount, user) {
		if (!has_component(user, "MobInventory") || !recipe) {return;}
		this.update_recipes();
		amount = Math.min(Math.max(+amount || 1, 1), recipe.build_limit); // no trust clients
		if (amount < 1) {return;}
		const multiplied_amount = (recipe.res_amount || 1) * amount;
		if (recipe.time) {
			if (
				!(await user.c.MobInventory.do_after({
					delay: recipe.time,
					target: this.a,
				}))
			)
				{return;}
			this.update_recipes();
			if (amount > recipe.build_limit) {return;}
		}
		const template = this.a.server.templates[recipe.template_name];
		const new_atom = new Atom(this.a.server, template);
		if (has_component(new_atom, "Stack")) {
			new_atom.c.Stack.amount = multiplied_amount;
		}
		new_atom.loc = this.a.base_mover && this.a.base_mover.fine_loc;
		if (has_component(new_atom, "Item")) {
			user.c.MobInventory.put_in_hands(new_atom);
		}
		this.use(recipe.cost * amount);
	}
}

Stack.template = {
	vars: {
		icon: "icons/obj/materials/",
		components: {
			Stack: {
				amount: 1,
				max_amount: 50,
				merge_type: null,
				novariants: true,
				singular_name: null,
				recipes: [],
				material: "wood",
			},
		},
	},
};

Stack.depends = ["Item"];
Stack.loadBefore = ["Item"];

module.exports.components = { Stack };
