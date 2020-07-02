const { registerUser, loginUser } = require('../database/user');
const { errorMessage } = require('../utils/error');

exports.registerUser = async (req, res) => {
    try {
        if (typeof req.body.name != 'string' || typeof req.body.email != 'string' || typeof req.body.password != 'string' || typeof req.body.adminPassCode != 'string') {
            let error = errorMessage('Invalid type of fields.');
            throw error;
        }

        // more validations remaining

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

exports.loginUser = async (req, res) => {
    try {
        if (typeof req.body.email != 'string' || typeof req.body.password != 'string') {
            let error = basicError('Invalid type of fields.');
            throw error;
        }

        // more validations remaining
        
        await loginUser(req, res);
    } catch (error) {
        console.error(error);
        throw error;
    }
};
