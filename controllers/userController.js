const { NotFoundError, BadRequestError, UnauthorizedError, UnauthenticatedError } = require('../errors');
const { StatusCodes }  =require('http-status-codes');
const validator = require('validator');
const User = require('../model/User');
const { createTokenUser, attachCookiesToResponse, checkPermissions } = require('../utils');


const getAllUsers = async (req, res) => {
    console.log(req.user);
    const users = await User.find({role: "user"}).select(["-password"]);
    if (!users) {
        throw new NotFoundError('We cant find users with role user');
    }
    console.log(users);
    res.status(StatusCodes.OK).json(users);
}

const getSingleUser = async (req, res) => {
    console.log(req.user);
    const { id } = req.params;
    const user = await User.findOne({_id: id}).select(["-password"]);
    if (!user) {
        throw new NotFoundError(`We cant find a User with the id ${id}`);
    }
    checkPermissions(re.user, user._id);
    console.log(user);
    res.status(StatusCodes.OK).json(user);
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user});
}

const updateUser = async (req, res) => {

    const { name, email} = req.body;
    const _id = req.user.userId;

    if (!name) {
        throw new BadRequestError('Please, provida a valid name');
    }
    if (!email || !validator.isEmail(email)) {
        throw new BadRequestError('Please, provid a valid email');
    }

    const user = await User.findOneAndUpdate({_id: _id}, {email, name}, {new: true, runValidators: true});
    if (!user) {
        throw new NotFoundError(`We cant find a user with id ${req.user._id}`);
    }
    
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res, user: tokenUser});

    res.status(StatusCodes.OK).json({user: tokenUser});
}

const updateUserPassword = async (req, res) => {

    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new BadRequestError('Please, provide a valid old password and new password');
    }

    const user = await User.findOne({_id: req.user.userId});
    if (!user) {
        throw new NotFoundError(`We cant find a user with id ${req.user._id}`);
    }

    const isPasswordCorrect = await user.checkPassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Please, provide a correct current password');
    }

    user.password = newPassword;
    await user.save({ user });
    
    res.status(StatusCodes.OK).json({msg: 'Password updated successfully'});
}

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
}