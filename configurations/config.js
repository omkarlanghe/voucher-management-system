/**
 * config.js : Configuration file which read configration variables from .env file.
 */

const dot_env = require('dotenv');
dot_env.config();

const database = {
    url: process.env.MONGODB_URI,
    name: process.env.DATABASE_NAME
};

const email_credentials = {
    emailId: process.env.EMAIL_ID,
    password: process.env.PASSWORD
};

module.exports = {
    environment: process.env.NODE_ENV,
    http_port: process.env.HTTP_PORT,
    host_name: process.env.HOST_NAME,
    database: database,
    email: email_credentials
};
