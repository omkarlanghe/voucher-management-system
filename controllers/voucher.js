const { errorMessage } = require('../utils/error');
const { generateVoucher, getVouchers, redeemVoucher } = require('../database/voucher');
const format = require('dateformat');
const validator = require('validator').default;

exports.generateVoucher = async (req, res) => {
    try {
        if (typeof req.email_id != 'string' || typeof req.pin != 'string') {
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

exports.getVouchers = async (p_Req) => {
    try {
        let aggeregation_stage = { '$match': {} };
        if (Object.keys(p_Req).length === 0) {
            let result = await getVouchers(aggeregation_stage);
            return (result);
        }
        if (p_Req.hasOwnProperty('from_timestamp') && p_Req.hasOwnProperty('to_timestamp')) {
            aggeregation_stage['$match'].generation_time = { '$gte': parseInt(p_Req.from_timestamp), '$lte': parseInt(p_Req.to_timestamp) }
        } else if (p_Req.hasOwnProperty('from_timestamp')) {
            aggeregation_stage['$match'].generation_time = { '$gte': parseInt(p_Req.from_timestamp) }
        } else if (p_Req.hasOwnProperty('to_timestamp')) {
            aggeregation_stage['$match'].generation_time = { '$lte': parseInt(p_Req.to_timestamp) }
        }
        if (p_Req.hasOwnProperty('status')) {
            aggeregation_stage['$match'].status = p_Req.status;
        }
        if (p_Req.hasOwnProperty('email')) {
            aggeregation_stage['$match'].email_address = p_Req.email;
        }
        let result = await getVouchers(aggeregation_stage);
        for (let i = 0; i < result.length; i++) {
            result[i].generation_time = format(result[i].generation_time, `ddd dS mmm yyyy hh:MM:ss TT`)
        }
        return (result);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

exports.redeemVoucher = async (req, res) => {
    try {
        if (typeof req.email != 'string' || typeof req.voucher_code != 'string' || typeof req.voucher_pin != 'string' || typeof req.price != 'number') {
            let error = errorMessage('Invalid type of input fields.');
            throw error;
        }

        let only_spaces = /^\s*$/;

        if (!validator.isEmail(req.email)) {
            let error = errorMessage('Email address is invalid.');
            throw error;
        } else if (validator.isEmpty(req.voucher_pin) || only_spaces.test(req.voucher_pin)) {
            let error = errorMessage('Invalid pin supplied.');
            throw error;
        } else if (req.voucher_pin.length !== 5) {
            let error = errorMessage('Pin length should be of 5 characters.');
            throw error;
        } else if (req.voucher_code.length !== 13) {
            let error = errorMessage('Code should be of 13 characters with prefix VCD.');
            throw error;
        }

        await redeemVoucher(req, res);
    } catch (error) {
        console.error(error);
        throw error;
    }
};
