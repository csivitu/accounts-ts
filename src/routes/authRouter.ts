import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import hbs from 'express-handlebars';
import url from 'url';
import rp from 'request-promise';

import { User, UserInterface } from '../models/user.model';
import { constants } from '../tools/constants';
import {
    verifyVITEmail,
    verifyMobile,
    verifyPassword,
    verifyRegNo,
    verifyEmail,
    verifyUsername,
} from '../tools/verify';
import sendMail from '../tools/sendMail';
import generateToken from '../tools/tokenGenerator';

const hb = hbs.create({
    extname: '.hbs',
    partialsDir: '.',
});

export const router = express.Router();

const sendVerificationMail = async (participant: UserInterface) => {
    const verifyLink = new url.URL(process.env.VERIFY_LINK);
    verifyLink.searchParams.append('token', participant.emailVerificationToken);
    const renderedHtml = await hb.render('src/templates/verify.hbs', {
        name: participant.name,
        verifyLink: verifyLink.href,
    });
    await sendMail(participant.name, participant.email,
        constants.sendVerificationMailSubject, renderedHtml);
};

const verifyRecaptcha = async (response: string) => {
    const recaptcha = await rp({
        method: 'POST',
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        form: {
            secret: process.env.RECAPTCHA_SECRET,
            response,
        },
        json: true,
    });
    return recaptcha.success === true;
};

router.get('/register', async (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const jsonResponse = {
        success: false,
        message: constants.defaultResponse,
        redirect: '',
        redirectClient: '',
        duplicates: [] as string[],
    };
    const recaptcha = await verifyRecaptcha(req.body.grecaptcha_token);
    if (!recaptcha) {
        jsonResponse.message = constants.recaptchaFailed;
        res.json(jsonResponse);
        return;
    }
    const user = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        regNo: req.body.regNo,
        gender: req.body.gender,
    });

    if (!verifyUsername(user.username)) {
        jsonResponse.message = constants.invalidUsername;
    }

    if (!verifyMobile(user.mobile)) {
        jsonResponse.message = constants.invalidMobile;
        res.json(jsonResponse);
        return;
    }

    if (!verifyPassword(user.password)) {
        jsonResponse.message = constants.invalidPassword;
        res.json(jsonResponse);
        return;
    }

    if (req.body.isVitian) {
        if (!verifyRegNo(user.regNo)) {
            jsonResponse.message = constants.invalidRegNo;
            res.json(jsonResponse);
            return;
        }
        if (!verifyVITEmail(user.email)) {
            jsonResponse.message = constants.invalidEmail;
            res.json(jsonResponse);
            return;
        }
    } else {
        if (!verifyEmail(user.email)) {
            jsonResponse.message = constants.invalidEmail;
            res.json(jsonResponse);
            return;
        }
        user.regNo = undefined;
    }

    const duplicate = await User.findOne({
        $or: [
            { email: user.email }, { username: user.username }, { regNo: user.regNo },
        ],
    });
    if (duplicate) {
        jsonResponse.message = constants.duplicate;
        jsonResponse.duplicates = [];
        if (duplicate.email === user.email) {
            jsonResponse.duplicates.push('Email');
        }
        if (duplicate.username === user.username) {
            jsonResponse.duplicates.push('Username');
        }
        if (duplicate.regNo === user.regNo) {
            jsonResponse.duplicates.push('Registration Number');
        }

        res.json(jsonResponse);
        return;
    }

    const saltRounds = 10;

    user.password = await bcrypt.hash(req.body.password, saltRounds);
    user.emailVerificationToken = (await crypto.randomBytes(32)).toString('hex');
    user.passwordResetToken = 'default';
    user.scope = ['user'];


    await user.save();

    sendVerificationMail(user);

    jsonResponse.success = true;
    jsonResponse.message = constants.registrationSuccess;

    if (req.session.clientId && jsonResponse.success) {
        const redirectUri = new url.URL(req.session.redirectUri);
        redirectUri.searchParams.append('token', generateToken(user));
        redirectUri.searchParams.append('state', req.session.state);
        jsonResponse.redirect = redirectUri.href;
        jsonResponse.redirectClient = req.session.clientName;

        req.session.clientId = undefined;
        req.session.clientName = undefined;
        req.session.redirectUri = undefined;
        req.session.state = undefined;
    }

    res.json(jsonResponse);
});

router.get('/verify', async (req, res) => {
    let verified = false;
    const participant = await User.findOneAndUpdate({
        emailVerificationToken: req.query.token,
    }, {
        verificationStatus: true,
    });

    if (!participant) {
        res.render('emailVerified', { verified });
        return;
    }

    verified = true;
    res.render('emailVerified', { verified, email: participant.email });
});

router.get('/login', async (req, res) => {
    res.render('login.html', { clientName: req.session.clientName });
});

router.post('/login', async (req, res) => {
    const jsonResponse = {
        success: false,
        message: constants.defaultResponse,
        redirectClient: '',
        redirect: '',
    };

    const recaptcha = await verifyRecaptcha(req.body.grecaptcha_token);
    if (!recaptcha) {
        jsonResponse.message = constants.recaptchaFailed;
        res.json(jsonResponse);
        return;
    }

    const { username, password } = req.body;

    if ((!username) || !password) {
        jsonResponse.message = constants.serverError;
    }


    const participant = await User.findOne({
        $or: [
            { username },
            { regNo: username },
        ],
    });

    if (!participant) {
        jsonResponse.success = false;
        jsonResponse.message = constants.incorrectDetails;
        res.json(jsonResponse);

        return;
    }

    if (await bcrypt.compare(password, participant.password)) {
        jsonResponse.success = true;
        jsonResponse.message = constants.loginSuccess;
    } else {
        jsonResponse.success = false;
        jsonResponse.message = constants.incorrectDetails;
    }

    if (participant.verificationStatus === 'false') {
        jsonResponse.success = false;
        jsonResponse.message = constants.notVerified;

        res.json(jsonResponse);
        return;
    }

    if (req.session.clientId && jsonResponse.success) {
        const redirectUri = new url.URL(req.session.redirectUri);
        redirectUri.searchParams.append('token', generateToken(participant));
        redirectUri.searchParams.append('state', req.session.state);
        jsonResponse.redirect = redirectUri.href;
        jsonResponse.redirectClient = req.session.clientName;

        req.session.clientId = undefined;
        req.session.clientName = undefined;
        req.session.redirectUri = undefined;
        req.session.state = undefined;
    }
    res.json(jsonResponse);
});

router.use('/logout', async (req, res) => {
    req.session.destroy(() => { });

    res.json({
        success: true,
        message: constants.logoutSuccess,
    });
});

export default router;
