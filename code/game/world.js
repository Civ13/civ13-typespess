const {format_html} = require("./utils.js");
class World {
	
	constructor(server) {
		this.server = server;
		this.servertime = 0; //server time in seconds (1000ms)
	
		this.season = "Summer";
		this.possible_seasons = ["Spring", "Summer", "Autumn", "Winter"];
		this.gametime = 0; //ingame time, in minutes (1440 = 24 hours)
		this.weather = "Clear";
		this.possible_weather = ["Clear", "Wet", "Storm"];

		this.weather_running = true;
		this.seasons_running = true;

		this.civilizations = [];
		this.age = 0;
	
		this.age1 = 0;
		this.age2 = 0;
		this.age3 = 0;

		this.time_scheduler.bind(this);
		this.season_scheduler.bind(this);
		this.weather_scheduler.bind(this);
	}
	
	get_tod() { //gets the time of day in HH:MM
		let hours = Math.floor(this.gametime/60);
		let minutes = Math.floor((this.gametime%60)*60);

		if (hours < 10) {var nhours = "0"+String(hours);}
		if (minutes < 10) {var nminutes = "0"+String(minutes);}
		return `${nhours}:${nminutes}`;
	}
	get_descriptive_tod() { //gets the time of day in a string, like "Night", "Morning", and so on
		let hours = Math.floor(this.gametime/60);
		let desc_tod = "Unknown";
		if (hours >= 0 && hours < 4) {desc_tod = "Night";}
		else if (hours >= 4 && hours < 8) {desc_tod = "Early Morning";}
		else if (hours >= 8 && hours < 12) {desc_tod = "Late Morning";}
		else if (hours >= 12 && hours < 16) {desc_tod = "Early Afternoon";}
		else if (hours >= 16 && hours < 20) {desc_tod = "Late Afternoon";}
		else if (hours >= 20 && hours < 24) {desc_tod = "Evening";}
		else {desc_tod = "Night";}

		return desc_tod;
	}
	change_season(new_season) { //sets the season to the input variable, if its in the list of possible_seasons
		for (var s of this.possible_seasons)
			{if (s == new_season) {this.season = s; console.log("WORLD: Changed the season to "+new_season);to_chat(user, format_html`<span class='announce'>It is now ${this.season}.</span>`);return true;}}
		return false;
	}
	advance_season() { //advances to the next season
		if (this.season == "Winter") {this.season="Spring";console.log("WORLD: Automatically advanced the season to "+this.season);}
		else if (this.season == "Spring") {this.season="Summer";console.log("WORLD: Automatically advanced the season to "+this.season);}
		else if (this.season == "Summer") {this.season="Autumn";console.log("WORLD: Automatically advanced the season to "+this.season);}
		else if (this.season == "Autumn") {this.season="Winter";console.log("WORLD: Automatically advanced the season to "+this.season);}
		this.server.to_global_chat(format_html`<span class='announce'>It is now ${this.season}.</span>`);
		return true;
	}
   change_weather(new_weather) { //sets the weather to the input variable, if its in the list of possible_weather
		let last_weather = this.weather;
		for (var w of this.possible_weather)
			{if (w == new_weather) {this.weather = w; console.log("WORLD: Changed the weather to "+new_weather); return true;}}
			if (last_weather !== this.weather)
			{this.server.to_global_chat(format_html`<span class='announce'>The weather has changed to ${this.weather}.</span>`);}
		return false;
	}
	random_weather() { //randomizes the weather
		let last_weather = this.weather;
		this.weather = this.possible_weather[Math.floor(Math.random() * this.possible_weather.length)];
		console.log("WORLD: Randomly changed the weather to "+this.weather);
		if (last_weather !== this.weather)
			{this.server.to_global_chat(format_html`<span class='announce'>The weather has changed to ${this.weather}.</span>`);}
		return true;
	}

	time_scheduler(thisworld) {
		thisworld.servertime+=1;
		thisworld.gametime+=0.25;
		if (thisworld.gametime >= 1440) {
			thisworld.gametime -= 1440;
		} //24 hours turns to 0 hours
		setTimeout(thisworld.time_scheduler, 6000, thisworld);
	} //4 seconds = 1 ingame minute

	season_scheduler(thisworld) {
		if (thisworld.seasons_running) {
			thisworld.advance_season();
			setTimeout(thisworld.season_scheduler, 3600000, thisworld);}
		}

	weather_scheduler(thisworld) {
		if (thisworld.weather_running && Math.random()<=0.18) {
			thisworld.random_weather();}
			setTimeout(thisworld.weather_scheduler, 60000, thisworld);
		}
}

module.exports = World;
