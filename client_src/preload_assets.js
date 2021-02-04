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

var preloadlist = dirIt("../resources/icons/ui/");
let tdir1 = dirIt("../resources/icons/mob/human_body/");
let tdir2 = dirIt("../resources/icons/mob/animals/");
let tdir3 = dirIt("../resources/icons/effects/");
if (typeof tdir1 !== "undefined")
	{preloadlist += tdir1;}
if (typeof tdir2 !== "undefined")
	{preloadlist += tdir2;}
if (typeof tdir3 !== "undefined")
	{preloadlist += tdir3;}

var tloadlist = `var preload_list = [${preloadlist}]; module.exports = preload_list;`;
fs.writeFile("./code/preloadlist.js", tloadlist, function (err) {
	if (err) {
		return console.error(err);
	}
	console.log("SERVER: Finished saving the preload list.");
});