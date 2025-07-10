const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor, getUnverifiedDoctors, verifyDoctorByAdmin } = require('../controllers/authController');
const { body } = require('express-validator');
const upload = require('../middleware/upload');
const auth = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  upload.single("image"),
  registerDoctor
);

// POST /api/auth/login
router.post('/login', loginDoctor);
router.get('/unverified-doctors', getUnverifiedDoctors);
router.patch('/verify-doctor/:id', verifyDoctorByAdmin);

module.exports = router;
