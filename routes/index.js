// index.js
const express = require('express');

const router = express.Router();

const constants = require('../tools/constants');

router.get('/', async (_req, res) => {
    res.json({
        success: true,
        message: constants.home,
    });
});

module.exports = router;
