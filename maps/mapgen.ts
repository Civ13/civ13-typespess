export{};
const fs = require("fs");
const CSON = require("cson");
console.info("Loading definitions...");
let originalLoadedConfigs = {width:100, height:100, water:25, dirt:20};
const {weak_deep_assign} = require("./../code/game/server.js");
let finalData = "";

function generateRandomInteger(min: number, max: number) {
	return Math.floor(min + Math.random() * (max + 1 - min));
}
function random_floor(prob: number) {
	if (Math.random() <= prob / 100) {
		return "dirt";
	} else {
		return "grass";
	}
}

function random_flora() {
	if (Math.random() <= 0.25) {
		return {rname: "bush", icon: "icons/obj/flora/bushes/", icon_state: `smallbush${generateRandomInteger(1, 44)}`};
	} else if (Math.random() <= 0.7) {
		return {rname: "grass", icon: "icons/obj/flora/wild/", icon_state: `tall_grass_${generateRandomInteger(1, 9)}`};
	} else {
		return {rname: "tree", icon: "icons/obj/flora/bigtrees/", icon_state: `tree${generateRandomInteger(1, 5)}`};
	}
}
originalLoadedConfigs = CSON.parse(fs.readFileSync(`../config/mapgen.cson`, "utf8"));
weak_deep_assign(originalLoadedConfigs, CSON.parse(fs.readFileSync(`../config/mapgen.cson`, "utf8")));
console.info(
	"Read definitions as: w: " +
		originalLoadedConfigs.width +
		", h: " + originalLoadedConfigs.height +
		", water: " + originalLoadedConfigs.water +
		", dirt: " + originalLoadedConfigs.dirt
);
const inc_w = -originalLoadedConfigs.width / 2;
const inc_h = -originalLoadedConfigs.height / 2;

console.info("Generating the map...");
finalData = finalData + "{\n";
finalData = finalData + '	"locs": {\n';
for (let i = inc_w; i <= Math.abs(inc_w); i++) {
	for (let j = inc_h; j <= Math.abs(inc_h); j++) {
		let hascomma = "		],\n";
		if (j === Math.abs(inc_h) && i === Math.abs(inc_w)) {
			hascomma = "		]\n";
		}
		const floorname = random_floor(originalLoadedConfigs.dirt);
		finalData = finalData + `		"${i},${j},0": [\n`;
		if (i === inc_w) {
			finalData = finalData + "			{\n";
			finalData = finalData + '				"instance_vars": {\n';
			finalData = finalData + '					"components": {\n';
			finalData = finalData + '						"Area": {\n';
			finalData = finalData + '							"map_id": "area_outside_arrivals"\n';
			finalData = finalData + "						}\n";
			finalData = finalData + "					}\n";
			finalData = finalData + "				},\n";
			finalData = finalData + '				"template_name": "area_outside_arrivals",\n';
			finalData = finalData + `				"x": ${i},\n`;
			finalData = finalData + `				"y": ${j}\n`;
			finalData = finalData + "			},\n";
			finalData = finalData + "			{\n";
			finalData = finalData + '				"instance_vars": {\n';
			finalData = finalData + '					"name": "start",\n';
			finalData = finalData + '					"components": {\n';
			finalData = finalData + '						"JobLandmark": {\n';
			finalData = finalData + '							"name": "start"\n';
			finalData = finalData + "						}\n";
			finalData = finalData + "					}\n";
			finalData = finalData + "				},\n";
			finalData = finalData + '				"template_name": "job_landmark",\n';
			finalData = finalData + `				"x": ${i},\n`;
			finalData = finalData + `				"y": ${j}\n`;
			finalData = finalData + "			},\n";
		}
		finalData = finalData + "			{\n";
		finalData = finalData + `				"template_name": "floor_${floorname}",\n`;
		finalData = finalData + `				"x": ${i},\n`;
		finalData = finalData + `				"y": ${j}\n`;
		if (i === 0 && j === 0) {
			finalData = finalData + "			},\n";
			finalData = finalData + "			{\n";
			finalData = finalData + '				"template_name": "sun",\n';
			finalData = finalData + `				"x": ${i},\n`;
			finalData = finalData + `				"y": ${j}\n`;
			finalData = finalData + "			}\n";
		} else {
			if (Math.random() <= 0.5) {
				const rflora = random_flora();
				finalData = finalData + "			},\n";
				finalData = finalData + "			{\n";
				finalData = finalData + `				"template_name": "${rflora.rname}",\n`;
				finalData = finalData + `				"instance_vars": {\n`;
				finalData = finalData + `					"icon": "${rflora.icon}",\n`;
				finalData = finalData + `					"icon_state": "${rflora.icon_state}"\n`;
				finalData = finalData + `				},\n`;
				finalData = finalData + `				"x": ${i},\n`;
				finalData = finalData + `				"y": ${j}\n`;
				finalData = finalData + "			}\n";
			} else {
				finalData = finalData + "			}\n";
			}
		}
		finalData = finalData + hascomma;
	}
}

finalData = finalData + "	}\n";
finalData = finalData + "}";

fs.writeFile("newmap.bsmap", finalData, function (err: Error) {
	if (err) {
		return console.error(err);
	}
	console.info("Finished saving the map.");
});
