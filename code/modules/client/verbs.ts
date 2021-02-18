export{};
const {to_chat} = require("./../../../code/game/server.js");

module.exports.now = function (server: Record<string, any>) {
	server.on("client_login", function (client: Record<string, any>) {
		client.on("message", (obj: Record<string, any>) => {
			if (obj.ooc_message) {
				if (client.last_ooc_message && server.now() < client.last_ooc_message + 300) {
					to_chat`You're doing that too fast!`(client);
				} else {
					client.last_ooc_message = server.now();
					const msg = ("" + obj.ooc_message).substring(0, 256);
					to_chat`<span style='color:#002eb8' class='ooc'><span class='prefix'>OOC:</span> <EM>${client.name}:</EM> <span class='message'>${msg}</span></span>`(
						[...Object.values(server.clients)]
					);
				}
			}
		});
	});
};
