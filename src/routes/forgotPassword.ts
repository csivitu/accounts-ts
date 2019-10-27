import express from 'express';
import crypto from 'crypto';
import hbs from 'express-handlebars'

import { Participant, ParticipantInterface } from '../models/participant.model';
import { constants } from '../tools/constants';
import { sendMail } from '../tools/sendMail';

const hb = hbs.create({
    extname: '.hbs',
    partialsDir: '.',
});

export const router = express.Router();

const sendResetMail = async (participant: ParticipantInterface) => {
    const resetLink = new URL(process.env.RESET_LINK);
    resetLink.search = `token=${participant.passwordResetToken}`;

    const renderedHtml = await hb.render('../templates/reset.hbs', { participant, resetLink: resetLink.href });
    await sendMail(participant.name, participant.email,
        constants.sendResetMailSubject, renderedHtml);
};

router.post('/forgotPassword', async (req, res) => {
    const participant = await Participant.findOne({
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

    const participant = await Participant.findOneAndUpdate({
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
