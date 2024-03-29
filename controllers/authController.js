const { attachCookiesToResponse } = require('../utils');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors/');

async function login(req, res) {
    return res.send('login');
}
async function register(req, res) {
    const { email, name, password } = req.body;
    const emailAlreadyExist = await User.findOne({ email });
    if (emailAlreadyExist) {
        throw new customError.BadRequestError('Email already exist!');
    }

    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const user = await User.create({ name, email, password, role });
    const tokenUser = {
        name: user.name,
        userId: user._id,
        role: user.role,
    };
    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({ user: tokenUser });
}

async function logout(req, res) {
    return res.send('logout');
}

module.exports = { register, login, logout };
