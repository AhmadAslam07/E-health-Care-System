const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Prescription = sequelize.define('Prescription', {
  prescription_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
});

module.exports = Prescription;
