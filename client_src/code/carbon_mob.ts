export{};
const {Component, chain_func} = require("../client/index.js");

class CarbonMob extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.a.get_transform = chain_func(this.a.get_transform, this.get_transform.bind(this));
		this.last_timestamp = 0;
		this.lying_direction = -1;
		this.interpolated_lying = this.lying ? 1 : 0;

		this.last_jitter = -Infinity;
		this.last_jitter_x = 0;
		this.last_jitter_y = 0;
	}

	get_transform(prev: () => any, timestamp: number) {
		let transform = prev();
		const timestamp_diff = timestamp - this.last_timestamp;
		if (timestamp_diff > 0) {
			if (this.lying) {
				if (this.interpolated_lying === 0) {
					this.lying_direction = Math.random() < 0.5 ? 1 : -1;
				}
				this.interpolated_lying = Math.min(this.interpolated_lying + timestamp_diff / 150, 1);
			} else {
				this.interpolated_lying = Math.max(this.interpolated_lying - timestamp_diff / 150, 0);
			}
			this.last_timestamp = timestamp;
		}
		transform = transform
			.translate(0, -this.interpolated_lying * 0.1875)
			.rotate(this.lying_direction * this.interpolated_lying * Math.PI * 0.5);
		const jitter_diff = timestamp - this.last_jitter;
		if (jitter_diff < 2400) {
			const curr_amt = Math.abs(((((jitter_diff / 200 - 1) % 2) + 2) % 2) - 1);
			transform = transform.translate(
				Math.round(this.last_jitter_x * curr_amt * 32) / 32,
				Math.round(this.last_jitter_y * curr_amt * 32) / 32
			);
		}
		if (this.jitteriness && jitter_diff >= 2000) {
			const amplitude = Math.min(4, this.jitteriness / 100 + 1) / 32;
			this.last_jitter_x = (Math.random() - 0.5) * amplitude * 2;
			this.last_jitter_y = (Math.random() - 0.5) * amplitude * 6;
			this.last_jitter = timestamp;
		}
		return transform;
	}
}

module.exports.components = {CarbonMob};
