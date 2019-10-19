const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const Participant = require('../models/participant.model');
const constants = require('./constants');
const { verifyEmail, verifyMobile, verifyPassword } = require('./verify');

router.post('/', async (req, res) => {
    const saltRounds = 10;

    const participant = new Participant({
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, saltRounds),
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

    await participant.save();

    jsonResponse.success = true;
    jsonResponse.message = constants.registrationSuccess;

    res.json(jsonResponse);
});

module.exports = router;
