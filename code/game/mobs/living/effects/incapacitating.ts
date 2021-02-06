const { has_component } = require("./../../../../../code/game/server.ts");

const StatusEffect = require("./effect.ts");

class Knockdown extends StatusEffect.Timed {
	apply_to(mob, props) {
		super.apply_to(mob, props);
		if (this.mob && !this.lying) {
			this.lying = true;
			this.mob.c.LivingMob.nomove_counter++;
			this.mob.c.LivingMob.nointeract_counter++;
			if (has_component(this.mob, "CarbonMob"))
				{this.mob.c.CarbonMob.lying_counter++;}
		}
	}

	unapply() {
		if (this.mob && this.lying) {
			this.lying = false;
			this.mob.c.LivingMob.nomove_counter--;
			this.mob.c.LivingMob.nointeract_counter--;
			if (has_component(this.mob, "CarbonMob"))
				{this.mob.c.CarbonMob.lying_counter--;}
		}
		super.unapply();
	}
}

class Unconscious extends StatusEffect.Timed {
	apply_to(mob, props) {
		super.apply_to(mob, props);
		if (this.mob) {this.mob.c.LivingMob.update_stat();}
	}

	unapply() {
		super.unapply();
		if (this.mob) {this.mob.c.LivingMob.update_stat();}
	}
}

class Stun extends StatusEffect.Timed {
	apply_to(mob, props) {
		super.apply_to(mob, props);
		if (this.mob && !this.lying) {
			this.lying = true;
			this.mob.c.LivingMob.nomove_counter++;
			this.mob.c.LivingMob.nointeract_counter++;
		}
	}

	unapply() {
		if (this.mob && this.lying) {
			this.lying = false;
			this.mob.c.LivingMob.nomove_counter--;
			this.mob.c.LivingMob.nointeract_counter--;
		}
		super.unapply();
	}
}

module.exports.status_effects = { Knockdown, Unconscious, Stun };
