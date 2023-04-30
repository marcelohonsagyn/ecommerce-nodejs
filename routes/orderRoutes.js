const { getAllOrders, getSingleOrder, getCurrentUserOrders, updateOrder, createOrder } = require('../controllers/orderController');
const CustomError = require('../errors');
const { authenticateUser, authorizePermission } = require('../middleware/authentication')
const express = require('express');
const router = express.Router();

router.route('/').post(authenticateUser, createOrder);
router.route('/').get(authenticateUser, authorizePermission('admin'), getAllOrders);
router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders);
router.route('/:id').patch(authenticateUser, authorizePermission('admin', 'owner'), updateOrder);
router.route('/:id').get(authenticateUser, authorizePermission('admin', 'owner'), getSingleOrder);

module.exports = router;