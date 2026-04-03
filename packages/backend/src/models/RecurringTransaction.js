const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecurringTransaction = sequelize.define('RecurringTransaction', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.STRING },
  category: { type: DataTypes.ENUM('needs', 'wants', 'savings', 'income', 'investment', 'other'), allowNull: false },
  type: { type: DataTypes.ENUM('income', 'expense', 'transfer'), allowNull: false },
  frequency: { type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'), defaultValue: 'monthly' },
  nextDate: { type: DataTypes.DATE, allowNull: false },
  accountId: { type: DataTypes.UUID, references: { model: 'Accounts', key: 'id' } },
  familyId: { type: DataTypes.UUID, allowNull: false }
});

module.exports = RecurringTransaction;