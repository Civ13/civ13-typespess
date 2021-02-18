export{};
const _ = require("underscore");

class PowerController {
	server: any;
	powernets: Set<unknown>;
	machines: Set<unknown>;
	last_tick_time: any;
	constructor(server: Record<string, any>) {
		this.server = server;
		this.powernets = new Set();
		this.machines = new Set();
		this.last_tick_time = null;
		this.tick = this.tick.bind(this);
	}

	start() {
		this.tick();
	}

	async tick() {
		if (this.server.ticker.game_state !== "pregame") {
			this.last_tick_time = this.server.now();
			const dt = 1;
			for (const powernet of _.shuffle([...this.powernets])) {
				if (!powernet.nodes.size && !powernet.cables.size) {
					this.powernets.delete(powernet);
				} else {
					powernet.reset(dt);
				}
			}
		}
		setTimeout(this.tick, 1000 - (this.server.now() - this.last_tick_time));
	}
}

module.exports.now = (server: any) => {
	server.power_controller = new PowerController(server);
};

module.exports.server_start = (server: Record<string, any>) => {
	server.power_controller.start();
};
