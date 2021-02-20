import { findLastIndex } from "underscore";

export{};
const {Atom} = require("../../client/index.js");

class SpawnObjectPanel {
	panel: any;
	templates: any;
	constructor(panel: Record<string, any>) {
		this.panel = panel;
		this.panel.on("message", this.message_handler.bind(this));

		this.panel.content_obj.innerHTML = `
<input type="text" placeholder="Search..." class="button search-field">
<div class='templates-list'>
</div>
`;
		this.panel.$(".search-field").addEventListener("input", (e: Record<string, any>) => {
			const term = e.target.value;
			for (const item of this.panel.$$(".template-entry")) {
				if (item.dataset.searchString.includes(term)) {
					item.style.display = "block";
				} else {
					item.style.display = "none";
				}
			}
		});
		this.panel.content_obj.addEventListener("click", (e: Record<string, any>) => {
			const button = e.target.closest(".spawn-button");
			if (button) {
				const template_name = button.closest(".template-entry").dataset.templateKey;
				this.panel.send_message({spawn: template_name});
			}
		});
		if (this.panel.manager.client.server_templates) {
			this.templates = this.panel.manager.client.server_templates;
			this.populate_templates();
		}
	}

	message_handler(msg: Record<string, any>) {
		if (msg.templates) {
			this.templates = msg.templates;
			this.panel.manager.client.server_templates = msg.templates;
			this.populate_templates();
		}
	}

	populate_templates() {
		for (const [tkey, tval] of Object.entries(this.templates).sort((a, b) => {
			const part1 = a[0] === b[0] ? 0 : -1;
			return a[0] > b[0] ? 1 : part1;
		})) {
			const key: any = tkey;
			const val: Record<string, any> = tval;
			const template_elem = document.createElement("div");
			template_elem.classList.add("template-entry");
			template_elem.style.borderBottom = "1px solid grey";
			template_elem.innerHTML = `
<canvas class='item-preview float-left' width=32 height=32></canvas>
<div class='button spawn-button float-right' dataset-template>Spawn</div>
<div><b>${val.vars.name}</b></div>
<div>
	<i>${key}</i>
</div>
`;
			template_elem.dataset.templateKey = key;
			template_elem.dataset.searchString = key + val.vars.name;
			this.panel.$(".templates-list").appendChild(template_elem);
			const preview = template_elem.querySelector(".item-preview");

			setTimeout(() => {
				// alright we need to build some images
				const instobj = Object.assign({}, val.vars);
				instobj.components = (val.components || []).filter((i: string | number) => {
					return this.panel.manager.client.components[i];
				});
				instobj.component_vars = val.vars.components;
				if (val.vars.components && val.vars.components.Tangible)
					{instobj.directional = val.vars.components.Tangible.directional;}
				else
					{instobj.directional = false;}
				const a = new Atom(this.panel.manager.client, instobj); // quick and dirty
				a.on_render_tick(0);
				a.fully_load(instobj.directional).then(() => {
					a.on_render_tick(0);
					a.draw(preview.getContext("2d"), 0);
					a.del();
				});
			}, 1);
		}
	}
}

module.exports.panel_classes = {SpawnObjectPanel};
