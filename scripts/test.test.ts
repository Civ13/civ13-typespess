global.is_test_env = true;

console.info("SERVER: Loading game...");

global.Tserver = require("./../index.js");

//this signals the continuous integration program to exit.
console.info("test passed.");
