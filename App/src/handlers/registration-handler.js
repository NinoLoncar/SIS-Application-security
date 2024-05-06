const UserDAO = require("../../db/DAOs/user-DAO.js");
const CountryDao = require("../../db/DAOs/country-DAO");
const encryption = require("../encryption.js");
const validator = require("../validator.js");

exports.unsecureRegisterUser = async function (req, res) {
	let userDAO = new UserDAO();
	let userData = req.body;
	let userWithSameEmailExists = await isEmailRegistered(userData.email);
	if (userWithSameEmailExists) {
		res.type("application/json");
		res.status(400);
		res.send("Korisnik s tim emailom već postoji");
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
	let countryDao = new CountryDao();
	let userData = req.body;

	console.log(userData);
	if (validator.validateRegistratonData(userData) == false) {
		res.type("application/json");
		res.status(400);
		res.send("Neispravni podaci");
		return;
	}

	let userWithSameEmailExists = await isEmailRegistered(userData.email);
	if (userWithSameEmailExists) {
		res.type("application/json");
		res.status(400);
		res.send("Email je već registriran");
		return;
	}

	let country = await countryDao.getCountryById(userData.countries_id);
	if (country == undefined) {
		res.type("application/json");
		res.status(400);
		res.send("Zemlja ne postoji");
		return;
	}

	let salt = await encryption.generateSalt();
	userData.password = await encryption.hashBcrypt(userData.password, salt);
	userData.salt = salt;
	userData.roles_id = 2;
	userData.balance = 0;
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
