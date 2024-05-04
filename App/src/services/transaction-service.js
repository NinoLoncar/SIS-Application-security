const UserDAO = require("../../db/DAOs/user-DAO.js");
const csrf = require('../csrf.js');

exports.addFunds = async function (req, res) {
    let funds = parseInt(req.body.funds);
    if (funds < 0 || isNaN(funds)) {
        res.type("application/json");
        res.status(400);
        res.send("Neuspješno dodavanje!");
        return;
    }
    let userDAO = new UserDAO();
    let oldBalance = await getUserBalance(req);
    let userId = req.session.userId;

    userDAO.addFunds(funds, userId).then(async () => {
        let newBalance = await getUserBalance(req);
        if (newBalance == oldBalance + funds) {
            res.type("application/json");
            res.status(200);
            res.send("Uspješno dodavanje");
            return;
        }
        else {
            res.type("application/json");
            res.status(400);
            res.send("Neuspješno dodavanje!");
            return;
        }
    });
}

exports.unsecureSendFunds = async function (req, res) {
    let receiverEmail = req.query.receiver;
    let funds = req.query.funds;
    let areValidFunds = validateFunds(funds);
    let validReceiverId = await validateReceiver(receiverEmail, req.session.email);

    if (!areValidFunds || !validReceiverId) {
        res.type("application/json");
        res.status(400);
        res.send("Neuspješno slanje!");
        return;
    }
    let userDAO = new UserDAO();
    let senderId = req.session.userId;
    userDAO.sendFunds(senderId, validReceiverId, funds).then(async () => {
        res.type("application/json");
        res.status(200);
        res.send("Uspješno dodavanje");
        return;
    });
}

exports.secureSendFunds = async function (req, res) {
    const csrfToken = req.header('X-CSRF-TOKEN');
    let secret = req.session.csrfSecret;
    let isValidCSRFToken = validateCSRFToken(csrfToken, secret);
    if (!isValidCSRFToken) {
        res.status(400).send("Neispravan CSRF token");
        return;
    }
    let receiverEmail = req.query.receiver;
    let funds = req.query.funds;
    let areValidFunds = validateFunds(funds);
    let validReceiverId = await validateReceiver(receiverEmail, req.session.email);

    if (!areValidFunds || !validReceiverId) {
        res.type("application/json");
        res.status(400);
        res.send("Neuspješno slanje!");
        return;
    }

    let userDAO = new UserDAO();
    let senderId = req.session.userId;
    userDAO.sendFunds(senderId, validReceiverId, funds).then(async () => {
        res.type("application/json");
        res.status(200);
        res.send("Uspješno dodavanje");
        return;
    });
}

function validateCSRFToken(token, secret) {
    return csrf.verifyCSRFToken(token, secret);
}

function validateFunds(funds) {
    return (funds < 0 || isNaN(funds)) ? false : true;
}

async function validateReceiver(receiverEmail, senderEmail) {
    if (receiverEmail == senderEmail) return false;
    let userDao = new UserDAO();
    let receiver = await userDao.getUserByEmail(receiverEmail);
    return receiver !== undefined ? receiver.id : false;
}

async function getUserBalance(req) {
    let userDAO = new UserDAO();
    let email = req.session.email;
    if (!email) return;
    let user = await userDAO.getUserByEmail(email);
    return user.balance;
}