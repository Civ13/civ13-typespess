
export{};
const { Reagent } = require("../reagent.js");
const { atmos_defines } = require("../../../defines/atmos_defines.js");
const { combat_defines } = require("../../../defines/combat_defines.js");
const { to_chat } = require("./../../../../code/game/server.js");
module.exports.reagents = {};

class Medicine extends Reagent {} // /datum/reagent/medicine
Object.assign(Medicine.prototype, {
	name: "Medicine",
	taste_description: "bitterness",
});

class Leporazine extends Medicine {
	// /datum/reagent/medicine/leporazine
	mob_life(dt: number) {
		if (this.holder.c.CarbonMob.bodytemperature > 310) {
			this.holder.c.CarbonMob.bodytemperature = Math.max(
				310,
				this.holder.c.CarbonMob.bodytemperature -
		20 * dt * atmos_defines.TEMPERATURE_DAMAGE_COEFFICIENT
			);
		} else if (this.holder.c.CarbonMob.bodytemperature < 311) {
			this.holder.c.CarbonMob.bodytemperature = Math.min(
				310,
				this.holder.c.CarbonMob.bodytemperature +
		20 * dt * atmos_defines.TEMPERATURE_DAMAGE_COEFFICIENT
			);
		}
		super.mob_life(dt);
	}
}
module.exports.reagents.Leporazine = Leporazine;
Object.assign(Leporazine.prototype, {
	name: "Leporazine",
	description:
	"Leporazine will effectively regulate a patient's body temperature, ensuring it never leaves safe levels.",
	color: [0.78, 0.65, 0.86],
});

class Inacusiate extends Medicine {} // /datum/reagent/medicine/inacusiate //TODO: mob_life()
module.exports.reagents.Inacusiate = Inacusiate;
Object.assign(Inacusiate.prototype, {
	name: "Inacusiate",
	description:
	"Instantly restores all hearing to the patient, but does not cure deafness.",
	color: [0.4, 0, 1],
});

class Rezadone extends Medicine {
	// /datum/reagent/medicine/rezadone //TODO: mob_life()
	overdose_process(dt: number) {
		this.holder.c.LivingMob.adjust_damage("tox", 1 * dt);
		this.holder.c.CarbonMob.dizziness = Math.max(
			0,
			this.holder.c.CarbonMob.dizziness,
			2.5 * dt
		);
		this.holder.c.CarbonMob.jitteriness = Math.max(
			0,
			this.holder.c.CarbonMob.jitteriness,
			2.5 * dt
		);
		super.overdose_process(dt);
	}
}
module.exports.reagents.Rezadone = Rezadone;
Object.assign(Rezadone.prototype, {
	name: "Rezadone",
	description:
	"A powder derived from fish toxin, Rezadone can effectively treat genetic damage as well as restoring minor wounds. Overdose will cause intense nausea and minor toxin damage.",
	reagent_state: "solid",
	color: [0.4, 0.6, 0],
	overdose_threshold: 30,
	taste_description: "fish",
});

class SilverSulfadiazine extends Medicine {
	// /datum/reagent/medicine/silver_sulfadiazine //TODO: reaction_mob()
	mob_life(dt: number) {
		this.holder.c.LivingMob.adjust_damage("burn", -1 * dt);
		super.mob_life(dt);
	}
}
module.exports.reagents.SilverSulfadiazine = SilverSulfadiazine;
Object.assign(SilverSulfadiazine.prototype, {
	name: "Silver Sulfadiazine",
	description:
	"If used in touch-based applications, immediately restores burn wounds as well as restoring more over time. If ingested through other means, deals minor toxin damage.",
	reagent_state: "liquid",
	color: [0.78, 0.65, 0.86],
});

