import express from "express";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";
import UnsecureHtmlManager from "../managers/unsecure-html-manager.js";
import userRest from "./rest/user-rest.js";

const server = express();
const port = process.env.PORT;
let unsecureHtmlManager = new UnsecureHtmlManager();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/css", express.static(path.join(__dirname, "../public/css")));
server.use("/js", express.static(path.join(__dirname, "../public/js")));
server.use("/images", express.static(path.join(__dirname, "../public/images")));

server.get("/unsecure/prijava", unsecureHtmlManager.getLoginHtml);
server.get("/unsecure/registracija", unsecureHtmlManager.getRegistrationHtml);
server.get("/unsecure/", unsecureHtmlManager.getIndexHtml);

server.post("/unsecure/registracija", (req, res) => {
	userRest.unsecurePostUser(req, res);
});

server.listen(port, async () => {
	console.log(`Server pokrenut na portu: ${port}`);
});
