import express from 'express';
import constants from '../tools/constants';
import { Client } from '../models/models';

export const router = express.Router();

router.get('/authorize', async (req, res) => {
    const { clientId, state, redirectUrl } = req.query;
    if (!clientId || !state || !redirectUrl) {
        return res.status(400).json({
            success: false,
            message: constants.serverError,
        });
    }

    const client = await Client.findOne({ clientId });
    // Client not found/Redirect URI not valid
    if (!client || client.redirectUris.indexOf(redirectUrl) < 0) {
        return res.status(400).json({
            success: false,
            message: constants.serverError,
        });
    }

    req.session.clientId = clientId;
    req.session.clientName = client.clientName;
    req.session.state = state;
    req.session.redirectUri = redirectUrl;

    return res.redirect('/auth/login');
});

export default router;
