
export{};
const {
	Atom,
	Component,
	has_component,
	make_watched_property,
} = require("./../../code/game/server.js");
const _ = require("underscore");
const combat_defines = require("../defines/combat_defines.js");
const EventEmitter = require("events");

class Action /*lawsuit*/ extends EventEmitter {
	constructor(inst: any) {
		super();
		Object.assign(
			this,
			{
				name: "Generic Action",
				desc: null,
				tooltip_theme: "",
				use_target_for_icon: false,
				target: null,
				check_conscious: false,
				check_interact: false,
				bg_icon:  "icons/ui/screen_civ13/",
				bg_icon_state: "template",
				act_icon: "icons/ui/screen_civ13/",
				act_icon_state: "template_active",
			},
			inst
		);
		this.instanced_buttons = [];
		make_watched_property(this, "bg_icon_state", "string");
		this.on("bg_icon_state_changed", (from: any, to: any) => {
			for (const button of this.instanced_buttons) {
				button.icon_state = to;
			}
		});
	}
	add_to(mob: Record<string,any>) {
		if (!has_component(mob, "MobHud")) {return;}
		if (mob.c.MobHud.actions.has(this)) {return;}
		mob.c.MobHud.actions.add(this);
		const button = new Atom(mob.server, {
			components: ["ActionButton"],
			vars: {
				components: {
					Tooltip: {
						desc: this.desc,
						theme: this.tooltip_theme,
					},
				},
				name: this.name,
				icon: this.bg_icon,
				icon_state: this.bg_icon_state,
			},
		});
		if (this.use_target_for_icon && this.target) {
			button.overlays.button_icon = _.pick(
				this.target,
				"icon",
				"icon_state",
				"color",
				"alpha",
				"dir"
			);
		} else {
			button.overlays.button_icon = {
				icon: this.act_icon,
				icon_state: this.act_icon_state,
			};
		}
		button.c.ActionButton.action = this;
		button.c.ActionButton.mob = mob;
		button.c.ActionButton.update_icon();
		this.instanced_buttons.push(button);
		mob.c.MobHud.action_buttons.set(this, button);
		mob.c.MobHud.reorganize_buttons();
	}
	remove_from(mob: Record<string,any>) {
		if (!has_component(mob, "MobHud")) {return;}
		if (!mob.c.MobHud.actions.has(this)) {return;}
		mob.c.MobHud.actions.delete(this);
		const button = mob.c.MobHud.action_buttons.get(this);
		button.c.ActionButton.action = this;
		button.c.ActionButton.mob = mob;
		mob.c.MobHud.action_buttons.delete(this);
		if (button) {
			mob.c.Eye.screen["button_" + button.object_id] = null;
			button.destroy();
			const idx = this.instanced_buttons.indexOf(button);
			if (idx !== -1) {this.instanced_buttons.splice(idx, 1);}
		}
		mob.c.MobHud.reorganize_buttons();
	}
	check_mob_use(mob: { c: { LivingMob: { stat: any; }; MobInteract: { nointeract_counter: any; }; }; }) {
		if (this.check_conscious) {
			if (!has_component(mob, "LivingMob")) {return false;}
			if (mob.c.LivingMob.stat !== combat_defines.CONSCIOUS) {return false;}
		}
		if (this.check_interact) {
			if (!has_component(mob, "MobInteract")) {return false;}
			if (mob.c.MobInteract.nointeract_counter) {return false;}
		}
		return true;
	}

	click_act(/*user*/) {return;}
}

class ItemAction extends Action {
	constructor(inst: any) {
		super(
			Object.assign(
				{},
				{
					check_conscious: true,
					check_interact: true,
					use_target_for_icon: true,
				},
				inst
			)
		);
	}
	check_mob_use(mob: any) {
		if (!super.check_mob_use(mob)) {return false;}
		if (
			!has_component(mob, "MobInventory") ||
	!this.target ||
	this.target.loc !== mob
		)
			{return false;}
		return true;
	}
	click_act(user: any) {
		this.target.c.Item.attack_self(user);
	}
}

Action.Item = ItemAction;

class ActionButton extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.on("clicked", this.clicked.bind(this));
		this.action = null;
		this.mob = null;
	}

	clicked(e: { mob: any; }) {
		if (!this.action || !this.action.check_mob_use(e.mob) || e.mob !== this.mob)
			{return;}
		this.action.click_act(e.mob);
	}

	update_icon() {
		const usable = this.action.check_mob_use(this.mob);
		if (!usable) {
			this.a.color = "#800000";
			this.a.alpha = 0.5;
			this.a.overlays.button_icon.color = this.color;
			this.a.overlays.button_icon.alpha = this.alpha;
		} else {
			this.a.color = null;
			this.a.alpha = 1;
			if (this.action.target) {
				this.a.overlays.button_icon.color = this.action.target.color;
				this.a.overlays.button_icon.alpha = this.action.target.alpha;
			} else {
				this.a.overlays.button_icon.color = null;
				this.a.overlays.button_icon.alpha = null;
			}
		}
	}
}

ActionButton.loadBefore = ["Tooltip"];
ActionButton.depends = ["Tooltip"];

class ItemActions extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.on("moved", this.moved.bind(this));
		this.actions = [];
	}

	moved(e: { old: { loc: any; }; new: { loc: any; }; }) {
		if (e.old && e.new && e.old.loc === e.new.loc) {return;} // nothing changed stop rearranging my buttons ree
		if (e.old && has_component(e.old.loc, "MobHud")) {
			for (const act of this.actions) {
				act.remove_from(e.old.loc);
			}
		}
		if (e.new && has_component(e.new.loc, "MobHud")) {
			for (const act of this.actions) {
				act.add_to(e.new.loc);
			}
		}
	}

	add_action(act: ItemAction) {
		if (this.actions.includes(act) || !act) {return act;}
		if (!(act instanceof Action)) {
			const instobj = act;
			act = new ItemAction(instobj);
		}
		if (!act.target) {act.target = this.a;}
		this.actions.push(act);
		if (has_component(this.loc, "MobHud")) {act.add_to(this.loc);}
		return act;
	}
	remove_action(act: { remove_from: (arg0: any) => void; }) {
		const idx = this.actions.indexOf(act);
		if (idx === -1) {return;}
		this.actions.splice(idx, 1);
		if (has_component(this.loc, "MobHud")) {act.remove_from(this.loc);}
	}
}

ItemActions.loadBefore = ["Item"];
ItemActions.depends = ["Item"];

module.exports = Action;
module.exports.components = { ActionButton, ItemActions };
