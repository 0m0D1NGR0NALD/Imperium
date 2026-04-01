const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Constitution = sequelize.define('Constitution', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  savingsRate: { type: DataTypes.FLOAT, defaultValue: 20 },
  emergencyFundMonths: { type: DataTypes.FLOAT, defaultValue: 3 },
  windfallRule: { type: DataTypes.STRING, defaultValue: 'invest' },
  spendingApprovalThreshold: { type: DataTypes.FLOAT, defaultValue: 500 },
  familyId: { type: DataTypes.UUID, allowNull: false, unique: true }
});

module.exports = Constitution;