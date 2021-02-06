

class ReagentBinding {
	constructor(panel, holder, props) {
		this.panel = panel;
		this.reagent_holder = holder;
		Object.assign(
			this,
			{
				path: "beaker",
				include_temperature: false,
				include_holder_name: true,
				sent_props: ["name", "volume"],
			},
			props
		);
		const obj = {};
		if (this.include_temperature)
			{obj.temperature = this.reagent_holder.c.ReagentHolder.temperature;}
		if (this.include_holder_name) {obj.holder_name = this.reagent_holder.name;}
		obj.total_volume = this.reagent_holder.c.ReagentHolder.total_volume;
		obj.maximum_volume = this.reagent_holder.c.ReagentHolder.maximum_volume;
		obj.reagents = {};
		for (const [key, reagent] of this.reagent_holder.c.ReagentHolder.reagents) {
			const robj = {};
			for (const prop of this.sent_props) {
				robj[prop] = reagent[prop];
			}
			obj.reagents[key] = robj;
		}
		this.send_message(obj);
		this.temperature_changed = this.temperature_changed.bind(this);
		this.added = this.added.bind(this);
		this.removed = this.removed.bind(this);
		if (this.include_temperature)
			{this.reagent_holder.c.ReagentHolder.on(
				"temperature_changed",
				this.temperature_changed
			);}
		this.reagent_holder.c.ReagentHolder.on("added", this.added);
		this.reagent_holder.c.ReagentHolder.on("removed", this.removed);
	}

	close() {
		if (this.panel.is_open) {this.send_message(null);}
		if (this.include_temperature)
			{this.reagent_holder.c.ReagentHolder.removeListener(
				"temperature_changed",
				this.temperature_changed
			);}
		this.reagent_holder.c.ReagentHolder.removeListener("added", this.added);
		this.reagent_holder.c.ReagentHolder.removeListener("removed", this.removed);
	}

	temperature_changed() {
		this.send_message({
			temperature: this.reagent_holder.c.ReagentHolder.temperature,
		});
	}

	added(reagent) {
		if (
			!this.reagent_holder.c.ReagentHolder.reagents.has(
				reagent.constructor.name
			)
		)
			{return;}
		const msg = {
			total_volume: this.reagent_holder.c.ReagentHolder.total_volume,
			maximum_volume: this.reagent_holder.c.ReagentHolder.maximum_volume,
			reagents: {},
		};
		const robj = {};
		for (const prop of this.sent_props) {
			robj[prop] = reagent[prop];
		}
		msg.reagents[reagent.constructor.name] = robj;
		this.send_message(msg);
	}

	removed(reagent) {
		const msg = {
			total_volume: this.reagent_holder.c.ReagentHolder.total_volume,
			maximum_volume: this.reagent_holder.c.ReagentHolder.maximum_volume,
			reagents: {},
		};
		if (reagent.volume <= 0) {
			msg.reagents[reagent.constructor.name] = null;
		} else {
			const robj = {};
			for (const prop of this.sent_props) {
				robj[prop] = reagent[prop];
			}
			msg.reagents[reagent.constructor.name] = robj;
		}
		if (this.panel.is_open) {this.send_message(msg);}
	}

	send_message(obj) {
		const sent_obj = {};
		let curr_obj = sent_obj;
		const split = this.path.split(".");
		for (let i = 0; i < split.length - 1; i++) {
			curr_obj[split[i]] = curr_obj = {};
		}
		curr_obj[split[split.length - 1]] = obj;
		this.panel.send_message(curr_obj);
	}
}

module.exports = ReagentBinding;