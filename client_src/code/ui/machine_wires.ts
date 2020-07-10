

class MachineWirePanel {
	panel: any;
	item_type: string | undefined;
	constructor(panel: any) {
		this.panel = panel;
		this.panel.on("message", this.handle_message.bind(this));

		this.panel.content_obj.innerHTML = `
			<div class='status-display wires_list'>

			</div>
			<div class='status-display status_text' style='display: none'>

			</div>
		`;
	}

	handle_message(msg: { wires: any; item_type: string | undefined; status_text: null | undefined; }) {
		console.log(msg);
		if (msg.wires) {
			for (const wire of msg.wires) {
				if (!this.panel.$(`.wire-color-${wire.color}`)) {
					const elem = document.createElement("tr");
					elem.classList.add(
						"zebrastripe",
						"flex",
						"flex-horizontal",
						`wire-color-${wire.color}`
					);
					elem.innerHTML = `
						<span class='wire-color' style='color: ${wire.color}'>${wire.color}</span>
						<div class='button wire-pulse-button' style='margin-left: auto' data-message='{"pulse":"${wire.color}"}' title="Requires multitool">Pulse</div>
						<div class='button wire-cut-button' data-message='{"cut":"${wire.color}"}' title="Requires wirecutters"></div>
					`;
					this.panel.$(".wires_list").appendChild(elem);
					if (this.item_type !== "Multitool")
						this.panel
							.$(`.wire-color-${wire.color} .wire-pulse-button`)
							.classList.add("disabled");
					if (this.item_type !== "Wirecutters")
						this.panel
							.$(`.wire-color-${wire.color} .wire-cut-button`)
							.classList.add("disabled");
				}
				if (wire.cut !== null)
					this.panel.$(
						`.wire-color-${wire.color} .wire-cut-button`
					).textContent = wire.cut ? "Mend" : "Cut";
			}
		}
		if (msg.item_type !== undefined) {
			this.item_type = msg.item_type;
			for (const elem of this.panel.$$(".wire-cut-button")) {
				if (this.item_type === "Wirecutters") elem.classList.remove("disabled");
				else elem.classList.add("disabled");
			}
			for (const elem of this.panel.$$(".wire-pulse-button")) {
				if (this.item_type === "Multitool") elem.classList.remove("disabled");
				else elem.classList.add("disabled");
			}
		}
		if (msg.status_text !== undefined) {
			if (msg.status_text === null)
				this.panel.$(".status_text").style.display = "none";
			else this.panel.$(".status_text").style.display = "block";
			this.panel.$(".status_text").innerHTML = msg.status_text;
		}
	}
}

module.exports.panel_classes = { MachineWirePanel };
