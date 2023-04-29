const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const Product = require('../model/Product');
const Review = require('../model/Review');
const { checkPermissions } = require('../utils/checkPermissions');

const createReview = async (req, res) => {
    const { product: productId } = req.body;

    const isValidProduct = await Product.findOne({ _id: productId });
    if (!isValidProduct) {
        throw new CustomError.BadRequestError(`We cant find a Product with the id ${productId}.`);
    }

    const alreadyReviewed = await Review.findOne({ product: productId, 
                                                   user: req.user.userId ,
    });
    
    if (alreadyReviewed) {
        throw new CustomError.BadRequestError('There is a Review with the Product and User provided.');
    }

    req.body.user = req.user.userId;
    const review = await Review.create(req.body);

    res.status(StatusCodes.CREATED).json({ review });
}

const getAllReviews = async (req, res) => {

    const reviews = await Review.find({})
                                .populate({path: 'product', select: 'name company price'})
                                .populate({path: 'user', select: 'name'})
                                .sort({"product": 1, "rating": -1});
    if (!reviews) {
        throw new CustomError.NotFoundError('We cant find reviews');
    }

    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
}

const getSingleReview = async (req, res) => {
     
    const {id: id} = req.params;
    const review = await Review.findOne({_id: id})
                                .populate({path: 'product', select: 'name company price'})
                                .populate({path: 'user', select: 'name'});
    if (!review) {
        throw new CustomError.NotFoundError(`We cant find a review with the id ${id}`);
    }

    res.status(StatusCodes.OK).json({ review });

}

const updateReview = async (req, res) => {

    const {id: id} = req.params;
    const review = await Review.findOne({_id: id});
    if (!review) {
        throw new CustomError.NotFoundError(`We cant find a review with the id ${id}`);
    }

    const reviewUpdate = req.params;
    reviewUpdate._id = id;

    checkPermissions(req.user, review.user);
    review.title = req.body.title;
    review.rating = req.body.rating;
    review.comment = req.body.comment;

    await review.save();
    res.status(StatusCodes.OK).json({ review });
}

const deleteReview = async (req, res) => {

    const {id: id} = req.params;
    const review = await Review.findOne({_id: id});
    if (!review) {
        throw new CustomError.NotFoundError(`We cant find a review with the id ${id}`);
    }

    checkPermissions(req.user, review.user);

    await review.remove();

    res.status(StatusCodes.OK).json({ msg: `The Review with id ${review._id} was deleted.` });
}

const getSingleProductReviews = async (req, res) => {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId });
    if (!reviews || reviews.length < 1) {
        throw new CustomError.NotFoundError(`We cant found reviews for the product with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({reviews, count: reviews.length});
}

module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews,
}