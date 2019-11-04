import jsonwebtoken from 'jsonwebtoken';
import OAuth2Server, {
    Client, User, Token, PasswordModel, AuthorizationCodeModel, AuthorizationCode,
} from 'oauth2-server';
import bcrypt from 'bcrypt';

import { Client as clientModel } from './client.model';
import { Token as TokenModel } from './token.model';
import { User as userModel, UserInterface } from './user.model';
import Code from './code.model';

const authCodeModel: AuthorizationCodeModel = {
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
    saveToken: async (
        token: Token,
        _client: Client,
        _user: User,
    ) => {
        const newToken = new TokenModel(token);
        return newToken.save();
    },
    getAccessToken: (accessToken: string) => TokenModel.findOne({ accessToken }).exec(),
    getAuthorizationCode: (authorizationCode: string) => Code.findOne({ authorizationCode }).exec(),
    saveAuthorizationCode: (code: AuthorizationCode, _client: Client, _user: User) => {
        const newCode = new Code(code);
        return newCode.save();
    },
    revokeAuthorizationCode: async (code: AuthorizationCode) => {
        const deleted = await Code.deleteOne({ authorizationCode: code.authorizationCode });

        return deleted.deletedCount === 1;
    },
    validateScope: async (user: User, client: Client, scope: string) => {
        if (!scope.split(' ').every((s) => user.scope.indexOf(s) >= 0)) {
            return false;
        }
        return scope;
    },
    verifyScope: async (token: Token, scope: string) => {
        if (!token.scope) {
            return false;
        }
        const requestedScopes = scope.split(' ');
        const authorizedScopes = (token.scope as string).split(' ');
        return requestedScopes.every((s) => authorizedScopes.indexOf(s) >= 0);
    },
};

const OauthServer = new OAuth2Server({
    model: authCodeModel,
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true,
});
export default OauthServer;
