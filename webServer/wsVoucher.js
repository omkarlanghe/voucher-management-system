const { errorMessage } = require('../utils/error');
const { generateVoucher, getVouchers, redeemVoucher } = require('../controllers/voucher');

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
