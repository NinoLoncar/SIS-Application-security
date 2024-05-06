const DB = require("../database-handler.js");

class CountryDAO {
	constructor() {
		this.db = new DB("./db/database.sqlite");
	}

	getAllCountries = async function () {
		this.db.openConnection();
		let sql = "SELECT * FROM countries";
		var data = await this.db.runQuery(sql, []);
		this.db.closeConnection();
		return data;
	};

	getCountryById = async function (id) {
		this.db.openConnection();
		let sql = "SELECT * FROM countries WHERE id=?";
		var data = await this.db.runQuery(sql, [id]);
		this.db.closeConnection();
		if (data.length == 1) return data[0];
	};
}
module.exports = CountryDAO;
