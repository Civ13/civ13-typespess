class LightingObject extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.atom.draw = this.draw.bind(this);
		this.atom.get_bounds = this.get_bounds.bind(this);
		this.atom.on_render_tick = this.on_render_tick.bind(this);
		this.atom.is_mouse_over = () => {
			return false;
		};
		this.atom.get_plane_id = () => {
			return "lighting";
		};
		this.canvas = document.createElement("canvas");
		this.random_angle_offset = Math.random();

		this.soft_shadow_radius = 1 / 8;
	}

	on_render_tick(timestamp: any) {
		const disp = this.a.get_displacement(timestamp);
		if (this.color != this.last_color) {
			this.dirty = true;
		} else if (this.radius != this.last_radius) {
			this.dirty = true;
		} else if (this.shadows_list != this.last_shadows_list) {
			this.dirty = true;
		} else if (
			!this.last_disp || this.last_disp.dispx != disp.dispx || this.last_disp.dispy != disp.dispy
		) {
			this.dirty = true;
		} else if (this.a.client.soft_shadow_resolution != this.last_resolution) {
			this.random_angle_offset = Math.random();
			this.dirty = true;
		}
		if (this.dirty) this.a.mark_dirty();

		this.last_color = this.color;
		this.last_radius = this.radius;
		this.last_shadows_list = this.shadows_list;
		this.last_disp = disp;
	}

	get_bounds() {
		return {
			x: -this.radius,
			y: -this.radius,
			width: this.radius * 2 + 1,
			height: this.radius * 2 + 1,
		};
	}

	draw(ctx: { globalCompositeOperation: string; drawImage: (arg0: any, arg1: number, arg2: number) => void; }, timestamp: any) {
		if (
			this.atom.screen_loc_x != null || this.radius !== +this.radius || !this.enabled
		)
			return;

		if (this.dirty) {
			this.last_resolution = this.a.client.soft_shadow_resolution;
			this.canvas.width = 32 + this.radius * 64;
			this.canvas.height = 32 + this.radius * 64;
			const bctx = this.canvas.getContext("2d");
			bctx.fillStyle = "black";
			bctx.fillRect(0, 0, bctx.width, bctx.height);

			const c = this.canvas.width * 0.5;

			let { dispx, dispy } = this.atom.get_displacement(timestamp);
			dispx = Math.round(dispx * 32) / 32;
			dispy = Math.round(dispy * 32) / 32;
			if (dispx != +dispx || dispy != +dispy) return;

			const sample_points = [];
			if (
				this.soft_shadow_radius <= 0 ||
		this.a.client.soft_shadow_resolution <= 1
			) {
				sample_points.push([dispx, dispy]);
			} else {
				for (let i = 0; i < this.a.client.soft_shadow_resolution; i++) {
					const angle =
			((i + this.random_angle_offset) * Math.PI * 2) /
			this.a.client.soft_shadow_resolution;
					sample_points.push([
						dispx + Math.cos(angle) * this.soft_shadow_radius,
						dispy + Math.sin(angle) * this.soft_shadow_radius,
					]);
				}
			}

			bctx.fillStyle = "black";
			bctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			const rgb = Math.ceil(255 / sample_points.length);
			bctx.fillStyle = `rgb(${rgb},${rgb},${rgb})`;
			bctx.globalCompositeOperation = "lighter";

			for (let i = 0; i < sample_points.length; i++) {
				const [point_x, point_y] = sample_points[i];
				const cx = c + Math.round((point_x - dispx) * 32);
				const cy = c - Math.round((point_y - dispy) * 32);
				const wall_offset_x = Math.round(-16 - point_x * 32);
				const wall_offset_y = Math.round(16 + point_y * 32);
				const walls = [];
				for (const shadow of this.shadows_list) {
					const wall: { x1: number; y1: number; x2: number; y2: number; base_width: number; base_height: number; used_horizontally: boolean; used_vertically: boolean; dist: number;} = {x1: 0, y1: 0, x2: 0, y2: 0, base_width: 32, base_height: 32, used_horizontally: false, used_vertically: false, dist: 0};
					wall.x1 = shadow.x1 * 32 + wall_offset_x;
					wall.y1 = -shadow.y2 * 32 + wall_offset_y;
					wall.x2 = shadow.x2 * 32 + wall_offset_x;
					wall.y2 = -shadow.y1 * 32 + wall_offset_y;
					wall.base_width = wall.x2 - wall.x1;
					wall.base_height = wall.y2 - wall.y1;
					wall.used_horizontally = false;
					wall.used_vertically = false;
					if (wall.x1 < 0 && wall.y1 < 0 && wall.x2 > 0 && wall.y2 > 0)
						continue;
					let hdist = Math.min(Math.abs(wall.x1), Math.abs(wall.x2));
					let vdist = Math.min(Math.abs(wall.y1), Math.abs(wall.y2));
					if (wall.x1 <= 0 && wall.x2 >= 0) hdist = 0;
					if (wall.y1 <= 0 && wall.y2 >= 0) vdist = 0;
					wall.dist = hdist + vdist;
					walls.push(wall);
				}

				walls.sort((a, b) => {
					return a.dist - b.dist;
				});

				for (let j = 0; j < walls.length; j++) {
					const wall1 = walls[j];
					if (wall1.used_horizontally || wall1.used_vertically) {
						continue;
					}
					for (let k = j + 1; k < walls.length; k++) {
						const wall2 = walls[k];
						if (wall2.used_vertically && wall2.used_horizontally) {
							continue;
						}
						if (
							(wall1.x1 > 0 &&
				wall1.x1 == wall2.x1 &&
				(wall1.y1 == wall2.y2 || wall1.y2 == wall2.y1)) || (wall1.y1 > 0 &&
				wall1.y1 == wall2.y1 &&
				(wall1.x1 == wall2.x2 || wall1.x2 == wall2.x1)) || (wall1.x2 < 0 &&
				wall1.x2 == wall2.x2 &&
				(wall1.y1 == wall2.y2 || wall1.y2 == wall2.y1)) || (wall1.y2 < 0 &&
				wall1.y2 == wall2.y2 &&
				(wall1.x1 == wall2.x2 || wall1.x2 == wall2.x1))
						) {
							if (wall1.x1 == wall2.x1 || wall1.x2 == wall2.x2) {
								if (wall2.used_vertically) continue;
								wall2.used_vertically = true;
							}
							if (wall1.y1 == wall2.y1 || wall1.y2 == wall2.y2) {
								if (wall2.used_horizontally) continue;
								wall2.used_horizontally = true;
							}
							wall1.x1 = Math.min(wall1.x1, wall2.x1);
							wall1.y1 = Math.min(wall1.y1, wall2.y1);
							wall1.x2 = Math.max(wall1.x2, wall2.x2);
							wall1.y2 = Math.max(wall1.y2, wall2.y2);
						}
					}
				}

				bctx.beginPath();
				for (const wall of walls) {
					if (wall.used_horizontally || wall.used_vertically) continue;
					let sx = 1;
					let sy = 1;
					let flip = false;
					let x1 = wall.x1;
					let y1 = wall.y1;
					let x2 = wall.x2;
					let y2 = wall.y2;
					const path = []; // So if I'm batching this all together the whole thing has to be one direction otherwise weird winding rule stuff happens
					if (wall.x2 < 0) {
						sx = -1;
						[x1, x2] = [-x2, -x1];
					}
					if (wall.y2 < 0) {
						sy = -1;
						[y1, y2] = [-y2, -y1];
					}
					if (x1 <= 0 && x2 >= 0) {
						flip = sx != sy;
						path.push([cx + x1 * sx, cy + (y1 + wall.base_height) * sy]);
						path.push([cx + x1 * sx, cy + y1 * sy]);
						let scalar = (this.radius * 32 + 48) / y1;
						path.push([cx + x1 * sx * scalar, cy + y1 * sy * scalar]);
						scalar = (this.radius * 32 + 48) / y1;
						path.push([cx + x2 * sx * scalar, cy + y1 * sy * scalar]);
						path.push([cx + x2 * sx, cy + y1 * sy]);
						path.push([cx + x2 * sx, cy + (y1 + wall.base_height) * sy]);
					} else if (y1 <= 0 && y2 >= 0) {
						flip = sx == sy;
						path.push([cx + (x1 + wall.base_width) * sx, cy + y1 * sy]);
						path.push([cx + x1 * sx, cy + y1 * sy]);
						let scalar = (this.radius * 32 + 48) / x1;
						path.push([cx + x1 * sx * scalar, cy + y1 * sy * scalar]);
						scalar = (this.radius * 32 + 48) / x1;
						path.push([cx + x1 * sx * scalar, cy + y2 * sy * scalar]);
						path.push([cx + x1 * sx, cy + y2 * sy]);
						path.push([cx + (x1 + wall.base_width) * sx, cy + y2 * sy]);
					} else {
						flip = sx != sy;
						path.push([
							cx + (x1 + wall.base_width) * sx,
							cy + (y1 + wall.base_height) * sy,
						]);
						path.push([cx + (x1 + wall.base_width) * sx, cy + y2 * sy]);
						path.push([cx + x1 * sx, cy + y2 * sy]);

						let scalar = (this.radius * 32 + 48) / Math.max(x1, y2);
						path.push([cx + x1 * sx * scalar, cy + y2 * sy * scalar]);

						path.push([
							cx + (this.radius * 32 + 48) * sx,
							cy + (this.radius * 32 + 48) * sy,
						]);

						scalar = (this.radius * 32 + 48) / Math.max(x2, y1);
						path.push([cx + x2 * sx * scalar, cy + y1 * sy * scalar]);

						path.push([cx + x2 * sx, cy + y1 * sy]);
						path.push([cx + x2 * sx, cy + (y1 + wall.base_height) * sy]);
					}
					if (!flip) {
						// draw it in a way that makes sure it winds in the right direction
						for (let i = 0; i < path.length; i++) {
							if (i == 0) bctx.moveTo(path[i][0], path[i][1]);
							else bctx.lineTo(path[i][0], path[i][1]);
						}
					} else {
						for (let i = path.length - 1; i >= 0; i--) {
							if (i == path.length - 1) bctx.moveTo(path[i][0], path[i][1]);
							else bctx.lineTo(path[i][0], path[i][1]);
						}
					}
					bctx.closePath();
				}
				bctx.fill();
			}

			bctx.fillStyle = "white";
			bctx.globalCompositeOperation = "difference";
			bctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			bctx.globalCompositeOperation = "multiply";

			const gradient = bctx.createRadialGradient(c, c, 0, c, c, c);
			gradient.addColorStop(0, this.color);
			gradient.addColorStop(1, "black");
			bctx.fillStyle = gradient;
			bctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			bctx.globalCompositeOperation = "source-over";

			this.dirty = false;
		}

		ctx.globalCompositeOperation = "lighter";
		ctx.drawImage(this.canvas, -this.radius * 32, -this.radius * 32);
		ctx.globalCompositeOperation = "source-over";
	}
}

module.exports.components = { LightingObject };