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

export default tokenSchema;
