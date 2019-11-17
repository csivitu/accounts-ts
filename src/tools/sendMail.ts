import sendgrid from 'sendgrid';

import { constants } from './constants';

require('dotenv').config();
const {
    SENDGRID_API_KEY,
} = process.env;

const Sendgrid = sendgrid(SENDGRID_API_KEY);

export const sendMail = async (name: string, email: string, subject: string, content: string) => {
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

    try {
        await Sendgrid.API(sgReq);
        console.log('Mail sent successfully');
    } catch (e) {
        console.log(e.response.body.errors);
    }
};

export default sendMail;
