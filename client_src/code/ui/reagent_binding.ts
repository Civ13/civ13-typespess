export{};
class ReagentBinding {
	elem: any;
	panel: any;
	reagent_elems: Record<string, any>;
	path: any;
	constructor(panel: any, elem: any, props: any) {
		Object.assign(
			this,
			{
				path: "beaker",
			},
			props
		);
		this.elem = elem;
		this.message_handler = this.message_handler.bind(this);
		this.panel = panel;
		this.reagent_elems = {};
		this.panel.on("message", this.message_handler);
		for (const e of this.elem.querySelectorAll(".has-container")) {
			e.style.display = "none";
		}
		for (const e of this.elem.querySelectorAll(".has-no-container")) {
			e.style.display = "visible";
		}
	}

	message_handler(obj: Record<string, any>) {
		for (const split of this.path.split(".")) {
			if (!obj || !Object.prototype.hasOwnProperty.call(obj, split)) {
				return;
			}
			obj = obj[split];
		}
		if (!obj) {this.handle_no_obj_message();}
		else {this.handle_obj_message(obj);}
	}
	handle_no_obj_message() {
		for (const e of this.elem.querySelectorAll(".has-container")) {
			e.style.display = "none";
		}
		for (const e of this.elem.querySelectorAll(".has-no-container")) {
			e.style.display = null;
		}
		for (const e of Object.values(this.reagent_elems)) {
			if (!e) {continue;}
			this.elem.querySelector(".reagents-list").removeChild(e);
		}
		this.reagent_elems = {};
	}

	handle_obj_message(obj: Record<string,any>) {
		for (const e of this.elem.querySelectorAll(".has-container")) {
			e.style.display = null;
		}
		for (const e of this.elem.querySelectorAll(".has-no-container")) {
			e.style.display = "none";
		}

		if (typeof obj.temperature !== "undefined") {
			[...this.elem.querySelectorAll(".temperature")].forEach((item) => {
				item.textContent = +obj.temperature.toFixed(1);
			});
		}
		if (typeof obj.holder_name !== "undefined") {
			[...this.elem.querySelectorAll(".holder-name")].forEach((item) => {
				item.textContent = obj.holder_name;
			});
		}
		if (typeof obj.total_volume !== "undefined") {
			[...this.elem.querySelectorAll(".total-volume")].forEach((item) => {
				item.textContent = obj.total_volume;
			});
		}
		if (typeof obj.maximum_volume !== "undefined") {
			[...this.elem.querySelectorAll(".maximum-volume")].forEach((item) => {
				item.textContent = obj.maximum_volume;
			});
		}

		if (obj.reagents) {
			this.check_reagents(obj);
		}
	}
	check_reagents(obj: Record<string, any>) {
		const reagents_list = this.elem.querySelector(".reagents-list");
		for (const [key, robj] of Object.entries(obj.reagents)) {
			if (!robj) {
				if (this.reagent_elems[key]) {
					reagents_list.removeChild(this.reagent_elems[key]);
					delete this.reagent_elems[key];
				}
				continue;
			}
			let elem = this.reagent_elems[key];
			if (!elem) {
				elem = this.build_entry(/*key, robj*/);
				reagents_list.appendChild(elem);
				this.reagent_elems[key] = elem;
			}
			this.update_entry(key, robj, elem);
		}
	}
	build_entry(/*id, obj*/) {
		const elem = document.createElement("div");
		elem.classList.add("zebrastripe");
		elem.style.padding = "2px 0";
		return elem;
	}
	update_entry(id: any, obj: Record<string, any>, elem: any) {
		elem.textContent = `${+obj.volume.toFixed(2)} unit${obj.volume === 1 ? "" : "s"} of ${obj.name}`;
	}

	close() {
		for (const e of this.elem.querySelectorAll(".has-container")) {
			e.style.display = "none";
		}
		for (const e of this.elem.querySelectorAll(".has-no-container")) {
			e.style.display = "visible";
		}
		this.panel.removeListener("message", this.message_handler);
	}
}

module.exports = ReagentBinding;
