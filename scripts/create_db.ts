const PouchDB = require("pouchdb");

var db = new PouchDB('http://localhost:5984/typespess');

var doc = {
	"_id": "test",
	"name": "test",
	"password": "test",
	"ips": [
		"localhost",
	],
	"banned": false
  };
  db.put(doc);