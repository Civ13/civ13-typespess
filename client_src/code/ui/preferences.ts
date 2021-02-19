export{};
const {Atom, dropdown} = require("../../client/index.js");

const job_pref_settings = ["NEVER", "Low", "Medium", "High"];
const job_pref_colors = ["red", "orange", "green", "slateblue"];

class PreferencesPanel {
	panel: any;
	char_prefs: any;
	sprite_accessories: any;
	job_preferences: any;
	job_metas: any;
	hair_colors: Record<string, any>;
	skin_tones: Record<string, any>;
	constructor(panel: any) {
		this.panel = panel;
		this.panel.header_obj.classList.add("center");
		this.panel.content_obj.innerHTML = `
<div class='center'>
	<div class='button' data-radio-group='tab' data-tab='character'>Character Setup</div>
	<div class='button' data-radio-group='tab' data-tab='job-preferences'>Job Preferences</div>
	<div class='button' data-radio-group='tab' data-tab='preferences'>Preferences</div>
</div>
<hr>
<div class='tabcontent' style='display: none' data-tab='character'>

<div class='status-display float-right' style='width:128px;height:128px;margin-left: 10;padding:0;position:relative'>
	<canvas class='preview-down' style='width:64px; position:absolute; top:0;left:0'></canvas>
	<canvas class='preview-right' style='width:64px; position:absolute; top:0;right:0'></canvas>
	<canvas class='preview-up' style='width:64px; position:absolute; bottom:0;left:0'></canvas>
	<canvas class='preview-left' style='width:64px; position:absolute; bottom:0;right:0'></canvas>
</div>
<div class='status-display'>
	<h2>Identity</h2>
	<div><div class='button property-be_random_name'>Always Random Name</div></div>
	<table>
	<tr>
		<td>Name:</td>
		<td><input type='text' class='button nopress nocenter property-name' maxlength=42></td>
		<td><div class='button yellow' data-message='{"randomize_name":"human"}'>Random</div></td>
	</tr>
	<tr>
		<td>Gender:</td>
		<td><div class='button property-gender dropdown'>Male</div></td>
	</tr>
	<tr>
		<td>Age:</td>
		<td><input class='button nopress nocenter property-age' type='number' min=17 max=85></td>
	</tr>
	</table>
</div>

<div class='status-display'>
	<h2>Body</h2>
	<div class='flex-horizontal wrap appearance-properties-container'>
		<div>
			<h3>Skin Tone</h3>
			<div><div class='button property-skin_tone dropdown'>caucasian2</div></div>
		</div>
		<div>
			<h3>Hair Style</h3>
			<div><div class='button property-hair dropdown'>Bald</div></div>
			<div><div class='button property-hair_color dropdown'>Color</div></div>
		</div>
	</div>
</div>

</div>
<div class='tabcontent' style='display: none' data-tab='job-preferences'>

<div class='job-list' style='color: #000000;display:grid;grid-auto-flow:column'></div>

</div>
<div class='tabcontent' style='display: none' data-tab='preferences'>

<input type="range" min="1" max="16" step="1" class="shadow-quality-slider" value=8>

</div>`;
		[...this.panel.$$('.button[data-radio-group="tab"]')].forEach((item) => {
			item.addEventListener("click", () => {
				this.show_tab(item.dataset.tab);
			});
		});

		const name_field = this.panel.$(".property-name");
		name_field.addEventListener("input", () => {
			this.panel.send_message({char_prefs: {name: name_field.value}});
		});

		const gender_dropdown = this.panel.$(".property-gender");
		gender_dropdown.addEventListener("click", (e: {defaultPrevented: any}) => {
			if (e.defaultPrevented) {
				return;
			}
			const genders = {male: "Male", female: "Female"};
			const menu = document.createElement("div");
			menu.classList.add("dropdown-content");
			for (const [id, name] of Object.entries(genders)) {
				const item = document.createElement("div");
				item.classList.add("button", "dropdown-item");
				if (id === this.char_prefs.gender) {
					item.classList.add("selected");
				}
				item.textContent = name;
				item.addEventListener("click", (e2) => {
					this.panel.send_message({char_prefs: {gender: id}});
					e2.preventDefault();
					this.char_prefs.gender = id;
					gender_dropdown.textContent = name;
					this.update_previews();
				});
				menu.appendChild(item);
			}
			dropdown(gender_dropdown, menu);
		});

		const hair_dropdown = this.panel.$(".property-hair");
		hair_dropdown.addEventListener("click", (e: {defaultPrevented: any}) => {
			if (e.defaultPrevented) {
				return;
			}
			const menu = document.createElement("div");
			menu.classList.add("dropdown-content");
			let sel_elem = null;
			for (const [id, tobj] of Object.entries(this.sprite_accessories.hair)) {
				const obj: Record<string, any> = tobj;
				const item = document.createElement("div");
				item.classList.add("button", "dropdown-item");
				item.style.height = "64px";
				if (id === this.char_prefs.hair_style) {
					item.classList.add("selected");
					sel_elem = item;
				}
				const text = document.createElement("span");
				text.textContent = obj.name;
				const preview = this.create_preview({
					prefs_modifier: (prefs: any) => {
						prefs.hair_style = id;
					},
				});
				preview.style.float = "left";
				preview.style.height = "64px";
				item.appendChild(preview);
				item.appendChild(text);
				item.addEventListener("click", (e3) => {
					this.panel.send_message({char_prefs: {hair_style: id}});
					e3.preventDefault();
					this.char_prefs.hair_style = id;
					hair_dropdown.textContent = obj.name;
					this.update_previews();
				});
				menu.appendChild(item);
			}
			dropdown(hair_dropdown, menu);
			if (sel_elem) {
				sel_elem.scrollIntoView({behavior: "auto"});
			}
		});

		const skin_tone_dropdown = this.panel.$(".property-skin_tone");
		skin_tone_dropdown.addEventListener("click", (e: {defaultPrevented: any}) => {
			if (e.defaultPrevented) {
				return;
			}
			const menu = document.createElement("div");
			menu.classList.add("dropdown-content");
			let sel_elem = null;
			for (const id of Object.keys(this.skin_tones)) {
				const item = document.createElement("div");
				item.classList.add("button", "dropdown-item");
				item.style.height = "64px";
				if (id === this.char_prefs.skin_tone) {
					item.classList.add("selected");
					sel_elem = item;
				}
				const text = document.createElement("span");
				text.textContent = id;
				const preview = this.create_preview({
					prefs_modifier: (prefs: {skin_tone: string}) => {
						prefs.skin_tone = id;
					},
				});
				preview.style.float = "left";
				preview.style.height = "64px";
				item.appendChild(preview);
				item.appendChild(text);
				item.addEventListener("click", (e4) => {
					this.panel.send_message({char_prefs: {skin_tone: id}});
					e4.preventDefault();
					this.char_prefs.skin_tone = id;
					skin_tone_dropdown.textContent = id;
					this.update_previews();
				});
				menu.appendChild(item);
			}
			dropdown(skin_tone_dropdown, menu);
			if (sel_elem) {
				sel_elem.scrollIntoView({behavior: "auto"});
			}
		});
		const hair_color_dropdown = this.panel.$(".property-hair_color");
		hair_color_dropdown.addEventListener("click", (e: {defaultPrevented: any}) => {
			if (e.defaultPrevented) {
				return;
			}
			const menu = document.createElement("div");
			menu.classList.add("dropdown-content");
			let sel_elem = null;
			for (const id of Object.keys(this.hair_colors)) {
				const item = document.createElement("div");
				item.classList.add("button", "dropdown-item");
				item.style.width = "96px";
				item.style.height = "24px";
				item.style.backgroundColor = this.hair_colors[id];
				if (this.hair_colors[id] === this.char_prefs.hair_color) {
					item.classList.add("selected");
					sel_elem = item;
				}
				const text = document.createElement("span");
				text.textContent = id;
				item.appendChild(text);
				item.addEventListener("click", (e5) => {
					this.panel.send_message({char_prefs: {hair_color: this.hair_colors[id]}});
					e5.preventDefault();
					this.char_prefs.hair_color = this.hair_colors[id];
					hair_color_dropdown.textContent = id;
					hair_color_dropdown.style.backgroundColor = this.char_prefs.hair_color;
					this.update_previews();
				});
				menu.appendChild(item);
			}
			dropdown(hair_color_dropdown, menu);
			if (sel_elem) {
				sel_elem.scrollIntoView({behavior: "auto"});
			}
		});

		this.panel.$(".property-age").addEventListener("input", (e: {target: {value: string | number}}) => {
			const age = Math.round(+e.target.value);
			this.panel.send_message({char_prefs: {age}});
		});

		const shadow_quality_slider = this.panel.$(".shadow-quality-slider");
		shadow_quality_slider.value = this.panel.manager.client.soft_shadow_resolution;
		shadow_quality_slider.addEventListener("input", () => {
			const desired_res = +shadow_quality_slider.value;
			this.panel.manager.client.soft_shadow_resolution = desired_res;
			localStorage.setItem("shadow_resolution", String(desired_res));
			for (const atom of this.panel.manager.client.atoms) {
				if (atom && atom.c && atom.c.LightingObject) {
					atom.mark_dirty();
				}
			}
		});

		this.panel.on("message", this.handle_message.bind(this));

		this.char_prefs = {};
	}

