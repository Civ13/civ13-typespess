export{};
const EventEmitter = require("events");
const {Sound, has_component, audible_message, to_chat} = require("./../../../code/game/server.js");

class Reagent extends EventEmitter {
	constructor() {
		super();
		this.volume = 0;
		this.holder = null;
		this.overdosing = false;
		this.time_in_mob = 0;
		this.name = "Reagent";
		this.description = "";
		this.taste_description = "metaphorical salt";
		this.taste_mult = 1;
		this.glass_name = "glass off ...what?";
		this.glass_desc = "You can't really tell what this is.";
		this.glass_icon_state = null;
		this.shot_glass_icon_state = null;
		this.reagent_state = "liquid";
		this.color = [0, 0, 0];
		this.can_synth = true;
		this.metabolizatifon_rate = 0.2;
		this.overdose_threshold = 0;
		this.addiction_threshold = 0;
		this.nutriment_factor = 0;
		this.hydration_factor = 0;
		this.boozepwr = 0;
		this.toxpwr = 0;
		this.subtype = "chemical";
	}
	add(amount: number, {nreagent = "", temp = 300} = {}) {
		amount = Math.min(
			this.holder.c.ReagentHolder.maximum_volume - this.holder.c.ReagentHolder.total_volume,
			amount
		);
		if (amount <= 0) {
			return 0;
		}
		if (typeof nreagent !== "string") {
			const reagent: Record<string, any> = nreagent;
			amount = reagent.remove(amount);
		}
		if (this.holder) {
			this.holder.c.ReagentHolder.temperature =
				(this.holder.c.ReagentHolder.temperature * this.holder.c.ReagentHolder.total_volume + amount * temp) /
				(this.holder.c.ReagentHolder.total_volume + amount);
		}
		this.volume += amount;
		this.emit("added", amount);
		if (this.holder) {
			this.holder.c.ReagentHolder.emit("added", this, amount);
		}
		return amount;
	}

	remove(amount: number) {
		amount = Math.min(this.volume, amount);
		if (amount <= 0) {
			return 0;
		}
		this.volume -= amount;
		this.emit("removed", amount);
		if (this.holder) {
			this.holder.c.ReagentHolder.emit("removed", this, amount);
		}
		return amount;
	}

	overdose_process() {return;}
	overdose_start() {
		to_chat`<span class='userdanger'>You feel like you took too much of ${this.name}!</span>`(this.holder);
	}

	addiction_act_stage1(dt: number) {
		/* yes I know probabilities don't work like that but I really don't give 2 fucks */
		if (Math.random() < 0.15 * dt) {
			to_chat`<span class='notice'>You feel like some ${name} right about now.</span>`(this.holder);
		}
	}

	addiction_act_stage2(dt: number) {
		if (Math.random() < 0.15 * dt) {
			to_chat`<span class='notice'>You feel like you need ${name}. You just can't get enough.</span>`(
				this.holder
			);
		}
	}

	addiction_act_stage3(dt: number) {
		if (Math.random() < 0.15 * dt) {
			to_chat`<span class='danger'>You have an intense craving for ${name}.</span>`(this.holder);
		}
	}

	addiction_act_stage4(dt: number) {
		if (Math.random() < 0.15 * dt) {
			to_chat`<span class='boldannounce'>You're not feeling good at all! You really need some ${name}.</span>`(
				this.holder
			);
		}
	}

	mob_life(dt: number, mob: Record<string,any> = null) {
		this.time_in_mob += dt;
		const removal = this.metabolization_rate * dt;
		if (this.volume > 0 && mob) {
			if (this.nutriment_factor > 0)
				{mob.hunger += removal*this.nutriment_factor;}
			else if (this.hydration_factor > 0)
				{mob.thirst += removal*this.hydration_factor;}
			if (this.toxpwr > 0)
			{mob.a.c.LivingMob.adjust_damage("tox", this.toxpwr * dt);}
		}
		this.remove(removal);
	}

	reaction_obj() {return;}
	reaction_mob(target: any, method: string, volume: number) {
		if (method === "vapor" && volume > 0.5) {
			target.c.ReagentHolder.add(this, volume);
		}
	}
	reaction_turf() {return;}
}

class ReagentReaction {
	min_temp: any;
	max_temp: any;
	mix_sound: boolean;
	mix_message: any;
	constructor(obj: Record<string, any>) {
		Object.assign(
			this,
			{
				results: {},
				required_reagents: {},
				required_catalysts: {},

				required_container: null,
				mob_react: true,

				min_temp: null,
				max_temp: null,

				mix_message: "The solution begins to bubble.",
				mix_sound: "sound/effects/bubbles.ogg",
			},
			obj
		);
	}

	get_react_status(container: Record<string, any>) {
		for (const [req, amount] of Object.entries(this.required_reagents)) {
			if (container.c.ReagentHolder.volume_of(req) < amount) {
				return 2;
			}
		}
		for (const [req, amount] of Object.entries(this.required_catalysts)) {
			if (container.c.ReagentHolder.volume_of(req) < amount) {
				return 2;
			}
		}
		if (typeof this.min_temp !== "undefined" && container.c.ReagentHolder.temperature < this.min_temp) {
			return 1;
		}
		if (typeof this.max_temp !== "undefined" && container.c.ReagentHolder.temperature > this.max_temp) {
			return 1;
		}
		return 0;
	}
	required_reagents(/*required_reagents: any*/) {
		throw new Error("Method not implemented.");
	}
	required_catalysts(/*required_catalysts: any*/) {
		throw new Error("Method not implemented.");
	}

	update(container: Record<string, any>) {
		const react_status = this.get_react_status(container);
		if (react_status === 2) {
			container.c.ReagentHolder.held_reactions.delete(this);
			return;
		}
		if (react_status === 1) {
			container.c.ReagentHolder.held_reactions.add(this);
			return;
		}

		let multiplier = Infinity;
		let single_result_volume = 0;
		let req_volume = 0;
		for (const v of Object.values(this.results)) {
			single_result_volume += v;
		}
		for (const [reagent, req] of Object.entries(this.required_reagents)) {
			multiplier = Math.min(multiplier, container.c.ReagentHolder.volume_of(reagent) / req);
			req_volume += req;
		}
		const dv = single_result_volume - req_volume;
		if (dv > 0) {
			multiplier = Math.min(
				multiplier,
				(container.c.ReagentHolder.maximum_volume - container.c.ReagentHolder.total_volume) / dv
			);
		}
		multiplier = Math.floor(multiplier);
		if (multiplier < 1) {
			container.c.ReagentHolder.held_reactions.add(this);
			return;
		}
		for (const [reagent, req] of Object.entries(this.required_reagents)) {
			container.c.ReagentHolder.remove(reagent, req * multiplier);
		}
		this.react(container, multiplier);
	}
	results(/*results: any*/) {
		throw new Error("Method not implemented.");
	}
	react(container: Record<string, any>, multiplier = 1) {
		for (const [reagent, amount] of Object.entries(this.results)) {
			container.c.ReagentHolder.add(reagent, amount * multiplier);
		}
		if (!has_component(container, "LivingMob") && this.mix_sound) {
			new Sound(container.server, {
				path: this.mix_sound,
				volume: 0.8,
				vary: true,
			}).emit_from(container);
		}
		if (this.mix_message) {
			audible_message(this.mix_message).range(4).emit_from(container);
		}
	}
}

module.exports = {Reagent, ReagentReaction};
