import express from 'express';
import crypto from 'crypto';
import hbs from 'express-handlebars';
import bcrypt from 'bcrypt';

import { UserInterface } from '../mongeese/user';
import { constants } from '../tools/constants';
import { sendMail } from '../tools/sendMail';
import { User } from '../mongeese/models';

const hb = hbs.create({
    extname: '.hbs',
    partialsDir: '.',
});

export const router = express.Router();

const sendResetMail = async (participant: UserInterface) => {
    const resetLink = new URL(process.env.RESET_LINK);
    resetLink.search = `token=${participant.passwordResetToken}`;

    const renderedHtml = await hb.render('src/templates/reset.hbs', {
        name: participant.name,
        username: participant.username,
        resetLink: resetLink.href,
    });

    await sendMail(participant.name, participant.email,
        constants.sendResetMailSubject, renderedHtml);
};

router.post('/forgotPassword', async (req, res) => {
    const participant = await User.findOne({
        email: req.body.email,
    });

    if (!participant) {
        res.json({
            success: false,
            message: constants.participantNotFound,
        });

        return;
    }

    if (participant.passwordResetToken !== 'default') {
        res.json({
            success: true,
            message: constants.emailAlreadySent,
        });
        return;
    }

    res.json({
        success: true,
        message: constants.passwordResetMail,
    });

    const passwordResetToken = (await crypto.randomBytes(32)).toString('hex');
    participant.passwordResetToken = passwordResetToken;
    await participant.save();

    sendResetMail(participant);
});

router.get('/resetPassword', async (req, res) => {
    const { token } = req.query;

    const user = await User.findOne({ passwordResetToken: token });
    if (!user) {
        res.render('resetPassword', { valid: false, token });
    } else {
        res.render('resetPassword', { valid: true, token });
    }
});

router.post('/resetPassword', async (req, res) => {
    const saltRounds = 10;
    const password = await bcrypt.hash(req.body.password, saltRounds);

    const participant = await User.findOneAndUpdate({
        passwordResetToken: req.body.token,
    }, {
        passwordResetToken: 'default',
        password,
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
        message: constants.passwordResetSuccess,
    });
});

export default router;