class Oxandrolone extends Medicine {
	// /datum/reagent/medicine/oxandrolone
	mob_life(dt: number) {
		if (this.holder.c.LivingMob.get_damage("burn") > 50) {
			this.holder.c.LivingMob.adjust_damage("burn", -2 * dt); //Twice as effective as silver sulfadiazine for severe burns
		} else {
			this.holder.c.LivingMob.adjust_damage("burn", -0.25 * dt); //But only a quarter as effective for minor ones
		}
		super.mob_life(dt);
	}
	overdose_process(dt: number) {
		if (this.holder.c.LivingMob.get_damage("burn") > 0) {
			//Makes existing burns worse
			this.holder.c.LivingMob.adjust_damage("burn", 2.25 * dt);
		}
		super.overdose_process(dt);
	}
}
module.exports.reagents.Oxandrolone = Oxandrolone;
Object.assign(Oxandrolone.prototype, {
	name: "Oxandrolone",
	description:
	"Stimulates the healing of severe burns. Extremely rapidly heals severe burns and slowly heals minor ones. Overdose will worsen existing burns.",
	reagent_state: "liquid",
	color: [0.97, 1, 0.65],
	metabolization_rate: 0.25,
	overdose_threshold: 25,
});

class SalineGlucoseSolution extends Medicine {
	// /datum/reagent/medicine/salglu_solution //TODO: mob_life()
	overdose_process(dt: number) {
		if (Math.random() < 0.03) {
			to_chat`<span class='warning'>You feel salty.</span>`(this.holder);
			this.holder.add("TableSalt", 1);
			this.holder.c.ReagentHolder.remove(this.constructor.name, 0.5);
		} else if (Math.random() < 0.06) {
			to_chat`<span class='warning'>You feel sweet.</span>`(this.holder);
			this.holder.add("Sugar", 1);
			this.holder.c.ReagentHolder.remove(this.constructor.name, 0.5);
		}
		if (Math.random() < 0.33) {
			this.holder.c.LivingMob.adjust_damage("brute", 0.25 * dt);
			this.holder.c.LivingMob.adjust_damage("burn", 0.25 * dt);
		}
		super.overdose_process(dt);
	}
}
module.exports.reagents.SalineGlucoseSolution = SalineGlucoseSolution;
Object.assign(SalineGlucoseSolution.prototype, {
	name: "Saline-Glucose Solution",
	description:
	"Has a 33% chance per metabolism cycle to heal brute and burn damage. Can be used as a temporary blood substitute.",
	reagent_state: "liquid",
	color: [0.86, 0.86, 0.86],
	metabolization_rate: 0.25,
	overdose_threshold: 60,
	taste_description: "sweetness and salt",
	last_added: 0,
	maximum_reachable: 490,
});

class Charcoal extends Medicine {
	// /datum/reagent/medicine/charcoal
	mob_life(dt: number) {
		this.holder.c.LivingMob.adjust_damage("tox", -1 * dt);
		for (const key of this.holder.c.ReagentHolder.reagents.keys()) {
			if (key !== this.constructor.name) {
				this.holder.c.ReagentHolder.remove(key, 0.5 * dt);
			}
		}
		super.mob_life(dt);
	}
}
module.exports.reagents.Charcoal = Charcoal;
Object.assign(Charcoal.prototype, {
	name: "Charcoal",
	description:
	"Heals toxin damage as well as slowly removing any other chemicals the patient has in their bloodstream.",
	reagent_state: "liquid",
	color: [0, 0, 0],
	metabolization_rate: 0.25,
	taste_description: "ash",
});

