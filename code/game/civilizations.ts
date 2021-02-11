class Civilization {
	name: string;
	symbol: string;
	color1: string;
	color2: string;
	research: Array<number>;
	members: Array<string>;
	points: number;
	constructor(name = "",symbol = "star",color1 = "#FFFFFF",color2 = "#000000",research = [0,0,0],points = 0) {
		this.name = name;
		this.symbol = symbol;
		this.color1 = color1;
		this.color2 = color2;
		this.research = research;
		this.members = [];
		this.points = points;
	}

}

module.exports = Civilization;
