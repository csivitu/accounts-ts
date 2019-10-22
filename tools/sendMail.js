const {
    SENDGRID_API_KEY,
} = process.env;

const Sendgrid = require('sendgrid')(SENDGRID_API_KEY);
const constants = require('./constants');

const sendMail = async (name, email, subject, content) => {
    const sgReq = Sendgrid.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',

        body: {
            personalizations: [{
                to: [{
                    name,
                    email,
                }],
                subject,
            }],

            from: {
                name: constants.emailFrom,
                email: constants.senderEmail,
            },

            content: [{
                type: 'text/html',
                value: content,
            }],

            replyTo: {
                email: constants.emailReplyTo,
                name: constants.emailFrom,
            },
        },
    });

    await Sendgrid.API(sgReq);
};

module.exports = sendMail;
