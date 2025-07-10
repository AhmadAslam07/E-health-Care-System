// controllers/reviewController.js
const Review = require('../models/Review');
const Patient = require('../models/patient');

const createReview = async (req, res) => {
  try {
    const { doctor_id, patient_id, comments, recommend } = req.body;

    if (!doctor_id || !patient_id || !comments) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const review = await Review.create({
      doctor_id,
      patient_id,
      comments,
      recommend,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('Create Review Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getReviewsForDoctor = async (req, res) => {
  try {
    const { doctor_id } = req.params;

    const reviews = await Review.findAll({
      where: { doctor_id },
      include: [
        {
          model: Patient,
          attributes: ['name'],
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(reviews);
  } catch (err) {
    console.error('Get Reviews Error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

module.exports = {
  createReview,
  getReviewsForDoctor,
};
