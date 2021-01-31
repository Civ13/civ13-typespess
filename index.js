const Typespess = require("./code/game/server.js");
const read_config = require("./code/config.js");
const World = require("./code/game/world.js");
const Database = require("./code/database.ts");

console.log("SERVER: Loading game...");

global.Tserver = new Typespess();
global.Tworld = new World(Tserver);

global.Tserver.resRoot = "./resources/";

global.Tserver.config = read_config("config.cson");

global.Tserver.importModule(require("./code/game/area/area_components.js"));
global.Tserver.importModule(require("./code/game/area/area.js"));
global.Tserver.importModule(require("./code/game/components/climbable.js"));
global.Tserver.importModule(require("./code/game/components/squeak.js"));
global.Tserver.importModule(require("./code/game/components/wires.js"));
global.Tserver.importModule(require("./code/game/mobs/mob_movement.js"));
global.Tserver.importModule(require("./code/game/mobs/new_player.js"));
global.Tserver.importModule(require("./code/game/mobs/dead/ghost.js"));
global.Tserver.importModule(require("./code/game/mobs/living/living_defense.js"));
global.Tserver.importModule(require("./code/game/mobs/living/living.js"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/carbon.js"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/slip.js"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/body_parts.js"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/components.js"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/head.js"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/health_doll.js"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/zones.js"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/human/human.js"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/human/human_parts.js"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/organs/liver.js"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/organs/lungs.js"));
global.Tserver.importModule(require("./code/game/mobs/living/carbon/organs/organ.js"));
global.Tserver.importModule(require("./code/game/components/objects/cleanable/blood.js"));
global.Tserver.importModule(require("./code/game/components/objects/cleanable/cleanable.js"));
global.Tserver.importModule(require("./code/game/components/objects/doors/door.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/devices/flashlight.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/devices/multitool.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/devices/scanners.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/stacks/sheets/glass.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/stacks/sheets/sheet_types.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/stacks/tiles/tile_types.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/stacks/rods.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/stacks/stack.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/storage/belt.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/storage/boxes.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/storage/toolbox.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/clothing.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/handcuffs.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/storage.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/tools.js"));
global.Tserver.importModule(require("./code/game/components/objects/items/weaponry.js"));
global.Tserver.importModule(require("./code/game/components/objects/structures/beds_chairs/chair.js"));
global.Tserver.importModule(require("./code/game/components/objects/structures/crates_lockers/base.js"));
global.Tserver.importModule(require("./code/game/components/objects/structures/crates_lockers/closets.js"));
global.Tserver.importModule(require("./code/game/components/objects/structures/crates_lockers/closets/utility.js"));
global.Tserver.importModule(require("./code/game/components/objects/structures/wall/walls.js"));
global.Tserver.importModule(require("./code/game/components/objects/structures/rack.js"));
global.Tserver.importModule(require("./code/game/components/objects/structures/table_frames.js"));
global.Tserver.importModule(require("./code/game/components/objects/structures/table.js"));
global.Tserver.importModule(require("./code/game/components/objects/structures/window.js"));
global.Tserver.importModule(require("./code/game/components/objects/structures/wild.js"));
global.Tserver.importModule(require("./code/game/components/objects/buckling.js"));
global.Tserver.importModule(require("./code/game/components/objects/destructible.js"));
global.Tserver.importModule(require("./code/game/components/objects/items.js"));
global.Tserver.importModule(require("./code/game/components/objects/objs.js"));
global.Tserver.importModule(require("./code/game/components/objects/puller.js"));
global.Tserver.importModule(require("./code/game/turfs/floor_base.js"));
global.Tserver.importModule(require("./code/game/placeholders.js"));
global.Tserver.importModule(require("./code/game/ticker.js"));
global.Tserver.importModule(require("./code/modules/admin/holder.js"));
global.Tserver.importModule(require("./code/modules/admin/menu.js"));
global.Tserver.importModule(require("./code/modules/client/verbs.js"));
global.Tserver.importModule(require("./code/modules/atoms/objects/clothing/gloves/_gloves.js"));
global.Tserver.importModule(require("./code/modules/atoms/objects/clothing/head/_head.js"));
global.Tserver.importModule(require("./code/modules/atoms/objects/clothing/masks/_masks.js"));
global.Tserver.importModule(require("./code/game/importer.js"));
global.Tserver.importModule(require("./code/modules/atoms/objects/clothing/under/_under.js"));
global.Tserver.importModule(require("./code/modules/atoms/objects/clothing/suits/_suits.js"));
global.Tserver.importModule(require("./code/modules/atoms/objects/clothing/shoes/_shoes.js"));
global.Tserver.importModule(require("./code/modules/effect_system/sparks.js"));
global.Tserver.importModule(require("./code/modules/atoms/objects/janitorial/mop.js"));
global.Tserver.importModule(require("./code/modules/jobs/controller.js"));
global.Tserver.importModule(require("./code/modules/jobs/landmark.js"));
global.Tserver.importModule(require("./code/modules/power/cable.js"));
global.Tserver.importModule(require("./code/modules/power/cell.js"));
global.Tserver.importModule(require("./code/modules/power/controller.js"));
global.Tserver.importModule(require("./code/modules/power/lighting.js"));
global.Tserver.importModule(require("./code/modules/power/machine.js"));
global.Tserver.importModule(require("./code/modules/power/node.js"));
global.Tserver.importModule(require("./code/modules/projectiles/ammunition/ammo_casings.js"));
global.Tserver.importModule(require("./code/modules/projectiles/ammunition/energy.js"));
global.Tserver.importModule(require("./code/modules/projectiles/boxes_magazines/ammo_boxes.js"));
global.Tserver.importModule(require("./code/modules/projectiles/boxes_magazines/external_mag.js"));
global.Tserver.importModule(require("./code/modules/projectiles/guns/ballistic/pistol.js"));
global.Tserver.importModule(require("./code/modules/projectiles/guns/energy/laser.js"));
global.Tserver.importModule(require("./code/modules/projectiles/guns/energy/stun.js"));
global.Tserver.importModule(require("./code/modules/projectiles/guns/ballistic.js"));
global.Tserver.importModule(require("./code/modules/projectiles/guns/energy.js"));
global.Tserver.importModule(require("./code/modules/projectiles/projectile/beam.js"));
global.Tserver.importModule(require("./code/modules/projectiles/projectile/bullets.js"));
global.Tserver.importModule(require("./code/modules/projectiles/projectile/energy.js"));
global.Tserver.importModule(require("./code/modules/projectiles/ammunition.js"));
global.Tserver.importModule(require("./code/modules/projectiles/box_magazine.js"));
global.Tserver.importModule(require("./code/modules/projectiles/gun.js"));
global.Tserver.importModule(require("./code/modules/projectiles/projectile.js"));
global.Tserver.importModule(require("./code/modules/atoms/reagents/containers/open.js"));
global.Tserver.importModule(require("./code/modules/atoms/reagents/containers/pill.js"));
global.Tserver.importModule(require("./code/modules/atoms/reagents/containers/spray.js"));
global.Tserver.importModule(require("./code/modules/atoms/reagents/machinery/chem_dispenser.js"));
global.Tserver.importModule(require("./code/modules/reagents/holder.js"));
global.Tserver.importModule(require("./code/modules/smoothing/smoothing.js"));
global.Tserver.importModule(require("./code/modules/speech/speech.js"));
global.Tserver.importModule(require("./code/onclick/action.js"));
global.Tserver.importModule(require("./code/onclick/hud.js"));
global.Tserver.importModule(require("./code/onclick/interact.js"));
global.Tserver.importModule(require("./code/onclick/inventory.js"));
global.Tserver.importModule(require("./code/onclick/screen_objects.js"));

if(global.is_bs_editor_env) {
	module.exports = client;
} else {
	const finalhandler = require("finalhandler");
	const http = require("http");
	const net = require("net");
	const https = require("https");
	const serveStatic = require("serve-static");
	const fs = require("fs");
	const url = require("url");

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

	global.Tserver.on("client_login", (client) => {
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
		global.Tserver.handle_login = function (ws) {
			ws.send(JSON.stringify({login_type: "database"}));
			let validated = {value: false, name: "none"};
			const message_handler = (msg) => {
				const obj = JSON.parse(msg);
				console.log(obj)
				if (obj.request_check === true) {database.authenticate(obj.name,obj.password).then(function(results){validated=results;
				if (validated.value==true && validated.name==obj.name) {console.log(`DB AUTH: user \"${obj.name}\" authorized`);ws.send(JSON.stringify({valid: true, logged_in_as: obj.name, autojoin: true}));}
				else  {console.log(`DB AUTH: user \"${obj.name}\" denied`);ws.send(JSON.stringify({ valid: false }));}});}

				if (obj.login) {
					let username = obj.login + "";
					ws.removeListener("message",  message_handler);
					this.login(ws, username);
				}
			};
			ws.on("message", message_handler);
		};}

	const serve = serveStatic(global.Tserver.resRoot, { index: ["index.html"] });

	const http_handler = (req, res) => {
		const done = finalhandler(req, res);
		const url_obj = url.parse(req.url, true);
		if (url_obj.pathname == "/status") {
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
	let http_server;
	if (server_config.https) {
		const proxies = {
			http: http.createServer((req, res) => {
				res.writeHead(301, {
					Location: "https://" + req.headers.host + req.url,
				});
				res.end();
			}),
			https: https.createServer(server_config.http_opts, http_handler),
		};
		net
			.createServer((socket) => {
				socket.once("data", (buffer) => {
					socket.pause();
					const byte = buffer[0];
					const protocol = byte == 22 ? "https" : "http";
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
	if (args[2] == "test") {
		console.log("test passed.");
		process.exit(0);}
	}