const Appointment = require('../models/appointment');
const Patient = require('../models/patient');
const { Op } = require('sequelize');

const getPatientStats = async (req, res) => {
  try {
    const pendingCount = await Appointment.count({ where: { status: 'pending' } });
    const scheduledCount = await Appointment.count({ where: { status: { [Op.in]: ['pending', 'scheduled'] } } });
    const totalPatients = await Patient.count();

    res.status(200).json({
      pending: pendingCount,
      scheduled: scheduledCount,
      totalPatients: totalPatients
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

module.exports = { getPatientStats };
