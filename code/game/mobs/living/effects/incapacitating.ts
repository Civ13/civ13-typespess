export{};
const { has_component } = require("./../../../../../code/game/server.js");

const StatusEffect = require("./effect.js");

class Knockdown extends StatusEffect.Timed {
	mob: any;
	lying: any;
	apply_to(mob: any, props: any) {
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
	mob: any;
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
	mob: boolean;
	lying: any;
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
