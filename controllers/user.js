const { registerUser, loginUser } = require('../database/user');
const { errorMessage } = require('../utils/error');

const validator = require('validator').default;

/**
 * @description controller function for user registration.
 * @param {*} req 
 * @param {*} res 
 */
exports.registerUser = async (req, res) => {
    try {
        if (typeof req.body.name != 'string' || typeof req.body.email != 'string' || typeof req.body.password != 'string' || typeof req.body.adminPassCode != 'string') {
            let error = errorMessage('Invalid type of fields.');
            throw error;
        }

        // validations while registering valid user details
        let { errors, flag } = this.registerValidator(req.body);

        if (!flag) {
            throw errors;
        }

        if (req.body.adminPassCode !== 'secret') {
            let error = errorMessage('Invalid admin pass code.');
            throw error;
        }
        await registerUser(req, res);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * @description wrapper function for user login.
 * @param {*} req 
 * @param {*} res 
 */
exports.loginUser = async (req, res) => {
    try {
        if (typeof req.body.email != 'string' || typeof req.body.password != 'string') {
            let error = errorMessage('Invalid type of fields.');
            throw error;
        }

        //validaton for email and password
        let { errors, flag } = this.loginValidator(req.body);

        if (!flag) {
            throw errors;
        }

        await loginUser(req, res);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * @description function to validate user before registration.
 * @param {*} p_data
 */
exports.registerValidator = (p_data) => {
    let bool_flag_isValid = true;
    let errors = {};
    let only_spaces = /^\s*$/;

    if (only_spaces.test(p_data.name) || validator.isEmpty(p_data.name)) {
        errors.name = 'Please provide name';
        bool_flag_isValid = false;
    }

    if (validator.isEmpty(p_data.email)) {
        errors.email = 'Please provide email address';
        bool_flag_isValid = false;
    }

    if (only_spaces.test(p_data.password) || validator.isEmpty(p_data.password)) {
        errors.password = 'Please provide password';
        bool_flag_isValid = false;
    }

    if (validator.isEmpty(p_data.adminPassCode)) {
        errors.adminPassCode = 'Please provide admin passcode';
        bool_flag_isValid = false;
    }

    if (!validator.isEmail(p_data.email)) {
        errors.email = 'Please provide valid email address';
        bool_flag_isValid = false;
    }
    return ({ 'errors': errors, 'flag': bool_flag_isValid });
};

/**
 * @description function to validate user credentials before login.
 * @param {*} p_data 
 */
exports.loginValidator = (p_data) => {
    let bool_flag_isValid = true;
    let errors = {};


    if (validator.isEmpty(p_data.email)) {
        errors.email = 'Please provide email address';
        bool_flag_isValid = false;
    }

    if (validator.isEmpty(p_data.password)) {
        errors.password = 'Please provide password';
        bool_flag_isValid = false;
    }

    if (!validator.isEmail(p_data.email)) {
        errors.email = 'Please provide valid email address';
        bool_flag_isValid = false;
    }
    return ({ 'errors': errors, 'flag': bool_flag_isValid });
};
