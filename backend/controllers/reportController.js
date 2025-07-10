const path = require('path');
const fs = require('fs');
const Report = require('../models/labReport');
const Appointment = require('../models/appointment');

// Upload reports and link with appointment
const uploadReports = async (req, res) => {
  try {
    const patient_id = req.params.id;
    const appointment_id = req.body.appointment_id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    if (!appointment_id) {
      return res.status(400).json({ message: 'Missing appointment ID' });
    }

    const appointmentExists = await Appointment.findByPk(appointment_id);
    if (!appointmentExists) {
      return res.status(404).json({ message: 'Invalid appointment ID' });
    }

    const reports = req.files.map(file => ({
      patient_id,
      appointment_id,
      file_path: `/uploads/reports/${file.filename}`,
      file_name: file.originalname,
    }));

    const savedReports = await Report.bulkCreate(reports);

    await Appointment.update(
      { lab_report: reports[0].file_path },
      { where: { appointment_id } }
    );

    res.status(201).json({ message: 'Reports uploaded successfully', reports: savedReports });
  } catch (err) {
    console.error('Upload error:', err.original || err.message || err);
    res.status(500).json({ message: 'Failed to upload reports', error: err.message });
  }
};

// Get all reports by a patient's ID (admin/doctor)
const getReportsByPatient = async (req, res) => {
  try {
    const patient_id = req.params.id;

    const reports = await Report.findAll({
      where: { patient_id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ reports });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
};

// Get reports for the logged-in patient
const getReportsByLoggedInPatient = async (req, res) => {
  try {
    const patient_id = req.user.id;

    const reports = await Report.findAll({
      where: { patient_id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ reports });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
};

module.exports = {
  uploadReports,
  getReportsByPatient,
  getReportsByLoggedInPatient
};
