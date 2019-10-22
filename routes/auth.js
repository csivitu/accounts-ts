const express = require('express');

const bcrypt = require('bcrypt');

const router = express.Router();

const Participant = require('../models/participant.model');
const constants = require('../middlewares/constants');
const authAdmin = require('../middlewares/authAdmin');

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

    const participant = await Participant.findOne({
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

    res.json(jsonResponse);
});

router.post('/logout', async (req, res) => {
    await req.session.destroy();

    res.json({
        success: true,
        message: constants.logoutSuccess,
    });
});

router.post('/admin/login', async (req, res) => {
    if (req.body.username === process.env.ADMIN_USERNAME
        && req.body.password === process.env.ADMIN_PASSWORD) {
        req.session.role = 'admin';
        res.json({
            success: true,
            message: constants.loggedInAsAdmin,
        });
    }
});

router.post('/admin/logout', authAdmin, async (req, res) => {
    await req.session.destroy();
    res.json({
        success: true,
        message: constants.logoutSuccess,
    });
});

module.exports = router;
