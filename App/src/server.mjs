import express from "express";
import session from "express-session";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import HtmlManager from "../managers/html-manager.js";
import userService from "./services/user-service.js";
import loginHandler from "./handlers/login-handler.js";
import registrationHandler from "./handlers/registration-handler.js";
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
	if (
		!req.session.userId &&
		req.path !== "/unsecure/prijava" &&
		req.path !== "/unsecure/registracija" &&
		req.path !== "/secure/prijava" &&
		req.path !== "/secure/registracija"
	) {
		return res.redirect("/secure/prijava");
	}
	next();
});

serveUnsecureHtml();

server.use((req, res, next) => {
	res.setHeader(
		"Content-Security-Policy",
		"default-src 'self'; script-src 'self' cdnjs.cloudflare.com; style-src 'self'; font-src 'self'; img-src 'self' data: *; frame-src 'self'"
	);
	res.setHeader("X-Frame-Options", "sameorigin");
	server.disable("x-powered-by");
	res.setHeader("X-Content-Type-Options", "nosniff");
	next();
});

serveSecureHtml();
serveAuthenticationAndAuthorization();
serveServices();

server.use((req, res) => {
	res.send(
		"Nepostojeca stranica, vrati se na <a href='/secure/prijava'>prijavu</a>"
	);
});

server.listen(port, async () => {
	console.log(`Server pokrenut na portu: ${port}`);
});

function serveUnsecureHtml() {
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

function serveSecureHtml() {
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

function serveServices() {
	server.get("/sve-vijesti", newsService.getAllNews);
	server.get("/najnovije-vijesti", newsService.getTwoNewestNews);
	server.get("/vijest/:id", newsService.getNewsById);
	server.post("/dodaj-sredstva", transactionService.addFunds);
	server.get("/komentari/:newsId", newsService.getCommentsByNewsId);

	server.post("/unsecure/dodaj-vijest", newsService.unsecureAddNews);
	server.post("/unsecure/dodaj-komentar", newsService.unsecureAddComment);

	server.post("/secure/dodaj-vijest", newsService.secureAddNews);
	server.post("/secure/dodaj-komentar", newsService.secureAddComment);
}
function serveAuthenticationAndAuthorization() {
	server.get("/odjava", loginHandler.logout);
	server.post(
		"/unsecure/registracija",
		registrationHandler.unsecureRegisterUser
	);
	server.post("/unsecure/prijava", loginHandler.unsecureLogin);
	server.post(
		"/unsecure/posalji-sredstva",
		transactionService.unsecureSendFunds
	);

	server.get("/secure/2fa", twoFactorAuth.activate2FA);
	server.post("/secure/prijava", loginHandler.secureLogin);
	server.post("/secure/provjeri-auth-kod", twoFactorAuth.verfiyToken);
	server.post("/secure/posalji-sredstva", transactionService.secureSendFunds);
	server.post("/secure/registracija", registrationHandler.secureRegisterUser);

	server.get("/sesija/ulogirani-korisnik", async (req, res) => {
		userService.unsecureGetUserByEmail(req.session.email, res);
	});
}
