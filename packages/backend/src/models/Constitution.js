const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Constitution = sequelize.define('Constitution', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  savingsRate: { type: DataTypes.FLOAT, defaultValue: 20 }, // percentage
  emergencyFundMonths: { type: DataTypes.FLOAT, defaultValue: 3 }, // months of expenses
  windfallRule: { type: DataTypes.STRING, defaultValue: 'invest' }, // 'invest' or 'split'
  spendingApprovalThreshold: { type: DataTypes.FLOAT, defaultValue: 500 },
  familyId: { type: DataTypes.UUID, references: { model: 'Families', key: 'id' }, unique: true }
});

module.exports = Constitution;