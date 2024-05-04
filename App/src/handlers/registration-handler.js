const UserDAO = require("../../db/DAOs/user-DAO.js");
const encryption = require("../encryption.js");

exports.unsecureRegisterUser = async function (req, res) {
	let userDAO = new UserDAO();
	let userData = req.body;
	let userWithSameEmailExists = await isEmailRegistered(userData.email);
	if (userWithSameEmailExists) {
		res.type("application/json");
		res.status(400);
		res.send(
			JSON.stringify({ error: "Korisnik s tim emailom je već registriran!" })
		);
		return;
	}
	userData.password = encryption.hashSha1(userData.password);
	userData.roles_id = 2; //hardkodira se user role
	userDAO.unsecureAddNewUser(userData).then(async (user) => {
		if (user) {
			res.type("application/json");
			res.status(201);
			res.send("Uspješno dodavanje!");
			return;
		}
	});
};

exports.secureRegisterUser = async function (req, res) {
	let userDAO = new UserDAO();
	let userData = req.body;
	let userWithSameEmailExists = await isEmailRegistered(userData.email);
	if (userWithSameEmailExists) {
		res.type("application/json");
		res.status(400);
		res.send(
			JSON.stringify({ error: "Korisnik s tim emailom je već registriran!" })
		);
		return;
	}
	let salt = await encryption.generateSalt();
	userData.password = await encryption.hashBcrypt(userData.password, salt);
	userData.salt = salt;
	userData.roles_id = 2; //hardkodira se user role
	userDAO.secureAddNewUser(userData).then(async (user) => {
		if (user) {
			res.type("application/json");
			res.status(201);
			res.send("Uspješno dodavanje!");
			return;
		}
	});
};

async function isEmailRegistered(email) {
	let userDAO = new UserDAO();
	let user = await userDAO.getUserByEmail(email);
	return user != undefined;
}
