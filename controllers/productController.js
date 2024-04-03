const path = require('path');
const { StatusCodes } = require('http-status-codes');
const customError = require('../errors');
const Product = require('../models/Product');

async function createProduct(req, res) {
    req.body.user = req.user.userId;

    const product = await Product.create(req.body);

    return res.status(StatusCodes.CREATED).json({ product });
}

async function getAllProducts(req, res) {
    const products = await Product.find({});

    return res.status(StatusCodes.OK).json({ products, count: products.length });
}

async function getSingleProduct(req, res) {
    const { id: productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new customError.NotFoundError(`No product with id: ${productId}`);
    }

    return res.status(StatusCodes.OK).json({ product });
}

async function updateProduct(req, res) {
    const { id: productId } = req.params;

    const product = await Product.findByIdAndUpdate(productId, req.body, { new: true, runValidators: true });

    if (!product) {
        throw new customError.NotFoundError(`No product with id: ${productId}`);
    }

    return res.status(StatusCodes.OK).json({ product });
}

async function deleteProduct(req, res) {
    const { id: productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new customError.NotFoundError(`No product with id: ${productId}`);
    }

    await product.remove();

    return res.status(StatusCodes.OK).json({ msg: 'Success! Product removed!' });
}

async function uploadImage(req, res) {
    if (!req.files) {
        throw new customError.BadRequestError('No File Uploaded');
    }
    const productImage = req.files.image;
    if (!productImage.mimetype.startsWith('image')) {
        throw new customError.BadRequestError('Please upload image');
    }
    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
        throw new customError.BadRequestError('Please upload image smaller than 1MB');
    }
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
    await productImage.mv(imagePath);
    return res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
}

module.exports = { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage };
