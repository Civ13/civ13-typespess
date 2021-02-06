

const {
	Component,
	has_component,
} = require("./../../../../../code/game/server.ts");
const layers = require("../../../../defines/layers.ts");

class CleanableDecal extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.a.on("crossed", this.crossed.bind(this));
	}
	crossed(other) {
		if (
			this.merge_group &&
	has_component(other, "CleanableDecal") &&
	other.c.CleanableDecal.merge_group === this.merge_group
		) {
			if (other.c.CleanableDecal.merge_priority >= this.merge_priority) {
				other.c.CleanableDecal.emit("merged", this.a);
				this.a.destroy();
			} else {
				this.emit("merged", other);
				other.destroy();
			}
		}
	}
}

CleanableDecal.depends = ["Tangible"];
CleanableDecal.loadBefore = ["Tangible"];

CleanableDecal.template = {
	vars: {
		components: {
			CleanableDecal: {
				merge_group: null,
				merge_priority: 0,
				footprint_amount: 0,
				footprint_type: null,
				on_floor_cover_layer: layers.ABOVE_NORMAL_FLOOR_LAYER,
			},
			Tangible: {
				anchored: true,
			},
			Examine: {
				desc: "It's red and gooey. Perhaps it's the chef's cooking?",
			},
		},
		icon: "icons/effects/blood/",
		icon_state: "floor3-old",
		layer: layers.ABOVE_NORMAL_TURF_LAYER,
	},
};

module.exports.components = { CleanableDecal };