class Omnizine extends Medicine {
	// /datum/reagent/medicine/omnizine
	mob_life(dt: number) {
		this.holder.c.LivingMob.adjust_damage("brute", -0.25 * dt);
		this.holder.c.LivingMob.adjust_damage("burn", -0.25 * dt);
		this.holder.c.LivingMob.adjust_damage("oxy", -0.25 * dt);
		this.holder.c.LivingMob.adjust_damage("tox", -0.25 * dt);
		super.mob_life(dt);
	}
	overdose_process(dt: number) {
		this.holder.c.LivingMob.adjust_damage("brute", 0.75 * dt);
		this.holder.c.LivingMob.adjust_damage("burn", 0.75 * dt);
		this.holder.c.LivingMob.adjust_damage("oxy", 0.75 * dt);
		this.holder.c.LivingMob.adjust_damage("tox", 0.75 * dt);
		super.overdose_process(dt);
	}
}
module.exports.reagents.Omnizine = Omnizine;
Object.assign(Omnizine.prototype, {
	name: "Omnizine",
	description:
	"Slowly heals all damage types. Overdose will cause damage in all types instead.",
	reagent_state: "liquid",
	color: [0.86, 0.86, 0.86],
	metabolization_rate: 0.125,
	overdose_threshold: 30,
});

class Calomel extends Medicine {
	// /datum/reagent/medicine/calomel
	mob_life(dt: number) {
		for (const key of this.holder.c.ReagentHolder.reagents.keys()) {
			if (key !== this.constructor.name) {
				this.holder.c.ReagentHolder.remove(key, 1.25 * dt);
			}
		}
		if (this.a.c.LivingMob.health > 20) {
			this.holder.c.LivingMob.adjust_damage("tox", 1.25 * dt);
		}
		super.mob_life(dt);
	}
}
module.exports.reagents.Calomel = Calomel;
Object.assign(Calomel.prototype, {
	name: "Calomel",
	description:
	"Quickly purges the body of all chemicals. Toxin damage is dealt if the patient is in good condition.",
	reagent_state: "liquid",
	color: [0.1, 0.78, 0.2],
	metabolization_rate: 0.25,
	taste_description: "acid",
});

class PotassiumIodide extends Medicine {
	// /datum/reagent/medicine/potass_iodide
	mob_life(dt: number) {
		if (this.holder.c.CarbonMob.radiation > 0) {
			this.holder.c.CarbonMob.radiation -= Math.min(
				this.holder.c.CarbonMob.radiation,
				4 * dt
			);
		}
		super.mob_life(dt);
	}
}
module.exports.reagents.PotassiumIodide = PotassiumIodide;
Object.assign(PotassiumIodide.prototype, {
	name: "Potassium Iodide",
	description: "Efficiently restores low radiation damage.",
	reagent_state: "liquid",
	color: [0.08, 1, 0.24],
	metabolization_rate: 1,
});

class PenteticAcid extends Medicine {
	// /datum/reagent/medicine/pen_acid
	mob_life(dt: number) {
		this.holder.c.CarbonMob.radiation -=
	Math.min(this.holder.c.CarbonMob.radiation - 250 * dt, 0) / 50;
		this.holder.c.LivingMob.adjust_damage("tox", -1 * dt);
		for (const key of this.holder.c.ReagentHolder.reagents.keys()) {
			if (key !== this.constructor.name) {
				this.holder.c.ReagentHolder.remove(key, 1 * dt);
			}
		}
		super.mob_life(dt);
	}
}
module.exports.reagents.PenteticAcid = PenteticAcid;
Object.assign(PenteticAcid.prototype, {
	name: "Pentetic Acid",
	description:
	"Reduces massive amounts of radiation and toxin damage while purging other chemicals from the body.",
	reagent_state: "liquid",
	color: [0.9, 1, 0.94],
	metabolization_rate: 0.25,
});

