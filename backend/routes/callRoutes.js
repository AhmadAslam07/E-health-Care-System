const express = require('express');
const router = express.Router();
const { initiateCall, endCall } = require('../controllers/callController');
const auth = require('../middleware/authMiddleware');

// Protected Routes
router.post('/initiate', auth, initiateCall);
router.post('/end', auth, endCall);

module.exports = router;