	show_tab(tab: any) {
		[...this.panel.$$(".tabcontent")].forEach((item) => {
			item.style.display = "none";
		});
		const tab_obj = this.panel.$(`.tabcontent[data-tab='${tab}']`);
		if (tab_obj) {
			tab_obj.style.display = "block";
		}
	}
	msg_char_prefs(msg: {
		char_prefs: {name: any; gender: string; age: any; skin_tone: any; hair_color: any; hair_style: string | number};
	}) {
		Object.assign(this.char_prefs, msg.char_prefs);
		if (msg.char_prefs.name) {
			this.panel.$(".property-name").value = msg.char_prefs.name;
		}
		if (msg.char_prefs.gender) {
			this.panel.$(".property-gender").textContent = msg.char_prefs.gender === "male" ? "Male" : "Female";
		}
		if (msg.char_prefs.age) {
			this.panel.$(".property-age").value = msg.char_prefs.age;
		}

		if (msg.char_prefs.skin_tone) {
			this.panel.$(".property-skin_tone").textContent = msg.char_prefs.skin_tone;
		}
		if (msg.char_prefs.hair_color) {
			this.panel.$(".property-hair_color").style.backgroundColor = msg.char_prefs.hair_color;
		}
		if (msg.char_prefs.hair_style) {
			this.panel.$(".property-hair").textContent = this.sprite_accessories.hair[msg.char_prefs.hair_style].name;
		}
		this.update_previews();
	}
	handle_message(msg: {
		sprite_accessories: any;
		skin_tones: any;
		hair_colors: any;
		set_tab: any;
		char_prefs: any;
		name_valid: any;
		name_correction: any[];
		job_preferences: any;
		job_metas: any;
	}) {
		if (msg.sprite_accessories) {
			this.sprite_accessories = msg.sprite_accessories;
		}
		if (msg.skin_tones) {
			this.skin_tones = msg.skin_tones;
		}
		if (msg.hair_colors) {
			this.hair_colors = msg.hair_colors;
		}
		if (msg.set_tab) {
			[...this.panel.$$(".button[data-radio-group='tab']")].forEach((item) => {
				item.classList.remove("selected");
			});
			this.panel.$(`.button[data-radio-group='tab'][data-tab='${msg.set_tab}']`).classList.add("selected");
			this.show_tab(msg.set_tab);
		}
		if (msg.char_prefs) {
			this.msg_char_prefs(msg);
		}

		if (Object.prototype.hasOwnProperty.call(msg, "name_valid")) {
			const elem = this.panel.$(".property-name");
			if (msg.name_valid) {
				elem.classList.remove("red");
			} else {
				elem.classList.add("red");
			}
		}
		if (msg.name_correction) {
			const elem = this.panel.$(".property-name");
			if (elem.value === msg.name_correction[0]) {
				elem.value = msg.name_correction[1];
			}
		}

		if (msg.job_preferences) {
			this.handle_prefs(msg);
		}
	}
	handle_prefs(msg: Record<string, any>) {
		this.job_preferences = msg.job_preferences;
		if (msg.job_metas) {
			this.job_metas = msg.job_metas;
		}
		// alright now we order the jobs.
		const job_order = [...Object.keys(this.job_metas)];
		job_order.sort((a, b) => {
			const ameta = this.job_metas[a];
			const bmeta = this.job_metas[b];
			const department_diff =
				department_order.indexOf(ameta.departments[0] || "misc") -
				department_order.indexOf(bmeta.departments[0] || "misc");
			if (department_diff !== 0) {
				return department_diff;
			}
			if (ameta.departments.includes("command") && !bmeta.departments.includes("command")) {
				return -1;
			}
			if (!ameta.departments.includes("command") && bmeta.departments.includes("command")) {
				return 1;
			}
			return 0;
		});
		this.panel.$(".job-list").style.gridTemplateRows = `repeat(${Math.ceil(job_order.length / 2)}, auto)`;
		for (const key of job_order) {
			const meta = this.job_metas[key];
			const elem = document.createElement("div");
			elem.style.minWidth = "280";
			elem.style.backgroundColor = meta.selection_color;
			elem.dataset.jobKey = key;
			const setting = this.job_preferences[key];
			elem.innerHTML = `
<div style='text-align:right;width:180;display:inline-block;padding-right:3px'>${meta.name}</div>
<div style='display:inline-block' class='job-pref-button-container'></div>`;
			const job_pref_button_container = elem.querySelector(".job-pref-button-container");
			const job_pref_button = document.createElement("div");
			job_pref_button_container.appendChild(job_pref_button);
			job_pref_button.classList.add("button", "dropdown", "white", "job-selection-button");
			if (key === "nomad") {
				this.do_nomad_job(key, setting, job_pref_button);
			} else {
				this.do_other_job(key, setting, job_pref_button);
			}
			this.panel.$(".job-list").appendChild(elem);
		}
	}
	do_other_job(key: any, setting: any, job_pref_button: Record<string, any>) {
		job_pref_button.style.visibility = "hidden";
		job_pref_button.classList.add("affected-by-assistant");
		job_pref_button.style.color = job_pref_colors[setting];
		job_pref_button.textContent = job_pref_settings[setting];
		job_pref_button.addEventListener("click", (e: any) => {
			if (e.defaultPrevented) {
				return;
			}
			const menu = document.createElement("div");
			menu.classList.add("dropdown-content");
			for (let i = 0; i <= 3; i++) {
				const item = document.createElement("div");
				item.classList.add("button", "dropdown-item", "white");
				if (i === this.job_preferences[key]) {
					item.classList.add("selected");
				}
				item.textContent = job_pref_settings[i];
				item.style.color = job_pref_colors[i];
				item.addEventListener("click", (e6) => {
					this.panel.send_message({job_preferences: {[key]: i}});
					e6.preventDefault();
					job_pref_button.textContent = job_pref_settings[i];
					job_pref_button.style.color = job_pref_colors[i];
					this.job_preferences[key] = i;
					if (i === 3) {
						for (const [otherjob, level] of Object.entries(this.job_preferences)) {
							if (level === 3 && otherjob !== key) {
								this.job_preferences[otherjob] = 2;
								const otherelem = this.panel.$(
									`.job-list div[data-job-key="${otherjob}"] .job-selection-button`
								);
								if (otherelem) {
									otherelem.textContent = job_pref_settings[2];
									otherelem.style.color = job_pref_colors[2];
								}
							}
						}
					}
				});
				menu.appendChild(item);
			}
			dropdown(job_pref_button, menu);
		});
	}

