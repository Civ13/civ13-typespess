export{};
const {Panel, has_component} = require("./../../code/game/server.js");

class StripPanel extends Panel {
	constructor(client: Record<string, any>, {title = "Strip"} = {}) {
		super(client, {width: 440, height: 600, title, can_close: true});
		this.on("message", this.message_handler.bind(this));
		this.on("close", this.closed.bind(this));
		this.on("open", this.opened.bind(this));
		this.slot_item_changed = this.slot_item_changed.bind(this);
	}

	message_handler(msg: Record<string, any>) {
		if (msg.slot && has_component(this.bound_mob, "MobInventory") && !this.cached_covered[msg.slot]) {
			const slot_to_strip = this.bound_atom.c.MobInventory.slots[msg.slot];
			if (!slot_to_strip) {
				return;
			}
			const item_to_strip = slot_to_strip.item;
			if (item_to_strip) {
				this.bound_mob.c.MobInventory.strip_panel_unequip(this.bound_atom, slot_to_strip);
			} else {
				this.bound_mob.c.MobInventory.strip_panel_equip(this.bound_atom, slot_to_strip);
			}
		}
	}
	opened() {
		const layout = this.bound_atom.c.MobInventory.strip_layout;
		const layout_names = this.bound_atom.c.MobInventory.strip_names;
		const covered: Record<string, any> = {};
		const covered_set = this.bound_atom.c.MobInventory.get_covered_slots();
		for (const slotname of Object.keys(this.bound_atom.c.MobInventory.slots)) {
			covered[slotname] = covered_set.has(slotname);
		}
		this.cached_covered = covered;
		const item_names: Record<string, any> = {};
		const item_appearances: Record<string, any> = {};
		for (const [slotname, tslot] of Object.entries(this.bound_atom.c.MobInventory.slots)) {
			const slot: any = tslot;
			if (!slot.item || covered[slotname]) {
				item_names[slotname] = null;
				item_appearances[slotname] = null;
			} else {
				item_names[slotname] = slot.props.visible ? slot.item.name : "Full";
				item_appearances[slotname] = slot.props.visible ? slot.item.network_encode(this.bound_mob) : null;
			}
		}
		this.send_message({
			layout,
			layout_names,
			covered,
			item_names,
			item_appearances,
		});
		this.bound_atom.c.MobInventory.on("slot_item_changed", this.slot_item_changed);
	}
	closed() {
		this.bound_atom.c.MobInventory.removeListener("slot_item_changed", this.slot_item_changed);
	}

	slot_item_changed(slotid: string | number, from: any, to: {name: any; network_encode: (arg0: any) => any}) {
		const slot = this.bound_atom.c.MobInventory.slots[slotid];
		const new_covered_set = this.bound_atom.c.MobInventory.get_covered_slots();
		const new_covered_msg: Record<string, any> = {};
		const new_item_names_msg: Record<string, any> = {};
		const new_item_appearances_msg: Record<string, any> = {};
		for (const [totherslotname, totherslot] of Object.entries(this.bound_atom.c.MobInventory.slots)) {
			const otherslotname: string = totherslotname;
			const otherslot: Record<string, any> = totherslot;
			const new_covered: boolean = new_covered_set.has(otherslotname);
			if (this.cached_covered[otherslotname] !== new_covered) {
				new_covered_msg[otherslotname] = new_covered;
				this.cached_covered[otherslotname] = new_covered;
				if (new_covered) {
					new_item_names_msg[otherslotname] = null;
					new_item_appearances_msg[otherslotname] = null;
				} else {
					const part1 = otherslot.props.visible ? otherslot.item.name : "Full";
					new_item_names_msg[otherslotname] = otherslot.item ? part1 : null;
					new_item_appearances_msg[otherslotname] =
						otherslot.item && otherslot.props.visible
							? otherslot.item.network_encode(this.bound_mob)
							: null;
				}
			}
		}
		if (!new_covered_msg[slotid] && !this.cached_covered[slotid]) {
			const props_visible = slot.props.visible ? to.name : "Full";
			new_item_names_msg[slotid] = to ? props_visible : null;
			new_item_appearances_msg[slotid] = to && slot.props.visible ? to.network_encode(this.bound_mob) : null;
		}
		this.send_message({
			covered: new_covered_msg,
			item_names: new_item_names_msg,
			item_appearances: new_item_appearances_msg,
		});
	}
}

module.exports = StripPanel;
