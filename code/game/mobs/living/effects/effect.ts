

class StatusEffect {
	static Timed: any;
	mob: any;
	overwrite_mode: string;
	apply_to(mob: Record<string,any>, props = {}) {
		if (this.mob && this.mob !== mob)
			{throw new Error(
				`This status effect has already been applied to ${this.mob}! Can't apply to ${mob} as well. Make a new status effect instead`
			);}
		const overwriting = mob.c.LivingMob.effects[this.constructor.name];
		if (overwriting && overwriting !== this) {
			if (this.overwrite_mode === "update") {
				return overwriting.apply_to(mob, props);
			} else if (this.overwrite_mode === "replace") {
				overwriting.unapply();
			} else {
				throw new Error(`Unrecognized overwrite mode ${this.overwrite_mode}`);
			}
		}
		this.mob = mob;
		mob.c.LivingMob.effects[this.constructor.name] = this;
	}

	unapply() {
		if (!this.mob) {return;}
		if (this.mob.c.LivingMob.effects[this.constructor.name] === this)
			{this.mob.c.LivingMob.effects[this.constructor.name] = null;}
		this.mob = null;
	}
}

StatusEffect.prototype.overwrite_mode = "update";

class TimedEffect extends StatusEffect {
	target_time: number;
	timeout: any;
	apply_to(mob: Record<string,any>, props: Record<string,any> = {}) {
		const new_target_time = mob.server.now() + (props.delay || 0);
		if (new_target_time <= (this.target_time || 0)) {return;}
		super.apply_to(mob, props);
		if (!this.mob) {return;}
		this.target_time = new_target_time;
		if (this.timeout) {clearTimeout(this.timeout);}
		this.timeout = setTimeout(this.unapply.bind(this), props.delay || 0);
	}

	adjust(amount: number) {
		if (this.timeout && this.mob) {
			clearTimeout(this.timeout);
			this.target_time += amount;
			this.timeout = setTimeout(
				this.unapply.bind(this),
				this.target_time - this.mob.server.now()
			);
		}
	}

	unapply() {
		if (this.timeout) {clearTimeout(this.timeout);}
		this.timeout = null;
		super.unapply();
	}
}

StatusEffect.Timed = TimedEffect;

module.exports = StatusEffect;
