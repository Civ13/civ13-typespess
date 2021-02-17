export{};
const { Component, chain_func } = require("./../../../code/game/server.js");

class MobMovement extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);

		this.intended_walk_dir = 0;
		this.last_axis = 3;

		this.atom.c.Mob.on("keydown", (e: Record<string,any>) => {
			if (!e) {return;}
			if (e.key === "a" || e.key === "ArrowLeft") {
				this.intended_walk_dir |= 8;
				this.last_axis = 12;
			}
			if (e.key === "d" || e.key === "ArrowRight") {
				this.intended_walk_dir |= 4;
				this.last_axis = 12;
			}
			if (e.key === "s" || e.key === "ArrowDown") {
				this.intended_walk_dir |= 2;
				this.last_axis = 3;
			}
			if (e.key === "w" || e.key === "ArrowUp") {
				this.intended_walk_dir |= 1;
				this.last_axis = 3;
			}
			this.update_walk();
		});

		this.atom.c.Mob.on("keyup", (e: Record<string,any>) => {
			if (!e) {return;}
			if (e.key === "a" || e.key === "ArrowLeft") {
				this.intended_walk_dir &= ~8;
			}
			if (e.key === "d" || e.key === "ArrowRight") {
				this.intended_walk_dir &= ~4;
			}
			if (e.key === "s" || e.key === "ArrowDown") {
				this.intended_walk_dir &= ~2;
			}
			if (e.key === "w" || e.key === "ArrowUp") {
				this.intended_walk_dir &= ~1;
			}
			this.update_walk();
		});

		this.a.move = chain_func(this.a.move, this.move.bind(this));

		this.a.c.Mob.on("client_changed", () => {
			this.intended_walk_dir = 0;
			this.update_walk();
		});
	}
	update_walk() {
		let walk_dir = this.intended_walk_dir;
		if (walk_dir & 12 && walk_dir & 3) {walk_dir &= this.last_axis;}
		this.a.walk_dir = walk_dir;
		this.a.walking = !!walk_dir;
	}
	move(prev: any, dx: number, dy: number) {
		let dir = 0;
		if (dx > 0) {dir |= 4;}
		if (dx < 0) {dir |= 8;}
		if (dy > 0) {dir |= 1;}
		if (dy < 0) {dir |= 2;}
		if (dir) {this.a.dir = dir;}
		if (!this.atom.c.SimpleMob) { //lets skip bodyparts if its a simple mob
			for (const tlimb of ["torso", "groin", "l_arm", "r_arm", "l_leg", "r_leg", "r_hand", "l_hand", "r_foot", "l_foot", "head"]) {
				if (this.atom.c.MobBodyParts.limbs[tlimb]) {
					this.atom.c.MobBodyParts.limbs[tlimb].c.BodyPart.update_overlays();}
			}
			for (const i in this.atom.c.MobInventory.slots)  {if (i) {this.atom.c.MobInventory.slots[i].update_icons();}}
	}
		return prev();
	}
}

MobMovement.depends = ["Mob", "Hearer"];
MobMovement.loadBefore = ["Mob"];

module.exports.components = { MobMovement };
