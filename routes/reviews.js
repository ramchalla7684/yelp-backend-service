const express = require('express');
const reviewsController = require('../controllers/reviews');

const router = express.Router();

router.get('/', (request, response, next) => {
    response.status(200).json({
        connected: true
    });
});

module.exports = router;