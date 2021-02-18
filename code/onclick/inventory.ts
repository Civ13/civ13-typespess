/* eslint-disable max-lines */ export{};
const {
	Component,
	Atom,
	has_component,
	chain_func,
	is_atom,
	make_watched_property,
	visible_message,
	to_chat,
} = require("./../../code/game/server.js");
const combat_defines = require("../defines/combat_defines.js");
const EventEmitter = require("events");
const StripPanel = require("./strip_panel.js");

const {_slot} = require("../game/components/objects/items.js").symbols;
const _slots: any = Symbol("_slots");
const _visible: any = Symbol("_can_see");
const _item: any = Symbol("_item");
const _active_hand: any = Symbol("_active_hand");
const _nohold_counter: any = Symbol("_nohold_counter");
const _throw_mode: any = Symbol("_throw_mode");

class MobInventory extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);

		this.a.c.Mob.on("keydown", this.keydown.bind(this));
		this.a.on("mouse_dragged_to", this.mouse_dragged_to.bind(this));
		if (has_component(this.a, "LivingMob")) {
			this.a.c.LivingMob.identifiable = chain_func(this.a.c.LivingMob.identifiable, this.identifiable.bind(this));
			this.a.c.LivingMob.get_id_name = this.get_id_name.bind(this);
		}
		this.next_move = 0;
		this[_slots] = {};
		this.slots = new Proxy(this[_slots], {
			set: () => {
				return false;
			},
			deleteProperty: () => {
				return false;
			},
			defineProperty: () => {
				return false;
			},
		});
		this.add_slot(
			"lhand",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "hand_l",
				screen_loc_x: 7.5,
				screen_loc_y: 0.15625,
				layer: 30,
				name: "left hand",
			},
			{
				is_hand_slot: true,
				worn_layer: 19,
				visible: true,
				wear_verb: "holding",
				wear_prep: "in",
				wear_noun: "left hand",
				strip_panel_name: "left hand",
			}
		);
		this.add_slot(
			"rhand",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "hand_r",
				screen_loc_x: 6.5,
				screen_loc_y: 0.15625,
				layer: 30,
				name: "right hand",
			},
			{
				is_hand_slot: true,
				worn_layer: 19,
				visible: true,
				wear_verb: "holding",
				wear_prep: "in",
				wear_noun: "right hand",
				strip_panel_name: "right hand",
			}
		);

		this.a.c.Eye.screen.swap_hands = new Atom(this.a.server, {
			vars: {
				icon: "icons/ui/screen_civ13/",
				icon_state: "act_equip",
				name: "swap hands",
				screen_loc_x: 6.5,
				screen_loc_y: 1.15625,
				layer: 30,
			},
		});
		this.a.c.Eye.screen.swap_hands.on("clicked", () => {
			this.swap_hands();
		});
		this.active_hand = "rhand";

		this.add_slot(
			"id",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "id",
				screen_loc_x: 3.375,
				screen_loc_y: 0.15625,
				layer: 30,
				name: "id",
			},
			{
				clothing_slot: "IdSlotItem",
				worn_layer: 4,
				requires_slot: "iclothing",
				visible: true,
				wear_verb: "wearing",
			}
		);
		this.add_slot(
			"belt",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "belt",
				screen_loc_x: 4.4375,
				screen_loc_y: 0.15625,
				layer: 30,
				name: "waist",
			},
			{
				clothing_slot: "BeltItem",
				worn_layer: 10,
				requires_slot: "iclothing",
				visible: true,
				wear_prep: "about",
				wear_noun: "waist",
			}
		);
		this.add_slot(
			"back",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "back",
				screen_loc_x: 5.4375,
				screen_loc_y: 0.15625,
				layer: 30,
				name: "back",
			},
			{
				clothing_slot: "BackItem",
				worn_layer: 13,
				visible: true,
				wear_prep: "on",
				wear_noun: "back",
			}
		);
		this.add_slot(
			"storage1",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "pocket",
				screen_loc_x: 8.5625,
				screen_loc_y: 0.15625,
				layer: 30,
				name: "left pocket",
			},
			{
				max_size: 2,
				requires_slot: "iclothing",
				requires_slot_prefix: "pocket",
				strip_desc: "left pocket",
			}
		);
		this.add_slot(
			"storage2",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "pocket",
				screen_loc_x: 9.625,
				screen_loc_y: 0.15625,
				layer: 30,
				name: "right pocket",
			},
			{
				max_size: 2,
				requires_slot: "iclothing",
				requires_slot_prefix: "pocket",
				strip_desc: "right pocket",
			}
		);
		this.add_slot(
			"suit_storage",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "suit_storage",
				screen_loc_x: 2.3125,
				screen_loc_y: 0.15625,
				layer: 30,
				name: "suit storage",
			},
			{
				worn_layer: 11,
				requires_slot: "oclothing",
				visible: true,
				wear_verb: "carrying",
				wear_prep: "on",
				wear_noun_slot: "oclothing",
			}
		);

		this.a.c.Eye.screen.toggle_clothing = new Atom(this.a.server, {
			vars: {
				icon: "icons/ui/screen_civ13/",
				icon_state: "toggle",
				name: "toggle inventory",
				screen_loc_x: 0.1875,
				screen_loc_y: 0.15625,
				layer: 30,
			},
		});
		this.a.c.Eye.screen.toggle_clothing.on("clicked", () => {
			for (const slotname of [
				"shoes",
				"iclothing",
				"oclothing",
				"gloves",
				"glasses",
				"mask",
				"ears",
				"head",
				"neck",
			]) {
				const slot = this.slots[slotname];
				slot.visible = !slot.visible;
			}
		});
		this.add_slot(
			"shoes",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "shoes",
				screen_loc_x: 1.25,
				screen_loc_y: 0.15625,
				layer: 30,
				name: "feet",
			},
			{
				clothing_slot: "FootItem",
				worn_layer: 5,
				visible: true,
				wear_verb: "wearing",
				wear_prep: "on",
				wear_noun: "feet",
			}
		);
		this.add_slot(
			"iclothing",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "uniform",
				screen_loc_x: 0.1875,
				screen_loc_y: 1.21875,
				layer: 30,
				name: "clothing",
			},
			{
				clothing_slot: "UniformItem",
				worn_layer: 3,
				visible: true,
				wear_verb: "wearing",
			}
		);
		this.add_slot(
			"oclothing",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "suit",
				screen_loc_x: 1.25,
				screen_loc_y: 1.21875,
				layer: 30,
				name: "suit",
			},
			{
				clothing_slot: "SuitItem",
				worn_layer: 8,
				visible: true,
				wear_verb: "wearing",
			}
		);
		this.add_slot(
			"gloves",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "gloves",
				screen_loc_x: 2.3125,
				screen_loc_y: 1.21875,
				layer: 30,
				name: "hands",
			},
			{
				clothing_slot: "HandItem",
				worn_layer: 6,
				visible: true,
				wear_prep: "on",
				wear_noun: "hands",
			}
		);
		this.add_slot(
			"mask",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "mask",
				screen_loc_x: 1.25,
				screen_loc_y: 2.28125,
				layer: 30,
				name: "face",
			},
			{
				clothing_slot: "MaskItem",
				worn_layer: 15,
				visible: true,
				wear_prep: "on",
				wear_noun: "face",
			}
		);
		this.add_slot(
			"neck",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "neck",
				screen_loc_x: 0.1875,
				screen_loc_y: 2.28125,
				layer: 30,
				name: "neck",
			},
			{
				clothing_slot: "NeckItem",
				worn_layer: 12,
				visible: true,
				wear_prep: "around",
				wear_noun: "neck",
			}
		);
		this.add_slot(
			"glasses",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "glasses",
				screen_loc_x: 0.1875,
				screen_loc_y: 3.34375,
				layer: 30,
				name: "glasses",
			},
			{
				clothing_slot: "EyeItem",
				worn_layer: 9,
				visible: true,
				wear_prep: "covering",
				wear_noun: "eyes",
			}
		);
		this.add_slot(
			"ears",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "ears",
				screen_loc_x: 2.3125,
				screen_loc_y: 2.28125,
				layer: 30,
				name: "ears",
			},
			{
				clothing_slot: "EarItem",
				worn_layer: 7,
				visible: true,
				wear_prep: "on",
				wear_noun: "ears",
			}
		);
		this.add_slot(
			"head",
			{
				icon: "icons/ui/screen_civ13/",
				icon_state: "head",
				screen_loc_x: 1.25,
				screen_loc_y: 3.34375,
				layer: 30,
				name: "head",
			},
			{
				clothing_slot: "HeadItem",
				worn_layer: 16,
				visible: true,
				wear_verb: "wearing",
				wear_prep: "on",
				wear_noun: "head",
			}
		);
		// give neck layer 12

		this.a.c.Eye.screen.drop_item = new Atom(this.a.server, {
			vars: {
				icon: "icons/ui/screen_civ13/",
				icon_state: "act_drop",
				name: "drop",
				screen_loc_x: 13.875,
				screen_loc_y: 1.21875,
				layer: 30,
			},
		});
		this.a.c.Eye.screen.drop_item.on("clicked", () => {
			this.slots[this.active_hand].item = void 0;
		});

		this.a.c.Eye.screen.throw_item = new Atom(this.a.server, {
			vars: {
				icon: "icons/ui/screen_civ13/",
				icon_state: "act_throw_off",
				name: "throw",
				screen_loc_x: 13.875,
				screen_loc_y: 1.21875,
				layer: 30,
			},
		});

		this.a.c.Eye.screen.throw_item.on("clicked", () => {
			this.throw_mode = !this.throw_mode;
		});

		this.a.c.Eye.screen.resist = new Atom(this.a.server, {
			vars: {
				icon: "icons/ui/screen_civ13/",
				icon_state: "act_resist",
				name: "resist",
				screen_loc_x: 12.8125,
				screen_loc_y: 1.21875,
				layer: 30,
			},
		});

		this.a.c.Eye.screen.act_intent = new Atom(this.a.server, {
			vars: {
				icon: "icons/ui/screen_civ13/",
				icon_state: "help",
				name: "intent",
				screen_loc_x: 11.75,
				screen_loc_y: 0.15625,
				layer: 30,
			},
		});

		this.a.c.Eye.screen.health = new Atom(this.a.server, {
			vars: {
				icon: "icons/ui/screen_gen/",
				icon_state: "health0",
				name: "health",
				screen_loc_x: 13.875,
				screen_loc_y: 6.46875,
				layer: 30,
			},
		});

		this.on("handcuffed_changed", this.handcuffed_changed.bind(this));

		make_watched_property(this, "handcuffed");
	}

	add_slot(
		id: string,
		appearance: {
			icon: string;
			icon_state: string;
			screen_loc_x: number;
			screen_loc_y: number;
			layer: number;
			name: string;
		},
		props: {
			is_hand_slot?: boolean;
			worn_layer?: number;
			visible?: boolean;
			wear_verb?: string;
			wear_prep?: string;
			wear_noun?: string;
			strip_panel_name?: string;
			clothing_slot?: string;
			requires_slot?: string;
			max_size?: number;
			requires_slot_prefix?: string;
			strip_desc?: string;
			wear_noun_slot?: string;
		}
	) {
		const slotatom = new Atom(this.a.server, {vars: appearance});
		this[_slots][id] = new Slot(this.atom, id, slotatom, props);
	}
	set active_hand(value) {
		if (typeof value !== "string" || !this[_slots][value] || !this[_slots][value].props.is_hand_slot) {
			throw new TypeError(`${value} is not a string referring to a valid hand slot.`);
		}
		if (this[_active_hand]) {
			this[_slots][this[_active_hand]].atom.overlays.hand_active = void 0;
		}
		const old_active_hand = this[_active_hand];
		this[_active_hand] = value;
		this[_slots][this[_active_hand]].atom.overlays.hand_active = {
			icon: "icons/ui/screen_civ13/",
			icon_state: "hand_active",
		};
		this.emit("active_hand_changed", old_active_hand, value);
		this.emit(
			"active_hand_item_changed",
			old_active_hand && this[_slots][old_active_hand].item,
			value && this[_slots][value].item
		);
	}
	get active_hand() {
		return this[_active_hand];
	}

	examine_slots(user: any) {
		const t_He = this.a.p_they(true);
		const t_his = this.a.p_their();
		const t_has = this.a.p_have();
		const t_is = this.a.p_are();
		const covered = this.get_covered_slots();
		for (const nslot of Object.values(this.slots)) {
			const slot: Record<string, any> = nslot;
			if (!slot.item || covered.has(slot.id)) {
				continue;
			}
			if (slot.props.visible) {
				const blood_stained = false;
				const verb = slot.props.wear_verb ? `${t_is} ${slot.props.wear_verb}` : t_has;
				const article = slot.item.gender === "plural" ? "some" : "a";
				const noun = slot.props.wear_noun ? ` ${slot.props.wear_prep} ${t_his} ${slot.props.wear_noun}` : "";
				to_chat`<span class='${blood_stained ? "warning" : "info"}'>${t_He} ${verb} ${article} ${
					blood_stained ? "blood-stained " : ""
				}${slot.item}${noun}${blood_stained ? "!" : "."}</span>`(user);
			}
		}
	}

	keydown(e: Record<string, any>) {
		if (e.key === "x") {
			// x
			this.swap_hands();
		}
		if (e.key === "z" && this.active_hand && this.slots[this.active_hand] && this.slots[this.active_hand].item) {
			// z
			this.slots[this.active_hand].item.c.Item.attack_self(this.a);
		}
		if (e.key === "q") {
			// q
			this.slots[this.active_hand].item = void 0;
		}
		if (e.key === "r") {
			this.throw_mode = !this.throw_mode;
		}
	}
	get throw_mode() {
		return !!this[_throw_mode];
	}
	set throw_mode(val) {
		val = !!val;
		if (this[_throw_mode] === val) {
			return;
		}
		this[_throw_mode] = val;
		this.a.c.Eye.screen.throw_item.icon_state = val ? "act_throw_on" : "act_throw_off";
	}

	throw_item(target: any) {
		this.throw_mode = false;
		if (!this.slots[this.active_hand].can_unequip()) {
			return;
		}
		if (!this.slots[this.active_hand].item) {
			return;
		}
		const item = this.slots[this.active_hand].item;
		this.slots[this.active_hand].item = void 0;
		visible_message(`<span class='danger'>The ${this.a} has thrown the ${item}</span class='danger'>`).emit_from(
			this.a
		);
		this.a.server.once("post_net_tick", () => {
			item.c.Tangible.throw_at({target});
		});
	}

	swap_hands() {
		if (this.active_hand === "lhand") {
			this.active_hand = "rhand";
		} else {
			this.active_hand = "lhand";
		}
	}

	put_in_hands(item: any) {
		let slot = this[_slots][this.active_hand];
		if (slot.can_accept_item(item)) {
			slot.item = item;
			return true;
		}
		for (slot of Object.values(this[_slots])) {
			if (!slot.props.is_hand_slot) {
				continue;
			}
			if (slot.can_accept_item(item)) {
				slot.item = item;
				return true;
			}
		}
		return false;
	}

	*hand_slots() {
		for (const tslot of Object.values(this[_slots])) {
			const slot: any = tslot;
			if (slot.props.is_hand_slot) {
				yield slot;
			}
		}
	}

	get nohold_counter() {
		return this[_nohold_counter];
	}
	set nohold_counter(val) {
		const old = this[_nohold_counter];
		if (val === old) {
			return;
		}
		this[_nohold_counter] = val;
		if (val && !old) {
			for (const tslot of Object.values(this.slots)) {
				const slot: Record<string, any> = tslot;
				if (slot.props.is_hand_slot && slot.can_unequip()) {
					slot.item = null;
				}
			}
		}
	}

	can_use_guns(gun: {c: {Gun: {trigger_guard: any}}}) {
		if (
			gun.c.Gun.trigger_guard !== combat_defines.TRIGGER_GUARD_ALLOW_ALL &&
			!this.a.c.MobInteract.advanced_tool_user
		) {
			to_chat`<span class='warning'>You don't have the dexterity to do this!</span>`(this.a);
			return false;
		}
		return true;
	}

	check_can_handcuff() {
		return this.handcuffable;
	}

	handcuffed_changed(from: any, to: any) {
		if (from) {
			this.a.c.MobHud.clear_alert("handcuffed");
			this.a.overlays.handcuffed = null;
			this.slots.lhand.atom.overlays.handcuffed = null;
			this.slots.rhand.atom.overlays.handcuffed = null;
			this.a.c.MobInteract.nointeract_counter--;
		}
		if (to) {
			this.a.c.MobHud.throw_alert("handcuffed", "alert_handcuffed", {
				new_master: to,
			});
			this.a.overlays.handcuffed = {
				overlay_layer: 17,
				icon: "icons/mob/",
				icon_state: "handcuff1",
			};
			// some interesting icon_state values you got there tg
			this.slots.rhand.atom.overlays.handcuffed = {
				name: "handcuffs",
				icon: "icons/ui/screen_gen/",
				icon_state: "markus",
			};
			this.slots.lhand.atom.overlays.handcuffed = {
				name: "handcuffs",
				icon: "icons/ui/screen_gen/",
				icon_state: "gabrielle",
			};
			this.a.c.MobInteract.nointeract_counter++;
			this.accident();
		}
	}

	accident() {
		for (const tslot of Object.values(this.slots)) {
			const slot: any = tslot;
			if (!slot.props.is_hand_slot || !slot.can_unequip()) {
				return;
			}
			if (!slot.item) {
				continue;
			}
			slot.item = null;
		}
	}

	get_id_name(if_no_id = "Unknown") {
		const id_item = this.slots.id && this.slots.id.item;
		if (!id_item) {
			return if_no_id;
		}
		if (has_component(id_item, "CardId") && id_item.c.CardId.registered_name) {
			return id_item.c.CardId.registered_name;
		}
		return if_no_id;
	}

	identifiable(prev: () => any) {
		for (const tslot of Object.values(this.slots)) {
			const slot: Record<string, any> = tslot;
			if (
				slot.props.clothing_slot &&
				has_component(slot.item, slot.props.clothing_slot) &&
				slot.item.c[slot.props.clothing_slot].hide_face
			) {
				return false;
			}
		}
		return prev();
	}

	get_covered_slots() {
		const set = new Set();
		for (const nslot of Object.values(this.slots)) {
			const slot: any = nslot;
			if (!slot.props.clothing_slot || !has_component(slot.item, slot.props.clothing_slot)) {
				continue;
			}
			const covered_slots = slot.item.c[slot.props.clothing_slot].covered_slots;
			if (!covered_slots) {
				continue;
			}
			for (const covered of covered_slots) {
				set.add(covered);
			}
		}
		return set;
	}

	mouse_dragged_to(e: Record<string, any>) {
		const user = e.mob;
		if (
			e.from.atom === this.a &&
			e.to.atom === user &&
			(!has_component(e.mob, "Tangible") || e.mob.c.Tangible.can_reach(this.a)) &&
			!user.c.Mob.get_panel(this.a, StripPanel) &&
			user.c.Mob.can_read_panel(this.a, StripPanel)
		) {
			// time for some fun strippy times
			const panel = new StripPanel(user.c.Mob.client, {
				title: `${this.a.name}`,
			});
			user.c.Mob.bind_panel(this.a, panel);
			panel.open();
		}
	}

	strip_panel_equip(mob: any, slot: Record<string, any>) {
		if (slot.item) {
			return;
		}
		const this_slot = this.slots[this.active_hand];
		if (!this_slot) {
			return;
		}
		const this_item = this_slot.item;
		if (!this_item) {
			return;
		}

		if (!this_slot.can_unequip()) {
			to_chat`<span class='warning'>You can't put the ${this_item} on the ${mob}, it's stuck to your hand!</span>`(
				this.a
			);
			return;
		}
		if (!slot.can_accept_item(this_item)) {
			to_chat`<span class='warning'>The ${this_item} doesn't fit in that place!</span>`(this.a);
			return;
		}
		let delay = this_item.c.Item.equip_delay_other;
		if (slot.props.visible) {
			visible_message`<span class='danger'>The ${this.a} tries to put the ${this_item} on the ${mob}.</span>`
				.self`<span class='userdanger'>The ${this.a} tries to put the ${this_item} on the ${mob}.</span>`.emit_from(
				mob
			);
		} else {
			to_chat`<span class='notice'>You try to place the ${this_item} into the ${mob}'s ${slot.props.strip_desc}.</span>`(
				this.a
			);
			delay *= 0.5; // reverse pickpocketing is da bomb
		}
		this.do_after({
			delay,
			target: mob,
			extra_checks: (cancel: any) => {
				slot.on("item_changed", cancel);
				return () => {
					slot.removeListener("item_changed", cancel);
				};
			},
		}).then((success) => {
			if (!success) {
				if (!slot.props.visible) {
					to_chat`<span class='warning'>You feel your ${slot.props.strip_desc} being fumbled with!</span>`(
						mob
					);
				}
				return;
			}
			if (slot.can_accept_item(this_item)) {
				slot.item = this_item;
			}
		});
	}
	strip_panel_unequip(mob: Record<string, any>, slot: Record<string, any>) {
		const item = slot.item;
		if (!item) {
			return;
		}
		if (!slot.can_unequip()) {
			to_chat`<span class='warning'>You can't remove the ${
				slot.visible ? item : "item"
			}, it appears to be stuck!</span>`(this.a);
			return;
		}
		if (slot.props.visible) {
			visible_message`<span class='danger'>The ${this.a} tries to remove the ${mob}'s ${item.name}.</span>`
				.self`<span class='userdanger'>The ${this.a} tries to remove the ${mob}'s ${item.name}.</span>`.emit_from(
				mob
			);
		} else {
			to_chat`<span class='notice'>You try to empty the ${mob}'s ${slot.props.strip_desc}.</span>`(this.a);
		}
		this.do_after({
			delay: item.c.Item.strip_delay,
			target: mob,
			extra_checks: (cancel: any) => {
				slot.on("item_changed", cancel);
				return () => {
					slot.removeListener("item_changed", cancel);
				};
			},
		}).then((success) => {
			if (!success) {
				if (!slot.props.visible) {
					to_chat`<span class='warning'>You feel your ${slot.props.strip_desc} being fumbled with!</span>`(
						mob
					);
				}
				return;
			}
			if (slot.can_unequip()) {
				item.loc = mob.fine_loc;
			}
		});
	}

	do_after({delay, needhand = true, target = null, progress = true, extra_checks = null}: Record<string, any> = {}) {
		return new Promise((resolve) => {
			if (!delay) {
				return true;
			}
			const time_begin = this.a.server.now();
			if (!target) {
				target = [];
			}
			if (!(target instanceof Array)) {
				target = [target];
			}
			target = target.slice();
			target.push(this.a);
			let remove_callbacks: {(): void; (): void} = null;
			const timeout = setTimeout(() => {
				remove_callbacks();
				resolve(true);
			}, delay);
			const callback_removers: {(): void; (): void; (): void}[] = [];
			remove_callbacks = () => {
				for (const remover of callback_removers) {
					remover();
				}
			};
			function cancel() {
				remove_callbacks();
				clearTimeout(timeout);
				resolve(false);
			}
			for (const item of target) {
				item.on("moved", cancel);
				item.on("destroyed", cancel);
				callback_removers.push(() => {
					item.removeListener("moved", cancel);
					item.removeListener("destroyed", cancel);
				});
			}
			if (needhand && this.slots[this.active_hand].item) {
				const slot = this.slots[this.active_hand];
				slot.on("item_changed", cancel);
				this.on("active_hand_changed", cancel);
				callback_removers.push(() => {
					slot.removeListener("item_changed", cancel);
					this.removeListener("active_hand_changed", cancel);
				});
			}
			if (extra_checks) {
				callback_removers.push(extra_checks(cancel));
			}
			// progress bar
			if (progress) {
				const attached_atom_id = this.a.c.Eye.get_netid_for_atom(target[0]);
				if (attached_atom_id) {
					const progressbar = new Atom(this.a.server, {
						components: ["ProgressBar"],
						vars: {
							components: {
								ProgressBar: {time_begin, delay, attached_atom_id},
							},
						},
					});
					this.a.c.Eye.screen[`progressbar_${progressbar.object_id}`] = progressbar;
					callback_removers.push(() => {
						delete this.a.c.Eye.screen[`progressbar_${progressbar.object_id}`];
						progressbar.destroy();
					});
				}
			}
		});
	}
}

