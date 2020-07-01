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
    registeredEvents: 'registeredEvents',
    users: 'users',
    photos: 'photos',
    feedbacks: 'feedbacks'
};

module.exports = { database, collection_names };
