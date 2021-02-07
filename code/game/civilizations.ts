class Civilization {
	name;
	symbol;
	color1;
	color2;
	research_ind;
	research_mil;
	research_hlt;
	members;
	points;
	constructor(name,symbol = "star",color1 = "#FFFFFF",color2 = "#000000",research_ind = 0,research_mil = 0,research_hlt = 0,members = [],points = 0) {
		this.name = name;
		this.symbol = symbol;
		this.color1 = color1;
		this.color2 = color2;
		this.research_ind = research_ind;
		this.research_mil = research_mil;
		this.research_hlt = research_hlt;
		this.members = members;
		this.points = points;
	}

}

module.exports = Civilization;
