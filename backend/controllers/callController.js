const { v4: uuidv4 } = require('uuid');
const CallLog = require('../models/call_logs');

const initiateCall = async (req, res) => {
  try {
    const { doctor_id, patient_id } = req.body;
    const { id: user_id, role } = req.user;

    if (![doctor_id, patient_id].includes(user_id)) {
      return res.status(403).json({ message: 'You can only initiate calls for yourself' });
    }

    if (!doctor_id || !patient_id) {
      return res.status(400).json({ message: 'doctor_id and patient_id required' });
    }

    const { room_id } = req.body;
    if (!room_id) return res.status(400).json({ message: 'room_id required' });
    const start_time = new Date();

    res.status(201).json({ message: 'Call initiated', room_id, start_time });
  } catch (err) {
    res.status(500).json({ message: 'Error initiating call', error: err.message });
  }
};

const endCall = async (req, res) => {
  try {
    const { room_id, doctor_id, patient_id, start_time } = req.body;
    const { id: user_id } = req.user;

    if (![doctor_id, patient_id].includes(user_id)) {
      return res.status(403).json({ message: 'Unauthorized to end this call' });
    }

    if (!room_id || !doctor_id || !patient_id || !start_time) {
      return res.status(400).json({ message: 'All call info required' });
    }

    const end_time = new Date();

    const log = await CallLog.create({
      room_id,
      doctor_id,
      patient_id,
      start_time,
      end_time
    });

    res.status(201).json({ message: 'Call ended and logged', log });
  } catch (err) {
    res.status(500).json({ message: 'Error logging call', error: err.message });
  }
};

module.exports = {
  initiateCall,
  endCall
};
