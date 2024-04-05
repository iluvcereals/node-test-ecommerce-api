const customError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { checkPermissions } = require('../utils/');

async function getAllOrders(req, res) {
    return res.json({ msg: 'get all orders' });
}

async function getSingleOrder(req, res) {
    return res.json({ msg: 'get single order' });
}

async function getCurrentUserOrders(req, res) {
    return res.json({ msg: 'get current user orders' });
}

async function createOrder(req, res) {
    return res.json({ msg: 'create order' });
}

async function updateOrder(req, res) {
    return res.json({ msg: 'update order' });
}

module.exports = { getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder };
