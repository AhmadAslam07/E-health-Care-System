const express = require('express');
const router = express.Router();
const { getAllAdmins, createAdmin, deleteAdmin, loginAdmin } = require('../controllers/adminAuthController');

router.get('/', getAllAdmins);
router.post('/', createAdmin);
router.delete('/:id', deleteAdmin);
router.post('/login', loginAdmin);

module.exports = router;
