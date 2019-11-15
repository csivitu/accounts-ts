import express from "express";
import constants from "../tools/constants";
import Client from "../models/client.model";

export const router = express.Router();

router.get("/authorize", async (req, res) => {
    const clientId = req.query.clientId;
    const state = req.query.state;
    const redirectUrl = req.query.redirect_uri;

    if (!clientId || !state || redirectUrl) {
        return res.status(400).json({
            success: false,
            message: constants.serverError
        });
    }

    const client = await Client.findOne({ clientId });

    // Client not found/Redirect URI not valid
    if (!client || client.redirectUris.indexOf(redirectUrl) < 0) {
        return res.status(400).json({
            success: false,
            message: constants.serverError
        });
    }

    req.session.clientId = clientId;
    req.session.state = state;
    req.session.redirectUrl = redirectUrl;

    res.redirect('/auth/login');
});

export default router;