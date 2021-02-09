export{};
const { Component, has_component } = require("./../../../code/game/server.js");

const layers = require("../../defines/layers.js");

const _areas = Symbol("_areas");
const _area = Symbol("_area");
const _area_brushes = Symbol("_area_brushes");

class Area extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.area_brushes = new Set();
		this.touching = new Set();
		this.a.once("map_instanced", (map) => {
			if (!this.map_id) {return;}
			map[_areas] = map[_areas] || {};
			map[_areas][this.map_id] = this.a;
		});
	}
}

Area.template = {
	vars: {
		components: {
			Area: {
				brush_icon: "icons/effects/areas/",
				brush_icon_state: "unknown",
				map_id: null,
			},
		},
		name: "Area",
		icon: "icons/effects/areas/",
		icon_state: "x1",
		visible: false,
		layer: layers.BELOW_AREA_LAYER,
	},
};

Area.update_map_instance = function (instobj) {
	const id = instobj.computed_vars.components.Area.map_id;
	if (!id) {return;}
	instobj.map[_areas] = instobj.map[_areas] || {};
	instobj.map[_areas][id] = instobj;
	if (!instobj.map[_area_brushes] || !instobj.map[_area_brushes][id]) {return;}
	for (const brush of instobj.map[_area_brushes][id]) {
		brush.client_atom.icon = instobj.computed_vars.components.Area.brush_icon;
		brush.client_atom.icon_state =
	instobj.computed_vars.components.Area.brush_icon_state;
	}
};

class AreaBrush extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this[_area] = null;
		this.a.once("map_instance_done", (map) => {
			if (!this.map_id) {return;}
			map[_areas] = map[_areas] || {};
			const area = map[_areas][this.map_id];
			if (area) {
				this.assign_area(area);
			} else {
				throw new Error(`Cannot find area of id ${this.map_id}`);
			}
		});
		this.a.on("crossed", this.crossed.bind(this));
		this.a.on("crossed_by", this.crossed.bind(this));
		this.a.on("uncrossed", this.uncrossed.bind(this));
		this.a.on("uncrossed_by", this.uncrossed.bind(this));
	}

	crossed(atom) {
		if (!this.area) {return;}
		if (!this.area.c.Area.touching.has(atom)) {
			this.area.c.Area.touching.add(atom);
			this.area.c.Area.emit("start_touch", atom);
			atom.emit("start_touch_area", this.area);
		}
	}

	uncrossed(atom) {
		if (!this.area) {return;}
		for (const brush of atom.crosses()) {
			if (
				has_component(brush, "AreaBrush") &&
		brush.c.AreaBrush.area === this.area
			)
				{return;}
		}
		this.area.c.Area.touching.delete(atom);
		this.area.c.Area.emit("end_touch", atom);
		atom.emit("end_touch_area", this.area);
	}

	assign_area(area) {
		if (this.area)
			{throw new Error("This brush already has an area associated with it!");}
		this[_area] = area;
		area.c.Area.area_brushes.add(this.a);
		for (const atom of this.a.crosses()) {this.crossed(atom);}
	}

	get area() {
		return this[_area];
	}

	destroy() {
		super.destroy();
		if (this.area) {this.area.area_brushes.delete(this.a);}
	}
}

AreaBrush.template = {
	vars: {
		components: {
			AreaBrush: {
				map_id: null,
			},
		},
		icon: "icons/effects/areas/",
		icon_state: "unknown",
		visible: false,
		layer: layers.BELOW_AREA_LAYER,
	},
};

AreaBrush.update_map_instance = function (instobj) {
	const id = instobj.computed_vars.components.AreaBrush.map_id;
	if (!id) {return;}
	instobj.map[_area_brushes] = instobj.map[_area_brushes] || {};
	instobj.map[_area_brushes][id] = instobj.map[_area_brushes][id] || new Set();
	instobj.map[_area_brushes][id].add(instobj);
	const area = instobj.map[_areas] && instobj.map[_areas][id];
	if (area) {
		instobj.client_atom.icon = area.computed_vars.components.Area.brush_icon;
		instobj.client_atom.icon_state =
	area.computed_vars.components.Area.brush_icon_state;
	}
};

module.exports.templates = {
	area: {
		components: ["Area", "AreaAmbience", "AreaPower"],
		tree_paths: ["areas"],
	},
	area_outside: {
		components: ["Area", "AreaAmbience", "AreaPower"],
		tree_paths: ["areas/outside"],
		vars: {
			components: {
				AreaPower: {
					infinite_power: true,
				},
			},
		},
	},
	area_outside_arrivals: {
		components: ["Area", "AreaAmbience", "AreaArrivals", "AreaPower"],
		tree_paths: ["areas/outside/arrivals"],
		vars: {
			components: {
				AreaPower: {
					infinite_power: true,
				},
			},
		},
	},
	area_arrivals: {
		components: [
			"Area",
			"AreaAmbience",
			"AreaArrivals",
			"AreaPower",
		],
		vars: {
			components: {
				AreaPower: {
					infinite_power: true,
				},
			},
		},
		tree_paths: ["areas/arrivals"],
	},
	area_brush: {
		components: ["AreaBrush"],
		tree_paths: ["areas/brush"],
	},
};

module.exports.components = { Area, AreaBrush };
module.exports.symbols = { _areas };
