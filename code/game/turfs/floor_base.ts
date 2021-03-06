export{};
const {Component, Atom, has_component, chain_func} = require("./../../../code/game/server.js");

const _ = require("underscore");

// Component shared by floors and plating
class FloorBase extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.c.Tangible.ex_act = chain_func(this.a.c.Tangible.ex_act, this.ex_act.bind(this));
	}

	ex_act(prev: any, severity: number) {
		prev();
		const shielded = this.is_shielded();
		if (severity !== 1 && shielded) {return;}
		if (severity === 1) {
			this.a.destroy();
		} else if (severity === 2) {
			if (Math.random() < 0.65) {
				this.a.destroy();
			} else {
				this.break_tile();
			}
			if (Math.random() < 0.33) {
				// eslint-disable-next-line no-new
				new Atom(this.a.server, "metal_sheet", this.a.loc);
			}
		} else {
			if (Math.random() < 0.5) {
				this.break_tile();
			}
		}
	}

	break_tile() {
		if (this.broken || !this.can_break) {return;}
		if (this.broken_states.length) {
			this.a.overlays.broken = {icon_state: _.sample(this.broken_states)};
		}
		this.broken = true;
	}

	is_shielded() {
		for (const obj of this.a.crosses()) {
			if (obj.layer <= this.a.layer) {continue;}
			const shielded_components = ["FloorBase", "Wall", "Window"];
			for (const comp of shielded_components) {
				if (has_component(obj, comp)) {return true;}
			}
		}
	}
}

FloorBase.depends = ["Tangible"];
FloorBase.loadBefore = ["Tangible"];

FloorBase.template = {
	vars: {
		components: {
			FloorBase: {
				can_break: false,
				can_burn: false,
				broken: false,
				burnt: false,
			},
			Tangible: {
				anchored: true,
			},
		},
	},
};

module.exports.components = {FloorBase};
