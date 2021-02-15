export{};
const {
	Component,
	Atom,
	has_component,
	is_atom,
} = require("./../../code/game/server.js");

class MobHud extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.alerts = {};
		this.actions = new Set();
		this.action_buttons = new Map();
		this.a.on("click", this._onclick.bind(this));
	}

	throw_alert(
		category: string | number = null,
		template: any = null,
		{ severity, new_master, override = false }: Record<string,any> = {}
	) {
		/* Proc to create or update an alert. Returns the alert if the alert is new or updated, 0 if it was thrown already
		category is a text string. Each mob may only have one alert per category; the previous one will be replaced
		path is a type path of the actual alert type to throw
		severity is an optional number that will be placed at the end of the icon_state for this alert
		For example, high pressure's icon_state is "highpressure" and can be serverity 1 or 2 to get "highpressure1" or "highpressure2"
		new_master is optional and sets the alert's icon state to "template" in the ui_style icons with the master as an overlay.
		Clicks are forwarded to master
		Override makes it so the alert is not replaced until cleared by a clear_alert with clear_override, and it's used for hallucinations.
		*/
		if (typeof severity === "undefined") {severity = "";}
		if (!category) {return false;}
		if (typeof template === "string")
			{template = this.a.server.templates[template];}
		if (!template || typeof template !== "object")
			{throw new TypeError(`${template} is not a valid template`);}
		this.a.server.process_template(template);
		if (!template.components.includes("Alert"))
			{throw new TypeError("Template provided is missing an Alert component.");}
		let thealert: { c: { Alert: { override_alerts: boolean; master: any; severity: any; timeout: number; mob_viewer: any; }; }; template: { vars: { icon_state: any; }; }; overlays: { alert_master: { icon: any; icon_state: any; color: any; }; }; icon_state: string; };
		if (this.alerts[category]) {
			thealert = this.alerts[category];
			if (thealert.c.Alert.override_alerts) {return false;}
			if (new_master && new_master !== thealert.c.Alert.master) {
				console.warn(
					`${this} threw alert ${category} with new_master ${new_master} while already having that alert with master ${thealert.c.Alert.master}`
				);

				this.clear_alert(category);
				// eslint-disable-next-line prefer-rest-params
				return this.throw_alert(...arguments);
			} else if (thealert.template !== template) {
				this.clear_alert(category);
				// eslint-disable-next-line prefer-rest-params
				return this.throw_alert(...arguments);
			} else if (!severity || severity === thealert.c.Alert.severity) {
				if (thealert.c.Alert.timeout) {
					this.clear_alert(category);
					// eslint-disable-next-line prefer-rest-params
					return this.throw_alert(...arguments);
				} else {
					//no need to update
					return false;
				}
			}
		} else {
			thealert = new Atom(this.a.server, template);
			thealert.c.Alert.override_alerts = override;
			if (override) {thealert.c.Alert.timeout = 0;}
		}
		thealert.c.Alert.mob_viewer = this.atom;

		if (is_atom(new_master)) {
			thealert.overlays.alert_master = {
				icon: new_master.icon,
				icon_state: new_master.icon_state,
				color: new_master.color,
			};
			thealert.icon_state = "template"; // We'll set the icon to the client's ui pref in reorganize_alerts()
			thealert.c.Alert.master = new_master;
		} else {
			thealert.icon_state = `${thealert.template.vars.icon_state}${severity}`;
			thealert.c.Alert.severity = severity;
		}

		this.alerts[category] = thealert;
		this.reorganize_alerts();
		// TODO Animation, see code/_onclick/hud/alert.dm line 64
		if (thealert.c.Alert.timeout) {
			setTimeout(() => {
				if (thealert.c.Alert.timeout && this.alerts[category] === thealert)
					{this.clear_alert(category);}
			}, thealert.c.Alert.timeout);
		}
	}
	clear_alert(category: string | number, clear_override = false) {
		const alert = this.alerts[category];
		if (!alert) {return false;}
		if (alert.c.Alert.override_alerts && !clear_override) {return false;}

		delete this.alerts[category];
		this.reorganize_alerts();
		//this.c.Eye.screen[`alert_${category}`] = void 0;
		// TODO: destroy the alert;
	}
	_onclick() {return false;}
	reorganize_alerts() {
		let alert_idx = 0;
		for (const alertname in this.alerts) {
			if (!Object.prototype.hasOwnProperty.call(this.alerts,alertname)) {continue;}
			const alert = this.alerts[alertname];
			alert.screen_loc_x = 13.875;
			alert.screen_loc_y = 12.84375 - 1.0625 * alert_idx;
			this.a.c.Eye.screen[`ui_alert${alert_idx}`] = alert;
			alert_idx++;
			if (alert_idx >= 5) {break;}
		}
		for (; alert_idx < 5; alert_idx++) {
			this.a.c.Eye.screen[`ui_alert${alert_idx}`] = void 0;
		}
	}
	reorganize_buttons() {
		const row_size = 10;
		const buttons_array = [...this.action_buttons.values()];
		for (let i = 0; i < buttons_array.length; i++) {
			const button = buttons_array[i];
			this.a.c.Eye.screen[`button_${button.object_id}`] = button;
			const row = Math.floor(i / row_size);
			const col = i % row_size;
			button.screen_loc_x = 0.1875 + 1.0625 * col;
			button.screen_loc_y = 13.8125 - row;
		}
	}
	update_buttons() {
		for (const button of this.action_buttons.values())
			{button.c.ActionButton.update_icon();}
	}
}

MobHud.depends = ["Mob"];

class Tooltip extends Component.Networked {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.add_networked_var("desc");
		this.add_networked_var("theme");
	}
}
Tooltip.template = {
	vars: {
		components: {
			Tooltip: {
				desc:
		"Something seems to have gone wrong with this tooltip, so report this bug please",
				theme: "",
			},
		},
	},
};

class Alert extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.on("clicked", this.clicked.bind(this));
		this.mob_viewer = null;
	}

	clicked() {
		if (this.resist_alert && this.mob_viewer && has_component(this.mob_viewer, "MobInteract"))
			{this.mob_viewer.c.MobInteract.resist();}
	}
}
Alert.template = {
	vars: {
		components: {
			Alert: {
				timeout: 0, // If set to a number, this alert will clear itself after that many ms
				resist_alert: false,
			},
		},
		icon: "icons/ui/screen_alert/",
		icon_state: "default",
		name: "Alert",
		layer: 30,
	},
	hidden: true, // Make it not appear in map editor
};
Alert.depends = ["Tooltip"];
Alert.loadBefore = ["Tooltip"];

class GridDisplay extends Component.Networked {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.add_networked_var("width");
		this.add_networked_var("height");
		this.add_networked_var("offset_x");
		this.add_networked_var("offset_y");
	}
}

GridDisplay.template = {
	vars: {
		components: {
			GridDisplay: {
				width: 1,
				height: 1,
				offset_x: 1,
				offset_y: 1,
			},
		},
	},
};

module.exports.components = { Alert, MobHud, GridDisplay, Tooltip };
