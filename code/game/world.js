/** @typedef {import('./server')} Typespess */
/** @typedef {import('./atom/atom')} Typespess.Atom */

class World {
	constructor(server) {
		this.server = server;
		this.servertime = 0; //server time in seconds

		this.season = "Summer";
		this.possible_seasons = ["Spring", "Summer", "Autumn", "Winter"];
		this.gametime = 0; //ingame time, in minutes (1440 = 24 hours)
		this.weather = "Clear";
		this.possible_weather = ["Clear", "Wet", "Storm"];
	}
	
	get_tod() { //gets the time of day in HH:MM
		let hours = Math.floor(this.gametime/60);
		let minutes = Math.floor((this.gametime%60)*60);

		if (hours < 10) {var nhours = "0"+String(hours)}
		if (minutes < 10) {var nminutes = "0"+String(minutes)}
		return `${nhours}:${nminutes}`
	}
	change_season(new_season) { //sets the season to the input variable, if its in the list of possible_seasons
		for (var s of this.possible_seasons)
			if (s == new_season) {this.season = s; console.log("Changed the season to "+new_season);return true;}
		return false;
	}
	advance_season() { //advances to the next season
		if (this.season == "Winter") {this.season="Spring";console.log("Automatically advanced the season to "+this.season);return true;}
		else if (this.season == "Spring") {this.season="Summer";console.log("Automatically advanced the season to "+this.season);return true;}
		else if (this.season == "Summer") {this.season="Autumn";console.log("Automatically advanced the season to "+this.season);return true;}
		else if (this.season == "Autumn") {this.season="Winter";console.log("Automatically advanced the season to "+this.season);return true;}
		return false;
	}
   change_weather(new_weather) { //sets the weather to the input variable, if its in the list of possible_weather
		for (var w of this.possible_weather)
			if (w == new_weather) {this.weather = w; console.log("Changed the weather to "+new_weather); return true;}
		return false;
	}
	random_weather() { //randomizes the weather
		this.weather = this.possible_weather[Math.floor(Math.random() * this.possible_weather.length)];
		console.log("Randomly changed the weather to "+this.weather);
		return true;
	}
}
module.exports = World;
