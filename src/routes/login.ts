import express from 'express';
import bcrypt from 'bcrypt';
import { Request, Response } from 'oauth2-server';

import { User } from '../models/user.model';
import { constants } from '../tools/constants';
import OauthServer from '../models/oauth';

export const router = express.Router();

router.get('/', async (req, res) => {
    res.render('login.html');
});

router.post('/', async (req, res) => {
    const request = new Request(req);
    const response = new Response(res);
    try {
        const token = await OauthServer.token(request, response);
        res.json({
            success: true,
            token,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: constants.serverError,
        });
    }
});

router.post('/logout', async (req, res) => {
    req.session.destroy(() => {});

    res.json({
        success: true,
        message: constants.logoutSuccess,
    });
});

export default router;
