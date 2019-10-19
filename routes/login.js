const express = require('express');

const bcrypt = require('bcrypt');

const router = express.Router();

const Participant = require('../models/participant.model');
const constants = require('./constants');

// Check email and password length

router.post('/', async (req, res) => {
    const jsonResponse = {
        success: false,
        message: constants.defaultResponse,
    };

    const { email, password } = req.body;

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
