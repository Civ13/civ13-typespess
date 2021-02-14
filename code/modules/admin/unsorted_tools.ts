

module.exports.admin_tools = {
	start_now: {
		name: "Start Game",
		perm_required: "server.lobby_timer",
		buttons: {
			"Start Game": (client: Record<string,any>) => {
				client.server.ticker.start_at = 1;
			},
		},
	},
};
