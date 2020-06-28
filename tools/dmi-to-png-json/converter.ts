/* eslint-disable @typescript-eslint/no-explicit-any */
"use strict";
const fs = require("fs");
const StreamPng = require("streampng");
const zlib = require("zlib");

const files = fs.readdirSync("./in/");
const dmifiles : Array<string> = [];
const dirOrder = [2, 1, 4, 8, 6, 10, 5, 9];

files.forEach((file: string) => { 
	if (file.search(".dmi") != -1) {
		console.log("Found "+file);
		dmifiles.push(file);
		const metadata = read_icon("./in/"+file);
		const jsonContent = JSON.stringify(metadata);
		fs.writeFile(`${file}.json`, jsonContent, "utf8", function (err: unknown) {
			if (err) {
				console.log("An error occured while writing JSON Object to File.");
				return console.log(err);
			}
		
			console.log("JSON file has been saved.");
		});
	}
}); 

async function read_icon (blob: string) {
	const img_blob = new Blob([blob], {type:"image/png"});
	const image = document.createElement("img");

	const obj = {image, icon_states: new Map(), icon_states_movement: new Map(), width:0,height:0};
	image.src = URL.createObjectURL(img_blob);

	try {
		const png = new StreamPng(new Buffer(img_blob));
		const [IHDR, zTXt] = await new Promise((resolve, reject) => {
			png.on("error", (err: any) => {
				reject(err);
			});
			let IHDR: any;
			let zTXt: any;
			png.on("IHDR", (chunk: unknown) => {
				IHDR = chunk;
				if(zTXt) {
					resolve([IHDR,zTXt]);
				}
			});
			png.on("zTXt", (chunk: unknown) => {
				zTXt = chunk;
				if(IHDR) {
					resolve([IHDR,zTXt]);
				}
			});
			png.on("tEXt", (chunk: unknown) => {
				zTXt = chunk;
				if(IHDR) {
					resolve([IHDR,zTXt]);
				}
			});
		});
		const inflated = zTXt.text || await new Promise((resolve, reject) => {
			zlib.inflate(zTXt.compressedText, (err: any, data: unknown) => {
				if(err) reject(err);
				resolve(data);
			});
		});
		const desc = inflated.toString("ascii");
		const split = desc.split("\n");
		let iconWidth = 0;
		let iconHeight = 0;
		const parsedItems = [];
		let parsing : Array<unknown> = [];
		let totalFrames = 0;
		for(let i = 0; i < split.length; i++) {
			const regexResult = /\t?([a-zA-Z0-9]+) ?= ?"?([^\r\n"]+)/.exec(split[i]);
			if(!regexResult)
				continue;
			const key = regexResult[1];
			const val = regexResult[2];
			if(key == "width") {
				iconWidth = +val;
			} else if(key == "height") {
				iconHeight = +val;
			} else if(key == "state") {
				if(parsing) {
					parsedItems.push(parsing);
				}
				parsing = {"state":val};
			} else if(key == "dirs" || key == "frames" || key == "movement") {
				parsing[key] = +val;
			} else if(key == "delay") {
				parsing.delay = JSON.parse("[" + val + "]");
			}
		}
		if(parsing) {
			parsedItems.push(parsing);
		}
		for(let i = 0; i < parsedItems.length; i++) {
			const item = parsedItems[i];
			totalFrames += item.frames * item.dirs;
			if(!item.delay) {
				item.delay = [1];
			}
			if(!item.frames) {
				item.frames = 1;
			}
			if(!item.dirs) {
				item.dirs = 1;
			}
		}
		if(!iconWidth && !iconHeight && totalFrames) {
			iconHeight = IHDR.height;
			iconWidth = IHDR.width / totalFrames;
		}
		obj.width = iconWidth;
		obj.height = iconHeight;
		const cols = IHDR.width / iconWidth;
		let iconIndex = 0;
		for(let i = 0; i < parsedItems.length; i++) {
			const item = parsedItems[i];
			const outItem = {dir_count:1, width:32, height:32, dirs:[], tile_size:32};
			const name = item.state;
			outItem.dir_count = item.dirs;
			outItem.width = iconWidth;
			outItem.height = iconHeight;
			const dirs = new Map();
			for(let j = 0; j < item.dirs; j++) {
				const dir = {frames:{ x: number; y: number; delay: number; }[],total_delay:0};
				const frames: { x: number; y: number; delay: number; }[] = [];
				let total_delay = 0;
				for(let k = 0; k < item.frames; k++) {
					const thisIconIndex = iconIndex + (k * item.dirs) + j;
					frames.push({x:(thisIconIndex%cols)*iconWidth, y:Math.floor(thisIconIndex/cols)*iconHeight, delay: item.delay[k]});
					total_delay += item.delay[k];
				}
				dir.total_delay = total_delay;
				dirs.set(dirOrder[j], dir);
			}
			outItem.dirs = dirs;
			outItem.tile_size = 32;
			if(item.movement) {
				obj.icon_states_movement.set(name, outItem);
			} else {
				obj.icon_states.set(name, outItem);
			}
			iconIndex += item.dirs * item.frames;
		}
	} finally {
		URL.revokeObjectURL(image.src);
	}
	
	return obj;
}