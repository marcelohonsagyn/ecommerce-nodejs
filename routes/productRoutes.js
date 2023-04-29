const { createProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct, uploadImage } = require('../controllers/productController');
const { getSingleProductReviews } = require('../controllers/reviewController');
const express = require('express');
const { Product } = require('../model/Product');
const router = express.Router();
const { authenticateUser, authorizePermission } = require('../middleware/authentication');

router.route('/').get(getAllProducts);
router.route('/').post(authenticateUser, authorizePermission('admin'), createProduct);
router.route('/:id').patch(authenticateUser, authorizePermission('admin'), updateProduct);
router.route('/:id').delete(authenticateUser, authorizePermission('admin'), deleteProduct);
router.route('/uploadImage').post(authenticateUser, authorizePermission('admin'), uploadImage);
router.route('/:id').get(getSingleProduct);
router.route('/:id/reviews').get(getSingleProductReviews);

module.exports = router;