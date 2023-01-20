class ServerPanel {
	panel: Record<string, any>;
	connection: any;
	constructor(panel: any) {
		this.panel = panel;
		this.panel.content_obj.classList.add("center");
		this.panel.header_obj.classList.add("center");
		this.connection = panel.manager.client.connection;
		this.run();
	}

	run() {
		let div = document.createElement("div");
		div.classList.add("vertical-margins");
		const button = document.createElement("div");
		button.classList.add("button");
		button.textContent = "Local";
		button.addEventListener("click", () => {
			this.panel.manager.client.resume_login("localhost");
			this.panel.close();
		});
		div.appendChild(button);
		this.panel.content_obj.appendChild(div);

		div = document.createElement("div");
		div.classList.add("vertical-margins");
		const button1 = document.createElement("div");
		button1.classList.add("button");
		button1.textContent = "civ13.com";
		button1.addEventListener("click", () => {
			this.panel.manager.client.resume_login("civ13.com");
			this.panel.close();
		});
		div.appendChild(button1);
		this.panel.content_obj.appendChild(div);
	}
}

module.exports.panel_classes = {ServerPanel};