Atom.prototype.attack_hand = () => {
	return;
};
Atom.prototype.attack_by = () => {
	return;
};

class Slot extends EventEmitter {
	constructor(mob: any, id: any, atom: any, props: any) {
		super();
		Object.defineProperty(this, "mob", {
			enumerable: false,
			configurable: false,
			writable: false,
			value: mob,
		});
		Object.defineProperty(this, "id", {
			enumerable: true,
			configurable: false,
			writable: false,
			value: id,
		});
		Object.defineProperty(this, "atom", {
			enumerable: true,
			configurable: false,
			writable: false,
			value: atom,
		});
		this.props = props ? props : {};
		this.visible = true;
		this.atom.on("clicked", this.clicked.bind(this));
		this.atom.on("mouse_dropped_by", this.mouse_dropped_by.bind(this));
	}

	clicked(e: Record<string, any>) {
		if (this.props.is_hand_slot) {
			if (this.mob.c.MobInventory.active_hand === this.id) {
				if (this.item) {
					this.item.c.Item.attack_self(this.mob);
				}
			} else {
				this.mob.c.MobInventory.active_hand = this.id;
			}
			return;
		}
		if (
			!this.item &&
			this.can_accept_item(this.mob.c.MobInventory.slots[this.mob.c.MobInventory.active_hand].item)
		) {
			this.item = this.mob.c.MobInventory.slots[this.mob.c.MobInventory.active_hand].item;
		} else if (this.item && !this.mob.c.MobInventory.slots[this.mob.c.MobInventory.active_hand].item) {
			this.item.attack_hand(this.mob, e);
		}
	}

