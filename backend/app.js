const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const couponsRoutes = require('./routes/coupons-routes');
const usersRoutes = require('./routes/user-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use('/api/coupons', couponsRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    throw new HttpError('Could not find this route', 404);
});

app.use((error, req, res, next) => {
    if(res.headerSend) {
        // check if response is already sent
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occured" });
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(5000);
        console.log(`Server started on port 5000 `)
    })
    .catch(err => {
        console.log(err);
    });
