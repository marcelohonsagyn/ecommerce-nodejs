const mongoose = require('mongoose');
const validator = require('validator');

const ProductSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'Please, provide a name for the Product.'],
            minLenght: 1,
            maxLength: [100, 'Provide a name with at max 100 characters'],
        }, 
        price: {
            type: Number,
            required: [true, 'Please, provide a value for the Product.'],
            min: [0.01, 'Please, provide a value with at least $ 0.01'],
            max: [1000000, 'Please, provide a value with at max $ 1.000.000']
        },
        description: {
            type: String,
            required: [true, 'Please, provide a description for the Product.'],
            minLenght: [3, 'Please, provide a description at least with 3 characters'],
            maxLength: [3000, 'Please, provide a description at max with 3000 characters'],
        }, 
        image: {
            type: String, 
            required: [true, 'Please, provide a image for the Product'],
            minLength: 3,
            maxLength: 400,
            default: '/uploads/example.jpeg',
        }, 
        category: {
            type: String,
            required: [true, 'Please, provide a category for the Product'],
            enum: ['office', 'kitchen', 'bedroom'],
            minLenght: 3,
            maxLength: 50
        },
        company: {
            type: String,
            required: [true, 'Please, provide a company for the Product'],
            enum: {
                values: ['ikea', 'liddy', 'marcos'],
                message: '{VALIUE} is not supported.'
            },
        },
        colors: {
            type: String, 
            required: true,
            default: '#222',
        }, 
        featured: {
            type: Boolean,
            default: false,
        },
        freeShipping: {
            type: Boolean,
            default: false,
        },
        inventory: {
            type: Number,
            min: 0,
            default: 15,
            required: [true, 'Please, provide a inventory for the Product.'],
        },
        averageRating: {
            type: Number,
            min: 0,
            max: 10,
        },
        numberOfReviews: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please, Provide a inventory for the Product.']
        },
    }, { timestamps: true, toJSON: {virtuals: true}, toObject: { virtuals: true }}
);

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
});

ProductSchema.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
})

module.exports = mongoose.model('Product', ProductSchema);