const NewsDAO = require("../../db/DAOs/news-DAO.js");
const UserDAO = require("../../db/DAOs/user-DAO.js");

exports.unsecureAddNews = async function (req, res) { //unsecure jer se ne provjerava role iz sesije
    let newsDAO = new NewsDAO();
    let newsData = req.body;
    res.type("application/json");
    let isValidNewsData = validateData(newsData);
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

exports.unsecureAddComment = async function (req, res) { //nema validacije
    if (!req.body.newsId || !req.body.content) {
        res.status(400);
        res.send("Nepotpuni podaci");
    }
    let newsDAO = new NewsDAO();
    let commentDate = new Date();
    let formatedDate = formatDate(commentDate)
    let commentData = {
        news_id: req.body.newsId,
        users_id: req.session.userId,
        content: req.body.content,
        date: formatedDate,
    }
    newsDAO.addComment(commentData).then(async () => {
        res.type("application/json");
        res.status(201);
        res.send("Uspješno dodavanje");
        return;
    });
};

exports.getCommentsByNewsId = async function (req, res) {
    let newsId = req.params.newsId;
    if (newsId === undefined) {
        res.status(400).send("Greška!");
        return;
    }

    let newsDAO = new NewsDAO();
    let userDAO = new UserDAO();

    try {
        let comments = await newsDAO.getCommentsByNewsId(newsId);
        for (let comment of comments) {
            let user = await userDAO.getUserById(comment.users_id);
            comment.user = user;
        }
        res.status(200).json(comments);
    } catch (error) {
        console.error("Greška prilikom dohvaćanja komentara:", error);
        res.status(500).send("Došlo je do pogreške prilikom dohvaćanja komentara.");
    }

}


function formatDate(date) {
    var formated = date.getDate() + '.'
        + (date.getMonth() + 1) + '.'
        + date.getFullYear();

    return formated
}

function validateData(newsData) {
    for (let key in newsData) {
        if (newsData[key] === "" || newsData[key] === null || newsData[key] === undefined) {
            return false;
        }
    }
    return true;
}