	mouse_dropped_by(e: Record<string, any>) {
		if (
			this.props.is_hand_slot &&
			this.can_accept_item(e.from.atom) &&
			e.from.atom.c.Item.slot &&
			e.from.atom.c.Item.slot.mob === this.mob &&
			this.mob.c.MobInteract.can_interact() &&
			!this.item
		) {
			this.item = e.from.atom;
		}
	}
	update_icons() {
		if (this.props.is_hand_slot || this.props.clothing_slot) {
			let preset = "inhand_";
			if (this.props.clothing_slot) {
				preset = "clothing_";
			}
			let icodir = 1;
			if (this.mob) {
				icodir = this.mob.dir;
			}
			if (icodir === 1) {
				icodir = 2;
			} else if (icodir === 2) {
				icodir = 1;
			} else if (icodir === 4) {
				icodir = 3;
			} else if (icodir === 8) {
				icodir = 4;
			}
			if (
				this.mob.overlays[`${preset}${this.id}`] &&
				this.mob.overlays[`${preset}${this.id}`].icon &&
				this.mob.overlays[`${preset}${this.id}`].icon.search("1.png") !== -1
			) {
				this.mob.overlays[`${preset}${this.id}`].icon = this.mob.overlays[`${preset}${this.id}`].icon.replace(
					"1.png",
					`${icodir}.png`
				);
			} else if (
				this.mob.overlays[`${preset}${this.id}`] &&
				this.mob.overlays[`${preset}${this.id}`].icon &&
				this.mob.overlays[`${preset}${this.id}`].icon.search("2.png") !== -1
			) {
				this.mob.overlays[`${preset}${this.id}`].icon = this.mob.overlays[`${preset}${this.id}`].icon.replace(
					"2.png",
					`${icodir}.png`
				);
			} else if (
				this.mob.overlays[`${preset}${this.id}`] &&
				this.mob.overlays[`${preset}${this.id}`].icon &&
				this.mob.overlays[`${preset}${this.id}`].icon.search("3.png") !== -1
			) {
				this.mob.overlays[`${preset}${this.id}`].icon = this.mob.overlays[`${preset}${this.id}`].icon.replace(
					"3.png",
					`${icodir}.png`
				);
			} else if (
				this.mob.overlays[`${preset}${this.id}`] &&
				this.mob.overlays[`${preset}${this.id}`].icon &&
				this.mob.overlays[`${preset}${this.id}`].icon.search("4.png") !== -1
			) {
				this.mob.overlays[`${preset}${this.id}`].icon = this.mob.overlays[`${preset}${this.id}`].icon.replace(
					"4.png",
					`${icodir}.png`
				);
			}
		}
	}
	can_accept_item(item: Record<string, any>) {
		if (!has_component(item, "Item")) {
			return false;
		}
		if (this.item) {
			return false;
		}
		if (item.c.Item.slot && !item.c.Item.slot.can_unequip()) {
			return false;
		}
		if (this.props.max_size && this.props.max_size < item.c.Item.size) {
			return false;
		}
		if (this.props.is_hand_slot && this.mob.c.MobInventory.nohold_counter) {
			return false;
		}
		if (this.props.clothing_slot && !has_component(item, this.props.clothing_slot)) {
			return false;
		}
		if (this.props.requires_slot) {
			const rslot = this.mob.c.MobInventory.slots[this.props.requires_slot];
			if (!rslot.item) {
				return false;
			}
			if (rslot.props.clothing_slot) {
				const whitelist =
					rslot.item.c[rslot.props.clothing_slot][`${this.props.requires_slot_prefix || this.id}_whitelist`];
				const blacklist =
					rslot.item.c[rslot.props.clothing_slot][`${this.props.requires_slot_prefix || this.id}_blacklist`];
				if (whitelist) {
					let valid = false;
					for (const comp of whitelist) {
						if (has_component(item, comp)) {
							valid = true;
							break;
						}
					}
					if (!valid) {
						return false;
					}
				}
				if (blacklist) {
					for (const comp of blacklist) {
						if (has_component(item, comp)) {
							return false;
						}
					}
				}
			}
		}
		return true;
	}

