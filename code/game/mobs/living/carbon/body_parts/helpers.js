

module.exports = {
	skin_tones: {
		Caucasian1: "#ffe0d1",
		Caucasian2: "#fcccb3",
		Caucasian3: "#e8b59b",
		Latino: "#d9ae96",
		Mediterranean: "#c79b8b",
		Asian1: "#ffdeb3",
		Asian2: "#e3ba84",
		Arab: "#c4915e",
		Indian: "#b87840",
		African1: "#754523",
		African2: "#471c18",
		Albino: "#fff4e6",
		Orange: "#ffc905",
	},
	hair_colors: {
		Black: "#090806",
		LightBrown: "#6a4e42",
		DarkBrown: "#3b3024",
		Red: "#b55239",
		Orange: "#91553d",
		LightBlond: "#e6cea8",
		Blond: "#e5c8a8",
		DirtyBlond: "#b89778",
		LightGrey: "#d3d3d3",
		Grey: "#808080"
	},
	// new eye colors
	eye_colors: {
		Black: "#000000",
		DarkBrown: "#2b1d0e",
		Brown: "#542a0e",
		Green: "#4b7248",
		Blue: "#5ea4e7",
	},
	random_zone(zone, prob = 0.8) {
		if (zone && Math.random() < prob) return zone;

		let t = Math.floor(Math.random() * 18);
		if (t == 0) return "head";
		else if (t == 1) return "torso";
		else if (t <= 5) return "l_arm";
		else if (t <= 9) return "r_arm";
		else if (t <= 13) return "l_leg";
		else if (t >= 14) return "r_leg";

		return zone;
	},
	parse_zone(zone) {
		if (zone == "r_hand") return "right hand";
		else if (zone == "l_hand") return "left hand";
		else if (zone == "l_arm") return "left arm";
		else if (zone == "r_arm") return "right arm";
		else if (zone == "l_leg") return "left leg";
		else if (zone == "r_leg") return "right leg";
		else if (zone == "l_foot") return "left foot";
		else if (zone == "r_foot") return "right foot";
		else return zone;
	},
};
