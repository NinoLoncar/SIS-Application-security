const crypto = require("crypto");

exports.encryptSha1 = function (text) {
	const sha1 = crypto.createHash("sha1");
	sha1.write(text);
	var output = sha1.digest("hex");
	sha1.end();
	console.log(output);
	return output;
};
