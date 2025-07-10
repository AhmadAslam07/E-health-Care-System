const Doctor = require('../models/doctor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');
const crypto = require('crypto');
const VerificationToken = require('../models/VerificationToken');

// Register Doctor
const registerDoctor = async (req, res) => {
  try {
    const {
      name, email, password, phone, gender, specialization,
      qualification, experience, clinic_location, fee, about, services
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const existing = await Doctor.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Doctor already registered with this email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      name, email, password: hashedPassword, phone, gender, specialization,
      qualification, experience, clinic_location, fee, about, services, image,
      is_verified: false
    });

    // Email to doctor (confirmation)
    const doctorEmailHTML = `
      <h3>Registration Received</h3>
      <p>Dear Dr. ${name},</p>
      <p>Thank you for registering with E-Health Care. Your request is under review.</p>
      <p>Please email your verified documents to <strong>admin@ehealth.com</strong> for approval.</p>
      <p>Once verified, you'll receive a confirmation email.</p>
    `;

    await sendEmail(email, 'Your Registration is Under Review - E-Health Care', doctorEmailHTML);

    // Email to admin (notification)
    const adminEmail = process.env.ADMIN_EMAIL || 'sobiiii3265@gmail.com';
    const adminEmailHTML = `
      <h3>New Doctor Registration Request</h3>
      <p>A new doctor has registered and is awaiting verification:</p>
      <ul>
        <li><strong>Name:</strong> Dr. ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Specialization:</strong> ${specialization}</li>
        <li><strong>Phone:</strong> ${phone}</li>
      </ul>
    `;

    await sendEmail(adminEmail, 'New Doctor Registration Request', adminEmailHTML);

    res.status(201).json({
      message: 'Doctor registered successfully. Awaiting admin approval.',
      doctor_id: doctor.doctor_id
    });

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: 'Server error during registration', error: err.message });
  }
};

const getUnverifiedDoctors = async (req, res) => {
  try {
    const unverified = await Doctor.findAll({ where: { is_verified: false } });
    res.status(200).json(unverified);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctor requests", error: err.message });
  }
};

const verifyDoctorByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.is_verified = true;
    await doctor.save();

    const loginURL = 'http://localhost:3000/DrsLogin';
    const emailHTML = `
      <h3>Account Approved</h3>
      <p>Dear Dr. ${doctor.name},</p>
      <p>Your account has been verified and approved by the admin.</p>
      <p>You can now log in using the following link:</p>
      <a href="${loginURL}">${loginURL}</a>
    `;

    await sendEmail(doctor.email, 'Account Verified - E-Health Care', emailHTML);

    res.json({ message: "Doctor verified successfully" });

  } catch (err) {
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
};

// Email Verification Handler
const verifyDoctorEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const record = await VerificationToken.findOne({ where: { token } });
    if (!record || record.expires_at < new Date()) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    const doctor = await Doctor.findByPk(record.doctor_id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.is_verified = true;
    await doctor.save();
    await record.destroy();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ message: "Email verification failed", error: err.message });
  }
};

// Doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ where: { email } });
    if (!doctor) return res.status(404).json({ message: 'No account with this email.' });

    if (!doctor.is_verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { id: doctor.doctor_id, role: 'doctor', email: doctor.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: pw, ...doctorData } = doctor.toJSON();

    // Login Alert
    const loginHTML = `
      <h3>Login Alert</h3>
      <p>Dear Dr. ${doctor.name}, your account was just logged in.</p>
      <p><strong>Email:</strong> ${doctor.email}</p>
      <p>If this wasn't you, please change your password immediately.</p>
    `;
    await sendEmail(doctor.email, 'Login Notification - E-Health Care', loginHTML);

    res.status(200).json({ message: 'Login successful', token, doctor: doctorData });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

// Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.filename;

    await doctor.update(updateData);
    res.json({ message: "Profile updated successfully", doctor });
  } catch (err) {
    res.status(500).json({ message: "Profile update failed", error: err.message });
  }
};

// Change Password
const changeDoctorPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const doctor = await Doctor.findByPk(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const match = await bcrypt.compare(oldPassword, doctor.password);
  if (!match) return res.status(401).json({ message: "Old password is incorrect" });

  const hashed = await bcrypt.hash(newPassword, 10);
  doctor.password = hashed;
  await doctor.save();

  res.json({ message: "Password updated successfully" });
};

// Get Doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ doctor });
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctor", error: err.message });
  }
};

module.exports = {
  registerDoctor,
  loginDoctor,
  getDoctorById,
  updateDoctorProfile,
  changeDoctorPassword,
  verifyDoctorEmail,
  getUnverifiedDoctors,
  verifyDoctorByAdmin
};
