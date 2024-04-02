const customError = require('../errors');

function checkPermisions(requestUser, resouceUserId) {
    if (requestUser.role === 'admin') return;
    if (requestUser.userId === resouceUserId.toString()) return;
    throw new customError.UnauthorizedError('Not authorized to access this route');
}

module.exports = checkPermisions;
