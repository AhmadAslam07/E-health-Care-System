// models/PatientVerificationToken.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Patient = require('./patient');

const PatientVerificationToken = sequelize.define('PatientVerificationToken', {
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
      key: 'patient_id'
    }
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'patient_verification_tokens',
  timestamps: false
});

module.exports = PatientVerificationToken;
