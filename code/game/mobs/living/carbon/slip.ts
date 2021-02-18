export{};
const {Component, has_component} = require("./../../../../../code/game/server.js");

class Slippery extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.on("crossed_by", (mob: Record<string, any>) => {
			this.slip(mob);
		});
	}

	slip(mob: Record<string, any>) {
		if (!has_component(mob, "CarbonMob")) {
			return;
		}
		if (!this.enabled) {
			return;
		}
		mob.c.CarbonMob.slip(this.a);
	}
}

Slippery.template = {
	vars: {
		components: {
			Slippery: {
				enabled: true,
				knockdown_amount: 6000,
			},
		},
	},
};

module.exports.components = {Slippery};
