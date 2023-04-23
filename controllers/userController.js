const { NotFoundError, BadRequestError, UnauthorizedError, UnauthenticatedError } = require('../errors');
const { StatusCodes }  =require('http-status-codes');
const User = require('../model/User');
const { login } = require('./authController');


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
    console.log(user);
    res.status(StatusCodes.OK).json(user);
}

const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user: req.user});
}

const updateUser = async (req, res) => {

    const user = User.findOne({_id: req.user._id});
    if (!user) {
        throw new NotFoundError(`We cant find a user with id ${req.user._id}`);
    }
    
    user.email = req.user.email;
    user.name = req.user.name;
    user.role = req.user.role;

    User.updateOne({user});
    
    res.status(StatusCodes.OK).json({user: user})
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