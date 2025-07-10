const express = require('express');
const router = express.Router();
const {
  registerPatient,
  loginPatient,
  getPatientDetails,
  updatePatient,
  getPatientHistory,
  addPatientHistory,
  updatePatientPassword,
  getPatientFavourites,
  verifyPatientEmail,
  getAllPatients
} = require('../controllers/patientController');

const auth = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', registerPatient);
router.post('/login', loginPatient);

// Verification route
router.get('/verify/:token', verifyPatientEmail);

// Profile routes
router.get('/:id', auth, getPatientDetails);
router.put('/:id', auth, updatePatient);

// Password update
router.put('/:id/password', auth, updatePatientPassword);

// Favourites and history
router.get('/:id/favourites', getPatientFavourites);
router.get('/:id/history', auth, getPatientHistory);
router.post('/:id/history', auth, addPatientHistory);
router.get('/', getAllPatients);

module.exports = router;
