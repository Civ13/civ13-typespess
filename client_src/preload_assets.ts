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
				let nfile:string = fullPath
				let pieces = nfile.split("\\");
				nfile = pieces.join("/");
				if (nfile.search("effects/") != -1 || nfile.search("turf/") != -1 || nfile.search("ui/") != -1) {
					nfile = nfile.replace("../resources/","");
					nfile = `"${nfile}",`
					files+=nfile;
				}
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
		return null;
	}
};

var preloadlist: string|null = dirIt("../resources/icons/");
var tloadlist: string = `var preload_list = [${preloadlist}]; module.exports = preload_list;`;
fs.writeFile("code/preloadlist.js", tloadlist, function (err: unknown) {
	if (err) {
		return console.error(err);
	}
	console.log("SERVER: Finished saving the preload list.");
});