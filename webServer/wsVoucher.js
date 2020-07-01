const { errorMessage } = require('../utils/error');
const { generateVoucher } = require('../controllers/voucher');

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
