import express from "express";
import "dotenv/config";
import { fileURLToPath } from "url";
import path from "path";

const server = express();
const port = process.env.PORT;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/css", express.static(path.join(__dirname, "../public/css")));
server.use("/js", express.static(path.join(__dirname, "../public/js")));

server.get("/", (req, res) => {
	console.log(path.join(__dirname, "../public/html/index.html"));
	res.sendFile(path.join(__dirname, "../public/html/index.html"));
});

server.listen(port, () => {
	console.log(`Server pokrenut na portu: ${port}`);
});
