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

	secureGetUserByEmailAndPassword = async function (email, password) {
		this.db.openConnection();
		let sql = "SELECT * FROM users WHERE email = ? AND password = ?;";
		var data = await this.db.runQuery(sql, [email, password]);
		this.db.closeConnection();
		return data;
	};

	getUserByEmail = async function (email) {
		this.db.openConnection();
		let sql = "SELECT * FROM users WHERE email = ?";
		var data = await this.db.runQuery(sql, [email]);
		this.db.closeConnection();
		return data[0];
	};

	unsecureGetUserByEmail = async function (email) {
		this.db.openConnection();
		let sql =
			"SELECT * FROM users WHERE email = '" +
			email + "';";
		var data = await this.db.runQuery(sql, [email]);
		this.db.closeConnection();
		return data[0];
	};

	getUserById = async function (id) {
		this.db.openConnection();
		let sql = "SELECT * FROM users WHERE id =?";
		var data = await this.db.runQuery(sql, [id]);
		this.db.closeConnection();
		return data[0];
	};

	unsecureAddNewUser = async function (user) {
		this.db.openConnection();
		let sql =
			"INSERT INTO users (roles_id, countries_id, name, surname, email, password, balance, address, postal, secure_app_user) VALUES (" +
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
			"', false);";
		var result = await this.db.runQuery(sql, []);
		this.db.closeConnection();
		return result;
	};

	secureAddNewUser = async function (user) {
		this.db.openConnection();
		let sql =
			"INSERT INTO users (roles_id, countries_id, name, surname, email, password, balance, address, postal, salt, secure_app_user) VALUES (?,?,?,?,?,?,?,?,?,?,?);";
		let data = [
			user.roles_id,
			user.countries_id,
			user.name,
			user.surname,
			user.email,
			user.password,
			user.balance,
			user.address,
			user.postal,
			user.salt,
			true,
		];
		var result = await this.db.runQuery(sql, data);
		this.db.closeConnection();
		return result;
	};

	addFunds = async function (funds, receiverId) {
		this.db.openConnection();
		let sql = "UPDATE users SET balance = balance + ? WHERE id =?";
		var result = await this.db.runQuery(sql, [funds, receiverId]);
		this.db.closeConnection();
		return result;
	};

	sendFunds = async function (senderId, receiverId, funds) {
		this.db.openConnection();
		let sql =
			"UPDATE users SET balance = CASE WHEN id = ? THEN balance + ? WHEN id = ? THEN balance - ? ELSE balance END WHERE id IN (?, ?);";
		var result = await this.db.runQuery(sql, [
			receiverId,
			funds,
			senderId,
			funds,
			receiverId,
			senderId,
		]);
		this.db.closeConnection();
		return result;
	};

	set2FAUserStatus = async function (userId, status) {
		this.db.openConnection();
		let sql = "UPDATE users SET activated_2fa = ? WHERE id = ?";
		var result = await this.db.runQuery(sql, [status, userId]);
		this.db.closeConnection();
		return result;
	};

	addSecretKeyToUserAccount = async function (userId, secretKey) {
		this.db.openConnection();
		let sql = "UPDATE users SET secret_key = ? WHERE id = ?";
		var result = await this.db.runQuery(sql, [secretKey, userId]);
		this.db.closeConnection();
		return result;
	};

	getUserSecretKey = async function (userId) {
		this.db.openConnection();
		let sql = "SELECT secret_key FROM users WHERE id = ?";
		var result = await this.db.runQuery(sql, [userId]);
		this.db.closeConnection();
		return result[0].secret_key;
	};
}
module.exports = UserDAO;
