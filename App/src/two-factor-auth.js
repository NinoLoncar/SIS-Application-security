const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

exports.generateQRCode = async function (req, res) {
    const secret = speakeasy.generateSecret({ name: 'SiS projekt FOI IPS' });
    //spremi secret u bazu podataka
    qrcode.toDataURL(secret.otpauth_url, (err, QRUrl) => {
        res.send(QRUrl);
    });
}

exports.generateQRCode = async function (req, res) {
    const userToken = req.body.token;
    const verified = speakeasy.totp.verify({
        secret: 123, //TU IDE POVUČENI KOD IZ BAZE
        encoding: 'ascii',
        token: userToken,
    });
    if (verified) {
        res.status(200).send(true);
    } else {
        res.status(401).send(false);
    }
}
