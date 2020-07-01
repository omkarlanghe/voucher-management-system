/**
 * routes.js : This Javascipt file contains all API endpoints routes which navigates to their respective API request.
 */
const voucher = require('./wsVoucher');

exports.navigateRoutes = async (app) => {
    app.post('/api/voucher/generate', voucher.generateVoucher);
};
