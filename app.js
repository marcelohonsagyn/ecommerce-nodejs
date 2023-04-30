//Imports
require('dotenv').config();
require('express-async-errors');

//App
const express = require('express');
const app = express();

//Additional Packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//Security
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

//Routes
app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload());

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const ordersRouter = require('./routes/orderRoutes');

//Route
app.get('/', (req, res) => {
    res.send('E-commerce Application');
})

app.get('/api/v1', (req, res) => {
    console.log(req.signedCookies);
    res.send('E-commerce Application With Cookies');
})

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', ordersRouter);

//Database
const connectDB = require('./db/connect');

//Middleware
const notFoundMiddleware  = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//Security
app.set('trust proxy', 1);
app.use(rateLimiter({
windowMs: 15 * 60 * 1000,
max: 60,
}));
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());

//Errors
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        const port = process.env.PORT || 5000;
        await connectDB(process.env.MONGO_URI)
        app.listen(port, ()=> {
            console.log(`E-Commerce API, listen port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();
