const express = require('express');
const crypto = require('crypto');
const hb = require('express-handlebars').create({
    extname: '.hbs',
    partialsDir: '.',
});

const Participant = require('../models/participant.model');
const constants = require('../tools/constants');
const sendMail = require('../tools/sendMail');

const router = express.Router();

const sendResetMail = async (participant) => {
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

module.exports = router;
