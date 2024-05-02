import express from "express";
import session from "express-session";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";
import UnsecureHtmlManager from "../managers/unsecure-html-manager.js";
import userService from "./services/user-service.js";
import loginHandler from "./login-handler.js";
import transactionService from "./services/transaction-service.js";
import newsService from "./services/news-service.js";
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

server.use((req, res, next) => {
	if (
		!req.session.userId &&
		req.path !== "/unsecure/prijava" &&
		req.path !== "/unsecure/registracija"
	) {
		return res.redirect("/unsecure/prijava");
	}
	next();
});

server.get("/sesija/ulogirani-korisnik", async (req, res) => {
	userService.unsecureGetUserByEmail(req.session.email, res);
});
server.get("/sve-vijesti", newsService.getAllNews);
server.get("/najnovije-vijesti", newsService.getTwoNewestNews);
server.post("/dodaj-sredstva", transactionService.addFunds);
server.get("/komentari/:newsId", newsService.getCommentsByNewsId);

server.get("/unsecure/prijava", unsecureHtmlManager.getLoginHtml);
server.get("/unsecure/registracija", unsecureHtmlManager.getRegistrationHtml);
server.get("/unsecure/dodaj-vijest/", unsecureHtmlManager.getAddNewsHtml);
server.get("/unsecure/transakcije/", unsecureHtmlManager.getTransactionsHtml);
server.get("/unsecure/vijesti/", unsecureHtmlManager.getNewsHtml);
server.post("/unsecure/dodaj-komentar", newsService.unsecureAddComment);

server.get("/unsecure/", unsecureHtmlManager.getIndexHtml);

server.get("/unsecure/vijesti/:id", unsecureHtmlManager.getNewsDetailsHtml);
server.get("/unsecure/vijest/:id", newsService.getNewsById);

server.get("/unsecure/odjava", loginHandler.unsecureLogout);
server.post("/unsecure/registracija", userService.unsecurePostUser);
server.post("/unsecure/prijava", loginHandler.unsecureLogin);
server.post("/unsecure/posalji-sredstva", transactionService.unsecureSendFunds);
server.post("/unsecure/dodaj-vijest", newsService.unsecureAddNews);

server.listen(port, async () => {
	console.log(`Server pokrenut na portu: ${port}`);
});
