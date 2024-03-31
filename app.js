require('dotenv').config();
require('express-async-errors');
const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// database
const connectDB = require('./db/connect');
// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

mongoose.set('strictQuery', true);
const app = express();

// routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// app.use('/api/v1/', (req, res) => {
//     console.log(req.signedCookies;
//     return res.send('hello');
// });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5001;
async function start() {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Listening on port ${port}`));
    } catch (error) {
        console.log(error);
    }
}

start();
