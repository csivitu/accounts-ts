import mongoose, { Model } from 'mongoose';

const participantSchema = new mongoose.Schema({
    name: {
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

interface ParticipantInterface extends mongoose.Document {
    name: string;
    email: string;
    mobile: string;
    password: string;
    regNo: string;
    gender: string;
    emailVerificationToken: string;
    verificationStatus: string;
    passwordResetToken: string;
}

export const Participant: Model<ParticipantInterface> = mongoose.model('Participant', participantSchema);
