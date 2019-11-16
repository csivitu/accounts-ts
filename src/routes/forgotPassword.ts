import express from 'express';
import crypto from 'crypto';
import hbs from 'express-handlebars';

import { User, UserInterface } from '../models/user.model';
import { constants } from '../tools/constants';
import { sendMail } from '../tools/sendMail';

const hb = hbs.create({
    extname: '.hbs',
    partialsDir: '.',
});

export const router = express.Router();

const sendResetMail = async (participant: UserInterface) => {
    const resetLink = new URL(process.env.RESET_LINK);
    resetLink.search = `token=${participant.passwordResetToken}`;

    const renderedHtml = await hb.render('../templates/reset.hbs', { participant, resetLink: resetLink.href });
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

    await sendResetMail(participant);

    res.json({
        success: true,
        message: constants.passwordResetMail,
    });
});

router.post('/resetPassword', async (req, res) => {
    const passwordResetToken = (await crypto.randomBytes(32)).toString('hex');

    const participant = await User.findOneAndUpdate({
        passwordResetToken: req.body.token,
    }, {
        passwordResetToken,
        password: req.body.password,
    });

    if (!participant) {
        res.json({
            success: true,
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
