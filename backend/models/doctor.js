const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Doctor = sequelize.define('Doctor', {
  doctor_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialization: {
    type: DataTypes.STRING(100)
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  online_status: {
    type: DataTypes.ENUM('online', 'offline', 'in_call'),
    defaultValue: 'offline'
  },
  schedule: {
    type: DataTypes.JSON
  },
  qualification: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clinicLocation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fee: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  services: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'doctors',
  timestamps: false
});

module.exports = Doctor;
