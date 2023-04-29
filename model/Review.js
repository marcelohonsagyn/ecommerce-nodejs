const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'Please, provide a Rating to Review Product.'],
        min: 1,
        max: 5,
    },
    title: {
        type: String,
        trim: true,
        minLength: 5,
        maxLenght: 300,
        required: [true, 'Please, provide a Title'],
    }, 
    comment: {
        type: String,
        minLength: 3,
        maxLength: 300,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please, provide a User responsible for the Review'],
    }, 
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Please, provide a Product for the Review.'],
    }
},
{ timestamps: true },
);

ReviewSchema.index({ product: 1, user: 1}, { unique: true});
module.exports = mongoose.model('Review', ReviewSchema);