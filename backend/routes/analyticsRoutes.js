const express = require('express');
const router = express.Router();
const { getPatientStats } = require('../controllers/analyticsController');

router.get('/patient-stats', getPatientStats);

module.exports = router;
