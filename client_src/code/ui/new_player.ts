class NewPlayerPanel {
	panel: any;
	start_at: any;
	timer_timeout: NodeJS.Timeout;
	constructor(panel: Record<string, any>) {
		this.panel = panel;
		this.panel.on("message", this.handle_message.bind(this));
		this.build_content();
		this.update_timer = this.update_timer.bind(this);
		this.update_timer();
	}

	handle_message(message: Record<string, any>) {
		if (typeof message.latejoin !== "undefined") {
			[...this.panel.content_obj.getElementsByClassName("pregame")].forEach(
				(item) => (item.style.display = message.latejoin ? "none" : "block")
			);
			[...this.panel.content_obj.getElementsByClassName("latejoin")].forEach(
				(item) => (item.style.display = message.latejoin ? "block" : "none")
			);
		}
		if (typeof message.start_at !== "undefined") {
			this.start_at = message.start_at;
			this.update_timer();
		}
	}

	update_timer() {
		this.timer_timeout = setTimeout(this.update_timer, 50);
		if (typeof this.start_at === "undefined") {
			this.panel.$(".timer").textContent = "Delayed";
		} else {
			const time_left = this.start_at - (performance.now() - this.panel.manager.client.server_time_to_client);
			if (time_left < 0) {
				this.panel.$(".timer").textContent = "SOON";
			} else {
				this.panel.$(".timer").textContent = (time_left / 1000).toFixed(1);
			}
		}
	}

	build_content() {
		this.panel.header_obj.classList.add("center");
		this.panel.content_obj.classList.add("center");
		this.panel.content_obj.innerHTML = `
			<div class="vertical-margins"><div class='button' data-message='{"setup_character":true}'>Character & Preferences</div></div>
			<div class="pregame vertical-margins">
				Starting in: <span class='timer'></span>
			</div>
			<div class="latejoin vertical-margins"><div class='button' data-message='{"latejoin":true}'>Join Game</div></div>
			<div class="vertical-margins"><div class='button' data-message='{"observe":true}'>Observe</div></div>
		`;
	}
}

module.exports.panel_classes = {NewPlayerPanel};
