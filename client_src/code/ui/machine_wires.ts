class MachineWirePanel {
	panel: Record<string, any>;
	item_type: string;
	constructor(panel: Record<string, any>) {
		this.panel = panel;
		this.panel.on("message", this.handle_message.bind(this));

		this.panel.content_obj.innerHTML = `
			<div class='status-display wires_list'>

			</div>
			<div class='status-display status_text' style='display: none'>

			</div>
		`;
	}

	handle_message(msg: Record<string,any>) {
		if (msg.wires) {
			for (const wire of msg.wires) {
				if (!this.panel.$(`.wire-color-${wire.color}`)) {
					const elem = document.createElement("tr");
					elem.classList.add("zebrastripe", "flex", "flex-horizontal", `wire-color-${wire.color}`);
					elem.innerHTML = `
						<span class='wire-color' style='color: ${wire.color}'>${wire.color}</span>
						<div class='button wire-pulse-button' style='margin-left: auto' data-message='{"pulse":"${wire.color}"}' title="Requires multitool">Pulse</div>
						<div class='button wire-cut-button' data-message='{"cut":"${wire.color}"}' title="Requires wirecutters"></div>
					`;
					this.panel.$(".wires_list").appendChild(elem);
					if (this.item_type !== "Multitool") {
						this.panel.$(`.wire-color-${wire.color} .wire-pulse-button`).classList.add("disabled");
					}
					if (this.item_type !== "Wirecutters") {
						this.panel.$(`.wire-color-${wire.color} .wire-cut-button`).classList.add("disabled");
					}
				}
				if (typeof wire.cut !== "undefined") {
					this.panel.$(`.wire-color-${wire.color} .wire-cut-button`).textContent = wire.cut ? "Mend" : "Cut";
				}
			}
		}

		this.handle_other_messages(msg);
	}
	handle_other_messages(msg: Record<string,any>) {
		if (typeof msg.item_type !== "undefined") {
			this.item_type = msg.item_type;
			for (const elem of this.panel.$$(".wire-cut-button")) {
				if (this.item_type === "Wirecutters") {
					elem.classList.remove("disabled");
				} else {
					elem.classList.add("disabled");
				}
			}
			for (const elem of this.panel.$$(".wire-pulse-button")) {
				if (this.item_type === "Multitool") {
					elem.classList.remove("disabled");
				} else {
					elem.classList.add("disabled");
				}
			}
		}
		if (typeof msg.status_text !== "undefined") {
			if (typeof msg.status_text === "undefined") {
				this.panel.$(".status_text").style.display = "none";
			} else {
				this.panel.$(".status_text").style.display = "block";
			}
			this.panel.$(".status_text").innerHTML = msg.status_text;
		}
	}
}

module.exports.panel_classes = {MachineWirePanel};
