import mongoose, { Model, Mongoose } from 'mongoose';

const tokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,
    },
    accessTokenExpiresAt: {
        type: Date,
    },
    scope: {
        type: String,
    },
});

export interface TokenInterface extends mongoose.Document {
    accessToken: String,
    type: Date,
    scope: String
}

export const Token: Model<TokenInterface> = mongoose.model('Token', tokenSchema);
export default Token;
