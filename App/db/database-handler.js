const SQLite = require("sqlite3").Database;

class DataBase {
    constructor(sqliteDBFilePath) {
        this.connectionDB = new SQLite(sqliteDBFilePath);
        this.sqliteDBFilePath = sqliteDBFilePath;
        this.connectionDB.exec("PRAGMA foreign_keys = ON;");
    }

    openConnection() {
        this.connectionDB = new SQLite(this.sqliteDBFilePath);
        this.connectionDB.exec("PRAGMA foreign_keys = ON;");
    }

    runQuery(sql, data, callbackFunction) {
        this.connectionDB.all(sql, data, callbackFunction);
    }

    runQuery(sql, data) {
        return new Promise((resolve, reject) => {
            this.connectionDB.all(sql, data, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    }

    closeConnection() {
        this.connectionDB.close();
    }
}
module.exports = DataBase;
