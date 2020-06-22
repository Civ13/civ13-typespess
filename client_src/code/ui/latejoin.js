

class LatejoinPanel {
	constructor(panel) {
		this.panel = panel;
		this.panel.on("message", this.handle_message.bind(this));
		this.panel.header_obj.classList.add("center");
		this.panel.content_obj.classList.add("flex-vertical", "wrap");
		this.job_elems = {};
		this.jobs = {};
		this.department_elems = {};

		for (let department of Object.keys(departments)) {
			let { name, color } = departments[department];
			let elem = document.createElement("fieldset");
			elem.classList.add("status-display", "center");
			let legend = document.createElement("legend");
			legend.style.color = color;
			legend.textContent = name;
			elem.appendChild(legend);
			this.panel.content_obj.appendChild(elem);
			this.department_elems[department] = elem;
		}
	}

	handle_message(message) {
		if (message.jobs) {
			for (let id of Object.keys(message.jobs)) {
				let job = this.jobs[id] || {};
				Object.assign(job, message.jobs[id]);
				let elem = this.job_elems[id];
				if (!elem) {
					elem = document.createElement("div");
					this.job_elems[id] = elem;
					let button = document.createElement("div");
					button.classList.add("button");
					button.dataset.message = JSON.stringify({ join: id });
					let department_elem = this.department_elems[
						job.departments[0] || "misc"
					];
					if (job.departments.lastIndexOf("command") > 0) {
						button.style.fontWeight = "bold";
						department_elem.insertBefore(elem, department_elem.firstChild);
					} else {
						department_elem.appendChild(elem);
					}
					elem.appendChild(button);
					elem.button = button;
				}
				elem.button.textContent = `${job.title} (${job.current_positions}/${
					job.total_positions != -1 ? job.total_positions : "∞"
				})`;
				if (
					job.current_positions >= job.total_positions && job.total_positions != -1
				) {
					elem.style.display = "none";
				} else {
					elem.style.display = "block";
				}
			}
		}
	}
}

const departments = {
	misc: {
		name: "Miscellaneous",
		color: "#ffffff",
	},
};

module.exports.panel_classes = { LatejoinPanel };
