const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./doctor');

const ClinicSlot = sequelize.define('ClinicSlot', {
  slot_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Doctor,
      key: 'doctor_id'
    }
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_booked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'clinic_slots',
  timestamps: false
});

// Relationship (optional)
Doctor.hasMany(ClinicSlot, { foreignKey: 'doctor_id' });
ClinicSlot.belongsTo(Doctor, { foreignKey: 'doctor_id' });

module.exports = ClinicSlot;
