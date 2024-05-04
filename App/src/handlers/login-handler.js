const UserDAO = require("../../db/DAOs/user-DAO.js");
const encryption = require("../encryption.js");

exports.unsecureLogin = async function (req, res) {
	let userDAO = new UserDAO();
	let userData = req.body;
	res.type("application/json");
	let userExists = await userDAO.unsecureGetUserByEmail(userData.email);
	if (!userExists) {
		res.status(400);
		res.send(JSON.stringify({ error: "Upisali ste krivi email!" }));
		return;
	}
	let encryptedPassword = encryption.hashSha1(userData.password);
	let result = await userDAO.unsecureGetUserByEmailAndPassword(
		userData.email,
		encryptedPassword
	);
	if (result.length > 0) {
		req.session.userId = result[0].id;
		req.session.email = result[0].email;
		req.session.role = result[0].roles_id;
		req.session.secure_app_user = result[0].secure_app_user;

		res.status(200);
		res.send(JSON.stringify({ message: "Uspješna prijava!" }));
		return;
	} else {
		res.status(400);
		res.send(JSON.stringify({ error: "Upisali ste krivu lozinku!" }));
		return;
	}
};

exports.secureLogin = async function (req, res) {
	let userDAO = new UserDAO();
	let userData = req.body;
	res.type("application/json");
	let encryptedPassword = encryption.hashSha1(userData.password); //promijeniti u bolji sha
	let result = await userDAO.unsecureGetUserByEmailAndPassword(
		userData.email,
		encryptedPassword
	);
	if (result.length > 0) {
		req.session.userId = result[0].id;
		req.session.email = result[0].email;
		req.session.role = result[0].roles_id;
		req.session.secure_app_user = result[0].secure_app_user;
		res.status(200);
		res.send(JSON.stringify(result[0]));
		return;
	} else {
		res.status(400);
		res.send(JSON.stringify({ error: "Netočni podaci!" }));
		return;
	}
};

exports.logout = async function (req, res) {
	req.session.userId = null;
	req.session.email = null;
	req.session.role = null;
	req.session.secure_app_user = null;
	res.redirect("/secure/prijava");
};