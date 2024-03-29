export{};
const {Component, has_component, to_chat, chain_func} = require("./../../../code/game/server.js");

const _temperature: any = Symbol("_temperature");
const {Reagent} = require("./reagent.js");

const reagent_types: Record<string, any> = {};
const reagent_reactions: any[] = [];

class ReagentHolder extends Component {
	init_reagents: Record<string, number>;
	constructor(atom: any, template: any) {
		super(atom, template);
		this.reagents = new Map();
		this.addictions = new Map();
		this.addiction_tick = 0;
		this.held_reactions = new Set();
		this.on("added", this.added.bind(this));
		this.on("removed", this.removed.bind(this));
		this.on("temperature_changed", this.update_reactions.bind(this));

		if (this.init_reagents) {
			for (const [reagent, amount] of Object.entries(this.init_reagents)) {
				this.add(reagent, amount);
			}
		}

		if (has_component(this.a, "Examine")) {
			this.a.c.Examine.examine = chain_func(this.a.c.Examine.examine, this.examine.bind(this));
		}
	}

	add(reagent: any, amount: number, {temp = 300} = {}) {
		const reagent_name = typeof reagent === "string" ? reagent : reagent.constructor.name;
		return this.assume_reagent(reagent_name).add(amount, {
			reagent: typeof reagent === "object" ? reagent : null,
			temp,
		});
	}

	remove(reagent: any, amount: number) {
		if (!reagent) {
			return 0;
		}
		if (typeof reagent === "string") {
			reagent = this.reagents.get(reagent);
		}
		if (!reagent) {
			return;
		}
		return reagent.remove(amount);
	}

	clear() {
		let removed = 0;
		for (const reagent of this.reagents.values()) {
			removed += reagent.remove(reagent.volume);
		}
		return removed;
	}

	assume_reagent(reagent_name: string) {
		if (!this.reagents.has(reagent_name)) {
			const reagent = new Reagent();
			for (const i in reagent_types[reagent_name]) {
				if (reagent_types[reagent_name][i] && reagent[i]) {
					reagent[i] = reagent_types[reagent_name][i];
				}
			}
			reagent.holder = this.a;
			this.reagents.set(reagent_name, reagent);
		}
		return this.reagents.get(reagent_name);
	}

	get total_volume() {
		let v = 0;
		for (const reagent of this.reagents.values()) {
			v += reagent.volume;
		}
		return v;
	}

	added(reagent: any, amount: number) {
		const reactions = reagent.constructor.reactions;
		if (!reactions) {
			return;
		}
		for (const [reaction, min_amount] of reactions) {
			if (amount >= min_amount) {
				reaction.update(this.a);
			}
		}
	}

	removed(reagent: any) {
		for (const reaction of this.held_reactions) {
			if (
				reagent.reactions &&
				reagent.reactions.get(reagent) &&
				reagent.reactions.get(reagent) < reagent.volume
			) {
				this.held_reactions.delete(reaction);
			}
		}
		if (reagent.volume <= 0) {
			this.reagents.delete(reagent.constructor.name);
			reagent.holder = null;
		}
	}

	update_reactions() {
		for (const reaction of this.held_reactions) {
			reaction.update(this.a);
		}
	}

	volume_of(reagent: any) {
		if (typeof reagent === "string") {
			reagent = this.reagents.get(reagent);
		}
		if (reagent) {
			return reagent.volume;
		} else {
			return 0;
		}
	}

	get temperature() {
		return this[_temperature];
	}
	set temperature(val) {
		const old = this[_temperature];
		if (val === old) {
			return;
		}
		this[_temperature] = val;

		this.emit("temperature_changed", old, val);
	}

	remove_any(amount = 1) {
		if (amount <= 0) {
			return 0;
		}
		let total_transferred = 0;

		const reagents_list = [...this.reagents.values()];

		while (total_transferred < amount) {
			if (!reagents_list.length) {break;}
			const rand_idx = Math.floor(Math.random() * reagents_list.length);
			const reagent = reagents_list[rand_idx];
			total_transferred += reagent.remove(amount - total_transferred);
			reagents_list.splice(rand_idx, 1);
		}

		return total_transferred;
	}

	remove_all(amount = 1) {
		if (amount <= 0) {
			return 0;
		}
		const ratio = amount / this.total_volume;
		let removed = 0;
		for (const reagent of this.reagents.values()) {
			removed += reagent.remove(reagent.volume * ratio);
		}
		return removed;
	}

	get_master_reagent() {
		let master = null;
		let master_amount = 0;
		for (const reagent of this.reagents.values()) {
			if (reagent.volume > master_amount) {
				master_amount = reagent.volume;
				master = reagent;
			}
		}
		return master;
	}

	transfer_percent_to(target: Record<string, any>, percent = 1) {
		if (!has_component(target, "ReagentHolder")) {
			return 0;
		}
		percent = Math.min(percent, 1);
		percent = Math.min(
			percent,
			(target.c.ReagentHolder.maximum_volume - target.c.ReagentHolder.total_volume) / this.total_volume
		);
		if (percent <= 0) {
			return 0;
		}
		let amount_transferred = 0;
		for (const reagent of this.reagents.values()) {
			amount_transferred += target.c.ReagentHolder.add(reagent, reagent.volume * percent);
		}
		return amount_transferred;
	}

	transfer_to(target: any, amount: number) {
		const percent = amount / this.total_volume;
		return this.transfer_percent_to(target, percent);
	}

