export{};
const Typespess = require("./../code/game/server.js");
const read_config = require("./../code/config.js");
const World = require("./../code/game/world.js");

console.log("SERVER: Loading game...");

global.Tserver = new Typespess();
global.Tworld = new World(global.Tserver);

global.Tserver.resRoot = "./resources/";

global.Tserver.importModule(require("./../code/game/area/area_components.js"));
global.Tserver.importModule(require("./../code/game/area/area.js"));
global.Tserver.importModule(require("./../code/game/components/climbable.js"));
global.Tserver.importModule(require("./../code/game/components/squeak.js"));
global.Tserver.importModule(require("./../code/game/components/wires.js"));
global.Tserver.importModule(require("./../code/game/mobs/mob_movement.js"));
global.Tserver.importModule(require("./../code/game/mobs/new_player.js"));
global.Tserver.importModule(require("./../code/game/mobs/dead/ghost.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/living_defense.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/living.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/simple.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/carbon/carbon.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/carbon/slip.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/carbon/body_parts/body_parts.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/carbon/body_parts/components.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/carbon/body_parts/head.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/carbon/body_parts/health_doll.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/carbon/body_parts/zones.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/carbon/human/human.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/carbon/organs/liver.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/carbon/organs/lungs.js"));
global.Tserver.importModule(require("./../code/game/mobs/living/carbon/organs/organ.js"));
global.Tserver.importModule(require("./../code/game/components/objects/cleanable/blood.js"));
global.Tserver.importModule(require("./../code/game/components/objects/cleanable/cleanable.js"));
global.Tserver.importModule(require("./../code/game/components/objects/doors/door.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/devices/flashlight.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/devices/multitool.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/devices/scanners.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/stacks/sheets/glass.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/stacks/sheets/sheet_types.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/stacks/tiles/tile_types.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/stacks/rods.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/stacks/stack.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/storage/belt.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/storage/boxes.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/storage/toolbox.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/clothing.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/handcuffs.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/storage.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/tools.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items/weaponry.js"));
global.Tserver.importModule(require("./../code/game/components/objects/structures/beds_chairs/chair.js"));
global.Tserver.importModule(require("./../code/game/components/objects/structures/crates_lockers/base.js"));
global.Tserver.importModule(require("./../code/game/components/objects/structures/crates_lockers/closets.js"));
global.Tserver.importModule(require("./../code/game/components/objects/structures/wall/walls.js"));
global.Tserver.importModule(require("./../code/game/components/objects/structures/rack.js"));
global.Tserver.importModule(require("./../code/game/components/objects/structures/structure.js"));
global.Tserver.importModule(require("./../code/game/components/objects/structures/table_frames.js"));
global.Tserver.importModule(require("./../code/game/components/objects/structures/table.js"));
global.Tserver.importModule(require("./../code/game/components/objects/structures/window.js"));
global.Tserver.importModule(require("./../code/game/components/objects/structures/wild.js"));
global.Tserver.importModule(require("./../code/game/components/objects/buckling.js"));
global.Tserver.importModule(require("./../code/game/components/objects/destructible.js"));
global.Tserver.importModule(require("./../code/game/components/objects/items.js"));
global.Tserver.importModule(require("./../code/game/components/objects/objs.js"));
global.Tserver.importModule(require("./../code/game/components/objects/puller.js"));
global.Tserver.importModule(require("./../code/game/turfs/floor_base.js"));
global.Tserver.importModule(require("./../code/game/placeholders.js"));
global.Tserver.importModule(require("./../code/game/ticker.js"));
global.Tserver.importModule(require("./../code/modules/client/verbs.js"));
global.Tserver.importModule(require("./../code/modules/atoms/objects/clothing/gloves/_gloves.js"));
global.Tserver.importModule(require("./../code/modules/atoms/objects/clothing/head/_head.js"));
global.Tserver.importModule(require("./../code/modules/atoms/objects/clothing/masks/_masks.js"));
global.Tserver.importModule(require("./../code/game/importer.js"));
global.Tserver.importModule(require("./../code/game/importer_tools.js"));
global.Tserver.importModule(require("./../code/modules/atoms/objects/clothing/under/_under.js"));
global.Tserver.importModule(require("./../code/modules/atoms/objects/clothing/suits/_suits.js"));
global.Tserver.importModule(require("./../code/modules/atoms/objects/clothing/shoes/_shoes.js"));
global.Tserver.importModule(require("./../code/modules/effect_system/sparks.js"));
global.Tserver.importModule(require("./../code/modules/atoms/objects/janitorial/mop.js"));
global.Tserver.importModule(require("./../code/modules/jobs/controller.js"));
global.Tserver.importModule(require("./../code/modules/jobs/landmark.js"));
global.Tserver.importModule(require("./../code/modules/power/cable.js"));
global.Tserver.importModule(require("./../code/modules/power/cell.js"));
global.Tserver.importModule(require("./../code/modules/power/controller.js"));
global.Tserver.importModule(require("./../code/modules/power/lighting.js"));
global.Tserver.importModule(require("./../code/modules/power/machine.js"));
global.Tserver.importModule(require("./../code/modules/power/node.js"));
global.Tserver.importModule(require("./../code/modules/projectiles/ammunition/energy.js"));
global.Tserver.importModule(require("./../code/modules/projectiles/guns/ballistic.js"));
global.Tserver.importModule(require("./../code/modules/projectiles/guns/energy.js"));
global.Tserver.importModule(require("./../code/modules/projectiles/projectile/beam.js"));
global.Tserver.importModule(require("./../code/modules/projectiles/ammunition.js"));
global.Tserver.importModule(require("./../code/modules/projectiles/box_magazine.js"));
global.Tserver.importModule(require("./../code/modules/projectiles/gun.js"));
global.Tserver.importModule(require("./../code/modules/projectiles/projectile.js"));
global.Tserver.importModule(require("./../code/modules/atoms/reagents/containers/open.js"));
global.Tserver.importModule(require("./../code/modules/atoms/reagents/containers/pill.js"));
global.Tserver.importModule(require("./../code/modules/atoms/reagents/containers/spray.js"));
global.Tserver.importModule(require("./../code/modules/atoms/reagents/machinery/chem_dispenser.js"));
global.Tserver.importModule(require("./../code/modules/reagents/holder.js"));
global.Tserver.importModule(require("./../code/modules/smoothing/smoothing.js"));
global.Tserver.importModule(require("./../code/modules/speech/speech.js"));
global.Tserver.importModule(require("./../code/onclick/action.js"));
global.Tserver.importModule(require("./../code/onclick/hud.js"));
global.Tserver.importModule(require("./../code/onclick/interact.js"));
global.Tserver.importModule(require("./../code/onclick/inventory.js"));
global.Tserver.importModule(require("./../code/onclick/screen_objects.js"));

global.Tserver.importModule(require("./../code/modules/admin/holder.js"));
global.Tserver.importModule(require("./../code/modules/admin/menu.js"));
global.Tserver.config = read_config("config.cson");

const fs = require("fs");

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

console.log("SERVER: Server started.");

//schedulers
global.Tworld.time_scheduler(global.Tworld);
global.Tworld.season_scheduler(global.Tworld);
global.Tworld.weather_scheduler(global.Tworld);

//this signals the continuous integration program to exit.
console.log("test passed.");
// eslint-disable-next-line no-process-exit
process.exit(0);