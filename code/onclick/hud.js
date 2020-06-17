const {
	Component,
	Atom,
	has_component,
	is_atom,
} = require("./../../typespess/index.js");

class MobHud extends Component {
	constructor(atom, template) {
		super(atom, template);
		this.alerts = {};
		this.actions = new Set();
		this.action_buttons = new Map();
		this.a.on("click", this._onclick.bind(this));
	}

	throw_alert(
		category,
		template,
		{ severity, new_master, override = false } = {}
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
		if (severity == undefined) severity = "";
		if (!category) return;
		if (typeof template == "string")
			template = this.a.server.templates[template];
		if (!template || typeof template != "object")
			throw new TypeError(`${template} is not a valid template`);
		this.a.server.process_template(template);
		if (!template.components.includes("Alert"))
			throw new TypeError("Template provided is missing an Alert component.");
		var thealert;
		if (this.alerts[category]) {
			thealert = this.alerts[category];
			if (thealert.c.Alert.override_alerts) return;
			if (new_master && new_master != thealert.c.Alert.master) {
				console.warn(
					`${this} threw alert ${category} with new_master ${new_master} while already having that alert with master ${thealert.c.Alert.master}`
				);

				this.clear_alert(category);
				return this.throw_alert.apply(this, arguments);
			} else if (thealert.template != template) {
				this.clear_alert(category);
				return this.throw_alert.apply(this, arguments);
			} else if (!severity || severity == thealert.c.Alert.severity) {
				if (thealert.c.Alert.timeout) {
					this.clear_alert(category);
					return this.throw_alert.apply(this, arguments);
				} else {
					//no need to update
					return;
				}
			}
		} else {
			thealert = new Atom(this.a.server, template);
			thealert.c.Alert.override_alerts = override;
			if (override) thealert.c.Alert.timeout = 0;
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
				if (thealert.c.Alert.timeout && this.alerts[category] == thealert)
					this.clear_alert(category);
			}, thealert.c.Alert.timeout);
		}
	}
	clear_alert(category, clear_override = false) {
		var alert = this.alerts[category];
		if (!alert) return false;
		if (alert.c.Alert.override_alerts && !clear_override) return false;

		delete this.alerts[category];
		this.reorganize_alerts();
		//this.c.Eye.screen[`alert_${category}`] = undefined;
		// TODO: destroy the alert;
	}
	_onclick() {}
	reorganize_alerts() {
		var alert_idx = 0;
		for (var alertname in this.alerts) {
			if (!this.alerts.hasOwnProperty(alertname)) continue;
			var alert = this.alerts[alertname];
			alert.screen_loc_x = 13.875;
			alert.screen_loc_y = 12.84375 - 1.0625 * alert_idx;
			this.a.c.Eye.screen[`ui_alert${alert_idx}`] = alert;
			alert_idx++;
			if (alert_idx >= 5) break;
		}
		for (; alert_idx < 5; alert_idx++) {
			this.a.c.Eye.screen[`ui_alert${alert_idx}`] = undefined;
		}
	}
	reorganize_buttons() {
		const row_size = 10;
		let buttons_array = [...this.action_buttons.values()];
		for (let i = 0; i < buttons_array.length; i++) {
			let button = buttons_array[i];
			this.a.c.Eye.screen[`button_${button.object_id}`] = button;
			let row = Math.floor(i / row_size);
			let col = i % row_size;
			button.screen_loc_x = 0.1875 + 1.0625 * col;
			button.screen_loc_y = 13.8125 - row;
		}
	}
	update_buttons() {
		for (let button of this.action_buttons.values())
			button.c.ActionButton.update_icon();
	}
}

MobHud.depends = ["Mob"];

