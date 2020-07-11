const PouchDB = require("pouchdb");
class Database {
	name : string
	path : string
	db : any
	constructor(name: string) {
		this.name = name;
		this.path = `http://localhost:5984/${name}`;
		this.db = new PouchDB(`http://localhost:5984/${name}`);
	}

	get_db_info(){
		this.db.info().then(function (info: any) {
			console.log(info);});
	}
	authenticate(tname : string, tpassword: string){
		console.log("Authenticating "+tname+"...")
		this.db.get(tname).catch(function (err: Error) {
			if (err.name === 'not_found') {
				console.log("user not found!")
				return false
			} else {throw err;}
			}).then(function (i: any) {
				{if (i.password && i.name && i.password == tpassword && i.name == tname && i.banned == false)
				{console.log("	Accepted");return true;}
				else {console.log("	Rejected");return false;}}
			}).catch(function (err: Error) {throw err;});
	}
}
module.exports = Database;
