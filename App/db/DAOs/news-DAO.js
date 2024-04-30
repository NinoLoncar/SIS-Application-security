const DB = require("../database-handler.js");

class NewsDAO {
    constructor() {
        this.db = new DB("./db/database.sqlite");
    }

    getAllNews = async function () {
        this.db.openConnection();
        let sql = "SELECT * FROM news ORDER BY id DESC";
        var data = await this.db.runQuery(sql, []);
        this.db.closeConnection();
        return data;
    }

    getTwoNewestNews = async function () {
        this.db.openConnection();
        let sql = "SELECT * FROM news ORDER BY id DESC LIMIT 2";
        var data = await this.db.runQuery(sql, []);
        this.db.closeConnection();
        return data;
    };

    getNewsById = async function (id) {
        this.db.openConnection();
        let sql = "SELECT * FROM news WHERE id = ?";
        var result = await this.db.runQuery(sql, [id]);
        this.db.closeConnection();
        return result[0];
    }

    addNews = async function (news) {
        this.db.openConnection();
        let sql = "INSERT INTO news (heading, content, url) VALUES (?, ?, ?)";
        var result = await this.db.runQuery(sql, [news.title, news.content, news.url]);
        this.db.closeConnection();
        return result;
    }
}
module.exports = NewsDAO;