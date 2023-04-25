const {getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword} = require('../controllers/userController');
const express = require('express');
const { update } = require('../model/User');
const router = express.Router();
const { authenticateUser, authorizePermission } = require('../middleware/authentication');

router.route('/').get(authenticateUser, authorizePermission('admin', 'owner'), getAllUsers);
router.route('/showMe').get(authenticateUser, showCurrentUser);
router.route('/updateUser').patch(authenticateUser, updateUser);
router.route('/updateUserPassword').post(authenticateUser, authorizePermission, updateUserPassword);
router.route('/:id').get(authenticateUser, authorizePermission('admin', 'owner'), getSingleUser);

module.exports = router;