const UserDAO = require("../../db/DAOs/user-DAO.js");

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

exports.unsecureSendFunds = async function (req, res) { //secure treba provjeravati token
    let receiverEmail = req.query.receiver;
    let funds = req.query.funds;
    let areValidFunds = validateFunds(funds);
    let validReceiverId = await validateReceiver(receiverEmail);

    if (!areValidFunds || !validReceiverId) {
        res.type("application/json");
        res.status(400);
        res.send("Neuspješno slanje!");
        return;
    }
    let userDAO = new UserDAO();
    let senderId = req.session.userId;
    console.log("sender: ", req.session);
    userDAO.sendFunds(senderId, validReceiverId, funds).then(async () => {
        res.type("application/json");
        res.status(200);
        res.send("Uspješno dodavanje");
        return;
    });
}

function validateFunds(funds) {
    return (funds < 0 || isNaN(funds)) ? false : true;
}

async function validateReceiver(receiverEmail) {
    let userDao = new UserDAO();
    let receiver = await userDao.unsecureGetUserByEmail(receiverEmail);
    return receiver !== undefined ? receiver.id : false;
}

async function getUserBalance(req) {
    let userDAO = new UserDAO();
    let email = req.session.email;
    if (!email) return;
    let user = await userDAO.unsecureGetUserByEmail(email);
    return user.balance;
}