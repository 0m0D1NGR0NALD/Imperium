const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SideHustle = sequelize.define('SideHustle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  monthlyIncome: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  profitAllocationPercent: {
    type: DataTypes.FLOAT,
    defaultValue: 100, // percentage to route to Sovereign Wealth Fund
    validate: { min: 0, max: 100 }
  },
  familyId: {
    type: DataTypes.UUID,
    references: { model: 'Families', key: 'id' },
    allowNull: false
  }
});

module.exports = SideHustle;