class SalicyclicAcid extends Medicine {
	// /datum/reagent/medicine/sal_acid
	mob_life(dt: number) {
		if (this.holder.c.LivingMob.get_damage("brute") > 50) {
			this.holder.c.LivingMob.adjust_damage("brute", -2 * dt); //Twice as effective as styptic powder for severe bruising
		} else {
			this.holder.c.LivingMob.adjust_damage("brute", -0.25 * dt); //But only a quarter as effective for more minor ones
		}
		super.mob_life(dt);
	}
	overdose_process(dt: number) {
		if (this.holder.c.LivingMob.get_damage("brute") > 0) {
			//Makes existing bruises worse
			this.holder.c.LivingMob.adjust_damage("brute", 2.25 * dt);
		}
		super.overdose_process(dt);
	}
}
module.exports.reagents.SalicyclicAcid = SalicyclicAcid;
Object.assign(SalicyclicAcid.prototype, {
	name: "Salicyclic Acid",
	description:
	"Stimulates the healing of severe bruises. Extremely rapidly heals severe bruising and slowly heals minor ones. Overdose will worsen existing bruising.",
	reagent_state: "liquid",
	color: [0.82, 0.82, 0.82],
	metabolization_rate: 0.25,
	overdose_threshold: 25,
});

class Salbutamol extends Medicine {
	// /datum/reagent/medicine/salbutamol
	mob_life(dt: number) {
		this.holder.c.LivingMob.adjust_damage("oxy", -1.5 * dt);
		if (this.holder.c.CarbonMob.losebreath >= 2 * dt) {
			this.holder.c.CarbonMob.losebreath -= 1 * dt;
		}
		super.mob_life(dt);
	}
}
module.exports.reagents.Salbutamol = Salbutamol;
Object.assign(Salbutamol.prototype, {
	name: "Salbutamol",
	description:
	"Rapidly restores oxygen deprivation as well as preventing more of it to an extent.",
	reagent_state: "liquid",
	color: [0, 1, 1],
	metabolization_rate: 0.125,
});

class Ephedrine extends Medicine {
	// /datum/reagent/medicine/ephedrine
	mob_life(dt: number) {
		this.holder.c.LivingMob.status_flags |= combat_defines.GOTTAGOFAST;
		this.holder.c.LivingMob.adjust_effect("Stun", -1000 * dt);
		this.holder.c.LivingMob.adjust_effect("Knockdown", -1000 * dt);
		this.holder.c.LivingMob.adjust_effect("Unconscious", -1000 * dt);
		this.holder.c.LivingMob.adjust_damage("clone", -0.5 * dt);
		super.mob_life(dt);
	}

	overdose_process(dt: number) {
		if (Math.random() < 0.33) {
			this.holder.c.LivingMob.adjust_damage("tox", 0.25 * dt);
			this.holder.c.CarbonMob.losebreath += 0.5 * dt;
		}
		super.overdose_process(dt);
	}
	addiction_act_stage1(dt: number) {
		if (Math.random() < 0.33) {
			this.holder.c.LivingMob.adjust_damage("tox", 1 * dt);
			this.holder.c.CarbonMob.losebreath += 1 * dt;
		}
		super.addiction_act_stage1(dt);
	}
	addiction_act_stage2(dt: number) {
		if (Math.random() < 0.33) {
			this.holder.c.LivingMob.adjust_damage("tox", 1.5 * dt);
			this.holder.c.CarbonMob.losebreath += 1.5 * dt;
		}
		super.addiction_act_stage2(dt);
	}
	addiction_act_stage3(dt: number) {
		if (Math.random() < 0.33) {
			this.holder.c.LivingMob.adjust_damage("tox", 2 * dt);
			this.holder.c.CarbonMob.losebreath += 2 * dt;
		}
		super.addiction_act_stage3(dt);
	}
	addiction_act_stage4(dt: number) {
		if (Math.random() < 0.33) {
			this.holder.c.LivingMob.adjust_damage("tox", 2.5 * dt);
			this.holder.c.CarbonMob.losebreath += 2.5 * dt;
		}
		super.addiction_act_stage4(dt);
	}
}
module.exports.reagents.Ephedrine = Ephedrine;
Object.assign(Ephedrine.prototype, {
	name: "Ephedrine",
	description:
	"Increases stun resistance and movement speed. Overdose deals toxin damage and inhibits breathing.",
	reagent_state: "liquid",
	color: [0.82, 1, 0.98],
	metabolization_rate: 0.25,
	overdose_threshold: 45,
	addiction_threshold: 30,
});

