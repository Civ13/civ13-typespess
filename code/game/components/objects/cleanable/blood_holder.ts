const { Component } = require("./../../../../../code/game/server.js");

class BloodHolder extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.blood_dna = [];
	}
}

module.exports.components = { BloodHolder };
