
const JobType = require("./job.js");

module.exports.jobs = {};

module.exports.jobs.nomad = new JobType({
	title: "Nomad",
	description: "Survive and create a society.",
	departments: ["misc"],
	total_positions: -1,
	spawn_positions: -1,
	selection_color: "#dddddd",
});

let nomad_outfit = new JobType.Outfit({
	name: "Nomad",
	jobtype: module.exports.jobs.nomad,
	slots: {
		iclothing: "loincloth",
	},
});
module.exports.jobs.nomad.outfit = nomad_outfit;
