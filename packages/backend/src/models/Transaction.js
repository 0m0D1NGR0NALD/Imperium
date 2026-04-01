const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  description: { type: DataTypes.STRING },
  category: { type: DataTypes.ENUM('needs', 'wants', 'savings', 'income', 'investment', 'other'), allowNull: false },
  type: { type: DataTypes.ENUM('income', 'expense', 'transfer'), allowNull: false },
  accountId: { type: DataTypes.UUID, allowNull: false },
  familyId: { type: DataTypes.UUID, allowNull: false }
});

module.exports = Transaction;