export{};
const {Panel} = require("./../../../code/game/server.js");

const CharacterPreferences = require("./character.js");
const sprite_accessories = require("../../game/mobs/living/carbon/human/sprite_accessories.js");
const {skin_tones, hair_colors} = require("../../game/mobs/living/carbon/body_parts/helpers.js");

class PreferencesPanel extends Panel {
	constructor(client: Record<string, any>, {start_tab = "character"} = {}) {
		super(client, {
			width: 640,
			height: 550,
			title: "Preferences",
			can_close: true,
		});
		this.start_tab = start_tab;
		this.on("message", this.message_handler.bind(this));
		this.on("close", this.closed.bind(this));
		this.on("open", this.opened.bind(this));
		this.char_prefs = client.character_preferences || (client.character_preferences = new CharacterPreferences());
	}

	check_name(new_name: string, msg: Record<string,any>) {
		if (new_name) {
			this.send_message({name_valid: true});
			const corrected = CharacterPreferences.reject_bad_name(msg.char_prefs.name, {trim: false});
			if (corrected !== msg.char_prefs.name) {
				this.send_message({
					name_correction: [msg.char_prefs.name, corrected],
				});
			}
			this.char_prefs.name = new_name;
		} else {
			this.send_message({name_valid: false});
		}
	}

	message_handler(msg: Record<string, any>) {
		if (msg.char_prefs && this.char_prefs) {
			if (typeof msg.char_prefs.name !== "undefined") {
				const new_name = CharacterPreferences.reject_bad_name(msg.char_prefs.name);
				this.check_name(new_name, msg);
			}
			if (typeof msg.char_prefs.gender !== "undefined") {
				this.char_prefs.gender = msg.char_prefs.gender === "female" ? "female" : "male";
			}
			if (typeof msg.char_prefs.age !== "undefined") {
				let age = +msg.char_prefs.age || 0;
				age = Math.min(Math.max(17, age), 85);
				this.char_prefs.age = age;
			}
			if (typeof msg.char_prefs.hair_style !== "undefined") {
				const hair_obj = sprite_accessories.hair[msg.char_prefs.hair_style];
				if (
					hair_obj &&
					Object.prototype.hasOwnProperty.call(sprite_accessories.hair, msg.char_prefs.hair_style) &&
					(!hair_obj.gender || hair_obj.gender.includes(this.char_prefs.gender))
				) {
					this.char_prefs.hair_style = msg.char_prefs.hair_style;
				}
			}

			if (
				typeof msg.char_prefs.skin_tone !== "undefined" &&
				Object.prototype.hasOwnProperty.call(skin_tones, msg.char_prefs.skin_tone)
			) {
				this.char_prefs.skin_tone = msg.char_prefs.skin_tone;
			}

			if (
				typeof msg.char_prefs.hair_color !== "undefined" &&
				Object.prototype.hasOwnProperty.call(hair_colors, msg.char_prefs.hair_color)
			) {
				this.char_prefs.hair_color = msg.char_prefs.hair_color;
			}
		}
		if (msg.randomize_name && this.char_prefs) {
			this.char_prefs.randomize_name(msg.randomize_name);
			this.send_prefs(["name"]);
		}
		if (msg.job_preferences) {
			this.check_job_preferences(msg);
		}
	}
	check_job_preferences(msg: Record<string, any>) {
		for (const [key, setting] of Object.entries(msg.job_preferences)) {
			let tsetting = setting;
			tsetting = Math.max(Math.min(Math.round(+tsetting || 0), 3), 0); // sanitize the value
			if (key === "nomad") {
				tsetting = +!!tsetting;
			} // turn it into 0/1 deal
			if (!this.client.server.job_controller.jobs[key]) {continue;} // oi that job doesnt exist ree
			if (tsetting === 0) {
				delete this.char_prefs.job_preferences[key];
			} else {
				this.char_prefs.job_preferences[key] = tsetting;
			}
			if (tsetting === 3) {
				for (const [otherjob, othersetting] of Object.entries(this.char_prefs.job_preferences)) {
					if (otherjob !== key && othersetting === 3) {
						this.char_prefs.job_preferences[otherjob] = 2;
					}
				}
			}
		}
	}

	send_prefs(parts: any = null) {
		const char_prefs_msg: Record<string, any> = {};
		for (const key of [
			"name",
			"be_random_name",
			"be_random_body",
			"gender",
			"age",
			"skin_tone",
			"backbag",
			"hair_style",
			"hair_color",
		]) {
			if (parts && !parts.includes(key)) {continue;}
			char_prefs_msg[key] = this.char_prefs[key];
		}
		this.send_message({char_prefs: char_prefs_msg});
	}

	send_job_prefs() {
		const prefs: Record<string, any> = {};
		const meta: Record<string, any> = {};
		for (const [key, tjob] of Object.entries(this.client.server.job_controller.jobs)) {
			const job: Record<string, any> = tjob;
			prefs[key] = this.char_prefs.job_preferences[key] || 0;
			meta[key] = {
				selection_color: job.selection_color,
				departments: job.departments,
				name: job.title,
			};
		}
		this.send_message({job_preferences: prefs, job_metas: meta});
	}

	closed() {
		this.client.preferences_panel = null;
	}
	opened() {
		this.client.preferences_panel = this;

		this.send_message({
			set_tab: this.start_tab,
			sprite_accessories,
			skin_tones,
			hair_colors,
		});
		this.send_prefs();
		this.send_job_prefs();
	}

	static open_for(client: Record<string, any>, options = {}) {
		if (client.preferences_panel) {
			return client.preferences_panel;
		}
		const panel = new PreferencesPanel(client, options);
		panel.open();
		return panel;
	}
}

module.exports = PreferencesPanel;
