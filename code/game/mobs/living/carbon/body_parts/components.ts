const {
	Component,
	chain_func,
	make_watched_property,
} = require("./../../../../../../code/game/server.js");

const { skin_tones } = require("./helpers.js");
const sprite_accessories = require("../human/sprite_accessories.js");

class BodyPartSkinTone extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.c.BodyPart.get_color = this.get_color.bind(this);
		this.a.c.BodyPart.get_main_overlay = chain_func(
			this.a.c.BodyPart.get_main_overlay,
			this.get_main_overlay.bind(this)
		);
		this.a.c.BodyPart.apply_prefs = chain_func(
			this.a.c.BodyPart.apply_prefs,
			this.apply_prefs.bind(this)
		);
		make_watched_property(this, "skin_tone");
		this.on("skin_tone_changed", () => {
			this.a.c.BodyPart.update_overlays();
		});
	}

	apply_prefs(prev, prefs) {
		prev();
		this.skin_tone = prefs.skin_tone;
	}

	get_color() {
		return skin_tones[this.skin_tone];
	}

	get_main_overlay(prev) {
		const overlay = prev();
		return overlay;
	}
}

BodyPartSkinTone.depends = ["BodyPart"];
BodyPartSkinTone.loadBefore = ["BodyPart"];

BodyPartSkinTone.template = {
	vars: {
		components: {
			BodyPartSkinTone: {
				skin_tone: "caucasian2",
			},
		},
	},
};

class BodyPartHumanHair extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.c.BodyPart.apply_prefs = chain_func(
			this.a.c.BodyPart.apply_prefs,
			this.apply_prefs.bind(this)
		);
		this.a.c.BodyPart.apply_overlays = chain_func(
			this.a.c.BodyPart.apply_overlays,
			this.apply_overlays.bind(this)
		);
		this.a.c.BodyPart.remove_overlays = chain_func(
			this.a.c.BodyPart.remove_overlays,
			this.remove_overlays.bind(this)
		);

		make_watched_property(this, "hair_style");
		make_watched_property(this, "hair_color");
		this.on("hair_style_changed", () => {
			this.a.c.BodyPart.update_overlays();
		});
		this.on("hair_color_changed", () => {
			this.a.c.BodyPart.update_overlays();
		});
	}

	apply_overlays(prev, atom) {
		prev();
		const hair_obj = sprite_accessories.hair[this.hair_style];
		if (hair_obj) {
			atom.overlays[`limb_${this.a.c.BodyPart.body_zone}_hair`] = this.get_main_overlay(atom);
		} else {
			atom.overlays[`limb_${this.a.c.BodyPart.body_zone}_hair`] = null;
		}
	}

	get_main_overlay(atm = null) {
		let icodir = 1;
		if (atm) {icodir = atm.dir;}
		const hair_obj = sprite_accessories.hair[this.hair_style];
		if (icodir ===1)
			{icodir = 2;}
		else if (icodir ===2)
			{icodir = 1;}
		else if (icodir ===4)
			{icodir = 3;}
		else if (icodir ===8)
			{icodir = 4;}
		const overlay = {
			icon: `icons/mob/human_face/${hair_obj.icon_state}/${hair_obj.icon_state}-dir${icodir}.png`,
			icon_state: hair_obj.icon_state,
			color: this.hair_color,
			overlay_layer: 14,
		};
		return overlay;
	}
	remove_overlays(prev, atom) {
		prev();
		atom.overlays[`limb_${this.a.c.BodyPart.body_zone}_brute`] = null;
	}

	apply_prefs(prev, prefs) {
		prev();
		this.hair_style = prefs.hair_style;
		this.hair_color = prefs.hair_color;
	}
}

BodyPartHumanHair.loadBefore = ["BodyPart"];
BodyPartHumanHair.depends = ["BodyPart"];

BodyPartHumanHair.template = {
	vars: {
		components: {
			BodyPartHumanHair: {
				hair_style: "bald",
				hair_color: [0, 0, 0],
			},
		},
	},
};

module.exports.components = { BodyPartSkinTone, BodyPartHumanHair };
