//Imports
require('dotenv').config();
require('express-async-errors');

//App
const express = require('express');
const app = express();

//Additional Packages
const morgan = require('morgan');

//Routes
app.use(express.json());
const authRouter = require('./routes/authRoutes');

//Route
app.get('/', (req, res) => {
    res.send('E-commerce Application');
})
app.use('/api/v1/auth', authRouter);

//Database
const connectDB = require('./db/connect');

//Middleware
const notFoundMiddleware  = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//Configurations
app.use(morgan('tiny'));
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
