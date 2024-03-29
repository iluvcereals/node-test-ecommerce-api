const jwt = require('jsonwebtoken');

function createJWT({ payload }) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
}

function isTokenValid({ payload }) {
    return jwt.verify(payload, process.env.JWT_SECRET);
}

function attachCookiesToResponse({ res, user }) {
    const token = createJWT({ payload: user });
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expiresIn: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    });
}

module.exports = { createJWT, isTokenValid, attachCookiesToResponse };
