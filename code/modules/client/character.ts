export{};
const { Atom } = require("./../../../code/game/server.js");
const _ = require("underscore");
const first_names = require("../../../strings/names/first.json");
const first_names_male = require("../../../strings/names/first_male.json");
const first_names_female = require("../../../strings/names/first_female.json");
const last_names = require("../../../strings/names/last.json");
const sprite_accessories = require("../../game/mobs/living/carbon/human/sprite_accessories.js");
const {
	skin_tones,hair_colors,
} = require("../../game/mobs/living/carbon/body_parts/helpers.js");

class CharacterPreferences {
	gender: string;
	age: number;
	skin_tone: any;
	hair_style: any;
	hair_color: any;
	name: string;
	constructor(obj: Record<string,any>) {
		Object.assign(this, {
			name: "asdf",
			be_random_name: false,
			be_random_body: false,
			gender: "male",
			age: 30,
			underwear: "nude",
			undershirt: "nude",
			socks: "nude",
			backbag: "default",
			hair_style: "bald",
			hair_color: [0, 0, 0],
			facial_hair_style: "shaved",
			facial_hair_color: [0, 0, 0],
			skin_tone: "caucasian1",
			job_preferences: {},
			jobless_role: "random", // assistant, random, or none
		});
		this.randomize_body();
		this.randomize_name("human");
		Object.assign(this, obj);
	}

	randomize_body() {
		this.gender = Math.random() < 0.5 ? "male" : "female";
		this.age = Math.floor(Math.random() ** 2 * 69) + 17; // Square the random number so that it's biased toward smaller numbers
		this.skin_tone = _.sample(Object.keys(skin_tones));
		this.hair_style = _.sample(
			[...Object.entries(sprite_accessories.hair)].filter((item: Array<any>) => {
				return !item[0].gender || item[0].gender.includes(this.gender);
			})
		)[0];
		this.hair_color = _.sample(Object.keys(hair_colors));
	}
	randomize_name(type: string) {
		if (!type || type === "human")
			{this.name = CharacterPreferences.generate_human_name(this.gender);}
	}

	static generate_human_name(gender: string) {
		let first_list = first_names;
		if (gender === "male") {first_list = first_names_male;}
		if (gender === "female") {first_list = first_names_female;}
		const first_name = _.sample(first_list);
		const last_name = _.sample(last_names);
		return `${first_name} ${last_name}`;
	}

	static reject_bad_name(
		t_in: string | any[],
		{ allow_numbers = false, max_length = 42, trim = true } = {}
	) {
		if (typeof t_in !== "string") {return;}
		if (t_in.length > max_length) {return;}
		let number_of_alphanumberic = 0;
		let last_char_group = 0;
		let t_out = "";

		for (let i = 0; i < t_in.length; i++) {
			const chr = t_in[i];
			if (chr >= "A" && chr <= "Z") {
				t_out += chr;
				number_of_alphanumberic++;
				last_char_group = 4;
			} else if (chr >= "a" && chr <= "z") {
				if (last_char_group < 2) {
					t_out += chr.toUpperCase();
				} else {
					t_out += chr;
				}
				number_of_alphanumberic++;
				last_char_group = 4;
			} else if (chr >= "0" && chr <= "9") {
				if (!last_char_group) {continue;}
				if (!allow_numbers) {continue;}
				t_out += chr;
				number_of_alphanumberic++;
				last_char_group = 3;
			} else if ("'-.".includes(chr)) {
				if (!last_char_group) {continue;}
				t_out += chr;
				last_char_group = 2;
			} else if ("~|@:#$%&*+".includes(chr)) {
				if (!last_char_group) {continue;}
				if (!allow_numbers) {continue;}
				t_out += chr;
				last_char_group = 3;
			} else if (chr === " ") {
				if (last_char_group <= 1) {continue;}
				t_out += chr;
				last_char_group = 1;
			} else {
				return;
			}
		}
		if (trim) {t_out = t_out.trim();}
		if (number_of_alphanumberic < 2) {return;}
		if (
			[
				"space",
				"floor",
				"wall",
				"r-wall",
				"monkey",
				"unknown",
				"inactive ai",
			].includes(t_out.toLowerCase())
		)
			{return;}
		return t_out;
	}

	instance_human(server: any) {
		const template = {
			components: ["HumanMob"],
			vars: { gender: "neuter", components: { LivingMob: { real_name: ""} } },
		};
		template.vars.components.LivingMob.real_name = this.name;
		template.vars.gender = this.gender;
		const mob = new Atom(server, template);
		for (const limb of mob.c.MobBodyParts.limbs_set) {
			limb.c.BodyPart.apply_prefs(this);
		}
		return mob;
	}
}

module.exports = CharacterPreferences;
