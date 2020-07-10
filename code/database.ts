const PouchDB = require("pouchdb");
class Database {
	name : string
	path : string
	db : any
	constructor(name: string) {
		this.name = name;
		this.path = `http://localhost:5984/${name}`;
		this.db = new PouchDB("http://localhost:5984/typespess");
	}

	get_db_info(){
		this.db.info().then(function (info: any) {
			console.log(info);});
	}
	authenticate(tname : string, tpassword: string){
		this.db.find({selector: {name: tname}, fields: ["_id"]}).then(function (result : any) {
			// handle result
			for (const i of result.docs)
			{if (i.password == tpassword && i.name == tname && i.banned == false)
			{return true;}}
		}).catch(function (err: Error) {console.log(err);});
		return false;
	}
}
module.exports = Database;
