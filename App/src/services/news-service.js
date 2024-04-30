const NewsDAO = require("../../db/DAOs/news-DAO.js");

exports.unsecureAddNews = async function (req, res) { //unsecure jer se ne provjerava role iz sesije
    let newsDAO = new NewsDAO();
    let newsData = req.body;
    res.type("application/json");
    let isValidNewsData = validateNewsData(newsData);
    if (!isValidNewsData) {
        res.status(400);
        res.send("Neispravni podaci!");
        return;
    }
    newsDAO.addNews(newsData).then(async (result) => {
        res.type("application/json");
        res.status(201);
        res.send("Uspješno dodavanje");
        return;
    });
};

exports.getAllNews = async function (req, res) {
    let newsDAO = new NewsDAO();
    res.type("application/json");
    newsDAO.getAllNews().then(async (result) => {
        res.type("application/json");
        res.status(200);
        res.send(result);
        return;
    });
}

exports.getNewsById = async function (req, res) {
    let newsId = req.params.id;
    if (newsId === undefined) {
        res.status(400);
        res.send("Greška!");
    }
    let newsDAO = new NewsDAO();
    res.type("application/json");
    newsDAO.getNewsById(newsId).then(async (result) => {
        res.type("application/json");
        res.status(200);
        res.send(result);
        return;
    });
}

exports.getTwoNewestNews = async function (req, res) {
    let newsDAO = new NewsDAO();
    res.type("application/json");
    newsDAO.getTwoNewestNews().then(async (result) => {
        res.type("application/json");
        res.status(200);
        res.send(result);
        return;
    });
}

function validateNewsData(newsData) {
    for (let key in newsData) {
        if (newsData[key] === "" || newsData[key] === null || newsData[key] === undefined) {
            return false;
        }
    }
    return true;
}