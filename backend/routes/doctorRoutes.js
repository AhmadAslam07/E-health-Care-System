const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// FROM doctorController: for filters and online status
const {
  getDoctorById,
  updateDoctorStatus,
  filterDoctors
} = require('../controllers/doctorController');

// FROM authController: profile update & password change
const {
  updateDoctorProfile,
  changeDoctorPassword
} = require('../controllers/authController');

// GET all doctors with optional filters (e.g., ?gender=male&specialization=cardiology)
router.get('/', filterDoctors);

// GET doctor by ID (protected)
router.get('/:id', auth, getDoctorById);

// PUT update profile (with image upload)
router.put('/:id', auth, upload.single('image'), updateDoctorProfile);

// POST change password
router.post('/:id/change-password', auth, changeDoctorPassword);

// PATCH online status (optional, you can remove if not using it)
router.patch('/:id/status', auth, updateDoctorStatus);

module.exports = router;
