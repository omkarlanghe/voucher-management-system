const { errorMessage } = require('../utils/error');
const { generateVoucher, getVouchers, redeemVoucher } = require('../controllers/voucher');

/**
 * @description wrapper function to to generate voucher coupen.
 * @param {*} req 
 * @param {*} res 
 */
exports.generateVoucher = async (req, res) => {
    try {
        if (!req._body) {
            let error = errorMessage('Body cannot be empty.');
            throw error;
        } else if (Object.keys(req.body).length == 0) {
            let error = errorMessage('Object cannot be empty.');
            throw error;
        }
        await generateVoucher(req.body, res);
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
};

/**
 * @description wrapper function to to generate voucher details based on query filters.
 * @param {*} req 
 * @param {*} res 
 */
exports.getVoucherDetails = async (req, res) => {
    try {
        let query_params = req.query;
        let result = await getVouchers(query_params);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
};

/**
 * @description wrapper function to to redeem voucher.
 * @param {*} req 
 * @param {*} res 
 */
exports.redeemVoucher = async (req, res) => {
    try {
        if (!req._body) {
            let error = errorMessage('Body cannot be empty.');
            throw error;
        } else if (Object.keys(req.body).length == 0) {
            let error = errorMessage('Object cannot be empty.');
            throw error;
        }
        await redeemVoucher(req.body, res);
    } catch (error) {
        console.error(error);
        res.status(400).json(error.message);
    }
};
