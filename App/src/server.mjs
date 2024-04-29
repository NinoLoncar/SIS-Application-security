import express from "express";
import session from "express-session";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";
import UnsecureHtmlManager from "../managers/unsecure-html-manager.js";
import userRest from "./rest/user-rest.js";
import loginHandler from "./login-handler.js";
import transactionService from "./transaction-service.js";

const server = express();
const port = process.env.PORT;

server.use(
	session({
		secret: "secret",
		saveUninitialized: true,
		cookie: { maxAge: 1000 * 60 * 60 },
		resave: false,
	})
);

let unsecureHtmlManager = new UnsecureHtmlManager();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/css", express.static(path.join(__dirname, "../public/css")));
server.use("/js", express.static(path.join(__dirname, "../public/js")));
server.use("/images", express.static(path.join(__dirname, "../public/images")));

server.get("/sesija/ulogirani-korisnik", async (req, res) => {
	userRest.getUserByEmail(req.session.email, res);
});
server.post("/add-funds", transactionService.addFunds);

server.get("/unsecure/prijava", unsecureHtmlManager.getLoginHtml);
server.get("/unsecure/registracija", unsecureHtmlManager.getRegistrationHtml);
server.get("/unsecure/profil", unsecureHtmlManager.getProfileHtml);
server.get("/unsecure/vijest-detalji/", unsecureHtmlManager.getNewsDetailsHtml);
server.get("/unsecure/dodaj-vijest/", unsecureHtmlManager.getAddNewsHtml);
server.get("/unsecure/transakcije/", unsecureHtmlManager.getTransactionsHtml);
server.get("/unsecure/vijesti/", unsecureHtmlManager.getNewsHtml);
server.get("/unsecure/", unsecureHtmlManager.getIndexHtml);

server.get("/unsecure/odjava", loginHandler.unsecureLogout)
server.post("/unsecure/registracija", userRest.unsecurePostUser);
server.post("/unsecure/prijava", loginHandler.unsecureLogin);
server.post("/unsecure/send-funds", transactionService.unsecureSendFunds);

server.listen(port, async () => {
	console.log(`Server pokrenut na portu: ${port}`);
});