	do_nomad_job(key: any, setting: any, job_pref_button: Record<string, any>) {
		if (setting) {
			job_pref_button.style.color = "green";
			job_pref_button.textContent = "Yes";
		} else {
			job_pref_button.style.color = "red";
			job_pref_button.textContent = "No";
		}
	}
	update_previews() {
		this.create_preview({canvas: this.panel.$(".preview-down"), dir: 1});
		this.create_preview({canvas: this.panel.$(".preview-right"), dir: 3});
		this.create_preview({canvas: this.panel.$(".preview-up"), dir: 2});
		this.create_preview({canvas: this.panel.$(".preview-left"), dir: 4});
	}

	create_preview({canvas = null, dir = 1, modifier = null, prefs_modifier = null} = {}) {
		const atom = new Atom(this.panel.manager.client, {dir});
		const prefs = JSON.parse(JSON.stringify(this.char_prefs));
		if (prefs_modifier) {
			prefs_modifier(prefs);
		}
		for (const part of [
			"torso",
			"groin",
			"l_arm",
			"r_arm",
			"l_leg",
			"r_leg",
			"r_hand",
			"l_hand",
			"r_foot",
			"l_foot",
			"head",
		]) {
			let icon_state = part;
			let partic = part;
			icon_state += prefs.gender === "female" ? "_f" : "_m";
			partic += prefs.gender === "female" ? "_f" : "_m";

			let color = null;
			if (this.skin_tones) {
				color = this.skin_tones[prefs.skin_tone];
			}
			atom.set_overlay(`limb_${part}`, {
				icon: `icons/mob/human_body/${partic}/${partic}-dir${dir}.png`,
				icon_state,
				color,
			});
		}
		const hair_style = this.sprite_accessories.hair[prefs.hair_style];
		if (hair_style) {
			atom.set_overlay("hair", {
				icon: `${hair_style.base_icon}/${hair_style.icon_state}-dir${dir}.png`,
				icon_state: hair_style.icon_state,
				color: this.char_prefs.hair_color,
				overlay_layer: 14,
			});
		}

		if (modifier) {
			modifier(atom);
		}
		if (!canvas) {
			canvas = document.createElement("canvas");
		}
		canvas.width = 32;
		canvas.height = 32;
		let ts = performance.now();
		atom.on_render_tick(ts);
		atom.fully_load().then(() => {
			ts = performance.now();
			atom.on_render_tick(ts);
			const ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			atom.draw(ctx, ts);
			atom.del();
		});
		return canvas;
	}
}
const department_order = ["misc", "command", "supply", "service", "eng", "med", "sci", "sec", "synth"];

module.exports.now = (client: {soft_shadow_resolution: number}) => {
	const shadow_pref = localStorage.getItem("shadow_resolution");
	if (typeof shadow_pref !== "undefined") {
		client.soft_shadow_resolution = +shadow_pref;
	}
};

module.exports.panel_classes = {PreferencesPanel};
