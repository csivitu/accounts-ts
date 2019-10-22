const express = require('express');
const Question = require('../models/question.model');
const authAdmin = require('../middlewares/authAdmin');
const constants = require('../middlewares/constants');

const router = express.Router();

router.post('/', authAdmin, async (req, res) => {
    const question = new Question({
        question: req.body.question,
        answer: req.body.answer,
        domain: req.body.domain,
    });

    await question.save();

    res.json({
        success: true,
        message: constants.questionAdded,
    });
});

module.exports = router;
