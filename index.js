// BASED OFF OF tgstation COMMIT 910be9f4e29270e3a0a36ed8042310ed4bee1845

const Typespess = require("./code/game/server.js");
const read_config = require("./code/config.js");
const World = require("./code/game/world.js");
const Database = require("./code/database.ts");

console.log("SERVER: Loading game...");

global.Tserver = new Typespess();
global.Tworld = new World(Tserver);

Tserver.resRoot = "./resources/";

Tserver.config = read_config("config.cson");

Tserver.importModule(require("./code/game/area/area_components.js"));
Tserver.importModule(require("./code/game/area/area.js"));
Tserver.importModule(require("./code/game/components/climbable.js"));
Tserver.importModule(require("./code/game/components/squeak.js"));
Tserver.importModule(require("./code/game/components/wires.js"));
Tserver.importModule(require("./code/game/mobs/mob_movement.js"));
Tserver.importModule(require("./code/game/mobs/new_player.js"));
Tserver.importModule(require("./code/game/mobs/dead/ghost.js"));
Tserver.importModule(require("./code/game/mobs/living/living_defense.js"));
Tserver.importModule(require("./code/game/mobs/living/living.js"));
Tserver.importModule(require("./code/game/mobs/living/carbon/carbon.js"));
Tserver.importModule(require("./code/game/mobs/living/carbon/slip.js"));
Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/body_parts.js"));
Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/components.js"));
Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/head.js"));
Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/health_doll.js"));
Tserver.importModule(require("./code/game/mobs/living/carbon/body_parts/zones.js"));
Tserver.importModule(require("./code/game/mobs/living/carbon/human/human.js"));
Tserver.importModule(require("./code/game/mobs/living/carbon/human/human_parts.js"));
Tserver.importModule(require("./code/game/mobs/living/carbon/organs/liver.js"));
Tserver.importModule(require("./code/game/mobs/living/carbon/organs/lungs.js"));
Tserver.importModule(require("./code/game/mobs/living/carbon/organs/organ.js"));
Tserver.importModule(require("./code/game/components/objects/cleanable/blood.js"));
Tserver.importModule(require("./code/game/components/objects/cleanable/cleanable.js"));
Tserver.importModule(require("./code/game/components/objects/doors/door.js"));
Tserver.importModule(require("./code/game/components/objects/items/devices/flashlight.js"));
Tserver.importModule(require("./code/game/components/objects/items/devices/multitool.js"));
Tserver.importModule(require("./code/game/components/objects/items/devices/scanners.js"));
Tserver.importModule(require("./code/game/components/objects/items/stacks/sheets/glass.js"));
Tserver.importModule(require("./code/game/components/objects/items/stacks/sheets/sheet_types.js"));
Tserver.importModule(require("./code/game/components/objects/items/stacks/tiles/tile_types.js"));
Tserver.importModule(require("./code/game/components/objects/items/stacks/rods.js"));
Tserver.importModule(require("./code/game/components/objects/items/stacks/stack.js"));
Tserver.importModule(require("./code/game/components/objects/items/storage/belt.js"));
Tserver.importModule(require("./code/game/components/objects/items/storage/boxes.js"));
Tserver.importModule(require("./code/game/components/objects/items/storage/toolbox.js"));
Tserver.importModule(require("./code/game/components/objects/items/clothing.js"));
Tserver.importModule(require("./code/game/components/objects/items/handcuffs.js"));
Tserver.importModule(require("./code/game/components/objects/items/storage.js"));
Tserver.importModule(require("./code/game/components/objects/items/tools.js"));
Tserver.importModule(require("./code/game/components/objects/items/weaponry.js"));
Tserver.importModule(require("./code/game/components/objects/structures/beds_chairs/chair.js"));
Tserver.importModule(require("./code/game/components/objects/structures/crates_lockers/base.js"));
Tserver.importModule(require("./code/game/components/objects/structures/crates_lockers/closets.js"));
Tserver.importModule(require("./code/game/components/objects/structures/crates_lockers/closets/utility.js"));
Tserver.importModule(require("./code/game/components/objects/structures/wall/walls.js"));
Tserver.importModule(require("./code/game/components/objects/structures/rack.js"));
Tserver.importModule(require("./code/game/components/objects/structures/table_frames.js"));
Tserver.importModule(require("./code/game/components/objects/structures/table.js"));
Tserver.importModule(require("./code/game/components/objects/structures/window.js"));
Tserver.importModule(require("./code/game/components/objects/structures/wild.js"));
Tserver.importModule(require("./code/game/components/objects/buckling.js"));
Tserver.importModule(require("./code/game/components/objects/destructible.js"));
Tserver.importModule(require("./code/game/components/objects/items.js"));
Tserver.importModule(require("./code/game/components/objects/objs.js"));
Tserver.importModule(require("./code/game/components/objects/puller.js"));
Tserver.importModule(require("./code/game/turfs/floor_base.js"));
Tserver.importModule(require("./code/game/turfs/floor.js"));
Tserver.importModule(require("./code/game/placeholders.js"));
Tserver.importModule(require("./code/game/ticker.js"));
Tserver.importModule(require("./code/modules/admin/holder.js"));
Tserver.importModule(require("./code/modules/admin/menu.js"));
Tserver.importModule(require("./code/modules/client/verbs.js"));
Tserver.importModule(require("./code/modules/atoms/objects/clothing/gloves/_gloves.js"));
Tserver.importModule(require("./code/modules/atoms/objects/clothing/head/_head.js"));
Tserver.importModule(require("./code/modules/atoms/objects/clothing/masks/_masks.js"));
Tserver.importModule(require("./code/game/importer.js"));
Tserver.importModule(require("./code/modules/atoms/objects/clothing/under/_under.js"));
Tserver.importModule(require("./code/modules/atoms/objects/clothing/suits/_suits.js"));
Tserver.importModule(require("./code/modules/atoms/objects/clothing/shoes/_shoes.js"));
Tserver.importModule(require("./code/modules/effect_system/sparks.js"));
Tserver.importModule(require("./code/modules/atoms/objects/janitorial/mop.js"));
Tserver.importModule(require("./code/modules/jobs/controller.js"));
Tserver.importModule(require("./code/modules/jobs/landmark.js"));
Tserver.importModule(require("./code/modules/power/cable.js"));
Tserver.importModule(require("./code/modules/power/cell.js"));
Tserver.importModule(require("./code/modules/power/controller.js"));
Tserver.importModule(require("./code/modules/power/lighting.js"));
Tserver.importModule(require("./code/modules/power/machine.js"));
Tserver.importModule(require("./code/modules/power/node.js"));
Tserver.importModule(require("./code/modules/projectiles/ammunition/ammo_casings.js"));
Tserver.importModule(require("./code/modules/projectiles/ammunition/energy.js"));
Tserver.importModule(require("./code/modules/projectiles/boxes_magazines/ammo_boxes.js"));
Tserver.importModule(require("./code/modules/projectiles/boxes_magazines/external_mag.js"));
Tserver.importModule(require("./code/modules/projectiles/guns/ballistic/pistol.js"));
Tserver.importModule(require("./code/modules/projectiles/guns/energy/laser.js"));
Tserver.importModule(require("./code/modules/projectiles/guns/energy/stun.js"));
Tserver.importModule(require("./code/modules/projectiles/guns/ballistic.js"));
Tserver.importModule(require("./code/modules/projectiles/guns/energy.js"));
Tserver.importModule(require("./code/modules/projectiles/projectile/beam.js"));
Tserver.importModule(require("./code/modules/projectiles/projectile/bullets.js"));
Tserver.importModule(require("./code/modules/projectiles/projectile/energy.js"));
Tserver.importModule(require("./code/modules/projectiles/ammunition.js"));
Tserver.importModule(require("./code/modules/projectiles/box_magazine.js"));
Tserver.importModule(require("./code/modules/projectiles/gun.js"));
Tserver.importModule(require("./code/modules/projectiles/projectile.js"));
Tserver.importModule(require("./code/modules/atoms/reagents/containers/open.js"));
Tserver.importModule(require("./code/modules/atoms/reagents/containers/pill.js"));
Tserver.importModule(require("./code/modules/atoms/reagents/containers/spray.js"));
Tserver.importModule(require("./code/modules/atoms/reagents/machinery/chem_dispenser.js"));
Tserver.importModule(require("./code/modules/reagents/holder.js"));
Tserver.importModule(require("./code/modules/smoothing/smoothing.js"));
Tserver.importModule(require("./code/modules/speech/speech.js"));
Tserver.importModule(require("./code/onclick/action.js"));
Tserver.importModule(require("./code/onclick/hud.js"));
Tserver.importModule(require("./code/onclick/interact.js"));
Tserver.importModule(require("./code/onclick/inventory.js"));
Tserver.importModule(require("./code/onclick/screen_objects.js"));

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
Tserver.station_dim = new Typespess.Dimension(Tserver);
Tserver.instance_map_sync(	JSON.parse(fs.readFileSync("maps/" + map + ".bsmap", "utf8")),
	0,
	0,
	0,
	Tserver.station_dim
);

