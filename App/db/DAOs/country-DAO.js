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
}
module.exports = CountryDAO;
