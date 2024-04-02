const { authorizePermissions, authenticateUser } = require('../middleware/authentication.js');

const express = require('express');
const router = express.Router();

// Controller
const {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
} = require('../controllers/productController.js');

router
    .route('/')
    .get(getAllProducts)

    .post([authenticateUser, authorizePermissions('admin')], createProduct);
router.route('/uploadImage').post([authenticateUser, authorizePermissions('admin')], uploadImage);
router
    .route('/:id')
    .post(getSingleProduct)
    .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
    .delete([authenticateUser, authorizePermissions('admin')], deleteProduct);

module.exports = router;
