const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./doctor');
const Patient = require('./patient');

const CallLog = sequelize.define('CallLog', {
  call_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  room_id: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Doctor,
      key: 'doctor_id'
    }
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
      key: 'patient_id'
    }
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'call_logs',
  timestamps: false
});

// Relationships (optional)
Doctor.hasMany(CallLog, { foreignKey: 'doctor_id' });
Patient.hasMany(CallLog, { foreignKey: 'patient_id' });
CallLog.belongsTo(Doctor, { foreignKey: 'doctor_id' });
CallLog.belongsTo(Patient, { foreignKey: 'patient_id' });

module.exports = CallLog;
