
const JobType = require("./job.js");

module.exports.jobs = {};

module.exports.jobs.engineer = new JobType({
	title: "Station Engineer",
	total_positions: 5,
	spawn_positions: 5,
	supervisors: "the chief engineer",
	selection_color: "#fff5cc",
	department_head: ["chief_engineer"],
	departments: ["eng"],
	access: [
		"engineering",
		"power_equipment",
		"maint",
		"external_airlocks",
		"tech_storage",
		"atmospherics",
		"construction",
		"minisat",
		"network",
	],
	minimal_access: [
		"engineering",
		"power_equipment",
		"maint",
		"external_airlocks",
		"tech_storage",
		"construction",
		"minisat",
		"network",
	],
	exp_requirements: 60,
	exp_type: "crew",
});

let engineer_outfit = new JobType.Outfit({
	name: "Station Engineer",
	jobtype: module.exports.jobs.engineer,
	slots: {
		iclothing: "jumpsuit_engineer",
		shoes: "boots_work",
		belt: "utility_belt_engi",
	},
	backpack: "backpack_industrial",
});
module.exports.jobs.engineer.outfit = engineer_outfit;
