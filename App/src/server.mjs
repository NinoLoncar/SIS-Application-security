import express from "express";
import session from "express-session";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import HtmlManager from "../managers/unsecure-html-manager.js";
import userService from "./services/user-service.js";
import loginHandler from "./login-handler.js";
import transactionService from "./services/transaction-service.js";
import newsService from "./services/news-service.js";
import twoFactorAuth from "./two-factor-auth.js";

const server = express();
const port = process.env.PORT;

server.use(
	session({
		secret: "secret",
		saveUninitialized: true,
		cookie: { maxAge: 1000 * 60 * 60, sameSite: "strict" },
		resave: false,
	})
);
server.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/css", express.static(path.join(__dirname, "../public/css")));
server.use("/js", express.static(path.join(__dirname, "../public/js")));
server.use("/images", express.static(path.join(__dirname, "../public/images")));

server.use((req, res, next) => {
	res.setHeader(
		"Content-Security-Policy",
		"default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src *; frame-src 'self'"
	);
	res.setHeader("X-Frame-Options", "sameorigin");
	server.disable("x-powered-by");
	res.setHeader("X-Content-Type-Options", "nosniff");

	if (
		!req.session.userId &&
		req.path !== "/unsecure/prijava" &&
		req.path !== "/unsecure/registracija" &&
		req.path !== "/secure/prijava" &&
		req.path !== "/secure/prijava"
	) {
		return res.redirect("/secure/prijava");
	}
	next();
});

ServeUnsecureHtml();
ServeSecureHtml();

server.get("/sesija/ulogirani-korisnik", async (req, res) => {
	userService.unsecureGetUserByEmail(req.session.email, res);
});
server.get("/sve-vijesti", newsService.getAllNews);
server.get("/najnovije-vijesti", newsService.getTwoNewestNews);
server.post("/dodaj-sredstva", transactionService.addFunds);
server.get("/komentari/:newsId", newsService.getCommentsByNewsId);

server.get("/odjava", loginHandler.logout);
server.get("/unsecure/vijest/:id", newsService.getNewsById);
server.post("/unsecure/registracija", userService.unsecurePostUser);
server.post("/unsecure/prijava", loginHandler.unsecureLogin);
server.post("/unsecure/posalji-sredstva", transactionService.unsecureSendFunds);
server.post("/unsecure/dodaj-vijest", newsService.unsecureAddNews);
server.post("/unsecure/dodaj-komentar", newsService.unsecureAddComment);

server.get("/secure/generiraj-qr", twoFactorAuth.generateQRCode);

server.listen(port, async () => {
	console.log(`Server pokrenut na portu: ${port}`);
});

function ServeUnsecureHtml() {
	let unsecureHtmlManager = new HtmlManager(false);

	server.get(
		"/unsecure/prijava",
		unsecureHtmlManager.getLoginHtml.bind(unsecureHtmlManager)
	);
	server.get(
		"/unsecure/registracija",
		unsecureHtmlManager.getRegistrationHtml.bind(unsecureHtmlManager)
	);
	server.get(
		"/unsecure/dodaj-vijest/",
		unsecureHtmlManager.getAddNewsHtml.bind(unsecureHtmlManager)
	);
	server.get(
		"/unsecure/transakcije/",
		unsecureHtmlManager.getTransactionsHtml.bind(unsecureHtmlManager)
	);
	server.get(
		"/unsecure/vijesti/",
		unsecureHtmlManager.getNewsHtml.bind(unsecureHtmlManager)
	);
	server.get(
		"/unsecure/",
		unsecureHtmlManager.getIndexHtml.bind(unsecureHtmlManager)
	);
	server.get(
		"/unsecure/vijesti/:id",
		unsecureHtmlManager.getNewsDetailsHtml.bind(unsecureHtmlManager)
	);
}

function ServeSecureHtml() {
	let secureHtmlManager = new HtmlManager(true);

	server.get(
		"/secure/prijava",
		secureHtmlManager.getLoginHtml.bind(secureHtmlManager)
	);
	server.get(
		"/secure/registracija",
		secureHtmlManager.getRegistrationHtml.bind(secureHtmlManager)
	);
	server.get(
		"/secure/dodaj-vijest/",
		secureHtmlManager.getAddNewsHtml.bind(secureHtmlManager)
	);
	server.get(
		"/secure/transakcije/",
		secureHtmlManager.getTransactionsHtml.bind(secureHtmlManager)
	);
	server.get(
		"/secure/vijesti/",
		secureHtmlManager.getNewsHtml.bind(secureHtmlManager)
	);
	server.get(
		"/secure/",
		secureHtmlManager.getIndexHtml.bind(secureHtmlManager)
	);
	server.get(
		"/secure/vijesti/:id",
		secureHtmlManager.getNewsDetailsHtml.bind(secureHtmlManager)
	);
}
