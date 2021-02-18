export{};
const {Component, Sound, Atom} = require("./../../../code/game/server.js");
const pass_flags = require("../../defines/pass_flags.js");
const sounds = require("../../defines/sounds.js");
const layers = require("../../defines/layers.js");
const EffectSystem = require("./effect_system.js");

class SparkEffect extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.on("moved", this.moved.bind(this));
		this.a.once("moved", () => {
			new Sound(this.a.server, {path: sounds.sparks, vary: true}).emit_from(this.a);
		});
		setTimeout(() => {
			this.a.destroy();
		}, 2000);
	}

	moved() {return;}
}

SparkEffect.depends = ["LightSource"];
SparkEffect.loadBefore = ["LightSource"];

SparkEffect.template = {
	vars: {
		components: {
			LightSource: {
				enabled: true,
				range: 1,
				color: "#444444",
			},
		},
		icon: "icons/effects/effects/",
		icon_state: "spark",
		let_pass_flags: pass_flags.PASSTABLE,
		name: "sparks",
		layer: layers.OBJ_LAYER,
	},
};

class SparkSystem extends EffectSystem {
	create_effect_atom(location: any) {
		return new Atom(this.server, {components: ["SparkEffect"]}, location);
	}
}

module.exports = SparkSystem;

module.exports.components = {SparkEffect};
