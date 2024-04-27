const DB = require("../database-handler.js");

class UserDAO {
	constructor() {
		this.db = new DB("./db/database.sqlite");
	}

	unsecureGetUserByEmailAndPassword = async function (email, password) {
		this.db.openConnection();
		let sql =
			"SELECT * FROM users WHERE email = '" +
			email +
			"' AND password ='" +
			password +
			"';";
		var data = await this.db.runQuery(sql, []);
		this.db.closeConnection();
		return data;
	};

	getUserByEmail = async function (email) {
		this.db.openConnection();
		let sql =
			"SELECT * FROM users WHERE email =?";
		var data = await this.db.runQuery(sql, [email]);
		this.db.closeConnection();
		return data[0];
	};

	unsecureAddNewUser = async function (user) {
		this.db.openConnection();
		let sql =
			"INSERT INTO users (roles_id, countries_id, name, surname, email, password, balance, address, postal) VALUES (" +
			user.roles_id +
			", " +
			user.countries_id +
			", '" +
			user.name +
			"', '" +
			user.surname +
			"', '" +
			user.email +
			"', '" +
			user.password +
			"', " +
			user.balance +
			", '" +
			user.address +
			"', '" +
			user.postal +
			"');";
		var result = await this.db.runQuery(sql, []);
		this.db.closeConnection();
		return result;
	}

	dajSveKorisnike = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik;";
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	};

	dajKorisnikaPoImenu = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korisnicko_ime=?;";
		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if (podaci.length == 1) return podaci[0];
		else return null;
	};

	dajKorisnikaPoImenuIliMailu = async function (korime, mail) {
		console.log("dajKorisnika " + korime + " " + mail);
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korisnicko_ime=? OR email=?;";
		var podaci = await this.baza.izvrsiUpit(sql, [korime, mail]);
		this.baza.zatvoriVezu();
		if (podaci.length != 0) return podaci;
		else return null;
	};

	dodajKorisnika = async function (korisnik) {
		console.log("Dodaj korisnika: " + JSON.stringify(korisnik));
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO korisnik (korisnicka_uloga_id, email, korisnicko_ime, lozinka, ime, prezime, telefonski_broj, adresa, postanski_broj, datum_registracije) VALUES (?,?,?,?,?,?,?,?,?,?)`;
		let podaci = [
			korisnik.korisnicka_uloga_id,
			korisnik.email,
			korisnik.korisnicko_ime,
			korisnik.lozinka,
			korisnik.ime,
			korisnik.prezime,
			korisnik.telefonski_broj,
			korisnik.adresa,
			korisnik.postanski_broj,
			korisnik.datum_registracije,
		];
		await this.baza.izvrsiUpit(sql, podaci);
		this.baza.zatvoriVezu();
		return true;
	};

	obrisiKorisnika = async function (korime) {
		console.log("Brisem korisnika iz baze: " + korime);
		this.baza.spojiSeNaBazu();
		let sql = "DELETE FROM korisnik WHERE korisnicko_ime=?";
		await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		return true;
	};

	azurirajKorisnika = async function (korime, korisnik) {
		this.baza.spojiSeNaBazu();
		let sql = `UPDATE korisnik SET ime=?, prezime=?, lozinka=?, adresa=?, postanski_broj=?, telefonski_broj=? WHERE korisnicko_ime=?`;
		let podaci = [
			korisnik.ime,
			korisnik.prezime,
			korisnik.lozinka,
			korisnik.adresa,
			korisnik.postanski_broj,
			korisnik.telefonski_broj,
			korime,
		];

		console.log(korisnik);
		console.log("Azuriram korisnika");
		await this.baza.izvrsiUpit(sql, podaci);
		this.baza.zatvoriVezu();
		return true;
	};
}

module.exports = UserDAO;
