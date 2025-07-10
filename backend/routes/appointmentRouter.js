const express = require('express');
const router = express.Router();
const { bookAppointment, getDoctorAppointments, updateAppointmentStatus, getPatientAppointments, uploadPrescriptions, getPatientPrescriptions, getPrescriptionsByAppointment, markAppointmentAsPaid, getAllAppointments } = require('../controllers/appointmentController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Book appointment (Patient only)
router.post('/', auth, bookAppointment);

// Get appointments for logged-in doctor
router.get('/doctor', auth, getDoctorAppointments);
router.patch('/:id', auth, updateAppointmentStatus);
router.get('/patient', auth, getPatientAppointments);
router.post('/:id/prescriptions', auth, upload.array('prescriptions'), uploadPrescriptions);
router.get('/prescriptions', auth, getPatientPrescriptions);
router.get('/prescriptions/:id', auth, getPrescriptionsByAppointment);
router.patch('/:id/mark-paid', markAppointmentAsPaid);
router.get('/', getAllAppointments);

module.exports = router;
