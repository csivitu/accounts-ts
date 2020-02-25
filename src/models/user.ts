import mongoose, { Model } from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    regNo: {
        type: String,
        unique: true,
        sparse: true,
    },
    gender: {
        type: String,
        enum: ['M', 'F'],
        required: true,
    },
    emailVerificationToken: {
        type: String,
        required: true,
    },
    verificationStatus: {
        type: String,
        default: false,
        required: true,
    },
    passwordResetToken: {
        type: String,
        required: true,
    },
    scope: {
        type: [String],
        required: true,
    },
});

export interface UserInterface extends mongoose.Document {
    name: string;
    username: string;
    email: string;
    mobile: string;
    password: string;
    regNo: string;
    gender: string;
    emailVerificationToken: string;
    verificationStatus: string;
    passwordResetToken: string;
    scope: string[];
}

export default userSchema;
