"use strict";
const _ = require("underscore");

class JobController {
	constructor(server) {
		this.server = server;
		this.jobs = {};
		this.unassigned = new Set();
		this.assigned = new Set(); // those assigned roles that spawn on the station.
		this.job_landmarks = {};

		this.importModule(require("./job_types/nomad.ts"));
	}

	assign_role(mind, job, { latejoin = false, run_checks = true } = {}) {
		if (run_checks && !this.can_be_job(mind, job, { latejoin })) {return false;}
		job.current_positions++;
		this.unassigned.delete(mind);
		if (!latejoin) {this.assigned.add(mind);}
		mind.assigned_role = job;
		return true;
	}

	reject_player(mind) {
		// oof
		// TODO make antags not
		this.unassigned.delete(mind);
	}

	// Okay tg was being really retarded and put the same list of checks literally everwhere
	// so I'm doing this to avoid that bullshit
	can_be_job(mind, job, { latejoin = false } = {}) {
		if (mind.restricted_roles.has(job.id)) {return false;}
		if (
			latejoin &&
	job.total_positions !== -1 &&
	job.current_positions > job.total_positions
		)
			{return false;}
		if (
			!latejoin &&
	job.spawn_positions !== -1 &&
	job.current_positions > job.spawn_positions
		)
			{return false;}
		return true;
	}

	find_occupation_candidates(job, level) {
		const candidates = [];
		if (
			job.spawn_positions !== -1 &&
	job.current_positions > job.spawn_positions
		)
			{return candidates;} // this ain't gonna be useful so let's get out of here.
		for (const mind of this.unassigned) {
			if (!this.can_be_job(mind, job)) {continue;}
			if (mind.character_preferences.job_preferences[job.id] >= level)
				{candidates.push(mind);}
		}
		return candidates;
	}

	give_random_job(mind) {
		for (const job of _.shuffle(Object.values(this.jobs))) {
			if (
				job &&
		job.id !== "nomad" &&
		!job.departments.includes("command") &&
		this.can_be_job(mind, job)
			) {
				if (this.assign_role(mind, job)) {return true;}
			}
		}
		return false;
	}

	importModule(mod) {
		if (mod) {
			if (mod.jobs) {
				for (const [id, job] of Object.entries(mod.jobs)) {
					if (this.jobs[id]) {throw new Error(`Job '${id}' defined!`);}
					this.jobs[id] = job;
					job.id = id;
				}
			}
		}
	}

	divide_occupations() {
		if (this.unassigned.size === 0) {return false;}

		// people who want to be assistants, sure, go on.
		for (const candidate of this.find_occupation_candidates(this.jobs.nomad,1)) {
			this.assign_role(candidate, this.jobs.nomad);
		}
		for (const level of [3, 2, 1]) {
			for (const mind of _.shuffle([...this.unassigned])) {
				for (const job of _.shuffle(Object.values(this.jobs))) {
					if (!job) {continue;}
					if (!this.can_be_job(mind, job)) {continue;}
					if (mind.character_preferences.job_preferences[job.id] >= level) {
						this.assign_role(mind, job);
						break;
					}
				}
			}
		}
		// Hand out random jobs to those who didn't in the last check
		// also makes sure to get their preference correct

		for (const mind of [...this.unassigned]) {
			if (
				!this.can_be_job(mind, this.jobs.nomad) &&
		mind.character_preferences.jobless_role !== "none"
			)
				{this.give_random_job(mind);} // you get to roll for random before everyone else just to be sure you don't get assistant. you're so speshul
		}
		for (const mind of [...this.unassigned]) {
			if (mind.character_preferences.jobless_role === "random")
				{this.give_random_job(mind);}
		}

		// for those who wanted to be assistant
		for (const mind of [...this.unassigned]) {
			if (mind.character_preferences.jobless_role === "nomad")
				{this.assign_role(mind, this.jobs.nomad);}
			else {this.reject_player(mind);}
		}

		for (const mind of [...this.unassigned]) {
			//Players that wanted to back out but couldn't because they're antags (can you feel the edge case?)
			if (!this.give_random_job(mind)) {
				// try a random one
				// now for the greatest edge case:
				// you rolled antag, *and* you're jobbanned from assistant *and* you can't get literally any other job
				// you may now feel good about being the greatest edge case in the history of edge cases.
				// oh yeah and just this once you get to be assistant even though you're jobbanned. edge case.
				this.assign_role(mind, this.jobs.nomad, { run_checks: false }); // run_checks = false, because you *NEED A FUCKING JOB DAMN IT ALL ANTAGS NEED JOBS*
			}
		}
		return true;
	}

	send_to_atom(mob, atom) {
		if (!atom) {return;}
		if (atom.is_base_loc || atom.is_fine_loc) {mob.loc = atom;}
		else {mob.loc = atom.base_mover.fine_loc;}
		mob.force_move(atom.x, atom.y, atom.y, mob.server.station_dim);
	}

	send_to_late_join(mob) {
		if (this.arrivals_area) {
			mob.force_move(0,0,0, mob.server.station_dim);
		}
	}

	send_to_spawn(mob,job_desc) {
		const landmarks_list = this.job_landmarks[job_desc];
		if (landmarks_list && landmarks_list.length) {
			const landmark = landmarks_list.shift(); // we rotate through the landmarks. If we have more jobs than landmarks, I guess people can spawn on top of each other.
			landmarks_list.push(landmark);
			this.send_to_atom(mob, landmark);
		} else {
			this.send_to_late_join(mob);
		}
	}
}

module.exports.now = function (server) {
	server.job_controller = new JobController(server);
};
