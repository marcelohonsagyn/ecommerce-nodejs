const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const Product = require('../model/Product');

const createProduct = async (req, res) => {
    const product = req.body;
    if (product._id) {
        throw new CustomError.BadRequestError('We cant update a product with this service. Try to use patch method.')
    }
    product.user = req.user.userId;
    productSaved = await Product.create(product);
    res.status(StatusCodes.CREATED).json({productSaved});
}

const getAllProducts = async (req, res) => {
    const products = await Product.find({}).sort({name: 1});
    if (!products) {
        throw new CustomError.NotFoundError('We cant find products. Sorry.');
    }

    res.status(StatusCodes.OK).json({products, count: products.length});
}

const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOne({_id: id});
    if (!product) {
        throw new NotFoundError(`We cant find a Product with the id ${id}`);
    }
    res.status(StatusCodes.OK).json(product);
}

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOneAndUpdate({_id: id}, req.body, { new: true, runValidators: true });

    if (!product) {
        throw new NotFoundError(`We cant update a Product with the id ${id}`);
    }
    res.status(StatusCodes.OK).json(product);
}

const deleteProduct = async (req, res) => {
    
    const { id } = req.params;
    const product = await Product.findOne({_id: id});

    if (!product) {
        throw new NotFoundError(`We cant update a Product with the id ${id}`);
    }

    await product.remove();

    res.status(StatusCodes.OK).json({msg: 'Sucess. The Product was removed.'});
}

const uploadImage = async (req, res) => {
    res.status(StatusCodes.OK).json({msg: 'updloadImage'});
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
}