	can_unequip() {
		return true;
	}

	equip_or_del(item: Record<string, any>) {
		if (!this.can_accept_item(item)) {
			if (is_atom(item)) {
				item.destroy();
			}
			return;
		}
		this.item = item;
	}

	set visible(value) {
		if (typeof value !== "boolean") {
			throw new TypeError(`Boolean expected, got ${value}`);
		}
		if (value === this[_visible]) {
			return;
		}
		this[_visible] = value;
		if (value) {
			this.mob.c.Eye.screen[`slot_${this.id}`] = this.atom;
			this.mob.c.Eye.screen[`item_in_slot_${this.id}`] = this.item;
		} else {
			this.mob.c.Eye.screen[`slot_${this.id}`] = void 0;
			this.mob.c.Eye.screen[`item_in_slot_${this.id}`] = void 0;
		}
	}
	get visible() {
		return this[_visible];
	}

	get item() {
		return this[_item];
	}
	set item(value) {
		if (!has_component(value, "Item") && typeof value !== "undefined") {
			throw new TypeError(`${value} is not an atom with item component or undefined!`);
		}
		if (this[_item]) {
			if (this.props.clothing_slot) {
				this.mob.overlays[`clothing_${this.id}`] = null;
			}
			this[_item].c.Item[_slot] = void 0;
			this[_item].layer = this.old_item_layer;
			this[_item].screen_loc_x = null;
			this[_item].screen_loc_y = null;
			this[_item].glide_size = 0;
			this[_item].loc = this.mob.fine_loc;
			this.mob.c.Eye.screen[`item_in_slot_${this.id}`] = void 0;
			for (const tslot of Object.values(this.mob.c.MobInventory.slots)) {
				const slot: Record<string, any> = tslot;
				if (slot.props.requires_slot === this.id && slot.can_unequip()) {
					slot.item = null;
				}
			}
		}
		const olditem = this[_item];
		this[_item] = value;
		if (this[_item]) {
			if (this[_item].c.Item[_slot]) {
				this[_item].c.Item[_slot].item = void 0;
				this[_item].loc = this.mob.fine_loc;
			}
			this[_item].loc = this.mob;
			this[_item].c.Item[_slot] = this;
			this.old_item_layer = this[_item].layer;
			this[_item].layer = 31;
			this[_item].screen_loc_x = this.atom.screen_loc_x;
			this[_item].screen_loc_y = this.atom.screen_loc_y;
			if (this.visible) {
				this.mob.c.Eye.screen[`item_in_slot_${this.id}`] = this[_item];
			}
			if (this.props.is_hand_slot && (this[_item].c.Item.inhand_icon_state || this[_item].icon_state)) {
				let icodir = 1;
				if (this.mob) {
					icodir = this.mob.dir;
				}
				if (icodir === 1) {
					icodir = 2;
				} else if (icodir === 2) {
					icodir = 1;
				} else if (icodir === 4) {
					icodir = 3;
				} else if (icodir === 8) {
					icodir = 4;
				}
				this.mob.overlays[`inhand_${this.id}`] = {
					icon_state: this[_item].c.Item.inhand_icon_state,
					icon: `${this[_item].c.Item[`inhand_${this.id}_icon`]}${this[_item].c.Item.inhand_icon_state}/${
						this[_item].c.Item.inhand_icon_state
					}-dir${icodir}.png`,
					overlay_layer: this.props.worn_layer,
				};
			}
			if (this.props.clothing_slot) {
				let icodir = 1;
				if (this.mob) {
					icodir = this.mob.dir;
				}
				if (icodir === 1) {
					icodir = 2;
				} else if (icodir === 2) {
					icodir = 1;
				} else if (icodir === 4) {
					icodir = 3;
				} else if (icodir === 8) {
					icodir = 4;
				}
				this.mob.overlays[`clothing_${this.id}`] = {
					icon_state: this[_item].c[this.props.clothing_slot].worn_icon_state,
					icon: `${this[_item].c[this.props.clothing_slot].worn_icon}${
						this[_item].c[this.props.clothing_slot].worn_icon_state
					}/${this[_item].c[this.props.clothing_slot].worn_icon_state}-dir${icodir}.png`,
					overlay_layer: this.props.worn_layer,
				};
			}
		} else {
			if (this.props.is_hand_slot) {
				this.mob.overlays[`inhand_${this.id}`] = void 0;
			}
		}
		if (olditem) {
			olditem.c.Item.emit("unequipped", this);
		}
		this.emit("item_changed", olditem, value);
		this.mob.c.MobInventory.emit("slot_item_changed", this.id, olditem, value);
		if (this.id === this.mob.c.MobInventory.active_hand) {
			this.mob.c.MobInventory.emit("active_hand_item_changed", olditem, value);
		}
		if (value) {
			value.c.Item.emit("equipped", this);
		}
		if (has_component(this.mob, "LivingMob")) {
			this.mob.c.LivingMob.update_name();
		}
	}
}

