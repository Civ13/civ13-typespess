

module.exports = {
	display_watts(watts: number) {
		if (watts >= 1000000) {return `${+(watts / 1000000).toFixed(3)} MW`;}
		if (watts >= 1000) {return `${+(watts / 1000).toFixed(3)} kW`;}
		return `${+watts.toFixed(3)} W`;
	},

	display_kilojoules(kilojoules: number) {

		if (kilojoules >= 1000000) {return `${+(kilojoules / 1000000).toFixed(3)} GJ`;}
		if (kilojoules >= 1000) {return `${+(kilojoules / 1000).toFixed(3)} MJ`;}
		if (kilojoules >= 1) {return `${+kilojoules.toFixed(3)} kJ`;}
		return `${+(kilojoules * 1000).toFixed(3)} J`;
	},
};
