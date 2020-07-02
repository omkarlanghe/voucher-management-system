
/**
 * wsUser.js : This Javascipt file contains all the menthods required to deal with user registration, login.
 * user login supports authentication using jwt and passport.
 */

const { errorMessage, errorObject } = require('../utils/error');
const { registerUser, loginUser } = require('../controllers/user');

/**
 * @description wrapper function for user registration.
 * @param {*} req 
 * @param {*} res 
 */
exports.registerUser = async (req, res) => {
    try {
        if (!req._body) {
            let error = errorMessage('Body cannot be empty.');
            throw error;
        } else if (Object.keys(req.body).length == 0) {
            let error = errorMessage('Object cannot be empty.');
            throw error;
        }
        await registerUser(req, res);
    } catch (error) {
        error.status = 400;
        if (!error.hasOwnProperty('message')) {
            res.status(400).json(error);
        } else {
            res.status(400).json(errorObject(error.message, error.status));
        }
    }
};

/**
 * @description wrapper function for user login.
 * @param {*} req 
 * @param {*} res 
 */
exports.loginUser = async (req, res) => {
    try {
        if (!req._body) {
            let error = errorMessage('Body cannot be empty.');
            throw error;
        } else if (Object.keys(req.body).length == 0) {
            let error = errorMessage('Object cannot be empty.');
            throw error;
        }
        await loginUser(req, res);
    } catch (error) {
        error.status = 400;
        if (!error.hasOwnProperty('message')) {
            res.status(400).json(error);
        } else {
            res.status(400).json(errorObject(error.message, error.status));
        }
    }
};
