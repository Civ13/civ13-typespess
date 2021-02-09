const { Component } = require("./../../../../code/game/server.js");

class EnergyLens extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
	}
}

EnergyLens.loadBefore = ["AmmoCasing"];
EnergyLens.depends = ["AmmoCasing"];

EnergyLens.template = {
	vars: {
		components: {
			EnergyLens: {
				e_cost: 100,
				select_name: "energy",
			},
			AmmoCasing: {
				fire_sound: "sound/weapons/laser.ogg",
				caliber: "energy",
				projectile_type: "energy_projectile",
				infinite: true,
			},
		},
		name: "energy weapon lens",
	},
};


module.exports.components = { EnergyLens };
