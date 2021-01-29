import { join } from "path";
const fs = require("fs");

var files: string = "";
const dirs: Array<string> = [];

function dirIt(directory: string) {

	try {

		let dirContent = fs.readdirSync(directory);

		dirContent.forEach( (path: string) => {

			const fullPath: string = join(directory,path);

			if ( fs.statSync(fullPath).isFile()) {
				let nfile:string = fullPath;
				let pieces = nfile.split("\\");
				nfile = pieces.join("/");
				nfile = nfile.replace("../resources/","");
				nfile = `"${nfile}",`;
				files+=nfile;

			}
			else
				{dirs.push(fullPath);}
		});

		if ( dirs.length !== 0 ) {
			let popd: string|undefined = dirs.pop();
			if (popd)
				{dirIt(popd);}
			}

		return files;

	} catch(ex) {
		console.log(ex);
		return "";
	}
}

var preloadlist: string = dirIt("../resources/icons/turf/floor/");
let tdir1 = dirIt("../resources/icons/mob/human_body/");
let tdir2 = dirIt("../resources/icons/ui/");
let tdir3 = dirIt("../resources/icons/effects/");
let tdir4 = dirIt("../resources/icons/mob/human_face/");
if (tdir1 != null)
	{preloadlist += tdir1;}
if (tdir2 != null)
	{preloadlist += tdir2;}
if (tdir3 != null)
	{preloadlist += tdir3;}
if (tdir4 != null)
	{preloadlist += tdir4;}
var tloadlist: string = `var preload_list = [${preloadlist}]; module.exports = preload_list;`;
fs.writeFile("code/preloadlist.js", tloadlist, function (err: unknown) {
	if (err) {
		return console.error(err);
	}
	console.log("SERVER: Finished saving the preload list.");
});