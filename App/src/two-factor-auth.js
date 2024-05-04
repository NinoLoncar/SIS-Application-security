const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const UserDAO = require("../db/DAOs/user-DAO.js");

exports.activate2FA = async function (req, res) {
    let userDAO = new UserDAO();
    let userId = req.session.userId;
    let user = await userDAO.getUserById(userId);

    if (user.activated_2fa) {
        await userDAO.set2FAUserStatus(userId, false);
        res.status(200).send("Deaktivirana");
        return;
    }
    else {
        if (user.secret_key) {
            await userDAO.set2FAUserStatus(userId, true);
            res.status(200).send("Aktivirana");
            return;
        }
        else {
            let qrUrl = await generateQRCode(userId);
            await userDAO.set2FAUserStatus(userId, true);
            res.status(201).send(qrUrl);
            return;
        }
    }

}

async function generateQRCode(userId) {
    let userDAO = new UserDAO();
    const secret = speakeasy.generateSecret({ name: 'SiS projekt FOI IPS' });

    await userDAO.addSecretKeyToUserAccount(userId, secret.base32);

    return new Promise((resolve, reject) => {
        qrcode.toDataURL(secret.otpauth_url, (err, QRUrl) => {
            if (err) {
                reject(err);
            } else {
                resolve(QRUrl);
            }
        });
    });
}


exports.verfiyToken = async function (req, res) {
    let userDAO = new UserDAO();
    let userId = req.session.userId;
    const secretKey = await userDAO.getUserSecretKey(userId);
    const userToken = req.body.token;
    const verified = speakeasy.totp.verify({
        secret: secretKey,
        encoding: 'base32',
        token: userToken,
    });
    console.log(verified)
    if (verified) {
        res.status(200).send("Uspješna verifikacija");
    } else {
        res.status(401).send("Neuspješna verifikacija");
    }
}
