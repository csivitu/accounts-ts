const mongoose = require('mongoose');
const responseSchema = require('./response.schema');

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
        index: true,
    },
    regNo: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    responses: [responseSchema],
});

module.exports = mongoose.model('Participant', participantSchema);
