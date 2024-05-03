exports.generateQRCode = async function (req, res) {
    const secret = speakeasy.generateSecret({ name: 'SiS projekt FOI IPS' });
    //spremi secret
    //qrcode.toData
}
