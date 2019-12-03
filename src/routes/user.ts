import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

export const router = express.Router();

router.options('/', cors());
router.get('/', cors(), (req, res) => {
    const token = req.headers.Authorization as string;

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
