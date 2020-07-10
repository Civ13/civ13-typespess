
class AdminPanel {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	panel: any; tools: any;
	constructor(panel: any) {
		this.panel = panel;
		this.panel.on("message", this.message_handler.bind(this));

		this.panel.content_obj.innerHTML = `
<input type="text" placeholder="Search..." class="button search-field">
<div class='tools-list'>
</div>
`;
		this.panel.$(".search-field").addEventListener("input", (e: { target: { value: any; }; }) => {
			const term = e.target.value;
			for (const item of this.panel.$$(".tool-entry")) {
				if (item.dataset.searchString.includes(term))
					item.style.display = "block";
				else item.style.display = "none";
			}
		});
	}

	message_handler(msg: { tools: any; }) {
		if (msg.tools) {
			this.tools = msg.tools;
			this.populate_tools();
		}
	}

	populate_tools() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		for (const [key, val] of Object.entries(this.tools).sort((a:Array<any>, b:Array<any>) => {
			return a[1].name > b[1].name ? 1 : a[1].name === b[1].name ? 0 : -1;
		})) {
			const template_elem = document.createElement("div");
			template_elem.classList.add("tool-entry");
			template_elem.style.borderBottom = "1px solid grey";
			template_elem.innerHTML = `
<div style='font-weight:bold'>${val.name}</div>
<div><i>${val.desc || ""}</i></div>
<div class='buttons'></div>
`;
			template_elem.dataset.searchString = key + val.name;
			this.panel.$(".tools-list").appendChild(template_elem);
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const buttons_list = template_elem.querySelector(".buttons")!;
			for (const button of val.buttons) {
				const elem = document.createElement("div");
				elem.classList.add("button");
				elem.textContent = button;
				elem.dataset.message = JSON.stringify({ button_tool: key, button });
				buttons_list.appendChild(elem);
			}
		}
	}
}

module.exports.panel_classes = { AdminPanel };
