const User = require('../model/User');
const {createJWT, isTokenValid} = require('../utils');
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
    const token = createJWT({payload: tokenUser});
    res.status(StatusCodes.CREATED).json({
        user: tokenUser,
        token
    });
}

const login = async (req, res) => {
    console.log(req.body);
    res.send('Login Auth Controller');
}

const logout = async (req, res) => {
    res.send('Logout Auth Controller');
}

module.exports = {
    register,
    login,
    logout,
}