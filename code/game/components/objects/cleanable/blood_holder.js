const { Component } = require("./../../../../../typespess/index.js");

class BloodHolder extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.blood_dna = [];
	}
}

module.exports.components = { BloodHolder };
