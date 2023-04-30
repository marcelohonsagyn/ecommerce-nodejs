const Product = require('../model/Product');
const Order = require('../model/Order');
const { checkPermissions } = require('../utils');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

const getAllOrders = async (req, res) => {

    const orders = await Order.find({}).sort({"createdAt": -1});
    if (!orders || orders.length < 1) {
        throw new CustomError.NotFoundError('We not found orders');
    }

    res.status(StatusCodes.OK).json({orders, count: orders.length});
}

const getSingleOrder = async (req, res) => {

    const order = await getOrder(req, res);

    res.status(StatusCodes.OK).json({order});
}

const getCurrentUserOrders = async (req, res) => {

    const { id } = req.params;
    const order = await Order.findOne({user: req.user.userId});
    if (!order) {
        throw new CustomError.NotFoundError(`We not found order with the id ${id}`);
    } 
    
    res.status(StatusCodes.OK).json({order});
}

const createOrder = async (req, res) => {
    const { items: carItems, tax, shippingFee } = req.body;
    if (!carItems || carItems.length < 0 ) {
        throw new CustomError.BadRequestError('Please, add itens in your cart.');
    }

    if (!tax) {
        throw new CustomError.BadRequestError('Please, provide the Tax Value');
    }

    if (!shippingFee) {
        throw new CustomError.BadRequestError('Please, provide the Shipping Fee Value');
    }

    let orderItems = [];
    let subTotal = 0;
    for (const item of carItems) {
        const productSaved = await Product.findOne({ _id: item.product });
        if (!productSaved) {
            throw new CustomError.NotFoundError(`There is no product with the id ${item.product}`);
        }

        const { name, price, image, _id } = productSaved;
        const singleOrderItem = {
            amount: item.amount,
            name, 
            price, 
            image, 
            product: _id,
        }
        orderItems = [...orderItems, singleOrderItem];
        subTotal += item.amount * price; 
    }
    //Calculate Total
    const total = tax + shippingFee + subTotal;
    //get client secret
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
    });


    const order = await Order.create({
        orderItems,
        total,
        subTotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId,
    });

    res.status(StatusCodes.CREATED).json({order, clientSecret:order.clientSecret});
}

const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = 'someRandomValue';
    return { client_secret, amount };
}

const updateOrder = async (req, res) => {

    const { paymentIntentId } = req.body;
    const order = await getOrder(req, res);
    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';

    await order.save();

    res.status(StatusCodes.OK).json({ order });
}

const getOrder = async (req, res) => {

    const { id } = req.params;
    const order = await Order.findOne({_id: id});
    if (!order) {
        throw new CustomError.NotFoundError(`We not found order with the id ${id}`);
    }

    checkPermissions(req.user, order.user);

    return order;
}

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
}