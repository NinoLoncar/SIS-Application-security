const fs = require("fs/promises");
const path = require("path");
const CountryDAO = require("../db/DAOs/country-DAO.js");

class HTMLManager {
	getLoginHtml = async function (req, res) {
		let page = await loadPage("unsecure/login", req);
		res.send(page);
	};

	getRegistrationHtml = async function (req, res) {
		let page = await loadPage("unsecure/registration", req);
		page = await fillCountryDropdown(page);
		res.send(page);
	};

	getIndexHtml = async function (req, res) {
		let page = await loadPage("unsecure/index", req);
		res.send(page);
	};

	getProfileHtml = async function (req, res) {
		let page = await loadPage("unsecure/profile", req);
		res.send(page);
	};

	getNewsDetailsHtml = async function (req, res) {
		let page = await loadPage("unsecure/news-details", req);
		res.send(page);
	};
	getAddNewsHtml = async function (req, res) {
		let page = await loadPage("unsecure/add-news", req);
		res.send(page);
	};
	getTransactionsHtml = async function (req, res) {
		let page = await loadPage("unsecure/transactions", req);
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
