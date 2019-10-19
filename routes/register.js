const express = require('express');

const router = express.Router();
const Participant = require('../models/participant.model');
const constants = require('./constants');

const getBodyAttribute = (req, attribute) => req.body[attribute];

const verifyEmail = (email) => constants.emailRegex.test(email);

const verifyMobile = (mobile) => constants.mobileRegex.verifyMobile.test(mobile);

const verifyPassword = (password) => constants.passwordRegex.verifyPassword.test(password);

router.post('/', async (req, res) => {
    const participant = new Participant();
    participant.name = getBodyAttribute(req, 'name');
    participant.email = getBodyAttribute(req, 'email');
    participant.mobile = getBodyAttribute(req, 'mobile');
    participant.password = getBodyAttribute(req, 'password');
    participant.regNo = getBodyAttribute(req, 'regNo');
    participant.gender = getBodyAttribute(req, 'gender');

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

    await participant.save();

    jsonResponse.success = true;
    jsonResponse.message = constants.registrationSuccess;

    res.json(jsonResponse);
});

module.exports = router;
