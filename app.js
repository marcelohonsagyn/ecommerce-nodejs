//Imports
require('dotenv').config();
require('express-async-errors');

//App
const express = require('express');
const app = express();

//Additional Packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

//Routes
app.use(express.json());
app.use(morgan('tiny'));
app.use(cookieParser(process.env.JWT_SECRET));
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

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

//Database
const connectDB = require('./db/connect');

//Middleware
const notFoundMiddleware  = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

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
