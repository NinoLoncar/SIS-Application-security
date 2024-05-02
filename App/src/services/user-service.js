const UserDAO = require("../../db/DAOs/user-DAO.js");
const encryption = require("../encryption.js");

exports.unsecurePostUser = async function (req, res) {
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
	userData.password = encryption.encryptSha1(userData.password);
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

exports.unsecureGetUserByEmail = async function (email, res) {
	let userDAO = new UserDAO();
	userDAO.unsecureGetUserByEmail(email).then(async (user) => {
		if (user) {
			res.type("application/json");
			res.status(200);
			res.send(user);
			return;
		}
	});
};

exports.getUserById = async function (id, res) {
	let userDAO = new UserDAO();
	userDAO.getUserById(id).then(async (user) => {
		if (user) {
			res.type("application/json");
			res.status(200);
			res.send(user);
			return;
		}
	});
};

async function isEmailRegistered(email) {
	let userDAO = new UserDAO();
	let user = await userDAO.unsecureGetUserByEmail(email);
	return user != undefined;
}
