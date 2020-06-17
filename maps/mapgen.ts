import { strict } from "assert";



const fs = require("fs");

console.log("Loading definitions...");
let originalLoadedConfigs: Array<number> = [100, 100, 25, 20]; // width, height, water, dirt
let finalData = "";

function load_configs() {
	fs.readFile("mapdef.txt", function (
		err: any,
		data: { toString: () => string }
	) {
		if (err) {
			return console.error(err);
		}
		const tempConfigs: Array<string> = (data.toString() as string).split(",", 4);
		const loadedConfigs = [
			Number(tempConfigs[0]),
			Number(tempConfigs[1]),
			Number(tempConfigs[2]),
			Number(tempConfigs[3]),
		];
		return loadedConfigs;
	});
	return [100, 100, 25, 20];
}

function random_floor(prob: number) {
	if (Math.random() <= prob / 100) return "dirt";
	else return "grass";
}

originalLoadedConfigs = load_configs();
console.log(
	"Read definitions as: " +
		originalLoadedConfigs[0] +
		"," +
		originalLoadedConfigs[1] +
		"," +
		originalLoadedConfigs[2] +
		"," +
		originalLoadedConfigs[3]
);
const inc_w: number = -originalLoadedConfigs[0] / 2;
const inc_h: number = -originalLoadedConfigs[1] / 2;

console.log("Generating the map...");
finalData = finalData + "{\n";
finalData = finalData + "	\"locs\": {\n";
for (let i = inc_w; i <= Math.abs(inc_w); i++) {
	for (let j = inc_h; j <= Math.abs(inc_h); j++) {
		let hascomma = "		],\n";
		if (j == Math.abs(inc_h) && i == Math.abs(inc_w)) {
			hascomma = "		]\n";
		}
		const floorname = random_floor(originalLoadedConfigs[3]);
		finalData = finalData + `		"${i},${j},0": [\n`;
		finalData = finalData + "			{\n";
		finalData = finalData + `				"template_name": "floor_${floorname}",\n`;
		finalData = finalData + "				\"variant_leaf_path\": [\n";
		finalData = finalData + `					"${floorname}"\n`;
		finalData = finalData + "				],\n";
		finalData = finalData + `				"x": ${i},\n`;
		finalData = finalData + `				"y": ${j}\n`;
		finalData = finalData + "			},\n";
		if (i == 0 && j == 0) {
			finalData = finalData + "			{\n";
			finalData = finalData + "				\"template_name\": \"sun\",\n";
			finalData = finalData + `				"x": ${i},\n`;
			finalData = finalData + `				"y": ${j}\n`;
			finalData = finalData + "			},\n";
		}
		finalData = finalData + "			{\n";
		finalData = finalData + "				\"instance_vars\": {\n";
		finalData = finalData + "					\"components\": {\n";
		finalData = finalData + "						\"Area\": {\n";
		finalData = finalData + "							\"map_id\": \"area_outside_arrivals\"\n";
		finalData = finalData + "						}\n";
		finalData = finalData + "					}\n";
		finalData = finalData + "				},\n";
		finalData = finalData + "				\"template_name\": \"area_outside_arrivals\",\n";
		finalData = finalData + `				"x": ${i},\n`;
		finalData = finalData + `				"y": ${j}\n`;
		finalData = finalData + "			}\n";
		finalData = finalData + hascomma;
	}
}

finalData = finalData + "	}\n";
finalData = finalData + "}";

fs.writeFile("newmap.bsmap", finalData, function (err: any) {
	if (err) {
		return console.error(err);
	}
	console.log("Finished saving the map.");
});
