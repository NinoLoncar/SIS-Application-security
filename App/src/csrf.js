const Tokens = require('csrf')
var tokens = new Tokens();



exports.createCSRFToken = function () {
    var secret = tokens.secretSync();
    var token = tokens.create(secret);
    return [secret, token];
};

exports.verifyCSRFToken = function (token, secret) {
    if (!tokens.verify(secret, token)) {
        return false;
    } else {
        return true;
    }
};