
const {
	Component,
	has_component,
	make_watched_property,
	chain_func,
} = require("./../../../typespess/index.js");

class ApcPowered extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.a.on("start_touch_area", this.start_touch_area.bind(this));
		this.a.on("end_touch_area", this.end_touch_area.bind(this));
		make_watched_property(this, "area");
		make_watched_property(this, "powered"); // controls whether this object received it's idle power in the last machine tick.
		this.a.c.MachineTick.process = chain_func(
			this.a.c.MachineTick.process,
			this.process.bind(this)
		);
	}

	start_touch_area(atom) {
		if (has_component(atom, "AreaPower")) {
			this.area = atom;
		}
	}
	end_touch_area(atom) {
		if (atom == this.area) {
			for (let brush of this.a.crosses()) {
				if (
					has_component(brush, "AreaBrush") &&
          has_component(brush.c.AreaBrush.area, "AreaPower")
				) {
					this.area = brush.c.AreaBrush.area;
					return;
				}
			}
			this.area = null;
		}
	}

	/**
   * @param {string} channel
   * @return {number} Amount of availible energy in joules
   */
	get_available_power(channel = this.power_channel) {
		if (!this.area) return 0;
		return this.area.c.AreaPower.get_available_power(channel);
	}

	/**
   *
   * @param {number} amount
   * @param {string} channel
   * @return {number} Amount of energy used in joules
   */
	use_power(amount, channel = this.power_channel) {
		if (!this.area) return 0;
		return this.area.c.AreaPower.use_power(amount, channel);
	}

	process(prev, dt) {
		prev();
		let new_powered = false;
		if (!this.using_idle_power) {
			new_powered = false;
		} else if (this.get_available_power() >= this.power_usage * dt) {
			this.use_power(this.power_usage * dt);
			new_powered = true;
		} else {
			new_powered = false;
		}
		// It looks 10x cooler if shit loses/gains power not all at the same time
		// So let's do that!
		setTimeout(() => {
			this.powered = new_powered;
		}, Math.random() * 1000 * Math.min(1, 0.8 * dt));
	}
}

ApcPowered.loadBefore = ["MachineTick"];
ApcPowered.depends = ["MachineTick"];

ApcPowered.template = {
	vars: {
		components: {
			ApcPowered: {
				power_channel: "equipment",
				// so tg code had "active" and "idle" power usage.
				// I've decided that this is unnecessary- it was generally
				// used by chargers, where there's already code in place to
				// charge something - just take the power at the same time the
				// charging happens using use_power, mmkay?
				power_usage: 0, // idle power usage in *watts*
				using_idle_power: false,
			},
		},
	},
};

class MachineTick extends Component {
	process(/* dt */) {}
}

module.exports.components = { MachineTick, ApcPowered };
