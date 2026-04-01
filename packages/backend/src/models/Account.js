const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Account = sequelize.define('Account', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('bank', 'brokerage', 'pension', 'cash', 'other'), defaultValue: 'bank' },
  balance: { type: DataTypes.FLOAT, defaultValue: 0 },
  isEmergencyFund: { type: DataTypes.BOOLEAN, defaultValue: false },
  familyId: { type: DataTypes.UUID, allowNull: false }
});

module.exports = Account;