class Diphenhydramine extends Medicine {
	// /datum/reagent/medicine/diphenhydramine
	mob_life(dt: number) {
		if (Math.random() < 0.1) {
			this.holder.c.CarbonMob.drowsiness += 0.5 * dt;
		}
		this.holder.c.CarbonMob.jitteriness -= 0.5 * dt;
		this.holder.c.ReagentHolder.remove("Histamine", 1.5 * dt);
		super.mob_life(dt);
	}
}
module.exports.reagents.Diphenhydramine = Diphenhydramine;
Object.assign(Diphenhydramine.prototype, {
	name: "Diphenhydramine",
	description:
	"Rapidly purges the body of Histamine and reduces jitteriness. Slight chance of causing drowsiness.",
	reagent_state: "liquid",
	color: [0.39, 1, 0.9],
	metabolization_rate: 0.25,
});

class Morphine extends Medicine {
	// /datum/reagent/medicine/morphine //TODO: overdose_process(), and addiction_act_stage()s
	mob_life(dt: number) {
		this.holder.c.LivingMob.status_flags |= combat_defines.IGNORESLOWDOWN;
		if (this.time_in_mob === 22) {
			to_chat`<span class='warning'>You start to feel tired...</span>`(
				this.holder
			);
		} else if (this.time_in_mob >= 24 && this.time_in_mob <= 24) {
			this.holder.c.CarbonMob.drowsiness += 0.5 * dt;
		} else if (this.time_in_mob > 24) {
			//TODO: M.Sleeping(40, 0)
		}
		super.mob_life(dt);
	}
}
module.exports.reagents.Morphine = Morphine;
Object.assign(Morphine.prototype, {
	name: "Morphine",
	description:
	"A painkiller that allows the patient to move at full speed even in bulky objects. Causes drowsiness and eventually unconsciousness in high doses. Overdose will cause a variety of effects, ranging from minor to lethal.",
	reagent_state: "liquid",
	color: [0.66, 0.98, 0.98],
	metabolization_rate: 0.25,
	overdose_threshold: 30,
	addiction_threshold: 25,
});

class Atropine extends Medicine {
	// /datum/reagent/medicine/atropine
	mob_life(dt: number) {
		if (this.holder.c.LivingMob.health < 0) {
			this.holder.c.LivingMob.adjust_damage("tox", -1 * dt);
			this.holder.c.LivingMob.adjust_damage("brute", -1 * dt);
			this.holder.c.LivingMob.adjust_damage("burn", -1 * dt);
			this.holder.c.LivingMob.adjust_damage("oxy", -2.5 * dt);
		}
		this.holder.c.CarbonMob.losebreath = 0;
		if (Math.random() < 0.2) {
			this.holder.c.CarbonMob.dizziness = Math.max(
				2.5 * dt,
				this.holder.c.CarbonMob.dizziness
			);
			this.holder.c.CarbonMob.jitteriness = Math.max(
				2.5 * dt,
				this.holder.c.CarbonMob.jitteriness
			);
		}
		super.mob_life(dt);
	}
	overdose_process(dt: number) {
		this.holder.c.LivingMob.adjust_damage("tox", 0.25 * dt);
		this.holder.c.CarbonMob.dizziness = Math.max(
			0.5 * dt,
			this.holder.c.CarbonMob.dizziness
		);
		this.holder.c.CarbonMob.jitteriness = Math.max(
			0.5 * dt,
			this.holder.c.CarbonMob.jitteriness
		);
		super.overdose_process(dt);
	}
}
module.exports.reagents.Atropine = Atropine;
Object.assign(Atropine.prototype, {
	name: "Atropine",
	description:
	"If a patient is in critical condition, rapidly heals all damage types as well as regulating oxygen in the body. Excellent for stabilizing wounded patients.",
	reagent_state: "liquid",
	color: [0, 0, 0],
	metabolization_rate: 0.125,
	overdose_threshold: 35,
});

