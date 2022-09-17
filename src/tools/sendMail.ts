import axios from 'axios';

require('dotenv').config();

const {
    MAILGUN_API_KEY,
} = process.env;

export const sendMail = async (email: string, subject: string, content: string) => {
    try {
        await axios.post('https://emailer-api.csivit.com/email', {
            html: content,
            subject,
            to: email,
            auth: MAILGUN_API_KEY,
        });
        console.log(`Mail sent to ${email} successfully`);
    } catch (e) {
        console.log(e);
    }
};

export default sendMail;
