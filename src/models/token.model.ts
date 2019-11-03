import mongoose, { Model } from 'mongoose';

const tokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true,
    },
    accessTokenExpiresAt: {
        type: Date,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    refreshTokenExpiresAt: {
        type: Date,
        required: true,
    },
    client: Object,
    user: Object,
});

export interface TokenInterface extends mongoose.Document {
    accessToken: String,
    accessTokenExpiresAt: Date,
    refreshToken: String,
    refreshTokenExpiresAt: Date,
    client: Object,
    user: Object
}

export const Participant: Model<TokenInterface> = mongoose.model('Token', tokenSchema);
export default Participant;
