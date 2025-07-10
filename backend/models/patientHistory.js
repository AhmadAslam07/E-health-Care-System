const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./doctor');
const Patient = require('./patient');

const PatientHistory = sequelize.define('PatientHistory', {
  history_id: {
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
  visit_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  prescription: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'patient_history',
  timestamps: false
});

// Relationships
Doctor.hasMany(PatientHistory, { foreignKey: 'doctor_id' });
Patient.hasMany(PatientHistory, { foreignKey: 'patient_id' });
PatientHistory.belongsTo(Doctor, { foreignKey: 'doctor_id' });
PatientHistory.belongsTo(Patient, { foreignKey: 'patient_id' });

module.exports = PatientHistory;
