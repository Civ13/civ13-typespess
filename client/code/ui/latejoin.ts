

class LatejoinPanel {
	panel: any;
	job_elems: any;
	jobs: any;
	department_elems: any;
	constructor(panel: any) {
		this.panel = panel;
		this.panel.on("message", this.handle_message.bind(this));
		this.panel.header_obj.classList.add("center");
		this.panel.content_obj.classList.add("flex-vertical", "wrap");
		this.job_elems = {};
		this.jobs = {};
		this.department_elems = {};

		for (const department of departments) {
			const name = department[0];
			const color = department[1];
			const elem = document.createElement("fieldset");
			elem.classList.add("status-display", "center");
			const legend = document.createElement("legend");
			legend.style.color = color;
			legend.textContent = name;
			elem.appendChild(legend);
			this.panel.content_obj.appendChild(elem);
			this.department_elems[department[0]] = elem;
		}
	}

	handle_message(message: { jobs: { [x: string]: any; }; }) {
		if (message.jobs) {
			for (const id of Object.keys(message.jobs)) {
				const job = this.jobs[id] || {};
				Object.assign(job, message.jobs[id]);
				let elem = this.job_elems[id];
				if (!elem) {
					elem = document.createElement("div");
					this.job_elems[id] = elem;
					const button = document.createElement("div");
					button.classList.add("button");
					button.dataset.message = JSON.stringify({ join: id });
					const department_elem = this.department_elems[
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

const departments = [["Miscellaneous", "#ffffff"]];

module.exports.panel_classes = { LatejoinPanel };