const UserDAO = require("../../db/DAOs/user-DAO.js");

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
