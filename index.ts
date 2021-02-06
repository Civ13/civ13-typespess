export{};
const Typespess = require("./code/game/server.ts");
const read_config = require("./code/config.ts");
const World = require("./code/game/world.ts");
const Database = require("./code/database.ts");
const { URLSearchParams } = require("url");

const global = require("./src/types/global.d.ts");

console.log("SERVER: Loading game...");

global.Tserver = new Typespess();
global.Tworld = new World(global.Tserver);

global.Tserver.resRoot = "./resources/";

global.Tserver.importModule(require("./code/game/area/area_components.ts"));
global.Tserver.importModule(require("./code/game/area/area.ts"));
global.Tserver.importModule(require("./code/game/components/climbable.ts"));
global.Tserver.importModule(require("./code/game/components/squeak.ts"));
global.Tserver.importModule(require("./code/game/components/wires.ts"));
global.Tserver.importModule(require("./code/game/mobs/mob_movement.ts"));
global.Tserver.importModule(require("./code/game/mobs/new_player.ts"));
global.Tserver.importModule(require("./code/game/mobs/dead/ghost.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/living_defense.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/living.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/simple.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/carbon.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/slip.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/body_parts.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/components.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/head.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/health_doll.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/zones.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/human/human.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/human/human_parts.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/organs/liver.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/organs/lungs.ts"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/organs/organ.ts"));
global.Tserver.importModule(require("./code/game/components/objects/cleanable/blood.ts"));
global.Tserver.importModule(require("./code/game/components/objects/cleanable/cleanable.ts"));
global.Tserver.importModule(require("./code/game/components/objects/doors/door.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/devices/flashlight.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/devices/multitool.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/devices/scanners.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/stacks/sheets/glass.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/stacks/sheets/sheet_types.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/stacks/tiles/tile_types.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/stacks/rods.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/stacks/stack.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/storage/belt.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/storage/boxes.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/storage/toolbox.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/clothing.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/handcuffs.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/storage.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/tools.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items/weaponry.ts"));
global.Tserver.importModule(require("./code/game/components/objects/structures/beds_chairs/chair.ts"));
global.Tserver.importModule(require("./code/game/components/objects/structures/crates_lockers/base.ts"));
global.Tserver.importModule(require("./code/game/components/objects/structures/crates_lockers/closets.ts"));
global.Tserver.importModule(require("./code/game/components/objects/structures/crates_lockers/closets/utility.ts"));
global.Tserver.importModule(require("./code/game/components/objects/structures/wall/walls.ts"));
global.Tserver.importModule(require("./code/game/components/objects/structures/rack.ts"));
global.Tserver.importModule(require("./code/game/components/objects/structures/table_frames.ts"));
global.Tserver.importModule(require("./code/game/components/objects/structures/table.ts"));
global.Tserver.importModule(require("./code/game/components/objects/structures/window.ts"));
global.Tserver.importModule(require("./code/game/components/objects/structures/wild.ts"));
global.Tserver.importModule(require("./code/game/components/objects/buckling.ts"));
global.Tserver.importModule(require("./code/game/components/objects/destructible.ts"));
global.Tserver.importModule(require("./code/game/components/objects/items.ts"));
global.Tserver.importModule(require("./code/game/components/objects/objs.ts"));
global.Tserver.importModule(require("./code/game/components/objects/puller.ts"));
global.Tserver.importModule(require("./code/game/turfs/floor_base.ts"));
global.Tserver.importModule(require("./code/game/placeholders.ts"));
global.Tserver.importModule(require("./code/game/ticker.ts"));
global.Tserver.importModule(require("./code/modules/client/verbs.ts"));
global.Tserver.importModule(require("./code/modules/atoms/objects/clothing/gloves/_gloves.ts"));
global.Tserver.importModule(require("./code/modules/atoms/objects/clothing/head/_head.ts"));
global.Tserver.importModule(require("./code/modules/atoms/objects/clothing/masks/_masks.ts"));
global.Tserver.importModule(require("./code/game/importer.ts"));
global.Tserver.importModule(require("./code/modules/atoms/objects/clothing/under/_under.ts"));
global.Tserver.importModule(require("./code/modules/atoms/objects/clothing/suits/_suits.ts"));
global.Tserver.importModule(require("./code/modules/atoms/objects/clothing/shoes/_shoes.ts"));
global.Tserver.importModule(require("./code/modules/effect_system/sparks.ts"));
global.Tserver.importModule(require("./code/modules/atoms/objects/janitorial/mop.ts"));
global.Tserver.importModule(require("./code/modules/jobs/controller.ts"));
global.Tserver.importModule(require("./code/modules/jobs/landmark.ts"));
global.Tserver.importModule(require("./code/modules/power/cable.ts"));
global.Tserver.importModule(require("./code/modules/power/cell.ts"));
global.Tserver.importModule(require("./code/modules/power/controller.ts"));
global.Tserver.importModule(require("./code/modules/power/lighting.ts"));
global.Tserver.importModule(require("./code/modules/power/machine.ts"));
global.Tserver.importModule(require("./code/modules/power/node.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/ammunition/ammo_casings.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/ammunition/energy.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/boxes_magazines/ammo_boxes.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/boxes_magazines/external_mag.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/guns/ballistic/pistol.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/guns/energy/laser.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/guns/energy/stun.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/guns/ballistic.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/guns/energy.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/projectile/beam.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/projectile/bullets.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/projectile/energy.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/ammunition.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/box_magazine.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/gun.ts"));
global.Tserver.importModule(require("./code/modules/projectiles/projectile.ts"));
global.Tserver.importModule(require("./code/modules/atoms/reagents/containers/open.ts"));
global.Tserver.importModule(require("./code/modules/atoms/reagents/containers/pill.ts"));
global.Tserver.importModule(require("./code/modules/atoms/reagents/containers/spray.ts"));
global.Tserver.importModule(require("./code/modules/atoms/reagents/machinery/chem_dispenser.ts"));
global.Tserver.importModule(require("./code/modules/reagents/holder.ts"));
global.Tserver.importModule(require("./code/modules/smoothing/smoothing.ts"));
global.Tserver.importModule(require("./code/modules/speech/speech.ts"));
global.Tserver.importModule(require("./code/onclick/action.ts"));
global.Tserver.importModule(require("./code/onclick/hud.ts"));
global.Tserver.importModule(require("./code/onclick/interact.ts"));
global.Tserver.importModule(require("./code/onclick/inventory.ts"));
global.Tserver.importModule(require("./code/onclick/screen_objects.ts"));

if(global.is_bs_editor_env) {
	module.exports = global.Tserver;
} else {
	global.Tserver.importModule(require("./code/modules/admin/holder.ts"));
	global.Tserver.importModule(require("./code/modules/admin/menu.ts"));
	global.Tserver.config = read_config("config.cson");
	const finalhandler = require("finalhandler");
	const http = require("http");
	const net = require("net");
	const https = require("https");
	const serveStatic = require("serve-static");
	const fs = require("fs");

	const database = new Database("typespess");

	const server_config = read_config("server.cson");
	const map = server_config.maps.current_map;
	console.log("SERVER: Loading map " + map + "...");
	global.Tserver.station_dim = new Typespess.Dimension(global.Tserver);
	global.Tserver.instance_map_sync(	JSON.parse(fs.readFileSync("maps/" + map + ".bsmap", "utf8")),
		0,
		0,
		0,
		global.Tserver.station_dim
	);

	global.Tserver.on("client_login", (client: { mob: any; }) => {
		if (!client.mob) {
			const mob = new Typespess.Atom(global.Tserver, { components: ["NewPlayer"] });
			mob.c.Mob.client = client;
		}
	});
	console.log("SERVER: Starting server...");

	for (const [key, file] of Object.entries(server_config.http_opts.files)) {
		if (!key || !file) {
			continue;
		}
		server_config.http_opts[key] = fs.readFileSync(file, "utf8");
	}

	if (server_config.gh_login.enabled) {
		global.Tserver.handle_login = function (ws: { send: (arg0: string) => void; removeListener: (arg0: string, arg1: (msg: any) => void) => void; on: (arg0: string, arg1: (msg: any) => void) => void; }) {
			ws.send(JSON.stringify({login_type: "database"}));
			let validated = {value: false, name: "none"};
			const message_handler = (msg: string) => {
				const obj = JSON.parse(msg);
				console.log(obj);
				if (obj.request_check === true) {database.authenticate(obj.name,obj.password).then(function(results: { value: boolean; name: string; }){validated=results;
				if (validated.value === true && validated.name === obj.name) {console.log(`DB AUTH: user "${obj.name}" authorized`);ws.send(JSON.stringify({valid: true, logged_in_as: obj.name, autojoin: true}));}
				else  {console.log(`DB AUTH: user "${obj.name}" denied`);ws.send(JSON.stringify({ valid: false }));}});}

				if (obj.login) {
					const username = obj.login + "";
					ws.removeListener("message",  message_handler);
					this.login(ws, username);
				}
			};
			ws.on("message", message_handler);
		};}

	const serve = serveStatic(global.Tserver.resRoot, { index: ["index.html"] });

	const http_handler = (req: { url: any; }, res: { setHeader: (arg0: string, arg1: string) => void; writeHead: (arg0: number, arg1: { "Content-Type": string; }) => void; write: (arg0: string) => void; end: () => void; }) => {
		const done = finalhandler(req, res);
		const url_obj = new URLSearchParams(req.url);
		if (url_obj.pathname === "/status") {
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.writeHead(200, { "Content-Type": "application/json" });
			const clients = [...Object.keys(global.Tserver.clients)];
			const clients_by_name = [...Object.keys(global.Tserver.clients_by_name)];
			res.write(JSON.stringify({
				player_count: clients.length,
				clients,
				clients_by_name,
			})
			);
			res.end();
		} else {
			serve(req, res, done);
		}
	};
	let http_server: { listen: (arg0: any) => void; };
	if (server_config.https) {
		const proxies = {
			http: http.createServer((req: { headers: { host: string; }; url: string; }, res: { writeHead: (arg0: number, arg1: { Location: string; }) => void; end: () => void; }) => {
				res.writeHead(301, {
					Location: "https://" + req.headers.host + req.url,
				});
				res.end();
			}),
			https: https.createServer(server_config.http_opts, http_handler),
		};
		net
			.createServer((socket: { once: (arg0: string, arg1: (buffer: any) => void) => void; pause: () => void; unshift: (arg0: any) => void; resume: () => void; }) => {
				socket.once("data", (buffer: any[]) => {
					socket.pause();
					const byte = buffer[0];
					const protocol = byte === 22 ? "https" : "http";
					const proxy = proxies[protocol];
					proxy.emit("connection", socket);
					socket.unshift(buffer);
					socket.resume();
				});
			})
			.listen(server_config.port);

		http_server = proxies.https;
	} else {
		http_server = http.createServer(http_handler);
		http_server.listen(server_config.port);
	}

	global.Tserver.startServer({ websocket: { server: http_server } });
	console.log("SERVER: Server started.");

	//schedulers
	global.Tworld.time_scheduler(global.Tworld);
	global.Tworld.season_scheduler(global.Tworld);
	global.Tworld.weather_scheduler(global.Tworld);

	//this signals the continuous integration program to exit.
	const args = process.argv;
	if (args[2] === "test") {
		console.log("test passed.");
		// eslint-disable-next-line no-process-exit
		process.exit(0);}
	}