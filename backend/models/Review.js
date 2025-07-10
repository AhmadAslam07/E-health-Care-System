// models/review.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
  review_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  recommend: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  tableName: 'reviews',
  timestamps: true,
});

module.exports = Review;