class Tooltip extends Component.Networked {
	constructor(atom, template) {
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
	constructor(atom, template) {
		super(atom, template);
		this.a.on("clicked", this.clicked.bind(this));
		this.mob_viewer = null;
	}

	clicked() {
		if (
			this.resist_alert &&
      this.mob_viewer &&
      has_component(this.mob_viewer, "MobInteract")
		)
			this.mob_viewer.c.MobInteract.resist();
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
		icon: "icons/mob/screen_alert.png",
		icon_state: "default",
		name: "Alert",
		layer: 30,
	},
	hidden: true, // Make it not appear in map editor
};
Alert.depends = ["Tooltip"];
Alert.loadBefore = ["Tooltip"];

class GridDisplay extends Component.Networked {
	constructor(atom, template) {
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

module.exports.templates = {
	alert_buckled: {
		// TODO click action see code/_onclick/hud/alert.dm line 574
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "You've been buckled to something. Click the alert to unbuckle unless you're handcuffed.",
				},
				Alert: {
					resist_alert: true,
				},
			},
			name: "Buckled",
			icon_state: "buckled",
		},
	},
	alert_handcuffed: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "You're handcuffed and can't act. If anyone drags you, you won't be able to move. Click the alert to free yourself.",
				},
				Alert: {
					resist_alert: true,
				},
			},
			name: "Handcufed",
		},
	},
	alert_not_enough_o2: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "You're not getting enough oxygen. Find some good air before you pass out! The box in your backpack has an oxygen tank and breath mask in it",
				},
			},
			name: "Choking (No O2)",
			icon_state: "not_enough_oxy",
		},
	},

	alert_too_much_o2: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "There's too much oxygen in the air, and you're breathing it in! Find some good air before you pass out!",
				},
			},
			name: "Choking (O2)",
			icon_state: "too_much_oxy",
		},
	},

	alert_not_enough_co2: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "You're not getting enough carbon dioxide. Find some good air before you pass out!",
				},
			},
			name: "Choking (No CO2)",
			icon_state: "not_enough_co2",
		},
	},

	alert_too_much_co2: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "There's too much carbon dioxide in the air, and you're breathing it in! Find some good air before you pass out!",
				},
			},
			name: "Choking (CO2)",
			icon_state: "too_much_co2",
		},
	},

	alert_not_enough_plasma: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "You're not getting enough plasma. Find some good air before you pass out!",
				},
			},
			name: "Choking (No Plasma)",
			icon_state: "not_enough_tox",
		},
	},

	alert_too_much_plasma: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "There's highly flammable, toxic plasma in the air and you're breathing it in. Find some fresh air. \
		The box in your backpack has an oxygen tank and gas mask in it.",
				},
			},
			name: "Choking (Plasma)",
			icon_state: "too_much_tox",
		},
	},
	//End gas alerts

	alert_fat: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "You ate too much food, lardass. Run around the station and lose some weight.",
				},
			},
			name: "Fat",
			icon_state: "fat",
		},
	},
	alert_hungry: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc: "Some food would be good right about now.",
				},
			},
			name: "Hungry",
			icon_state: "hungry",
		},
	},
	alert_starving: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "You're severely malnourished. The hunger pains make moving around a chore.",
				},
			},
			name: "Starving",
			icon_state: "starving",
		},
	},
	alert_hot: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "You're flaming hot! Get somewhere cooler and take off any insulating clothing like a fire suit.",
				},
			},
			name: "Too Hot",
			icon_state: "hot",
		},
	},
	alert_cold: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "You're freezing cold! Get somewhere warmer and take off any insulating clothing like a space suit.",
				},
			},
			name: "Too Cold",
			icon_state: "cold",
		},
	},
	alert_lowpressure: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "The air around you is hazardously thin. A space suit would protect you.",
				},
			},
			name: "Low Pressure",
			icon_state: "lowpressure",
		},
	},
	alert_highpressure: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "The air around you is hazardously thick. A fire suit would protect you.",
				},
			},
			name: "High Pressure",
			icon_state: "highpressure",
		},
	},
	alert_blind: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "You can't see! This may be caused by a genetic defect, eye trauma, being unconscious, \
		or something covering your eyes.",
				},
			},
			name: "Blind",
			icon_state: "blind",
		},
	},
	alert_high: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "Whoa man, you're tripping balls! Careful you don't get addicted... if you aren't already.",
				},
			},
			name: "High",
			icon_state: "high",
		},
	},
	alert_drunk: {
		//Not implemented
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "All that alcohol you've been drinking is impairing your speech, motor skills, and mental cognition. Make sure to act like it.",
				},
			},
			name: "Drunk",
			icon_state: "drunk",
		},
	},
	alert_embeddedobject: {
		// TODO click action see code/_onclick/hud/alert.dm line 203
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "Something got lodged into your flesh and is causing major bleeding. It might fall out with time, but surgery is the safest way. \
		If you're feeling frisky, click yourself in help intent to pull the object out.",
				},
			},
			name: "Embedded Object",
			icon_state: "embeddedobject",
		},
	},
	alert_weightless: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "Gravity has ceased affecting you, and you're floating around aimlessly. You'll need something large and heavy, like a \
		wall or lattice, to push yourself off if you want to move. A jetpack would enable free range of motion. A pair of \
		magboots would let you walk around normally on the floor. Barring those, you can throw things, use a fire extinguisher, \
		or shoot a gun to move around via Newton's 3rd Law of Motion.",
				},
			},
			name: "Weightless",
			icon_state: "weightless",
		},
	},
	alert_fire: {
		// TODO click action see code/_onclick/hud/alert.dm line 221
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "You're on fire. Stop, drop and roll to put the fire out or move to a vacuum area.",
				},
			},
			name: "On Fire",
			icon_state: "fire",
		},
	},

	//ALIENS

	alert_alien_tox: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "There's flammable plasma in the air. If it lights up, you'll be toast.",
					theme: "alien",
				},
			},
			name: "Plasma",
			icon_state: "alien_tox",
		},
	},
	alert_alien_fire: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "It's too hot! Flee to space or at least away from the flames. Standing on weeds will heal you.",
					theme: "alien",
				},
			},
			name: "Too Hot",
			icon_state: "alien_fire",
		},
	},
	alert_alien_vulnerable: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc:
            "Your queen has been killed, you will suffer movement penalties and loss of hivemind. A new queen cannot be made until you recover.",
					theme: "alien",
				},
			},
			name: "Severed Matriarchy",
			icon_state: "alien_noqueen",
		},
	},

	//BLOBS

	alert_nofactory: {
		components: ["Alert"],
		vars: {
			components: {
				Tooltip: {
					desc: "You have no factory, and are slowly dying!",
					theme: "blob",
				},
			},
			name: "No Factory",
			icon_state: "blobbernaut_nofactory",
		},
	},
};

module.exports.components = { Alert, MobHud, GridDisplay, Tooltip };
