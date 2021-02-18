export{};
const {join} = require("path");
const {readdirSync, statSync} = require("fs");

function getFileExtension(filename: string) {
	const a = filename.split(".");
	if (a.length === 1 || (a[0] === "" && a.length === 2)) {
		return "";
	}
	return a.pop().toLowerCase();
}

const unfold = (f: any, initState: any) =>
	f(
		(value: any, nextState: any) => [value, ...unfold(f, nextState)],
		(): any => [],
		initState
	);

const None = Symbol();

const relativePaths = (path = ".") => readdirSync(path).map((p: any) => join(path, p));

const traverseDir = (dir: string) =>
	unfold(
		(next: (arg0: any, arg1: any) => any, done: () => any, [path = None, ...rest]: any) =>
			path === None ? done() : next(path, statSync(path).isDirectory() ? relativePaths(path).concat(rest) : rest),
		relativePaths(dir)
	);

module.exports = {getFileExtension, relativePaths, traverseDir, unfold, None};
