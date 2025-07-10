const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MODELS
const Doctor = require('./models/doctor');
const Patient = require('./models/patient');
const Appointment = require('./models/appointment');
const ClinicSlot = require('./models/clinicSlot');
const CallLogs = require('./models/call_logs');
const PatientHistory = require('./models/patientHistory');
const LabReport = require('./models/labReport');
const Review = require('./models/Review');
const Prescription = require('./models/prescription');

// ASSOCIATIONS
Doctor.hasMany(Appointment, { foreignKey: 'doctor_id' });
Patient.hasMany(Appointment, { foreignKey: 'patient_id' });
ClinicSlot.hasOne(Appointment, { foreignKey: 'slot_id' });

Appointment.belongsTo(Doctor, { foreignKey: 'doctor_id' });
Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });
Appointment.belongsTo(ClinicSlot, { foreignKey: 'slot_id' });

Doctor.hasMany(PatientHistory, { foreignKey: 'doctor_id' });
Patient.hasMany(PatientHistory, { foreignKey: 'patient_id' });

PatientHistory.belongsTo(Doctor, { foreignKey: 'doctor_id' });
PatientHistory.belongsTo(Patient, { foreignKey: 'patient_id' });

Patient.hasMany(LabReport, { foreignKey: 'patient_id' });
LabReport.belongsTo(Patient, { foreignKey: 'patient_id' });

Doctor.hasMany(Review, { foreignKey: 'doctor_id' });
Patient.hasMany(Review, { foreignKey: 'patient_id' });

Review.belongsTo(Doctor, { foreignKey: 'doctor_id' });
Review.belongsTo(Patient, { foreignKey: 'patient_id' });

Appointment.hasMany(Prescription, { foreignKey: 'appointment_id' });
Prescription.belongsTo(Appointment, { foreignKey: 'appointment_id' });

// ROUTES
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRouter');
const clinicRoutes = require('./routes/clinicRoutes');
const callRoutes = require('./routes/callRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const contactRoutes = require('./routes/contactRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const reportRoutes = require('./routes/reportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clinic', clinicRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admins', require('./routes/adminAuth'));

// IPN Listener for PayFast sandbox
app.post('/payfast/ipn', express.urlencoded({ extended: false }), (req, res) => {
  console.log('PayFast IPN Received:', req.body);
  res.sendStatus(200);
});

// Root
app.get('/', (req, res) => {
  res.send('Pulse-Connect backend running!');
});

// DB Sync
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Models synced');
  })
  .catch((err) => {
    console.error('DB error:', err);
  });

// Server Start
app.listen(PORT, () => {
  console.log(`Server live at http://localhost:${PORT}`);
});
