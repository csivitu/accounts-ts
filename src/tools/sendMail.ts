import rp from 'request-promise'

require('dotenv').config();

const {
    SENGRID_API_KEY,
} = process.env;

export const sendMail = async (email: string, subject: string, content: string) => {
    try {
        await rp({
            method: 'POST',
            uri: 'https://emailer-api.csivit.com/email',
            body: {
                html: content, subject: subject, to: email, auth: SENGRID_API_KEY,
            },
        });    
        console.log(`Mail sent to ${email} successfully`);
    } catch (e) {
        console.log(e);
    }
};

export default sendMail;
