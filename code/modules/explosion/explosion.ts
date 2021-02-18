export{};
const {Sound, has_component, stoplag} = require("./../../../code/game/server.js");

const _ = require("underscore");
const combat_defines = require("../../defines/combat_defines.js");

async function explosion({
	epicenter,
	devastation_range = 0,
	heavy_impact_range = 0,
	light_impact_range = 0,
	flash_range = devastation_range,
	flame_range = light_impact_range,
	silent = false,
}: Record<string, any> = {}) {
	if (!epicenter.dim) {
		// fuck off there's no place to explode into
		return;
	}
	const max_range = Math.max(devastation_range, heavy_impact_range, light_impact_range, flame_range, flash_range);
	const x0 = Math.round(epicenter.x);
	const y0 = Math.round(epicenter.y);
	const z0 = Math.round(epicenter.z);
	const dim = epicenter.dim;

	if (!silent) {
		const far_dist = heavy_impact_range * 5 + devastation_range * 20;
		const emitter = {x: x0, y: y0};
		for (const mob of dim.server.atoms_for_components.Mob) {
			if (mob.dim !== dim) {
				continue;
			}
			const dist = Math.sqrt((x0 - mob.x) ** 2 + (y0 - mob.y) ** 2);
			if (dist <= max_range + 5) {
				new Sound(dim.server, {
					path: "sound/effects/explosion{1-2}.ogg",
					vary: true,
					emitter,
				}).play_to(mob);
			} else if (dist <= far_dist) {
				const far_volume = Math.min(Math.max(far_dist / 100, 0.3), 0.5) * 8;
				new Sound(dim.server, {
					path: "sound/effects/explosionfar.ogg",
					vary: true,
					volume: far_volume,
					emitter,
				}).play_to(mob);
			}
		}
	}

	// word of warning here, the algorithm used here is quite different from byond ss13
	// alright, let's get a bounding box.
	let bbox = [];
	if (max_range === 0) {
		bbox.push([0, 0]);
	} else {
		for (let i = -max_range + 1; i <= max_range - 1; i++) {
			bbox.push([i, max_range]);
			bbox.push([i, -max_range]);
			bbox.push([max_range, i]);
			bbox.push([-max_range, i]);
		}
		bbox.push([-max_range, -max_range]);
		bbox.push([-max_range, max_range]);
		bbox.push([max_range, -max_range]);
		bbox.push([max_range, max_range]);
	}
	bbox = _.shuffle(bbox); // shuffle so that it doesn't look tacky if it lags
	const explosion_block_cache = new Map(); // Stores the explosion block for tiles that have already been exploded
	for (const target of bbox) {
		let ttarget = target;
		const flip_x = ttarget[0] < 0;
		const flip_y = ttarget[1] < 0;
		target[0] = Math.abs(ttarget[0]);
		target[1] = Math.abs(ttarget[1]);
		const flip_xy = ttarget[1] > ttarget[0];
		if (flip_xy) {
			ttarget = [ttarget[1], ttarget[0]];
		}
		const delta_error = ttarget[1] / ttarget[0];
		let flipped_dy = 0;
		let error = 0;
		let accumulated_explosion_block = 0;
		// alright, time to cast a ray!
		for (let flipped_dx = 0; flipped_dx <= target[0]; flipped_dx++) {
			let dx = flip_xy ? flipped_dy : flipped_dx;
			if (flip_x) {
				dx = -dx;
			}
			let dy = flip_xy ? flipped_dx : flipped_dy;
			if (flip_y) {
				dy = -dy;
			}
			const tile = dim.location(x0 + dx, y0 + dy, z0);
			if (explosion_block_cache.has(tile)) {
				// This tile has already been done, add explosion block and move on
				accumulated_explosion_block += explosion_block_cache.get(tile);
			} else {
				await stoplag();
				// first check if it's too far away
				let dist = accumulated_explosion_block + Math.sqrt(dx * dx + dy * dy) - 0.5;
				if (dist > max_range) {
					break;
				} // we don't need to cast any more rays.
				let this_explosion_block = 0;
				for (const obj of tile.partial_contents) {
					if (has_component(obj, "Tangible")) {
						this_explosion_block += obj.c.Tangible.explosion_block;
					}
				}
				accumulated_explosion_block += this_explosion_block;
				dist += this_explosion_block;
				explosion_block_cache.set(tile, this_explosion_block);
				if (dist > max_range) {
					break;
				}
				let explode_power = combat_defines.EXPLODE_NONE;
				if (dist < devastation_range) {
					explode_power = combat_defines.EXPLODE_DEVASTATE;
				} else if (dist < heavy_impact_range) {
					explode_power = combat_defines.EXPLODE_HEAVY;
				} else if (dist < light_impact_range) {
					explode_power = combat_defines.EXPLODE_LIGHT;
				}

				if (explode_power > combat_defines.EXPLODE_NONE) {
					const sorted_contents = [...tile.contents];
					sorted_contents.sort((a, b) => {
						return b.layer - a.layer;
					});
					for (const obj of sorted_contents) {
						if (has_component(obj, "Tangible")) {
							obj.c.Tangible.ex_act(explode_power);
						}
					}
				}
			}
			error += delta_error;
			if (error >= 0.5) {
				flipped_dy++;
				error--;
			}
		}
	}
}

explosion.dyn_explosion = function dyn_explosion({
	epicenter = null,
	power = null,
	flash_range = 0.25,
	admin_log = true,
	ignore_cap = true,
	flame_range = 0,
	silent = false,
	smoke = true,
} = {}) {
	if (!power) {return;}
	const range = Math.round(Math.sqrt(2 * power));
	explosion({
		epicenter,
		devastation_range: Math.round(range * 0.25),
		heavy_impact_range: Math.round(range * 0.5),
		light_impact_range: range,
		flash_range: Math.round(flash_range * range),
		admin_log,
		ignore_cap,
		flame_range: Math.round(flame_range * range),
		silent,
		smoke,
	});
};

module.exports = explosion;
