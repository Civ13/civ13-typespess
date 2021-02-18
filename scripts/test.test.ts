global.is_test_env = true;

console.log("SERVER: Loading game...");

global.Tserver = require("./../index.js");

//this signals the continuous integration program to exit.
console.log("test passed.");
