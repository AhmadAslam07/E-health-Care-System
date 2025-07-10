const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const ClinicSlot = require('../models/clinicSlot');
const Prescription = require('../models/prescription');
const { sendEmail, sendInvoiceEmail } = require('../utils/emailService');
const path = require('path');

// CREATE appointment (pending + unpaid)
const bookAppointment = async (req, res) => {
  try {
    const { slot_id, appointment_type } = req.body;
    const { id: patient_id, role } = req.user;

    if (role !== 'patient') {
      return res.status(403).json({ message: 'Only patients can book appointments' });
    }

    if (!slot_id || !appointment_type) {
      return res.status(400).json({ message: 'Missing required fields (slot_id, appointment_type)' });
    }

    if (!['video', 'in_clinic'].includes(appointment_type)) {
      return res.status(400).json({ message: 'Invalid appointment type' });
    }

    const slot = await ClinicSlot.findByPk(slot_id);
    if (!slot || slot.is_booked) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    const doctor = await Doctor.findByPk(slot.doctor_id);
    const patient = await Patient.findByPk(patient_id);

    if (!doctor || !patient) {
      return res.status(404).json({ message: 'Doctor or patient not found' });
    }

    const appointment = await Appointment.create({
      doctor_id: slot.doctor_id,
      patient_id,
      slot_id,
      datetime: slot.start_time,
      appointment_type,
      status: 'pending',
      payment_status: 'unpaid'
    });

    slot.is_booked = true;
    await slot.save();

    const emailHTML = `
      <h3>New Appointment Request</h3>
      <p>Dear Dr. ${doctor.name},</p>
      <p>You have a new appointment request:</p>
      <ul>
        <li><strong>Patient:</strong> ${patient.name}</li>
        <li><strong>Email:</strong> ${patient.email}</li>
        <li><strong>Type:</strong> ${appointment_type}</li>
        <li><strong>Time:</strong> ${slot.start_time}</li>
      </ul>
      <p>Please review and confirm the appointment in your dashboard.</p>
    `;

    await sendEmail(doctor.email, 'New Appointment Request', emailHTML);

    res.status(201).json({ message: 'Appointment request sent', appointment });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: 'Error booking appointment', error: err.message });
  }
};

// GET doctor's appointments
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor_id = req.user.id;

    const appointments = await Appointment.findAll({
      where: { doctor_id },
      include: [{ model: Patient, attributes: ['name', 'email'] }],
      order: [['datetime', 'DESC']]
    });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
};

// UPDATE appointment status
const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['scheduled', 'completed', 'canceled'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const appt = await Appointment.findByPk(id, {
    include: [
      { model: Doctor, attributes: ['name', 'email'] },
      { model: Patient, attributes: ['name', 'email'] },
      { model: ClinicSlot }
    ]
  });

  if (!appt) return res.status(404).json({ message: "Appointment not found" });

  appt.status = status;
  await appt.save();

  if (status === 'scheduled') {
    const emailHTML = `
      <h3>Appointment Confirmed</h3>
      <p>Dear ${appt.Patient?.name},</p>
      <p>Your appointment with Dr. ${appt.Doctor?.name} has been <strong>confirmed</strong>.</p>
      <ul>
        <li><strong>Date & Time:</strong> ${new Date(appt.datetime).toLocaleString()}</li>
        <li><strong>Type:</strong> ${appt.appointment_type === 'video' ? 'Video Call' : 'In-Clinic'}</li>
      </ul>
      <p>Please make sure to be available at the scheduled time.</p>
    `;

    await sendEmail(appt.Patient?.email, 'Your Appointment is Confirmed', emailHTML);
  }

  res.json({ message: "Status updated", appointment: appt });
};

// GET patient's appointments
const getPatientAppointments = async (req, res) => {
  try {
    const patient_id = req.user.id;

    const appointments = await Appointment.findAll({
      where: { patient_id },
      include: [{ model: Doctor, attributes: ['name', 'email'] }],
      order: [['datetime', 'DESC']]
    });

    const updated = appointments.map(appt => ({
      ...appt.toJSON(),
      payment_status: appt.payment_status || 'unpaid'
    }));

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
};

// Mark appointment as paid & send invoice
const markAppointmentAsPaid = async (req, res) => {
  const appointmentId = req.params.id;

  try {
    const appointment = await Appointment.findByPk(appointmentId, {
      include: [Doctor, Patient]
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.payment_status = 'paid';
    await appointment.save();

    const totalAmount = 500.00;
    const commissionRate = 0.15;
    const commission = (totalAmount * commissionRate).toFixed(2);
    const doctorPayout = (totalAmount - commission).toFixed(2);

    const invoiceData = {
      appointmentId: appointment.appointment_id,
      date: new Date().toLocaleString(),
      amount: totalAmount,
      commission,
      doctorPayout,
      doctorName: appointment.Doctor.name,
      patientName: appointment.Patient.name
    };

    await sendInvoiceEmail(appointment.Patient.email, invoiceData, 'patient');
    await sendInvoiceEmail(appointment.Doctor.email, invoiceData, 'doctor');

    res.status(200).json({ message: 'Appointment marked as paid and emails sent' });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upload prescription
const uploadPrescriptions = async (req, res) => {
  const appointment_id = req.params.id;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  try {
    const prescriptions = req.files.map(file => ({
      appointment_id,
      file_name: file.originalname,
      file_path: `/uploads/prescriptions/${file.filename}`
    }));

    await Prescription.bulkCreate(prescriptions);

    res.status(201).json({ message: 'Prescriptions uploaded successfully' });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to upload prescriptions', error: err.message });
  }
};

// GET prescriptions for patient
const getPatientPrescriptions = async (req, res) => {
  try {
    const patient_id = req.user.id;

    const prescriptions = await Prescription.findAll({
      include: {
        model: Appointment,
        where: { patient_id },
        attributes: ['appointment_id', 'datetime', 'appointment_type'],
        include: {
          model: Doctor,
          attributes: ['name']
        }
      },
      order: [['createdAt', 'DESC']]
    });

    const formatted = prescriptions.map(p => ({
      prescription_id: p.prescription_id,
      file_name: p.file_name,
      file_path: p.file_path,
      createdAt: p.createdAt,
      appointment_id: p.appointment_id,
      datetime: p.Appointment?.datetime,
      appointment_type: p.Appointment?.appointment_type,
      doctor_name: p.Appointment?.Doctor?.name || 'N/A'
    }));

    res.status(200).json({ prescriptions: formatted });
  } catch (err) {
    console.error('Fetch prescriptions error:', err);
    res.status(500).json({ message: 'Failed to fetch prescriptions', error: err.message });
  }
};

// GET prescriptions by appointment
const getPrescriptionsByAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const prescriptions = await Prescription.findAll({
      where: { appointment_id: id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ prescriptions });
  } catch (err) {
    console.error("Doctor fetch prescriptions error:", err);
    res.status(500).json({ message: "Failed to fetch prescriptions", error: err.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: Doctor, attributes: ['name', 'specialization'] },
        { model: Patient, attributes: ['name', 'email'] }
      ],
      order: [['datetime', 'DESC']]
    });

    res.status(200).json(appointments);
  } catch (err) {
    console.error("Admin fetch error:", err);
    res.status(500).json({ message: 'Error fetching appointments', error: err.message });
  }
};

module.exports = {
  bookAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  getPatientAppointments,
  markAppointmentAsPaid,
  uploadPrescriptions,
  getPatientPrescriptions,
  getPrescriptionsByAppointment, 
  getAllAppointments
};
