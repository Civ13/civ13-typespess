const { Component } = require("./../../../../../code/game/server.js");

class BloodHolder extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.blood_dna = [];
	}
}

module.exports.components = { BloodHolder };
