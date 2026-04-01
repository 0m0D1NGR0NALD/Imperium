const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Budget = sequelize.define('Budget', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  needsPercent: { type: DataTypes.FLOAT, defaultValue: 50 },
  wantsPercent: { type: DataTypes.FLOAT, defaultValue: 30 },
  savingsPercent: { type: DataTypes.FLOAT, defaultValue: 20 },
  familyId: { type: DataTypes.UUID, allowNull: false, unique: true }
});

module.exports = Budget;