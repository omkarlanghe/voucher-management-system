/**
 * mongo.config.js : Contains database name, url and collection names.
 */
const config = require('./config');

const database = {
    url: config.database.url,
    name: config.database.name,
    secretOrKey: 'secret'
};

const collection_names = {
    users: 'users',
    vouchers: 'vouchers'
};

module.exports = { database, collection_names };
