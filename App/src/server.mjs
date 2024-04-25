import express from "express";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";
import UnsecureHtmlManager from "../managers/unsecure-html-manager.js";

const server = express();
const port = process.env.PORT;
let unsecureHtmlManager = new UnsecureHtmlManager();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/css", express.static(path.join(__dirname, "../public/css")));
server.use("/js", express.static(path.join(__dirname, "../public/js")));
server.use("/images", express.static(path.join(__dirname, "../public/images")));

server.get("/prijava", unsecureHtmlManager.getLoginHtml);
server.get("/registracija", unsecureHtmlManager.getRegistrationHtml);
server.get("/", unsecureHtmlManager.getIndexHtml);

server.listen(port, () => {
	console.log(`Server pokrenut na portu: ${port}`);
});
