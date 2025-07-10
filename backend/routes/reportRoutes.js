const express = require('express');
const router = express.Router();
const { uploadReports, getReportsByPatient, getReportsByLoggedInPatient } = require('../controllers/reportController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/reports';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });

router.post('/upload/:id', upload.array('reports', 10), uploadReports);
router.get('/:id', getReportsByPatient);
router.get('/me', auth, getReportsByLoggedInPatient);

module.exports = router;
