const mongoose = require('mongoose');

const SingleOrderItemSchema = new mongoose.Schema({
    name: { type: String, required: true} ,
    image: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true }, 
    product: { 
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
}); 

const OrderSchema = new mongoose.Schema(
    {
        tax: {
            type: Number,
            required: [true, 'Please, provide the Tax Value'],
            min: 0,
        },
        shippingFee: {
            type: Number,
            required: [true, 'Please, provide the Shipping Fee'],
            min: 0,
        },
        subTotal: {
            type: Number,
            required: [true, 'Please, provide a Sub Total'],
            min: 0,
        },
        total: {
            type: Number,
            required: [true, 'Please, provide a Total'],
            min: 0,
        },
        orderItems: [SingleOrderItemSchema],
        status: {
            type: String,
            enum: ['pending', 'failed', 'paid', 'delivered', 'canceld'],
            default: 'pending',
        }, 
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please, provide a User'],
        },
        clientSecret: {
            type: String,
            required: [true, 'Please, provide a Client Secret'],
            minLength: 1,
            maxLength: 200,
        }, 
        paymentId: {
            type: String,
            minLength: 1,
            maxLength: 200,
        }
}, 
{timestamps: true},
);

module.exports = mongoose.model('Order', OrderSchema);