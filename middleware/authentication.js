const customError = require('../errors');
const { isTokenValid } = require('../utils');

async function authenticateUser(req, res, next) {
    const { token } = req.signedCookies;
    const isValid = isTokenValid({ payload: token });
    if (!isValid) {
        console.log('no token present');
    } else {
        console.log('token present');
    }
    next();
}

module.exports = { authenticateUser };
