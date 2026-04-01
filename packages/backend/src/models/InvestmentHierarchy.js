const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InvestmentHierarchy = sequelize.define('InvestmentHierarchy', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  step: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  name: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('not_started', 'in_progress', 'completed'), defaultValue: 'not_started' },
  completedAt: { type: DataTypes.DATE },
  familyId: { type: DataTypes.UUID, allowNull: false }
});

module.exports = InvestmentHierarchy;