const mongo_util = require('../utils/mongo.util');
const mongo_config = require('../configurations/mongo.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorMessage } = require('../utils/error');

/**
 * @description database function which querys to the database for user registration.
 * @param {*} req 
 * @param {*} res 
 */
exports.registerUser = async (req, res) => {
    try {
        let mongo_client = await mongo_util.dbClient();
        req.body.registration_time = new Date().getTime();

        let bool_user_exists = await mongo_client.collection(mongo_config.collection_names.users).aggregate([
            { '$match': { 'email': req.body.email } }
        ]).toArray();

        if (bool_user_exists.length == 1) {
            let error = errorMessage('User already registered with the given email id.');
            throw error;
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                throw err;
            }

            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                if (err) {
                    throw err;
                }
                req.body.password = hash;
                let response = await mongo_client.collection(mongo_config.collection_names.users).insertOne(req.body);
                response.result.insertedId = response.insertedId;
                res.status(200).json(response.result);
            });
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * @description database function which queries and verified login user from database.
 * @param {*} req 
 * @param {*} res 
 */
exports.loginUser = async (req, res) => {
    try {
        let mongo_client = await mongo_util.dbClient();

        let user = await mongo_client.collection(mongo_config.collection_names.users).aggregate([
            { '$match': { 'email': req.body.email } }
        ]).toArray();

        if (user.length == 0) {
            let error = errorMessage(`Email id doesn't exists.`);
            throw error;
        }
        bcrypt.compare(req.body.password, user[0].password).then((isMatch) => {
            if (!isMatch) {
                res.status(404).json({ 'password': 'password do not match.' });
            }

            const payload = { 'id': user[0]._id, 'name': user[0].name };
            // console.log(payload);
            jwt.sign(payload, mongo_config.database.secretOrKey, { expiresIn: Math.floor(Date.now() / 1000) - (60 * 60) }, (err, token) => {
                if (err) { throw err; }
                res.json({
                    'name': user[0].name,
                    'email': user[0].email,
                    'success': true,
                    'access_token': `${token}`
                });
            });
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};
