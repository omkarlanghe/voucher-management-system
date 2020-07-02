/**
 * routes.js : This Javascipt file contains all API endpoints routes which navigates to their respective API request.
 */
const voucher = require('./wsVoucher');
const user = require('./wsUser');
const mongo_config = require('../configurations/mongo.config');
const express_jwt = require('express-jwt');
const jwt_secure_check = express_jwt({ secret: mongo_config.database.secretOrKey, algorithms: ['HS256'] });

exports.navigateRoutes = async (app) => {
    app.post('/api/voucher/generate', jwt_secure_check, voucher.generateVoucher);
    app.post('/api/user/register', user.registerUser);
    app.post('/api/user/login', user.loginUser);
};
