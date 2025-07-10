// models/VerificationToken.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./doctor');

const VerificationToken = sequelize.define('VerificationToken', {
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    references: { model: Doctor, key: 'doctor_id' },
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'verification_tokens',
  timestamps: false
});

module.exports = VerificationToken;
