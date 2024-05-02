const DB = require("../database-handler.js");

class UserDAO {
	constructor() {
		this.db = new DB("./db/database.sqlite");
	}

	unsecureGetUserByEmailAndPassword = async function (email, password) {
		this.db.openConnection();
		let sql =
			"SELECT * FROM users WHERE email = '" +
			email +
			"' AND password ='" +
			password +
			"';";
		var data = await this.db.runQuery(sql, []);
		this.db.closeConnection();
		return data;
	};

	unsecureGetUserByEmail = async function (email) {
		this.db.openConnection();
		let sql =
			"SELECT * FROM users WHERE email = '" + email + "' ";
		var data = await this.db.runQuery(sql, []);
		this.db.closeConnection();
		return data[0];
	};

	getUserById = async function (id) {
		this.db.openConnection();
		let sql =
			"SELECT * FROM users WHERE id =?";
		var data = await this.db.runQuery(sql, [id]);
		this.db.closeConnection();
		return data[0];
	};

	unsecureAddNewUser = async function (user) {
		this.db.openConnection();
		let sql =
			"INSERT INTO users (roles_id, countries_id, name, surname, email, password, balance, address, postal) VALUES (" +
			user.roles_id +
			", " +
			user.countries_id +
			", '" +
			user.name +
			"', '" +
			user.surname +
			"', '" +
			user.email +
			"', '" +
			user.password +
			"', " +
			user.balance +
			", '" +
			user.address +
			"', '" +
			user.postal +
			"');";
		var result = await this.db.runQuery(sql, []);
		this.db.closeConnection();
		return result;
	}

	addFunds = async function (funds, receiverId) {
		this.db.openConnection();
		let sql = "UPDATE users SET balance = balance + ? WHERE id =?";
		var result = await this.db.runQuery(sql, [funds, receiverId]);
		this.db.closeConnection();
		return result;
	}

	sendFunds = async function (senderId, receiverId, funds) {
		this.db.openConnection();
		let sql = 'UPDATE users SET balance = CASE WHEN id = ? THEN balance + ? WHEN id = ? THEN balance - ? ELSE balance END WHERE id IN (?, ?);';
		var result = await this.db.runQuery(sql, [receiverId, funds, senderId, funds, receiverId, senderId]);
		this.db.closeConnection();
		return result;
	}
}
module.exports = UserDAO;
