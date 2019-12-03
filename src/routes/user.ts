import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

export const router = express.Router();

router.options('/', cors());
router.get('/', cors(), (req, res) => {
    let { token } = req.query;
    if (!token) {
        token = req.headers.authorization as string;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
            res.json({
                success: false,
            });
        } else {
            res.json({
                success: true,
                user: decoded,
            });
        }
    });
});

export default router;
