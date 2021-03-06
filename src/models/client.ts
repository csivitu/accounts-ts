import mongoose, { Model } from 'mongoose';
import { Client as oauthClientInterface } from 'oauth2-server';

const clientSchema = new mongoose.Schema({
    clientName: {
        type: String,
    },
    clientId: {
        type: String,
        required: true,
    },
    redirectUris: {
        type: [String],
        required: true,
    },
});

export interface ClientInterface extends mongoose.Document {
    clientId: String,
    redirectUris: Array<String>,
    clientName: String,
}

export default clientSchema;
