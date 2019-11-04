import mongoose, { Model } from 'mongoose';
import { Token as oauth2Token } from 'oauth2-server';

const tokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,
    },
    accessTokenExpiresAt: {
        type: Date,
    },
    refreshToken: {
        type: String,
    },
    refreshTokenExpiresAt: {
        type: Date,
    },
    scope: {
        type: String,
    },
    client: {
        type: Object,
        required: true,
    },
    user: {
        type: Object,
        required: true,
    },
});

type tokenInterface = oauth2Token & mongoose.Document;

export const Token: Model<tokenInterface> = mongoose.model('Token', tokenSchema);
export default Token;