	react_atom(atom: Record<string, any>, method = "touch", {volume_modifier = 1, show_message = true} = {}) {
		let react_function = "reaction_obj";
		if (has_component(atom, "CarbonMob")) {
			react_function = "reaction_mob";
		} else if (has_component(atom, "Turf")) {
			react_function = "reaction_turf";
		}
		for (const reagent of this.reagents.values()) {
			reagent[react_function](atom, {
				method,
				volume: reagent.volume * volume_modifier,
				show_message,
			});
		}
	}

	metabolize(dt = 2) {
		if (!has_component(this.a, "CarbonMob")) {
			throw new Error("Oi! Why are you calling metabolize on something that isn't a mob?");
		}

		for (const [key, reagent] of this.reagents) {
			if (!this.should_metabolize_reagent(key /*, reagent*/)) {continue;}
			const dt = Math.min(reagent.volume,Math.max(reagent.volume*0.01, 0.03));
			if (reagent.overdose_threshold && reagent.volume >= reagent.overdose_threshold && !reagent.overdosed) {
				reagent.overdosed = true;
				reagent.overdose_start();
			}
			if (
				reagent.addiction_threshold &&
				reagent.volume >= reagent.addiction_threshold &&
				!this.addictions.has(key)
			) {
				const addiction = new reagent.constructor();
				addiction.holder = this.a;
				this.addictions.set(key, addiction);
			}
			if (reagent.overdosed) {
				reagent.overdose_process(dt);
			}
			if (this.addictions.has(key)) {
				const addiction = this.addictions.get(key);
				addiction.addiction_stage = -15;
			}
			reagent.mob_life(dt, this.a.c.CarbonMob);
		}

		if (this.addiction_tick >= 12) {
			this.addiction_tick -= 12;
			for (const [key, addiction] of [...this.addictions]) {
				addiction.addiction_stage += dt / 2;
				if (addiction.addiction_stage < 1) {continue;}
				const stage = Math.floor(addiction.addiction_stage / 10) + 1;
				if (stage > 4) {
					to_chat`<span class='notice'>You feel like you've gotten over your need for ${addiction.name}.</span>`(
						this.a
					);
					this.addictions.delete(key);
					continue;
				}
				addiction[`addiction_act_stage${stage}`](dt);
			}
		}
		this.addiction_tick += dt;
	}

	should_metabolize_reagent(key: string /*, reagent*/) {
		if (key === "Blood" && this.a.c.CarbonMob.uses_blood) {return false;}
		return true;
	}

	can_be_injected() {
		return this.injectable;
	}
	can_be_drawn() {
		return this.drawable;
	}
	can_see_reagents() {
		// Whether or not the contents of this container are visible. Not if the individual reagents can be identified.
		return this.reagents_visible;
	}
	examine(prev: any, user: any) {
		prev();
		if (this.can_see_reagents()) {
			to_chat`It contains:`(user);
			to_chat`${this.total_volume} units of various reagents`(user);
		}
	}

	get_reagents_color() {
		let r = 0;
		let g = 0;
		let b = 0;
		let total = 0;
		let a = 0;
		let atotal = 0;
		for (const reagent of this.a.c.ReagentHolder.reagents.values()) {
			const rr = reagent.color[0];
			const rg = reagent.color[1];
			const rb = reagent.color[2];
			let ra = reagent.color[3];
			if (typeof ra === "undefined") {
				ra = 1;
			}
			const m = ra * reagent.volume;
			r += rr * m;
			g += rg * m;
			b += rb * m;
			a += ra * reagent.volume;
			total += m;
			atotal += reagent.volume;
		}
		r /= total;
		g /= total;
		b /= total;
		a /= atotal;
		return [r, g, b, a];
	}

	can_consume(eater: Record<string, any> /*, user*/) {
		if (!has_component(eater, "CarbonMob")) {return false;}
		// TODO mouth cover check
		return true;
	}
}

ReagentHolder.loadBefore = ["Examine"];

ReagentHolder.template = {
	vars: {
		components: {
			ReagentHolder: {
				maximum_volume: 100,
				temperature: 150,
				react: true,
				init_reagents: null,
				injectable: false,
				drawable: false,
				reagents_visible: true,
			},
		},
	},
};

function add_items(mod: Record<string, any>) {
	if (mod.reagents) {
		for (const key in mod.reagents) {
			if (reagent_types[key]) {
				throw new Error(`Reagent meta '${key}' defined more than once!`);
			} else {
				reagent_types[key] = mod.reagents[key];
			}
		}
	}
	if (mod.reagent_reactions) {
		for (const reaction of mod.reagent_reactions) {
			reagent_reactions.push(reaction);
		}
	}
}

// Import the reagents and recipes
add_items(require("./reagents/reagent_importer.js"));
add_items(require("./recipes/recipe_importer.js"));

// Cache the reactions for the reagents

for (const reaction of reagent_reactions) {
	const to_cache: Record<string, any> = {};
	for (const [req, tamount] of Object.entries(reaction.required_reagents)) {
		const amount: any = tamount;
		if (!to_cache[req]) {
			to_cache[req] = 0;
		}
		to_cache[req] = Math.max(to_cache[req], amount);
	}
	for (const [reagent_name, amount] of Object.entries(to_cache)) {
		const reagent_type = reagent_types[reagent_name];
		if (!reagent_type) {
			throw new Error(`Reaction ${JSON.stringify(reaction.results)} references unknown reagent ${reagent_name}`);
		}
		if (!reagent_type.reactions) {
			reagent_type.reactions = new Map();
		}
		reagent_type.reactions.set(reaction, amount);
	}
}

module.exports.components = {ReagentHolder};
module.exports.reagent_types = reagent_types;
