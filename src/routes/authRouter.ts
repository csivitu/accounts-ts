import express from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import hbs from 'express-handlebars';
import url from 'url';

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
    const verifyLink = url.format({
        href: process.env.VERIFY_LINK,
        query: {
            token: participant.emailVerificationToken,
        },
    });
    const renderedHtml = await hb.render('src/templates/verify.hbs', {
        participant,
        verifyLink,
    });
    await sendMail(participant.name, participant.email,
        constants.sendVerificationMailSubject, renderedHtml);
};

router.get('/register', async (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const user = new User({
        username: req.body.username,
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
        duplicates: [] as string[],
    };

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
    } else if (!verifyEmail(user.email)) {
        jsonResponse.message = constants.invalidEmail;
        res.json(jsonResponse);
        return;
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
    user.passwordResetToken = (await crypto.randomBytes(32)).toString('hex');
    user.scope = ['user'];


    await user.save();

    sendVerificationMail(user);

    jsonResponse.success = true;
    jsonResponse.message = constants.registrationSuccess;

    res.json(jsonResponse);
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
    res.render('login.html', { clientName: req.session.clientName });
});

router.post('/login', async (req, res) => {
    const jsonResponse = {
        success: false,
        message: constants.defaultResponse,
        redirect: '',
    };

    const { username, password } = req.body;

    const participant = await User.findOne({
        username,
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

    if (req.session.clientId && jsonResponse.success) {
        const redirectUri = new url.URL(req.session.redirectUri);
        redirectUri.searchParams.append('token', generateToken(participant));
        redirectUri.searchParams.append('state', req.session.state);
        jsonResponse.redirect = redirectUri.href;

        req.session.clientId = undefined;
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
