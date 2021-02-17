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

	} catch(ex) {throw new Error(ex);}
}

const preloadlist = dirIt("../resources/icons/ui/");

const tloadlist = `var preload_list = [${preloadlist}]; module.exports = preload_list;`;
fs.writeFile("./code/preloadlist.js", tloadlist, function (err: any) {
	if (err) {
		return console.error(err);
	}
	console.log("SERVER: Finished saving the preload list.");
});