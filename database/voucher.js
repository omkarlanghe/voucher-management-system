const mongo_util = require('../utils/mongo.util');
const mongo_config = require('../configurations/mongo.config');
const bcrypt = require('bcryptjs');
const voucher_code = require('voucher-code-generator');
const format = require('dateformat');
const { errorMessage } = require('../utils/error');

/**
 * @description database function which generates voucher coupen and saves in database.
 * @param {*} req 
 * @param {*} res 
 */
exports.generateVoucher = async (req, res) => {
    try {
        let { sendMail } = require('../services/service.mail');
        let mongo_client = await mongo_util.dbClient();
        let voucher = {
            'voucher_code': voucher_code.generate(
                {
                    charset: voucher_code.charset('alphanumeric'),
                    count: 1,
                    length: 10,
                    prefix: 'VCD',
                }
            )[0],
            'voucher_pin': null,
            'email_address': req.email,
            'generation_time': new Date().getTime(),
            'usage_activity': 0,
            'status': 'active',
            'price': 1000,
            'max_usage_limit': 5
        };

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                throw err;
            }

            bcrypt.hash(req.pin, salt, async (err, hash) => {
                if (err) {
                    throw err;
                }

                // updating voucher pin with hash
                voucher.voucher_pin = hash;

                // save in database.
                let response = await mongo_client.collection(mongo_config.collection_names.vouchers).insertOne(voucher);
                if (response.insertedCount == 1) {

                    // modification on voucher details.
                    voucher.voucher_pin = req.pin;
                    voucher.generation_time = format(voucher.generation_time, `ddd dS mmm yyyy hh:MM:ss TT`);
                    delete voucher._id;
                    // once successfully saved, then only sent email.
                    sendMail(voucher);

                    // sending API response to the user.
                    res.status(200).json(voucher);
                }
            });
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * @description database function which retrieves voucher coupens based on pipeline stage passed as a parameter to it.
 * @param {*} p_pipeline_stage 
 */
exports.getVouchers = async (p_pipeline_stage) => {
    try {
        let mongo_client = await mongo_util.dbClient();
        let response = await mongo_client.collection(mongo_config.collection_names.vouchers).aggregate([p_pipeline_stage, { '$project': { '_id': 0 } }]).toArray();
        return (response);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * @description database function which updates and redeems voucher coupens from database.
 * @param {*} req 
 * @param {*} res 
 */
exports.redeemVoucher = async (req, res) => {
    try {
        let mongo_client = await mongo_util.dbClient();
        let is_valid_email = await mongo_client.collection(mongo_config.collection_names.vouchers).aggregate([
            { '$match': { 'email_address': req.email, 'voucher_code': req.voucher_code } },
            { '$project': { '_id': 0 } }
        ]).toArray().then(result => {
            return result[0];
        });

        if (is_valid_email.length == 0) {
            let error = errorMessage('Data not found for the given voucher redemtion request. Please check you supply all fields correctly.');
            throw error;
        }

        // find 24 hours difference from generation time to  current time.
        let current_time = new Date().getTime();
        let hourly_difference = (current_time - is_valid_email.generation_time) / 1000;
        hourly_difference = hourly_difference / (60 * 60);
        hourly_difference = Math.abs(Math.round(hourly_difference));

        if (hourly_difference > 24) {
            res.status(400).json('Invalid voucher code. Voucher code is only valid for 24 hours from the time of generation.');
        } else {
            bcrypt.compare(req.voucher_pin, is_valid_email.voucher_pin).then(async (isMatch) => {
                if (!isMatch) {
                    res.status(404).json({ 'voucher_code': 'Voucher pin does not match.' });
                } else {

                    if (is_valid_email.price == 0) {
                        res.status(400).json('Cannot redeem. Voucher outdated and already redeemed to its max price.');
                    } else if (req.price > is_valid_email.price) {
                        res.status(400).json('Cannot redeem. Requested price is greated than original price. Max voucher price can be 1000.');
                    } else if (req.price <= 0) {
                        res.status(400).json('Cannot redeem. Requested price is invalid.');
                    } else if (is_valid_email.max_usage_limit <= 0) {

                        let response = await mongo_client.collection(mongo_config.collection_names.vouchers).updateOne(
                            { 'email_address': req.email, 'voucher_code': req.voucher_code },
                            { '$set': { 'status': 'reedemed' } }
                        );

                        if (response.result.nModified != 0) {
                            res.status(400).json('Cannot redeem. Voucher can be used maximum for 5 times.');
                        }
                        res.json('Voucher coupen outdated.');

                    } else if (req.price == is_valid_email.price) {

                        is_valid_email.usage_activity = req.price;
                        is_valid_email.status = 'redeemed';
                        is_valid_email.price = 0;
                        is_valid_email.max_usage_limit--;
                        is_valid_email.updation_time = new Date().getTime();

                        if (is_valid_email.updation_time <= is_valid_email.next_usage_time) {
                            res.status(400).json('Cannot redeem. Next attempt to redeem voucher code should be after 10 minutes.');
                        } else {
                            is_valid_email.next_usage_time = is_valid_email.next_usage_time = new Date(is_valid_email.updation_time).setMinutes(new Date(is_valid_email.updation_time).getMinutes() + 10);

                            let response = await mongo_client.collection(mongo_config.collection_names.vouchers).updateOne(
                                { 'email_address': req.email, 'voucher_code': req.voucher_code },
                                { '$set': is_valid_email }
                            );

                            if (response.result.nModified == 0) {
                                res.json('Data not found to redeem voucher coupen.');
                            } else {
                                is_valid_email.voucher_pin = req.voucher_pin;
                                is_valid_email.generation_time = format(is_valid_email.generation_time, `ddd dS mmm yyyy hh:MM:ss TT`);
                                is_valid_email.updation_time = format(is_valid_email.updation_time, `ddd dS mmm yyyy hh:MM:ss TT`);
                                res.json(is_valid_email);
                            }
                        }
                    } else {

                        is_valid_email.usage_activity = (is_valid_email.usage_activity + req.price);
                        is_valid_email.status = 'partially redeemed';
                        is_valid_email.price = (is_valid_email.price - req.price);
                        is_valid_email.max_usage_limit--;
                        is_valid_email.updation_time = new Date().getTime();

                        if (is_valid_email.updation_time <= is_valid_email.next_usage_time) {
                            res.status(400).json('Cannot redeem. Next attempt to redeem voucher code should be after 10 minutes.');
                        } else {
                            is_valid_email.next_usage_time = new Date(is_valid_email.updation_time).setMinutes(new Date(is_valid_email.updation_time).getMinutes() + 10);

                            let response = await mongo_client.collection(mongo_config.collection_names.vouchers).updateOne(
                                { 'email_address': req.email, 'voucher_code': req.voucher_code },
                                { '$set': is_valid_email }
                            );

                            if (response.result.nModified == 0) {
                                res.json('Data not found to redeem voucher coupen.');
                            } else {
                                is_valid_email.voucher_pin = req.voucher_pin;
                                is_valid_email.generation_time = format(is_valid_email.generation_time, `ddd dS mmm yyyy hh:MM:ss TT`);
                                is_valid_email.updation_time = format(is_valid_email.updation_time, `ddd dS mmm yyyy hh:MM:ss TT`);
                                res.json(is_valid_email);
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};
