import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import hbs from 'express-handlebars';
import url from 'url';

import { User, UserInterface } from '../models/user.model';
import { constants } from '../tools/constants';
import {
    verifyEmail,
    verifyMobile,
    verifyPassword,
    verifyRegNo,
} from '../tools/verify';
import sendMail from '../tools/sendMail';
import generateToken from '../tools/tokenGenerator';

const hb = hbs.create({
    extname: '.hbs',
    partialsDir: '.',
});

export const router = express.Router();

const sendVerificationMail = async (participant: UserInterface) => {
    const verifyLink = new URL(process.env.VERIFY_LINK);
    verifyLink.search = `?token=${participant.emailVerificationToken}`;
    const renderedHtml = await hb.render('../templates/verify.hbs', {
        participant,
        verifyLink: verifyLink.href,
    });
    await sendMail(participant.name, participant.email,
        constants.sendVerificationMailSubject, renderedHtml);
};

router.get('/register', async (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const participant = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: req.body.password,
        regNo: req.body.regNo,
        gender: req.body.gender,
    });

    const jsonResponse = {
        success: false,
        message: constants.defaultResponse,
    };

    if (!verifyEmail(participant.email)) {
        jsonResponse.message = constants.invalidEmail;
        res.json(jsonResponse);

        return;
    }

    if (!verifyMobile(participant.mobile)) {
        jsonResponse.message = constants.invalidMobile;
        res.json(jsonResponse);

        return;
    }

    if (!verifyPassword(participant.password)) {
        jsonResponse.message = constants.invalidPassword;
        res.json(jsonResponse);

        return;
    }

    if (!verifyRegNo(participant.regNo)) {
        jsonResponse.message = constants.invalidRegNo;
        res.json(jsonResponse);

        return;
    }

    if (participant.email.length > 320 || participant.gender.length > 1) {
        jsonResponse.success = false;
        jsonResponse.message = constants.maxFieldLengthExceeded;
        return;
    }
    const saltRounds = 10;

    participant.password = await bcrypt.hash(req.body.password, saltRounds);
    participant.emailVerificationToken = (await crypto.randomBytes(32)).toString('hex');
    participant.passwordResetToken = (await crypto.randomBytes(32)).toString('hex');

    await participant.save();

    sendVerificationMail(participant);

    jsonResponse.success = true;
    jsonResponse.message = constants.registrationSuccess;

    // res.json(jsonResponse);
    res.redirect('/auth/login');
});

router.post('/verify', async (req, res) => {
    const participant = await User.findOneAndUpdate({
        emailVerificationToken: req.body.emailVerificationToken,
    }, {
        verificationStatus: true,
    });

    if (!participant) {
        res.json({
            success: false,
            message: constants.participantNotFound,
        });
        return;
    }

    res.json({
        success: true,
        message: constants.verificationSuccess,
    });
});

router.get('/login', async (req, res) => {
    res.render('login.html');
});

router.post('/login', async (req, res) => {
    const jsonResponse = {
        success: false,
        message: constants.defaultResponse,
    };

    const { email, password } = req.body;

    if (email.length > 320 || password.length > 16) {
        jsonResponse.success = false;
        jsonResponse.message = constants.maxFieldLengthExceeded;
        return;
    }

    const participant = await User.findOne({
        email,
    });

    if (!participant) {
        jsonResponse.success = false;
        jsonResponse.message = constants.participantNotFound;
        res.json(jsonResponse);

        return;
    }

    if (await bcrypt.compare(password, participant.password)) {
        req.session.email = email;

        jsonResponse.success = true;
        jsonResponse.message = constants.loginSuccess;
    } else {
        jsonResponse.success = false;
        jsonResponse.message = constants.incorrectPassword;
    }

    if (req.session.clientId) {
        res.redirect(url.format({
            href: req.session.redirectUri,
            query: {
                token: generateToken(participant),
                state: req.session.state,
            },
        }));
        req.session.clientId = undefined;
        req.session.redirectUri = undefined;
        req.session.state = undefined;
    }
    res.json(jsonResponse);
});

router.use('/logout', async (req, res) => {
    req.session.destroy(() => {});

    res.json({
        success: true,
        message: constants.logoutSuccess,
    });
});

export default router;
