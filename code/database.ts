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
	async authenticate(tname : string, tpassword: string){
		console.log("Authenticating "+tname+"...")
		var i = await this.db.get(tname);
		let accepted = {value: false, name: tname};
		if (i.password == tpassword && i.name == tname && i.banned === false)
			{console.log("	Accepted");accepted.value=true;}
		else
			{console.log("	Rejected");accepted.value=false;}
		return accepted;
	}
}
module.exports = Database;
