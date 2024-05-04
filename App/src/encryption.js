const crypto = require("crypto");
const bcrypt = require("bcrypt");

exports.encryptSha1 = function (text) {
	const sha1 = crypto.createHash("sha1");
	sha1.write(text);
	var output = sha1.digest("hex");
	sha1.end();
	console.log(output);
	return output;
};

exports.generateSalt = async function () {
	let salt = await bcrypt.genSalt();
	return salt;
};

exports.hashBcrypt = async function (password, salt) {
	let hash = await bcrypt.hash(password, salt);
	return hash;
};
