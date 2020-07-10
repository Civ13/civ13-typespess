const {
	Component,
	Sound,
	Atom,
} = require("./../../../code/game/server.js");
const NewPlayerPanel = require("./new_player_panel.js");
const _ = require("underscore");
const CharacterPreferences = require("../../modules/client/character.js");
const { chain_func } = require("../utils.js");

class SplashScreen extends Component.Networked {
	constructor(atom, template) {
		super(atom, template);
		this.fading = false;
		this.fade_start = 0;
		this.fade_len = 1500;
		this.a.del = chain_func(this.a.del, this.del.bind(this));
		this.a.on_render_tick = chain_func(
			this.a.on_render_tick,
			this.on_render_tick.bind(this)
		);
		this.a.draw = chain_func(this.a.draw, this.draw.bind(this));
	}

	on_render_tick(prev) {
		prev();
		if (this.fading) this.a.mark_dirty();
	}

	draw(prev, ctx, timestamp) {
		const old_alpha = ctx.globalAlpha;
		if (this.fading) {
			ctx.globalAlpha *=
		1 - (1 / this.fade_len) * (timestamp - this.fade_start);
		}
		prev();
		ctx.globalAlpha = old_alpha;
	}

	del(prev) {
		this.fading = true;
		this.fade_start = performance.now();
		setTimeout(prev, this.fade_len);
	}
}

class NewPlayer extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.a.c.Mob.on("client_changed", this.client_changed.bind(this));

		this.splash_screen = new Atom(this.a.server, {
			components: ["SplashScreen"],
			vars: {
				screen_loc_x: 0,
				screen_loc_y: 14,
				icon: "icons/title_screen/civ13.png",
				icon_state: "",
				layer: 30,
			},
		});
		this.a.c.Eye.screen.splash_screen = this.splash_screen;
	}

	client_changed(old_client, new_client) {
		if (old_client) {
			this.new_player_panel.close();
			this.lobby_music_sound.stop();
			this.a.destroy();
			this.a.server.ticker.total_players--;
			return;
		}
		if (new_client) {
			this.a.server.ticker.total_players++;

			this.new_player_panel = new NewPlayerPanel(new_client);
			this.new_player_panel.open();

			this.lobby_music_sound = new Sound(this.a.server, {
				path: this.a.server.lobby_music,
				volume: 0.85,
			});
			this.lobby_music_sound.play_to(new_client);

			if (!new_client.character_preferences)
				new_client.character_preferences = new CharacterPreferences();
		}
	}

	destroy() {
		this.splash_screen.destroy();
	}
}
NewPlayer.depends = ["Mob"];
NewPlayer.loadBefore = ["Mob"];

module.exports.components = { NewPlayer, SplashScreen };
module.exports.now = function (server) {
	server.lobby_music = _.sample(["sound/music/words_through_the_sky.ogg"]);
};