MobInventory.depends = ["Mob", "MobHud"];
MobInventory.loadBefore = ["Mob", "MobHud", "LivingMob"];

MobInventory.template = {
	vars: {
		components: {
			MobInventory: {
				nohold_counter: 0,
				handcuffable: false,
				strip_layout: [
					"lhand",
					"rhand",
					null,
					"back",
					null,
					"head",
					"mask",
					"neck",
					"glasses",
					"ears",
					null,
					"oclothing",
					"suit_storage",
					"shoes",
					"gloves",
					"iclothing",
					"belt",
					"storage1",
					"storage2",
					"id",
				],
				strip_names: [
					"left hand",
					"right hand",
					null,
					"Back",
					null,
					"Head",
					"Mask",
					"Neck",
					"Eyes",
					"Ears",
					null,
					"Exosuit",
					"↳Suit Storage",
					"Shoes",
					"Gloves",
					"Uniform",
					"↳Belt",
					"↳Left Pocket",
					"↳Right Pocket",
					"↳ID",
				],
			},
		},
	},
};

class ProgressBar extends Component.Networked {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.add_networked_var("time_begin");
		this.add_networked_var("delay");
		this.add_networked_var("attached_atom_id");
	}
}

ProgressBar.template = {
	vars: {
		icon: "icons/effects/progressbar/",
		name: "progress bar",
		icon_state: "prog_bar_0",
		layer: 50,
	},
};

module.exports.components = {MobInventory, ProgressBar};
