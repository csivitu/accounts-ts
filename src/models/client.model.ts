import mongoose, { Model } from 'mongoose';
import { Client as oauthClientInterface } from 'oauth2-server';

const clientSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    clientSecret: {
        type: String,
        required: true,
    },
    grants: [String],
    redirectUris: [String],
});

type clientInterface = mongoose.Document & oauthClientInterface;

export const Client: Model<clientInterface> = mongoose.model('Client', clientSchema);
export default Client;
