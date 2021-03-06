export{};
const {Component} = require("./../../../code/game/server.js");

class JobLandmark extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		const job_landmarks = this.a.server.job_controller.job_landmarks;
		if (!job_landmarks[this.a.name]) {
			job_landmarks[this.a.name] = [];
		}
		job_landmarks[this.a.name].splice(Math.floor(Math.random() * job_landmarks[this.a.name].length), 0, this.a); // insert this landmark in a random spot in the list.
	}

	destroy() {
		super.destroy();
		const job_landmarks = this.a.server.job_controller.job_landmarks;
		if (!job_landmarks[this.a.name]) {
			return;
		}
		const idx = job_landmarks[this.a.name].indexOf(this.a);
		if (idx !== -1) {
			job_landmarks[this.a.name].splice(idx, 1);
		}
	}
}

JobLandmark.loadBefore = [];
JobLandmark.depends = [];

JobLandmark.template = {
	vars: {
		name: "start",
		icon: "icons/ui/screen_gen/",
		icon_state: "x",
		visible: false,
		layer: 2,
	},
};

module.exports.components = {JobLandmark};
