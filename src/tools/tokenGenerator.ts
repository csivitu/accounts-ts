import jsonwebtoken, { JsonWebTokenError } from 'jsonwebtoken';
import { UserInterface } from '../models/user.model';

export const generateToken = async (user: UserInterface) => {
    const userObj = user;
    delete userObj.password;
    delete userObj.emailVerificationToken;
    delete userObj.verificationStatus;
    delete userObj.passwordResetToken;

    return jsonwebtoken.sign(userObj, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

export default generateToken;
