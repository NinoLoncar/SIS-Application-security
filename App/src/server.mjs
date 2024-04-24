import express from "express";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";
import HTMLManager from "../managers/html-manager.js";

const server = express();
const port = process.env.PORT;
let htmlManager = new HTMLManager();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/css", express.static(path.join(__dirname, "../public/css")));
server.use("/js", express.static(path.join(__dirname, "../public/js")));
server.use("/images", express.static(path.join(__dirname, "../public/images")));

server.get("/prijava", htmlManager.login);
server.get("/registracija", htmlManager.registration);
server.get("/", htmlManager.index);

server.listen(port, () => {
	console.log(`Server pokrenut na portu: ${port}`);
});
