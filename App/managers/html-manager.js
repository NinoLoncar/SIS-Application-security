const fs = require("fs/promises");
const path = require("path");

class HTMLManager {
    login = async function (req, res) {
        let page = await loadPage("login", req);
        res.send(page);
    };

    registration = async function (req, res) {
        let page = await loadPage("registration", req);
        res.send(page);
    };

    index = async function (req, res) {
        let page = await loadPage("index", req);
        res.send(page);
    };
}
module.exports = HTMLManager;

async function loadPage(pageName, req) {
    let page = loadHTML(pageName);
    return page;
}

function loadHTML(page) {
    return fs.readFile(path.join(__dirname, "../public/html/" + page + ".html"), "UTF-8");
}
