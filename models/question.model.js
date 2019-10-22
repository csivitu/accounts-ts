const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    answer: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    domain: {
        type: String,
        required: true,
        enum: ['tech', 'design', 'management', 'video'],
    },
});

module.exports = mongoose.model('Question', questionSchema);
