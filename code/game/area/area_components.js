const {
	Component,
	Sound,
	has_component,
} = require("./../../../typespess/index.js");

class AreaAmbience extends Component {
	constructor(atom, template) {
		super(atom, template);

		this.a.c.Area.on("start_touch", this.start_touch.bind(this));
	}
	start_touch(atom) {
		if (has_component(atom, "LivingMob") && atom.c.Mob.client) {
			if (Math.random() < 0.35 && !atom.c.Mob.client.played_ambience) {
				atom.c.Mob.client.played_ambience = true;
				let soundname = this.ambient_sounds[
					Math.floor(Math.random() * this.ambient_sounds.length)
				];
				let sound = new Sound(this.a.server, { path: soundname, volume: 0.35 });
				sound.play_to(atom);
				atom.c.Mob.client.ambience_sound = sound; // so it can be turned off later if the client wants
				setTimeout(() => {
					if (atom.c.Mob.client) atom.c.Mob.client.played_ambience = false;
				}, 60000);
			}
		}
	}
}

AreaAmbience.template = {
	vars: {
		components: {
			AreaAmbience: {
				ambient_sounds: [
					"sound/ambience/ambigen1.ogg",
					"sound/ambience/ambigen3.ogg",
					"sound/ambience/ambigen4.ogg",
					"sound/ambience/ambigen5.ogg",
					"sound/ambience/ambigen6.ogg",
					"sound/ambience/ambigen7.ogg",
					"sound/ambience/ambigen8.ogg",
					"sound/ambience/ambigen9.ogg",
					"sound/ambience/ambigen10.ogg",
					"sound/ambience/ambigen11.ogg",
					"sound/ambience/ambigen12.ogg",
					"sound/ambience/ambigen14.ogg",
				],
			},
		},
	},
};

AreaAmbience.depends = ["Area"];
AreaAmbience.loadBefore = ["Area"];

class AreaArrivals extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.a.server.job_controller.arrivals_area = this.a;
		this.chairs = [];
		this.a.c.Area.on("start_touch", this.start_touch.bind(this));
		this.a.c.Area.on("end_touch", this.end_touch.bind(this));
	}

	start_touch(item) {
		if (has_component(item, "Chair")) {
			this.chairs.push(item);
		}
	}
	end_touch(item) {
		if (has_component(item, "Chair")) {
			let idx = this.chairs.indexOf(item);
			if (idx != -1) this.chairs.splice(idx, 1);
		}
	}
}

AreaArrivals.depends = ["Area"];
AreaArrivals.loadBefore = ["Area"];

class AreaPower extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.apc = null;
	}

	// returns the energy available in joules
	get_available_power(channel = "equipment") {
		if (this.infinite_power) return Infinity;
		if (!this.apc) return 0;
		return this.apc.c.Apc.get_available_power(channel);
	}

	// uses this amount of energy
	use_power(amount, channel = "equipment") {
		if (this.infinite_power) return amount;
		if (!this.apc) return 0;
		return this.apc.c.Apc.use_power(amount, channel);
	}
}

AreaPower.loadBefore = ["Area"];
AreaPower.depends = ["Area"];

AreaPower.template = {
	vars: {
		components: {
			AreaPower: {
				infinite_power: false, // more clear variable name than what byond does
			},
		},
	},
};

module.exports.components = { AreaAmbience, AreaArrivals, AreaPower };
