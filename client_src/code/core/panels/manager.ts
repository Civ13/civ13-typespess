class PanelManager extends EventEmitter {
	constructor(client: any) {
		super();
		this.client = client;
		this.panels = {};
	}

	send_message(obj: any) {
		if (!this.client.connection) return;
		this.client.connection.send(JSON.stringify({ panel: obj }));
	}

	create_client_panel(obj: any) {
		const panel = new Panel(this, "", obj);
		this.emit("create", panel, obj);
		return panel;
	}

	handle_message(obj: { create: { [x: string]: any; }; message: any; close: any; }) {
		if (obj.create) {
			for (const id in obj.create) {
				if (!Object.prototype.hasOwnProperty.call(obj.create,id)) continue;
				if (this.panels[id])
					console.warn(
						`The server tried to open a panel with the same ID ${id} twice! ${JSON.stringify(
							obj.create[id]
						)}`
					);
				const panel = new Panel(this, id, obj.create[id]);
				this.emit("create", panel, obj.create[id]);
			}
		}
		if (obj.message) {
			for (const message of obj.message) {
				const panel = this.panels[message.id];
				if (!panel) continue;
				panel.emit("message", message.contents);
			}
		}
		if (obj.close) {
			for (const id of obj.close) {
				const panel = this.panels[id];
				if (!panel) continue;
				panel.close();
			}
		}
	}
}

module.exports = PanelManager;
