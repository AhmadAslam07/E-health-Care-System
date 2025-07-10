const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LabReport = sequelize.define('LabReport', {
  report_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'lab_reports',
  timestamps: true
});

module.exports = LabReport;
