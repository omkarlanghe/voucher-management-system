const mongo_util = require('../utils/mongo.util');
const mongo_config = require('../configurations/mongo.config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const voucher_code = require('voucher-code-generator');

exports.generateVoucher = async (req, res) => {
    try {
        let mongo_client = await mongo_util.dbClient();
        let voucher = {
            'voucher_code': voucher_code.generate(
                {
                    charset: voucher_code.charset('alphanumeric'),
                    count: 1,
                    length: 10,
                    prefix: 'VCD-',
                }
            )[0],
            'voucher_pin': null,
            'email_address': req.email_id,
            'generation_time': new Date().getTime(),
            'usage_activity': 100,
            'status': 'fresh'
        };

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                throw err;
            }

            bcrypt.hash(req.pin, salt, async (err, hash) => {
                if (err) {
                    throw err;
                }

                voucher.voucher_pin = hash;

                // sent mail.

                // save in database.
                let response = await mongo_client.collection(mongo_config.collection_names.vouchers).insertOne(voucher);
                if (response.insertedCount == 1) {
                    res.status(200).json(voucher);
                }
            });
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};
