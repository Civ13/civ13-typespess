const PouchDB = require("pouchdb");

const db = new PouchDB("http://localhost:5984/typespess");

const doc = {
	_id: "test",
	name: "test",
	password: "test",
	ips: ["localhost"],
	banned: false,
};
db.put(doc);
