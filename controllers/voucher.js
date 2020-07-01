let { errorMessage } = require('../utils/error');
let { generateVoucher } = require('../database/voucher');

let validator = require('validator').default;

exports.generateVoucher = async (req, res) => {
    try {
        if (typeof req.email_id != 'string' && typeof req.pin != 'string') {
            let error = errorMessage('Invalid type of input fields. Requires string.');
            throw error;
        }

        let only_spaces = /^\s*$/;

        if (!validator.isEmail(req.email_id)) {
            let error = errorMessage('Email address is invalid.');
            throw error;
        } else if (validator.isEmpty(req.pin) || only_spaces.test(req.pin)) {
            let error = errorMessage('Invalid pin supplied.');
            throw error;
        } else if (req.pin.length !== 5) {
            let error = errorMessage('Pin length should be of 5 characters.');
            throw error;
        }
        await generateVoucher(req, res);
    } catch (error) {
        console.error(error);
        throw error;
    }
};
