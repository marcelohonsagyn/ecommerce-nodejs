const User = require('../model/User');
const { attachCookiesToResponse } = require('../utils');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {

    console.log(req.body);
    const { email, name, password } = req.body;
    const userSaved = await User.findOne({ email: email });

    if (userSaved) {
        throw new BadRequestError(`There is a User with this email, ${email}`);
    }

    const isFirstUser = await User.countDocuments({});
    const role = (isFirstUser === 0) ? 'admin' : 'user';
    const user = await User.create({ email, name, password, role });
    const tokenUser = { name: user.name, userId: user._id, role: user.role };

    attachCookiesToResponse({ res, user: tokenUser });

    res.status(StatusCodes.CREATED).json({ user: tokenUser });
}

const login = async (req, res) => {

    const {email, password} = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please, provide an email and password');
    }

    const user = await User.findOne({email: email});
    if (!user) {
        throw new UnauthenticatedError(`There is no user with this email associated, ${email}`);
    }

    const isCorrectPassword = await user.checkPassword(password);
    if (!isCorrectPassword) {
        throw new UnauthenticatedError('Please, check your email and password');
    }

    const tokenUser = { name: user.name, userId: user._id, role: user.role };
    attachCookiesToResponse({res, user: tokenUser}); 
    res.status(StatusCodes.OK).json({user: tokenUser});
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', { httpOnly: true,  expires: new Date(Date.now() + 5 * 1000) });
    res.status(StatusCodes.OK).json({msg: 'user logout'});
}

module.exports = {
    register,
    login,
    logout,
}