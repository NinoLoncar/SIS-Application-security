const fs = require("fs/promises");
const path = require("path");
const CountryDAO = require("../db/DAOs/country-DAO.js");
const encryption = require("../src/encryption.js");

class HtmlManager {
	constructor(isSecure) {
		if (isSecure == true) {
			this.pathBeginning = "secure";
		} else {
			this.pathBeginning = "unsecure";
		}
	}

	getLoginHtml = async function (req, res) {
		let page = await loadPage(this.pathBeginning + "/login", req);
		res.send(page);
	};

	getRegistrationHtml = async function (req, res) {
		let page = await loadPage(this.pathBeginning + "/registration", req);
		page = await fillCountryDropdown(page);
		res.send(page);
	};

	getIndexHtml = async function (req, res) {
		let page = await loadPage(this.pathBeginning + "/index", req);
		res.send(page);
	};

	getProfileHtml = async function (req, res) {
		let page = await loadPage(this.pathBeginning + "/profile", req);
		res.send(page);
	};

	getNewsDetailsHtml = async function (req, res) {
		let page = await loadPage(this.pathBeginning + "/news-details", req);
		res.send(page);
	};
	getAddNewsHtml = async function (req, res) {
		let page = await loadPage(this.pathBeginning + "/add-news", req);
		if (this.pathBeginning == "secure" && req.session.role == 1) {
			res.send(page);
			return;
		} else if (this.pathBeginning == "secure" && req.session.role != 1) {
			res.status(401);
			res.send("Niste autorizirani");
			return;
		}
	};
	getTransactionsHtml = async function (req, res) {
		let page = await loadPage(this.pathBeginning + "/transactions", req);
		if (this.pathBeginning == "secure") {
			page = page.replace(
				'<div id="send-funds">',
				`<div id="send-funds" data-hidden-text="${req.session.csrfToken}">`
			);
		}
		res.send(page);
	};
	getNewsHtml = async function (req, res) {
		let page = await loadPage(this.pathBeginning + "/news", req);
		res.send(page);
	};
}
module.exports = HtmlManager;

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

async function fillCountryDropdown(page) {
	let countryDAO = new CountryDAO();
	let countries = await countryDAO.getAllCountries();
	let options = `<option value="${0}">Odaberite državu</option>`;
	countries.forEach((country) => {
		options += `<option value="${country.id}">${country.name}</option>`;
	});
	page = page.replace("#države#", options);
	return page;
}
