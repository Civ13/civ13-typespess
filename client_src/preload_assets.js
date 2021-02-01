const { join } = require ("path");
const fs = require("fs");

var files = "";
const dirs = [];

function dirIt(directory) {

	try {

		let dirContent = fs.readdirSync(directory);

		dirContent.forEach( (path) => {

			const fullPath = join(directory,path);

			if ( fs.statSync(fullPath).isFile()) {
				let nfile = fullPath;
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
			let popd = dirs.pop();
			if (popd)
				{dirIt(popd);}
			}

		return files;

	} catch(ex) {
		console.log(ex);
		return "";
	}
}

var preloadlist = dirIt("../resources/icons/turf/floor/");
let tdir1 = dirIt("../resources/icons/mob/human_body/");
let tdir2 = dirIt("../resources/icons/ui/");
let tdir3 = dirIt("../resources/icons/effects/");
if (tdir1 != null)
	{preloadlist += tdir1;}
if (tdir2 != null)
	{preloadlist += tdir2;}
if (tdir3 != null)
	{preloadlist += tdir3;}

var tloadlist = `var preload_list = [${preloadlist}]; module.exports = preload_list;`;
fs.writeFile("./code/preloadlist.js", tloadlist, function (err) {
	if (err) {
		return console.error(err);
	}
	console.log("SERVER: Finished saving the preload list.");
});