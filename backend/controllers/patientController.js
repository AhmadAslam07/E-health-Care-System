const Patient = require('../models/patient');
const PatientHistory = require('../models/patientHistory');
const Doctor = require('../models/doctor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');
const crypto = require('crypto');
const PatientVerificationToken = require('../models/PatientVerificationToken');

const registerPatient = async (req, res) => {
  try {
    const { name, email, password, dob, contact_info } = req.body;

    const existing = await Patient.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'A patient account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      name,
      email,
      password: hashedPassword,
      dob,
      contact_info,
      is_verified: false
    });

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    await PatientVerificationToken.create({
      token,
      patient_id: patient.patient_id,
      expires_at: expiresAt
    });

    const verificationLink = `http://localhost:3000/verify-patient/${token}`;

    // Send Welcome Email
    const welcomeHTML = `
      <h2>Welcome to E-Health Care, ${name}!</h2>
      <p>Thank you for registering. Please verify your email to activate your account.</p>
    `;

    const verifyHTML = `
      <h3>Email Verification</h3>
      <p>Hello ${name},</p>
      <p>Click below to verify your email:</p>
      <a href="${verificationLink}" style="background:#28a745;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Verify Email</a>
      <p>This link will expire in 30 minutes.</p>
    `;

    await sendEmail(email, 'Welcome to E-Health Care', welcomeHTML);
    await sendEmail(email, 'Verify Your Email - E-Health Care', verifyHTML);

    res.status(201).json({ message: 'Patient registered. Verification email sent.' });

  } catch (err) {
    console.error("Patient Registration Error:", err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

const verifyPatientEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const record = await PatientVerificationToken.findOne({ where: { token } });
    if (!record || record.expires_at < new Date()) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    const patient = await Patient.findByPk(record.patient_id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    patient.is_verified = true;
    await patient.save();
    await record.destroy();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ message: "Email verification failed", error: err.message });
  }
};

const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ where: { email } });
    if (!patient) {
      return res.status(404).json({ message: 'No patient found with this email.' });
    }

    if (!patient.is_verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { id: patient.patient_id, role: 'patient', email: patient.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: pw, ...patientData } = patient.toJSON();

    const maskedPassword = '*'.repeat(Math.max(4, password.length - 2));
    const loginEmailHTML = `
      <h3>Login Notification - E-Health Care</h3>
      <p>Dear ${patient.name},</p>
      <p>Your account was just accessed.</p>
      <p><strong>Email:</strong> ${patient.email}</p>
      <p><strong>Password:</strong> ${maskedPassword}</p>
      <p>If this wasn't you, please reset your password immediately.</p>
    `;

    await sendEmail(patient.email, 'Login Alert - E-Health Care', loginEmailHTML);

    res.status(200).json({ message: 'Login successful', token, patient: patientData });

  } catch (err) {
    console.error("Patient Login Error:", err);
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

const getPatientDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'doctor' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await Patient.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({ patient });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching patient', error: err.message });
  }
};

const getPatientHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'doctor' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const history = await PatientHistory.findAll({
      where: { patient_id: id },
      include: [
        {
          model: Doctor,
          attributes: ['doctor_id', 'name', 'specialization']
        },
        {
          model: Patient,
          attributes: ['patient_id', 'name', 'email', 'dob']
        }
      ]
    });

    res.status(200).json({ history });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch history', error: err.message });
  }
};

const addPatientHistory = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can add patient history' });
    }

    const { id: patient_id } = req.params;
    const { diagnosis, prescription, visit_date } = req.body;
    const doctor_id = req.user.id;

    if (!diagnosis || !prescription) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const entry = await PatientHistory.create({
      patient_id,
      doctor_id,
      diagnosis,
      prescription,
      visit_date: visit_date || new Date()
    });

    res.status(201).json({ message: 'History added', entry });
  } catch (err) {
    res.status(500).json({ message: 'Error adding history', error: err.message });
  }
};

// PUT /api/patients/:id
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'patient' || req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const patient = await Patient.findByPk(id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    // Filter out undefined/null values to prevent overwriting with null
    const updateFields = {};
    const allowedFields = ['name', 'email', 'phone', 'gender', 'address', 'age'];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined && req.body[field] !== null) {
        updateFields[field] = req.body[field];
      }
    }

    await patient.update(updateFields);
    res.status(200).json({ message: 'Profile updated successfully', patient });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// PUT /api/patients/:id/password
const updatePatientPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Ensure user can only change their own password
    if (req.user.id !== parseInt(id) || req.user.role !== 'patient') {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await patient.update({ password: hashedPassword });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const Appointment = require('../models/appointment');

const getPatientFavourites = async (req, res) => {
  try {
    const { id } = req.params;

    const appointments = await Appointment.findAll({
      where: { patient_id: id },
      include: [
        {
          model: Doctor,
          attributes: [
            'doctor_id',
            'name',
            'specialization',
            'clinicLocation',
            'experience',
            'fee'
          ]
        }
      ]
    });

    const doctorMap = new Map();
    for (const appt of appointments) {
      if (appt.Doctor && !doctorMap.has(appt.Doctor.doctor_id)) {
        doctorMap.set(appt.Doctor.doctor_id, appt.Doctor);
      }
    }

    const favourites = Array.from(doctorMap.values());
    res.status(200).json({ favourites });
  } catch (err) {
    console.error("Error fetching favourites:", err);
    res.status(500).json({ message: "Failed to fetch favourites", error: err.message });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      attributes: { exclude: ['password'] }  
    });
    res.status(200).json(patients);
  } catch (err) {
    console.error("Error fetching all patients:", err);
    res.status(500).json({ message: 'Error retrieving patients', error: err.message });
  }
};


module.exports = {
  registerPatient,
  verifyPatientEmail,
  loginPatient,
  getPatientDetails,
  addPatientHistory,
  getPatientHistory,
  updatePatient,
  updatePatientPassword,
  getPatientFavourites,
  getAllPatients
};
