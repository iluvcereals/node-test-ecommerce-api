const { attachCookiesToResponse } = require('../utils');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors/');

async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new customError.BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({ email });

    if (!user) {
        throw new customError.UnauthenticatedError('Invalid Credentials');
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new customError.UnauthenticatedError('Invalid Credentials');
    }

    const tokenUser = {
        name: user.name,
        userId: user._id,
        role: user.role,
    };

    attachCookiesToResponse({ res, user: tokenUser });
    return res.status(StatusCodes.CREATED).json({ user: tokenUser });
}

async function register(_, res) {
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

    return res.status(StatusCodes.CREATED).json({ user: tokenUser });
}

async function logout(_, res) {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    return res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
}

module.exports = { register, login, logout };
