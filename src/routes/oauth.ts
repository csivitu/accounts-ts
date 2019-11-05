import express from 'express';
import bcrypt from 'bcrypt';
import { Request, Response, OAuthError } from 'oauth2-server';

import { User } from '../models/user.model';
import { constants } from '../tools/constants';
import OauthServer from '../models/oauth';

export const router = express.Router();

router.use((req, res, next) => {
    res.locals.request = new Request(req);
    res.locals.response = new Response(res);
    next();
});

class AuthenticationHandler {
    static async handle(req2: any, _res2: any) {
        const user = await User.findOne({ username: req2.body.username }).exec();
        if (await bcrypt.compare(req2.body.password, user.password)) {
            return user;
        }
        throw new OAuthError('Incorrect Password', { code: 403 });
    }
}
router.post('/authorize', async (req, res) => {
    try {
        const code = OauthServer.authorize(
            res.locals.request,
            res.locals.response,
            {
                authenticateHandler: AuthenticationHandler,
            },
        );
        res.json({
            success: true,
            code,
        });
    } catch (e) {
        res.json(e);
    }
});
export default router;
