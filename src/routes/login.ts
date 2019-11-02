import express from 'express';
import bcrypt from 'bcrypt';

export const router = express.Router();

import { Participant } from  '../models/participant.model';
import { constants } from  '../tools/constants';

router.get('/', async (req, res) => {
    res.render('login.html');
});

router.post('/', async (req, res) => {
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
    req.session.destroy(() => {});

    res.json({
        success: true,
        message: constants.logoutSuccess,
    });
});

