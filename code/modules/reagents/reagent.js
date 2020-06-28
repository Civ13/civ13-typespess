

const EventEmitter = require("events");
const {
	Sound,
	has_component,
	audible_message,
	to_chat,
} = require("./../../../code/game/server.js");

class Reagent extends EventEmitter {
	constructor() {
		super();
		this.volume = 0;
		this.holder = null;
		this.overdosing = false;
		this.time_in_mob = 0;
	}
	add(amount, { reagent, temp } = {}) {
		if (temp == null && (reagent == null || reagent.holder == null)) {
			temp = 300;
		} else if (temp == null) {
			temp = reagent.holder.c.ReagentHolder.temperature;
		}
		amount = Math.min(
			this.holder.c.ReagentHolder.maximum_volume -
		this.holder.c.ReagentHolder.total_volume,
			amount
		);
		if (amount <= 0) return 0;
		if (reagent) {
			amount = reagent.remove(amount);
		}
		if (this.holder)
			this.holder.c.ReagentHolder.temperature =
		(this.holder.c.ReagentHolder.temperature *
		this.holder.c.ReagentHolder.total_volume +
		amount * temp) /
		(this.holder.c.ReagentHolder.total_volume + amount);
		this.volume += amount;
		this.emit("added", amount);
		if (this.holder) this.holder.c.ReagentHolder.emit("added", this, amount);
		return amount;
	}

	remove(amount) {
		amount = Math.min(this.volume, amount);
		if (amount <= 0) return 0;
		this.volume -= amount;
		this.emit("removed", amount);
		if (this.holder) this.holder.c.ReagentHolder.emit("removed", this, amount);
		return amount;
	}

	overdose_process() {return;}
	overdose_start() {
		to_chat`<span class='userdanger'>You feel like you took too much of ${this.name}!</span>`(
			this.holder
		);
	}

	addiction_act_stage1(dt) {
		/* yes I know probabilities don't work like that but I really don't give 2 fucks */
		if (Math.random() < 0.15 * dt)
			to_chat`<span class='notice'>You feel like some ${name} right about now.</span>`(
				this.holder
			);
	}

	addiction_act_stage2(dt) {
		if (Math.random() < 0.15 * dt)
			to_chat`<span class='notice'>You feel like you need ${name}. You just can't get enough.</span>`(
				this.holder
			);
	}

	addiction_act_stage3(dt) {
		if (Math.random() < 0.15 * dt)
			to_chat`<span class='danger'>You have an intense craving for ${name}.</span>`(
				this.holder
			);
	}

	addiction_act_stage4(dt) {
		if (Math.random() < 0.15 * dt)
			to_chat`<span class='boldannounce'>You're not feeling good at all! You really need some ${name}.</span>`(
				this.holder
			);
	}

	mob_life(dt) {
		this.time_in_mob += dt;
		this.remove(this.metabolization_rate * dt);
	}

	reaction_obj() {return;}
	reaction_mob(target, { method, volume } = {}) {
		if (method == "vapor") {
			if (volume > 0.5) target.c.ReagentHolder.add(this, volume);
		}
	}
	reaction_turf() {return;}
}
Object.assign(Reagent.prototype, {
	name: "Reagent",
	description: "",
	taste_description: "metaphorical salt",
	taste_mult: 1,
	glass_name: "glass off ...what?",
	glass_desc: "You can't really tell what this is.",
	glass_icon_state: null,
	shot_glass_icon_state: null,
	reagent_state: "liquid",
	color: [0, 0, 0],
	can_synth: true,
	metabolization_rate: 0.2,
	overdose_threshold: 0,
	addiction_threshold: 0,
	nutriment_factor: 0.5,
	boozepwr: 0,
	toxpwr: 0,
	subtype: "chemical",
});

class ReagentReaction {
	constructor(obj) {
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

	get_react_status(container) {
		for (let [req, amount] of Object.entries(this.required_reagents)) {
			if (container.c.ReagentHolder.volume_of(req) < amount) return 2;
		}
		for (let [req, amount] of Object.entries(this.required_catalysts)) {
			if (container.c.ReagentHolder.volume_of(req) < amount) return 2;
		}
		if (
			this.min_temp != null &&
	container.c.ReagentHolder.temperature < this.min_temp
		)
			return 1;
		if (
			this.max_temp != null &&
	container.c.ReagentHolder.temperature > this.max_temp
		)
			return 1;
		return 0;
	}

	update(container) {
		let react_status = this.get_react_status(container);
		if (react_status == 2) {
			container.c.ReagentHolder.held_reactions.delete(this);
			return;
		}
		if (react_status == 1) {
			container.c.ReagentHolder.held_reactions.add(this);
			return;
		}

		let multiplier = Infinity;
		let single_result_volume = 0;
		let req_volume = 0;
		for (let v of Object.values(this.results)) single_result_volume += v;
		//multiplier = (container.c.ReagentHolder.maximum_volume - container.c.ReagentHolder.total_volume) / single_result_volume;
		for (let [reagent, req] of Object.entries(this.required_reagents)) {
			multiplier = Math.min(
				multiplier,
				container.c.ReagentHolder.volume_of(reagent) / req
			);
			req_volume += req;
		}
		let dv = single_result_volume - req_volume;
		if (dv > 0) {
			multiplier = Math.min(
				multiplier,
				(container.c.ReagentHolder.maximum_volume -
		container.c.ReagentHolder.total_volume) /
		dv
			);
		}
		multiplier = Math.floor(multiplier);
		if (multiplier < 1) {
			container.c.ReagentHolder.held_reactions.add(this);
			return;
		}
		for (let [reagent, req] of Object.entries(this.required_reagents)) {
			container.c.ReagentHolder.remove(reagent, req * multiplier);
		}
		this.react(container, multiplier);
	}
	react(container, multiplier = 1) {
		for (let [reagent, amount] of Object.entries(this.results))
			container.c.ReagentHolder.add(reagent, amount * multiplier);
		if (!has_component(container, "LivingMob") && this.mix_sound)
			new Sound(container.server, {
				path: this.mix_sound,
				volume: 0.8,
				vary: true,
			}).emit_from(container);
		if (this.mix_message)
			audible_message(this.mix_message).range(4).emit_from(container);
	}
}

module.exports = { Reagent, ReagentReaction };