Tserver.on("client_login", (client) => {
	if (!client.mob) {
		const mob = new Typespess.Atom(Tserver, { components: ["NewPlayer"] });
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
	Tserver.handle_login = function (ws) {
		ws.send(JSON.stringify({login_type: "database"}));
		let validated = {value: false, name: "none"};
		const message_handler = (msg) => {
			const obj = JSON.parse(msg);
			console.log(obj)
			if (obj.request_check == true) {database.authenticate(obj.name,obj.password).then(function(results){validated=results;
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

const serve = serveStatic(Tserver.resRoot, { index: ["index.html"] });

const http_handler = (req, res) => {
	const done = finalhandler(req, res);
	const url_obj = url.parse(req.url, true);
	if (url_obj.pathname == "/status") {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.writeHead(200, { "Content-Type": "application/json" });
		const clients = [...Object.keys(Tserver.clients)];
		const clients_by_name = [...Object.keys(Tserver.clients_by_name)];
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

Tserver.startServer({ websocket: { server: http_server } });
console.log("SERVER: Server started.");

//schedulers
Tworld.time_scheduler(Tworld);
Tworld.season_scheduler(Tworld);
Tworld.weather_scheduler(Tworld);

//this signals the continuous integration program to exit.
const args = process.argv;
if (args[2] == "test") {
	console.log("test passed.");
	process.exit(0);}
