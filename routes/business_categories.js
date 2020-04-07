const express = require('express');
const businessCategoriesController = require('../controllers/business_categories');

const router = express.Router();

router.get('/', businessCategoriesController.getTopBusinessCategories);


module.exports = router;