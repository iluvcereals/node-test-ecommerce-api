const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');

async function getAllUsers(req, res) {
    const users = await User.find({ role: 'user' }).select('-password');

    return res.status(StatusCodes.OK).json({ users });
}
async function getSingleUser(req, res) {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');

    if (!user) {
        throw new customError.NotFoundError('User not found');
    }

    return res.status(StatusCodes.OK).json({ user });
}
async function showCurrentUser(req, res) {
    return res.send('show current user');
}
async function updateUser(req, res) {
    const { name } = req.body;
    return res.status(200).json({ name });
}
async function updateUserPassword(req, res) {
    const { password } = req.body;
    return res.status(200).json({ password });
}

module.exports = { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword };
