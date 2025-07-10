const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({ attributes: ['admin_id', 'name', 'email'] });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching admins', error: err.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ name, email, password: hashedPassword });

    // Send plain password in email (not ideal for real production apps)
    const emailHTML = `
      <h3>Welcome to E-Health Care</h3>
      <p>You have been added as an admin.</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>Please login and change your password after first login.</p>
    `;

    await sendEmail(email, 'Admin Account Created - E-Health Care', emailHTML);

    res.status(201).json({ message: 'Admin created', admin: { name, email } });
  } catch (err) {
    console.error("Admin creation error:", err);
    res.status(500).json({ message: 'Failed to create admin', error: err.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    await admin.destroy();
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting admin', error: err.message });
  }
};


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: 'No admin found with this email.' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { id: admin.admin_id, role: 'admin', email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: 'Login successful', token, admin: { id: admin.admin_id, name: admin.name, email: admin.email } });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


module.exports = { getAllAdmins, createAdmin, deleteAdmin, loginAdmin };