class Epinephrine extends Medicine {
	// /datum/reagent/medicine/epinephrine
	mob_life(dt: number) {
		if (this.holder.c.LivingMob.health < 0) {
			this.holder.c.LivingMob.adjust_damage("tox", -0.25 * dt);
			this.holder.c.LivingMob.adjust_damage("brute", -0.25 * dt);
			this.holder.c.LivingMob.adjust_damage("burn", -0.25 * dt);
		}
		if (this.holder.c.LivingMob.get_damage("oxy") > 35) {
			this.holder.c.LivingMob.set_damage("oxy", 35);
		}
		if (this.holder.c.CarbonMob.losebreath >= 2 * dt) {
			this.holder.c.CarbonMob.losebreath -= 1 * dt;
		}
		if (this.holder.c.CarbonMob.losebreath < 0) {
			this.holder.c.CarbonMob.losebreath = 0;
		}
		this.holder.c.LivingMob.adjust_damage("stamina", -0.25 * dt);
		if (Math.random() < 0.2) {
			this.holder.c.LivingMob.adjust_effect("Stun", -1000 * dt);
			this.holder.c.LivingMob.adjust_effect("Knockdown", -1000 * dt);
			this.holder.c.LivingMob.adjust_effect("Unconscious", -1000 * dt);
		}
		super.mob_life(dt);
	}
	overdose_process(dt: number) {
		if (Math.random() < 0.33) {
			this.holder.c.LivingMob.adjust_damage("stamina", 1.25 * dt);
			this.holder.c.LivingMob.adjust_damage("tox", 0.5 * dt);
			this.holder.c.CarbonMob.losebreath += 0.5 * dt;
		}
		super.overdose_process(dt);
	}
}
module.exports.reagents.Epinephrine = Epinephrine;
Object.assign(Epinephrine.prototype, {
	name: "Epinephrine",
	description:
	"Minor boost to stun resistance. Slowly heals damage if a patient is in critical condition, as well as regulating oxygen loss. Overdose causes weakness and toxin damage.",
	reagent_state: "liquid",
	color: [0.82, 1, 0.98],
	metabolization_rate: 0.125,
	overdose_threshold: 30,
});

class Mannitol extends Medicine {
	// /datum/reagent/medicine/mannitol
	mob_life(dt: number) {
		this.holder.c.LivingMob.adjust_damage("brain", -1.5 * dt);
		super.mob_life(dt);
	}
}
module.exports.reagents.Mannitol = Mannitol;
Object.assign(Mannitol.prototype, {
	name: "Mannitol",
	description: "Efficiently restores brain damage.",
	color: [0.86, 0.86, 1],
});

class Stimulants extends Medicine {
	// /datum/reagent/medicine/stimulants
	mob_life(dt: number) {
		this.holder.c.LivingMob.status_flags |= combat_defines.GOTTAGOFAST;
		if (this.a.c.LivingMob.health < 50 && this.a.c.LivingMob.health > 0) {
			this.holder.c.LivingMob.adjust_damage("oxy", -0.5 * dt);
			this.holder.c.LivingMob.adjust_damage("tox", -0.5 * dt);
			this.holder.c.LivingMob.adjust_damage("brute", -0.5 * dt);
			this.holder.c.LivingMob.adjust_damage("burn", -0.5 * dt);
		}
		this.holder.c.LivingMob.adjust_effect("Stun", -3000 * dt);
		this.holder.c.LivingMob.adjust_effect("Knockdown", -3000 * dt);
		this.holder.c.LivingMob.adjust_effect("Unconscious", -3000 * dt);
		this.holder.c.LivingMob.adjust_damage("stamina", -2.5 * dt);
		super.mob_life(dt);
	}

