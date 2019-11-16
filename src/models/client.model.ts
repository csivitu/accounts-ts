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
    redirectUris: [String],
});

export interface ClientInterface extends mongoose.Document {
    clientId: String,
    redirectUris: Array<String>
}

export const Client: Model<ClientInterface> = mongoose.model('Client', clientSchema);
export default Client;
