/**
 * service.mail.js: mailing service initiated when voucher coupen is successfully generated for the given email address.
 * Confirmation mail is sent, once generation succeeds.
 */

const node_mailer = require('nodemailer');
const { email } = require('../configurations/config');

const mail_transporter = node_mailer.createTransport({
    service: 'gmail',
    auth: { user: email.emailId, pass: email.password }
});

/**
 * @description function which sends email.
 * @param {*} p_details 
 */
exports.sendMail = (p_details) => {
    try {
        let mail_options = {
            from: email.emailId,
            to: p_details.email_address,
            subject: 'Voucher Management System',
            html: `
        <h2> Thank you for using our voucher management system.</h2>
        <h3> Please find your voucher details. </h3>
        <div>
            <strong>Voucher Code</strong>:   ${p_details.voucher_code}<br>
            <strong>Voucher Pin</strong>:   ${p_details.voucher_pin}<br>
            <strong>Email Address</strong>:  ${p_details.email_address}<br>
            <strong>Generation Time</strong>: ${p_details.generation_time}<br>
            <strong>Usage Activity</strong>: ${p_details.usage_activity}<br>
            <strong>Status</strong>: ${p_details.status}<br>
        </div>
        `
        };


        mail_transporter.sendMail(mail_options, (err, info) => {
            if (err) {
                throw err;
            }
            console.info('email sent :: ' + info.response);
        });

    } catch (error) {
        console.error(error);
        throw error;
    }
};
