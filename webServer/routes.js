/**
 * routes.js : This Javascipt file contains all API endpoints routes which navigates to their respective API request.
 */
const example = require('./example');
exports.navigateRoutes = async (app) => {
    app.get('/api', example.example);
};
