const express = require('express');
const businessesController = require('../controllers/businesses');

const router = express.Router();

router.get('/', businessesController.getMostReviewedBusinesses);
router.get('/:business_id', businessesController.getBusinessDetails);

module.exports = router;