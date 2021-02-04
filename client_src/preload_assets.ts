const { join } = require ("path");
import fs from "fs";

let files = "";
const dirs: any[] = [];

function dirIt(directory: string) {

	try {

		const dirContent = fs.readdirSync(directory);

		dirContent.forEach( (path: any) => {

			const fullPath = join(directory,path);

			if ( fs.statSync(fullPath).isFile()) {
				let nfile = fullPath;
				const pieces = nfile.split("\\");
				nfile = pieces.join("/");
				nfile = nfile.replace("../resources/","");
				nfile = `"${nfile}",`;
				files+=nfile;

			}
			else
				{dirs.push(fullPath);}
		});

		if ( dirs.length !== 0 ) {
			const popd = dirs.pop();
			if (popd)
				{dirIt(popd);}
			}

		return files;

	} catch(ex) {
		console.log(ex);
		return "";
	}
}

let preloadlist = dirIt("../resources/icons/ui/");
const tdir1 = dirIt("../resources/icons/mob/human_body/");
const tdir2 = dirIt("../resources/icons/mob/animals/");
const tdir3 = dirIt("../resources/icons/effects/");
if (typeof tdir1 !== "undefined")
	{preloadlist += tdir1;}
if (typeof tdir2 !== "undefined")
	{preloadlist += tdir2;}
if (typeof tdir3 !== "undefined")
	{preloadlist += tdir3;}

const tloadlist = `var preload_list = [${preloadlist}]; module.exports = preload_list;`;
fs.writeFile("./code/preloadlist.js", tloadlist, function (err: any) {
	if (err) {
		return console.error(err);
	}
	console.log("SERVER: Finished saving the preload list.");
});