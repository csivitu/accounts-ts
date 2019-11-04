import mongoose, { Model } from 'mongoose';
import { AuthorizationCode as oauth2Code } from 'oauth2-server';

const codeSchema = new mongoose.Schema({
    authorizationCode: {
        type: String,
    },
    expiresAt: {
        type: Date,
    },
    redirectUri: {
        type: String,
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

type codeInterface = oauth2Code & mongoose.Document;

export const Code: Model<codeInterface> = mongoose.model('Code', codeSchema);
export default Code;
