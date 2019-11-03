import mongoose, { Model } from 'mongoose';

const clientSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    clientId: {
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

export interface ClientInterface extends mongoose.Document {
    id: String,
    clientId: String,
    clientSecret: String,
    grants: String[],
    redirectUris: String[]
}

export const Participant: Model<ClientInterface> = mongoose.model('Client', clientSchema);
export default Participant;