	overdose_process(dt: number) {
		if (Math.random() < 0.33) {
			this.holder.c.LivingMob.adjust_damage("stamina", 1.25 * dt);
			this.holder.c.LivingMob.adjust_damage("tox", 0.5 * dt);
			this.holder.c.CarbonMob.losebreath += 0.5 * dt;
		}
		super.overdose_process(dt);
	}
}
module.exports.reagents.Stimulants = Stimulants;
Object.assign(Stimulants.prototype, {
	name: "Stimulants",
	description:
	"Increases stun resistance and movement speed in addition to restoring minor damage and weakness. Overdose causes weakness and toxin damage.",
	color: [0.47, 0, 0.55],
	metabolization_rate: 0.25,
	overdose_threshold: 60,
});

class Insulin extends Medicine {} // /datum/reagent/medicine/insulin //TODO: mob_life()
module.exports.reagents.Insulin = Insulin;
Object.assign(Insulin.prototype, {
	name: "Insulin",
	description: "Increases sugar depletion rates.",
	reagent_state: "liquid",
	color: [1, 1, 0.94],
	metabolization_rate: 0.25,
});

class Bicaridine extends Medicine {
	// /datum/reagent/medicine/bicaridine
	mob_life(dt: number) {
		this.holder.c.LivingMob.adjust_damage("brute", -1 * dt);
		super.mob_life(dt);
	}
	overdose_process(dt: number) {
		this.holder.c.LivingMob.adjust_damage("brute", 2 * dt);
		super.overdose_process(dt);
	}
}
module.exports.reagents.Bicaridine = Bicaridine;
Object.assign(Bicaridine.prototype, {
	name: "Bicaridine",
	description: "Restores bruising. Overdose causes it instead.",
	reagent_state: "liquid",
	color: [0.78, 0.65, 0.86],
	overdose_threshold: 30,
});

class Dexalin extends Medicine {
	// /datum/reagent/medicine/dexalin
	mob_life(dt: number) {
		this.holder.c.LivingMob.adjust_damage("oxy", -1 * dt);
		super.mob_life(dt);
	}
	overdose_process(dt: number) {
		this.holder.c.LivingMob.adjust_damage("oxy", 2 * dt);
		super.overdose_process(dt);
	}
}
module.exports.reagents.Dexalin = Dexalin;
Object.assign(Dexalin.prototype, {
	name: "Dexalin",
	description: "Restores oxygen loss. Overdose causes it instead.",
	reagent_state: "liquid",
	color: [0.78, 0.65, 0.86],
	overdose_threshold: 30,
});

class Kelotane extends Medicine {
	// /datum/reagent/medicine/kelotane
	mob_life(dt: number) {
		this.holder.c.LivingMob.adjust_damage("burn", -1 * dt);
		super.mob_life(dt);
	}
	overdose_process(dt: number) {
		this.holder.c.LivingMob.adjust_damage("burn", 2 * dt);
		super.overdose_process(dt);
	}
}
module.exports.reagents.Kelotane = Kelotane;
Object.assign(Kelotane.prototype, {
	name: "Kelotane",
	description: "Restores fire damage. Overdose causes it instead.",
	reagent_state: "liquid",
	color: [0.78, 0.65, 0.86],
	overdose_threshold: 30,
});

class AntiToxin extends Medicine {
	// /datum/reagent/medicine/antitoxin
	mob_life(dt: number) {
		this.holder.c.LivingMob.adjust_damage("tox", -1 * dt);
		for (const key of this.holder.c.ReagentHolder.reagents.keys()) {
			if (key !== this.constructor.name) {
				this.holder.c.ReagentHolder.remove(key, 0.5 * dt);
			}
		}
		super.mob_life(dt);
	}
	overdose_process(dt: number) {
		this.holder.c.LivingMob.adjust_damage("tox", 2 * dt);
		super.overdose_process(dt);
	}
}
module.exports.reagents.AntiToxin = AntiToxin;
Object.assign(AntiToxin.prototype, {
	name: "Anti-Toxin",
	description:
	"Heals toxin damage and removes toxins in the bloodstream. Overdose causes toxin damage.",
	reagent_state: "liquid",
	color: [0.78, 0.65, 0.86],
	overdose_threshold: 30,
	taste_description: "a roll of gauze",
});

