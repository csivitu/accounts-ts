import jsonwebtoken, { JsonWebTokenError } from 'jsonwebtoken';
import { UserInterface } from '../models/user';

export const generateToken = (user: UserInterface) => {
    const userObj = {
        verificationStatus: user.verificationStatus,
        name: user.name,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        regNo: user.regNo,
        gender: user.gender,
        scope: user.scope,
    };

    return jsonwebtoken.sign(userObj, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

export default generateToken;
