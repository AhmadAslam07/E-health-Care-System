const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./doctor');
const Patient = require('./patient');
const ClinicSlot = require('./clinicSlot');

const Appointment = sequelize.define('Appointment', {
  appointment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
      key: 'patient_id'
    }
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Doctor,
      key: 'doctor_id'
    }
  },
  slot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ClinicSlot,
      key: 'slot_id'
    }
  },
  datetime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'scheduled', 'completed', 'canceled'),
    defaultValue: 'pending'
  },
  appointment_type: {
    type: DataTypes.ENUM('video', 'in_clinic'),
    allowNull: false
  },
  payment_status: {
    type: DataTypes.ENUM('paid', 'unpaid'),
    defaultValue: 'unpaid'
  },
  prescription: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lab_report: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'appointments',
  timestamps: false
});

// Associations
Doctor.hasMany(Appointment, { foreignKey: 'doctor_id' });
Patient.hasMany(Appointment, { foreignKey: 'patient_id' });
ClinicSlot.hasOne(Appointment, { foreignKey: 'slot_id' });

Appointment.belongsTo(Doctor, { foreignKey: 'doctor_id' });
Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });
Appointment.belongsTo(ClinicSlot, { foreignKey: 'slot_id' });

module.exports = Appointment;
