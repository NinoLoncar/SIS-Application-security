const DB = require("../database-handler.js");

class RoleDAO {
    constructor() {
        this.db = new DB("./db/database.sqlite");
    }

    getRoleByName = async function (name) {
        this.db.openConnection();
        let sql = "SELECT * FROM roles WHERE name = ?";
        var data = await this.db.runQuery(sql, [name]);
        this.db.closeConnection();
        return data[0];
    };
}
module.exports = RoleDAO;