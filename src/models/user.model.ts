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
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    regNo: {
        type: String,
        required: true,
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
        required: true,
        default: false,
    },
    passwordResetToken: {
        type: String,
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
}

export const User: Model<UserInterface> = mongoose.model('Participant', userSchema);
export default User;
