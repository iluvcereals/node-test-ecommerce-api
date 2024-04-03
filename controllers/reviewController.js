const customError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { checkPermission, checkPermissions } = require('../utils');
const checkPermisions = require('../utils/checkPermissions');

async function createReview(req, res) {
    const { product: productId } = req.body;

    const isProductValid = await Product.findById(productId);
    if (!isProductValid) {
        throw new customError.NotFoundError(`No product with id: ${productId}`);
    }

    const alreadySubmitted = await Review.findOne({ product: productId, user: req.user.userId });
    if (alreadySubmitted) {
        throw new customError.BadRequestError('Already submitted review for this product');
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    return res.status(StatusCodes.CREATED).json({ review });
}

async function getAllReviews(req, res) {
    const reviews = await Review.find({}).populate({ path: 'product', select: 'name company price' });

    return res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
}

async function getSingleReview(req, res) {
    const { id: reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new customError.NotFoundError(`No review with id ${reviewId}`);
    }

    return res.status(StatusCodes.OK).json({ review });
}

async function updateReview(req, res) {
    const { id: reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new customError.NotFoundError(`No review with id ${reviewId}`);
    }

    checkPermissions(req.user, review.user);

    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();

    return res.json({ review });
}

async function deleteReview(req, res) {
    const { id: reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new customError.NotFoundError(`No review with id ${reviewId}`);
    }

    checkPermissions(req.user, review.user);

    await review.remove();

    return res.json({ msg: 'review deleted' });
}

module.exports = { createReview, getAllReviews, getSingleReview, updateReview, deleteReview };
