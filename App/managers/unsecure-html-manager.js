const fs = require("fs/promises");
const path = require("path");

class HTMLManager {
	getLoginHtml = async function (req, res) {
		let page = await loadPage("unsecure/login", req);
		res.send(page);
	};

	getRegistrationHtml = async function (req, res) {
		let page = await loadPage("unsecure/registration", req);
		res.send(page);
	};

	getIndexHtml = async function (req, res) {
		let page = await loadPage("unsecure/index", req);
		res.send(page);
	};
}
module.exports = HTMLManager;

async function loadPage(pageName, req) {
	let page = loadHTML(pageName);
	return page;
}

function loadHTML(page) {
	return fs.readFile(
		path.join(__dirname, "../public/html/" + page + ".html"),
		"UTF-8"
	);
}
