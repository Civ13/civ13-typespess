
const Outfit = require("../../outfit.ts");
const {
	weak_deep_assign,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	has_component,
	to_chat,
} = require("./../../../../code/game/server.ts");
const CharacterPreferences = require("../../client/character.ts");

class JobType {
	constructor(obj) {
		Object.assign(
			this,
			{
				title: "NOPE",

				description: "none",
				total_positions: 0,
				spawn_positions: 0,
				current_positions: 0,
				departments: ["misc"],
				selection_color: "#ffffff",

				name_override: "",
				req_admin_notify: false,
				minimal_player_age: 0,
				outfit: null,
				exp_requirements: 0,
				exp_type: "",
				exp_type_department: "",
			},
			obj
		);
	}

	instance(server, prefs) {
		if (!prefs) {prefs = new CharacterPreferences();}
		const mob = prefs.instance_human(server, {
			name_override: this.name_override,
		});
		this.equip(mob);
		return mob;
	}

	after_spawn(user) {
		to_chat`<b>You job title is ${""}${this.title}.</b>`(user);
		to_chat`Your role is ${this.description}`(user);
		if (this.req_admin_notify)
			{to_chat`<b>You are playing a job that is important for Game Progression. If you have to disconnect, please notify the admins via adminhelp.</b>`(user);}
	}

	equip(mob) {
		if (this.outfit) {this.outfit.equip(mob);}
	}
}

class JobOutfit extends Outfit {
	constructor(obj) {
		super(obj);
		weak_deep_assign(this, {
			name: "Standard Gear",
			jobtype: null,
			slots: {
				iclothing: "jumpsuit_grey",
				//shoes: "shoes_black",
				//id: "id",
			},

			//backpack: "backpack",
			//satchel: "backpack",
			//duffelbag: "backpack",
			//box: "survival_box",

			//pda_slot: "belt",
		});
		Object.defineProperty(this, "jobtype", {
			enumerable: false,
			value: this.jobtype,
		});
	}

	pre_equip() {
		this.slots.back = this.backpack;
		if (this.box) {
			if (!this.backpack_contents) {this.backpack_contents = [];}
			this.backpack_contents.splice(0, 0, this.box); // at 0th position, deleting 0 items, insert this.box
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	post_equip(target, visuals_only = false) {return;}
}

JobType.Outfit = JobOutfit;

module.exports = JobType;
