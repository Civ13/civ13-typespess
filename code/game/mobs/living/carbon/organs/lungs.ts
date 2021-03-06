export{};
const {Component} = require("./../../../../../../code/game/server.js");

class OrganLungs extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
	}
}

OrganLungs.depends = ["Organ"];
OrganLungs.loadBefore = ["Organ"];

OrganLungs.template = {
	vars: {
		components: {
			OrganLungs: {
				// BE CAREFUL: The individual values within these objects will be inherited!
				gas_reqs: {
					o2: {
						min: 16,
						max: null,
						min_dam: 1,
						max_dam: 10,
						dam_type: "oxy",
						breath_convert: "co2",
					},
					n2: {
						min: null,
						max: null,
						min_dam: 1,
						max_dam: 10,
						dam_type: "oxy",
					},
					co2: {min: null, max: 10, min_dam: 1, max_dam: 10, dam_type: "oxy"},
					plasma: {
						min: null,
						max: 0.05,
						min_dam: 1,
						max_dam: 10,
						dam_type: "tox",
					},
				},
			},
			Organ: {
				zone: "torso",
				slot: "lungs",
			},
			Item: {
				size: 3,
			},
		},
		gender: "plural",
		name: "lungs",
		icon_state: "lungs",
	},
};

module.exports.components = {OrganLungs};
