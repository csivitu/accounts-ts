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
});

module.exports = mongoose.model('Question', questionSchema);
