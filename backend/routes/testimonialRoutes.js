const express = require('express');
const router = express.Router();
const { getAllTestimonials, createTestimonial } = require('../controllers/testimonialController');

router.get('/', getAllTestimonials);
router.post('/', createTestimonial);

module.exports = router;
