const { Op } = require('sequelize');
const Doctor = require('../models/doctor');

const filterDoctors = async (req, res) => {
  try {
    const { gender, specialists, search } = req.query;

    const where = {};

    if (gender) where.gender = gender;

    if (specialists) {
      const specialistArray = specialists.split(',');
      where.specialization = { [Op.in]: specialistArray };
    }

    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }

    const doctors = await Doctor.findAll({ where });

    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Error filtering doctors', error: err.message });
  }
}

const getAvailableDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { online_status: 'online' }
    });
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors', error: err.message });
  }
};

// Update doctor status
const updateDoctorStatus = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['online', 'offline', 'in_call'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.online_status = status;
    await doctor.save();

    res.status(200).json({ message: 'Status updated', status: doctor.online_status });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
};

// Get doctor by ID (used in profile view)
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Wrap doctor in an object for consistent API structure
    res.status(200).json({ doctor });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctor', error: err.message });
  }
};

module.exports = {
  getAvailableDoctors,
  updateDoctorStatus,
  getDoctorById,
  filterDoctors
};
