const { createReview, getAllReviews, getSingleReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { Review } = require('../model/Review');
const express = require('express');
const router = express.Router();
const { authenticateUser, authorizePermission } = require('../middleware/authentication');
const { create } = require('../model/Product');

router.route('/').get(getAllReviews);
router.route('/').post(authenticateUser, createReview);
router.route('/:id').delete(authenticateUser, authorizePermission('admin'), deleteReview);
router.route('/:id').patch(authenticateUser, authorizePermission('admin'), updateReview);
router.route('/:id').get(getSingleReview);

module.exports = router;