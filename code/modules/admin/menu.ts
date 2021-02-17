export{};
const { Panel } = require("./../../../code/game/server.js");

const admin_tools: Record<string,any> = {};

class AdminPanel extends Panel {
	constructor(client: Record<string,any>) {
		super(client, {
			width: 500,
			height: 400,
			title: "Admin Tools",
			can_close: true,
		});
		this.on("message", this.message_handler.bind(this));
		this.on("open", this.opened.bind(this));
		this.on("close", this.closed.bind(this));
	}

	message_handler(msg: Record<string,any>) {
		if (msg.button_tool && msg.button) {
			const tool = admin_tools[msg.button_tool];
			if (
				tool &&
		this.client.holder &&
		this.client.holder.has_permission(tool.perm_required)
			) {
				const func = tool.buttons[msg.button];
				if (func) {func(this.client);}
			}
		}
	}
	opened() {
		this.client.holder.admin_menu = this;
		const tools: Record<string,any> = {};
		for (const [key, ttool] of Object.entries(admin_tools)) {
			const tool: Record<string,any> = ttool;
			if (
				!this.client.holder ||
		!this.client.holder.has_permission(tool.perm_required)
			)
				{continue;}
			tools[key] = {
				name: tool.name,
				desc: tool.desc,
				buttons: Object.keys(tool.buttons),
			};
		}
		this.send_message({ tools: tools });
	}
	closed() {
		this.client.holder.admin_menu = null;
	}
}

importModule(require("./spawn_object.js"));
importModule(require("./unsorted_tools.js"));

function importModule(mod: Record<string,any>) {
	if (mod.admin_tools) {
		for (const [key, tool] of Object.entries(mod.admin_tools)) {
			if (admin_tools[key]) {console.warn(`Admin tool ${key} already exists!`);}
			admin_tools[key] = tool;
		}
	}
}

module.exports.now = (server:any) => {
	server.on("client_login", (client: Record<string,any>) => {
		client.on("keydown", (e: Record<string,any>) => {
			if (!e) {return;}
			if (e.key === "F4" && client.holder && !client.holder.admin_menu) {
					const menu = new AdminPanel(client);
					menu.open();
				}
		});
	});
};
