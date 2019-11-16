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

    if (req.body.isVitian === 'true') {
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

    if (await User.findOne({
        $or: [
            { email: user.email }, { username: user.username }, { regNo: user.regNo },
        ],
    })) {
        jsonResponse.message = constants.serverError;
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
    } else {
        res.json(jsonResponse);
    }
});

router.use('/logout', async (req, res) => {
    req.session.destroy(() => { });

    res.json({
        success: true,
        message: constants.logoutSuccess,
    });
});

export default router;