const express = require('express');
const router = express.Router();

// middleware
const { authenticateUser } = require('../middleware/authentication');

// controllers
const {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
} = require('../controllers/reviewController');

router.route('/').post([authenticateUser], createReview).get(getAllReviews);

router
    .route('/:id')
    .get(getSingleReview)
    .delete([authenticateUser], deleteReview)
    .patch([authenticateUser], updateReview);

module.exports = router;
