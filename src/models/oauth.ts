import jsonwebtoken from 'jsonwebtoken';
import {
    Client, User, Token, PasswordModel,
} from 'oauth2-server';
import bcrypt from 'bcrypt';

import { Client as clientModel } from './client.model';
import { Token as TokenModel } from './token.model';
import { User as userModel, UserInterface } from './user.model';

const passwordModel: PasswordModel = {
    generateAccessToken: async (_client: Client, user: User, _scope: string) => {
        const payload = {
            username: user.username,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            regNo: user.regNo,
            gender: user.gender,
        };
        return jsonwebtoken.sign(payload, process.env.JWT_SECRET);
    },
    getClient: (
        clientId: String,
        clientSecret: String,
    ) => clientModel.findOne({ clientId, clientSecret }).exec(),
    getUser: async (
        username: String,
        password: String,
    ) => {
        const user = await userModel.findOne({ username, password }).exec();
        if (await bcrypt.compare(password, user.password)) {
            return user;
        }
        return false;
    },
    saveToken: async (
        token: Token,
        _client: Client,
        _user: User,
    ) => {
        const newToken = new TokenModel(token);
        return newToken.save();
    },
    getAccessToken: (accessToken: string) => TokenModel.findOne({ accessToken }).exec(),
    verifyScope: async (token: Token, scope: string) => {
        if (!token.scope) {
            return false;
        }
        const requestedScopes = scope.split(' ');
        const authorizedScopes = (token.scope as string).split(' ');
        return requestedScopes.every((s) => authorizedScopes.indexOf(s) >= 0);
    },
};

export default passwordModel;
