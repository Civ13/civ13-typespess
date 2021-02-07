
const EventEmitter = require("events");
const {
	make_watched_property,
	to_chat,
	stoplag,
	has_component,
} = require("./../../code/game/server.js");
const Mind = require("./mobs/mind/mind.js");
class GameTicker extends EventEmitter {
	constructor(server) {
		super();
		this.server = server;
		this.server.ticker = this;
		/** @type {"pregame"|"playing"|"finished"} */
		this.game_state = "pregame";
		this.busy = false;
		this.total_players = 0;
		this.total_players_ready = 0;
		/** @type {number|null} */
		this.start_at = null;

		this.round_tip_override = null;
		this.round_tip_sent = false;

		make_watched_property(this, "total_players", "number");
		make_watched_property(this, "game_state", "string");
		make_watched_property(this, "start_at");
		this.on("total_players_changed", this.total_players_changed.bind(this));
	}
	start_ticking() {
		setInterval(this.tick.bind(this), 2000);
		if (this.total_players)
			{this.start_at =
		this.server.now() + 3 * 1000;}
	}
	tick() {
		if (this.busy) {return;}
		if (this.game_state === "pregame") {
			if (typeof this.start_at !== "undefined") {
				const time_left = this.start_at - this.server.now();
				/** if (time_left <= 30000 && !this.round_tip_sent) {this.send_tip_of_the_round();
					this.round_tip_sent = true;
				}*/
				if (time_left <= 0) {
					this.start_game().then(
						(success) => {
							if (!success) {
								this.game_state = "pregame";
								this.busy = false;
								if (this.total_players)
									{this.start_at =
					this.server.now() +
					3 * 1000;}
								else {this.start_at = null;}
							}
						},
						(err) => {
							console.error(err);
							// eslint-disable-next-line no-process-exit
							process.exit(1); // something went horribly wrong, let's gtfo.
						}
					);
				}
			}
		}
	}

	async start_game() {
		this.busy = true;
		to_chat`<span class='boldannounce'>Starting game...</span>`(
			Object.values(this.server.clients)
		);
		stoplag();
		for (const client of Object.values(this.server.clients)) {
			if (
				has_component(client.mob, "NewPlayer") &&
		client.mob.c.NewPlayer.new_player_panel &&
		client.mob.c.NewPlayer.new_player_panel.ready
			) {
				// readied up.
				const mind = new Mind(client.key);
				if (client.character_preferences)
					{mind.character_preferences = client.character_preferences;}
				this.server.job_controller.unassigned.add(mind);
			}
		}
		this.server.job_controller.divide_occupations();
		for (const mind of this.server.job_controller.assigned) {
			if (!mind.assigned_role) {continue;} //
			// alright now spawn everyone in
			const mob = mind.assigned_role.instance(this.server,mind.character_preferences);
			mind.transfer_to(mob);
			this.server.job_controller.send_to_spawn(mob, mind.assigned_role.id);
			mind.assigned_role.after_spawn(mob);
		}
		stoplag();
		to_chat`<span style='color:red;font-weight:bold'>Welcome to Civilization 13, enjoy your stay!</span>`(
			Object.values(this.server.clients)
		);
		this.busy = false;
		this.game_state = "playing";
		return true;
	}

	total_players_changed(from, to) {
		if (from && !to) {this.start_at = null;}
		if (to && !from)
			{this.start_at = this.start_at =
		this.server.now() + 3 * 1000;}
	}
}

module.exports.now = (server) => {
	server.ticker = new GameTicker(server);
};

module.exports.server_start = (server) => {
	server.ticker.start_ticking();
};
