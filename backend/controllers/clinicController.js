const ClinicSlot = require('../models/clinicSlot');
const Doctor = require('../models/doctor');

const addClinicSlot = async (req, res) => {
  try {
    const { doctor_id, start_time, end_time } = req.body;

    if (!doctor_id || !start_time || !end_time) {
      return res.status(400).json({ message: 'doctor_id, start_time, and end_time are required' });
    }

    const slot = await ClinicSlot.create({
      doctor_id,
      start_time,
      end_time,
      is_booked: false
    });

    res.status(201).json({ message: 'Clinic slot added', slot });
  } catch (err) {
    res.status(500).json({ message: 'Error adding slot', error: err.message });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { doctor_id } = req.query;
    const { Op } = require("sequelize");

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const where = {
      is_booked: false,
      start_time: { [Op.gte]: todayStart }
    };

    if (doctor_id) where.doctor_id = doctor_id;

    const slots = await ClinicSlot.findAll({
      where,
      include: [{
        model: Doctor,
        attributes: ['doctor_id', 'name', 'specialization']
      }],
      order: [['start_time', 'ASC']]
    });

    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching slots', error: err.message });
  }
};

// DELETE /api/clinic/slot/:id
const deleteClinicSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await ClinicSlot.findByPk(id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    await slot.destroy();
    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting slot', error: err.message });
  }
};

const getAllDoctorSlots = async (req, res) => {
  try {
    const { doctor_id } = req.query;

    if (!doctor_id) {
      return res.status(400).json({ message: 'doctor_id is required' });
    }

    const slots = await ClinicSlot.findAll({
      where: { doctor_id },
      include: [{
        model: Doctor,
        attributes: ['doctor_id', 'name', 'specialization']
      }],
      order: [['start_time', 'ASC']]
    });

    res.status(200).json(slots);
  } catch (err) {
    console.error("Error fetching all slots:", err.message);
    res.status(500).json({ message: 'Error fetching doctor slots', error: err.message });
  }
};

module.exports = {
  addClinicSlot,
  getAvailableSlots,
  deleteClinicSlot,
  getAllDoctorSlots
};
