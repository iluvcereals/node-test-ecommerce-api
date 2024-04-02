const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const { checkPermissions, createTokenUser, attachCookiesToResponse } = require('../utils');

async function getAllUsers(req, res) {
    console.log(req.user);
    const users = await User.find({ role: 'user' }).select('-password');

    return res.status(StatusCodes.OK).json({ users });
}

async function getSingleUser(req, res) {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
        throw new customError.NotFoundError('User not found');
    }

    checkPermissions(req.user, user._id);

    return res.status(StatusCodes.OK).json({ user });
}

async function showCurrentUser(req, res) {
    return res.status(StatusCodes.OK).json({ user: req.user });
}

async function updateUserPassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new customError.BadRequestError('Provide old and new password');
    }

    const user = await User.findById(req.user.userId);

    const isPasswordMatching = await user.comparePassword(oldPassword);

    if (!isPasswordMatching) {
        throw new customError.UnauthenticatedError('Invalid credentials');
    }

    user.password = newPassword;
    await user.save();

    return res.status(StatusCodes.OK).json({ msg: 'password changed successfully' });
}

async function updateUser(req, res) {
    const { name, email } = req.body;
    if (!name || !email) {
        throw new customError.BadRequestError('Provide old and new password');
    }

    const user = await User.findByIdAndUpdate(req.user.userId, { name, email }, { new: true, runValidators: true });

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });

    return res.status(200).json({ user: tokenUser });
}

module.exports = { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword };
