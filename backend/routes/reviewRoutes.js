const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { getReviewsForDoctor, createReview } = require('../controllers/reviewController');

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this missing route
router.get('/:doctor_id', getReviewsForDoctor);

// POST review
router.post('/', createReview);

module.exports = router;
