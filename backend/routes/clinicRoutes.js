const express = require('express');
const router = express.Router();
const {
  addClinicSlot,
  getAvailableSlots,
  deleteClinicSlot,
  getAllDoctorSlots
} = require('../controllers/clinicController');

// Existing routes
router.post('/slots', addClinicSlot);
router.get('/slots', getAvailableSlots);
router.delete('/slot/:id', deleteClinicSlot);

// New route for doctor dashboard
router.get('/slots/all', getAllDoctorSlots);

module.exports = router;
