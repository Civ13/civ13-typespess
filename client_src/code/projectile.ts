export{};
const {Component, chain_func} = require("../client/index.js");

class Projectile extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.get_transform = chain_func(this.a.get_transform, this.get_transform.bind(this));
		this.a.get_displacement = chain_func(this.a.get_displacement, this.get_displacement.bind(this));
	}

	get_transform(prev: () => {(): any; new (): any; rotate: {(arg0: number): any; new (): any}}) {
		return prev().rotate(((this.angle - 90) * Math.PI) / 180);
	}

	get_displacement(prev: any, timestamp: number) {
		const dt = timestamp - this.a.client.server_time_to_client - this.last_process;
		let dispx = this.a.x;
		let dispy = this.a.y;
		const dist_to_move = (this.speed * dt) / 1000;
		const rad_angle = (this.angle * Math.PI) / 180;
		dispx += Math.cos(rad_angle) * dist_to_move;
		dispy += Math.sin(rad_angle) * dist_to_move;
		return {dispx, dispy};
	}
}

module.exports.components = {Projectile};