class Inaprovaline extends Medicine {
	// /datum/reagent/medicine/inaprovaline
	mob_life(dt: number) {
		if (this.holder.c.CarbonMob.losebreath >= 2.5 * dt) {
			this.holder.c.CarbonMob.losebreath -= 2.5 * dt;
		}
		super.mob_life(dt);
	}
}
module.exports.reagents.Inaprovaline = Inaprovaline;
Object.assign(Inaprovaline.prototype, {
	name: "Inaprovaline",
	description:
	"Stabilizes the breathing of patients. Good for those in critical condition.",
	reagent_state: "liquid",
	color: [0.78, 0.65, 0.86],
});

class Tricordrazine extends Medicine {
	// /datum/reagent/medicine/tricordrazine
	mob_life(dt: number) {
		if (Math.random() < 0.8) {
			this.holder.c.LivingMob.adjust_damage("brute", -0.5 * dt);
			this.holder.c.LivingMob.adjust_damage("burn", -0.5 * dt);
			this.holder.c.LivingMob.adjust_damage("oxy", -0.5 * dt);
			this.holder.c.LivingMob.adjust_damage("tox", -0.5 * dt);
		}
		super.mob_life(dt);
	}
	overdose_process(dt: number) {
		this.holder.c.LivingMob.adjust_damage("brute", 1 * dt);
		this.holder.c.LivingMob.adjust_damage("burn", 1 * dt);
		this.holder.c.LivingMob.adjust_damage("oxy", 1 * dt);
		this.holder.c.LivingMob.adjust_damage("tox", 1 * dt);
		super.overdose_process(dt);
	}
}
module.exports.reagents.Tricordrazine = Tricordrazine;
Object.assign(Tricordrazine.prototype, {
	name: "Tricordrazine",
	description:
	"Has a high chance to heal all types of damage. Overdose instead causes it.",
	reagent_state: "liquid",
	color: [0.78, 0.65, 0.86],
	overdose_threshold: 30,
	taste_description: "grossness",
});

class Haloperidol extends Medicine {
	// /datum/reagent/medicine/haloperidol
	mob_life(dt: number) {
		for (const key of this.holder.c.ReagentHolder.reagents.keys()) {
			if (key !== this.constructor.name) {
				this.holder.c.ReagentHolder.remove(key, 2.5 * dt);
			}
		}
		this.holder.c.CarbonMob.drowsiness += 1 * dt;
		if (this.holder.c.CarbonMob.jitteriness >= 1.5 * dt)
			{this.holder.c.CarbonMob.jitteriness -= 1.5 * dt;}
		if (this.holder.c.CarbonMob.hallucination >= 2.5 * dt)
			{this.holder.c.CarbonMob.hallucination -= 2.5 * dt;}
		if (Math.random() < 0.2) {
			this.holder.c.LivingMob.adjust_damage("brain", 0.5 * dt);
		}
		this.holder.c.LivingMob.adjust_damage("stamina", 1.25 * dt);
		super.mob_life(dt);
	}
}
module.exports.reagents.Haloperidol = Haloperidol;
Object.assign(Haloperidol.prototype, {
	name: "Haloperidol",
	description:
	"Increases depletion rates for most stimulating/hallucinogenic drugs. Reduces druggy effects and jitteriness. Severe stamina regeneration penalty, causes drowsiness. Small chance of brain damage.",
	reagent_state: "liquid",
	color: [0.15, 0.53, 0.04],
	metabolization_rate: 0.2,
});